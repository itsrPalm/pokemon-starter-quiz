// // src/app/api/webhooks/stripe/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import {prisma} from '@/lib/prisma';
// import axios from 'axios';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-09-30.acacia', // Use the latest stable API version
// });

// export async function POST(request: NextRequest) {
//   const sig = request.headers.get('stripe-signature')!;
//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

//   let event: Stripe.Event;

//   try {
//     const body = await request.text();
//     event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
//   } catch (err) {
//     console.error('Error verifying Stripe webhook:', err);
//     return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed':
//       const session = event.data.object as Stripe.Checkout.Session;
//       await handleCheckoutSessionCompleted(session);
//       break;
//     default:
//       console.warn(`Unhandled event type ${event.type}`);
//   }

//   return NextResponse.json({ received: true });
// }

// async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
//   const order = await prisma.order.findUnique({
//     where: { stripeSessionId: session.id },
//     include: { variant: true },
//   });

//   if (order && order.status === 'pending') {
//     // Update order status
//     await prisma.order.update({
//       where: { id: order.id },
//       data: {
//         status: 'paid',
//         shippingDetails: session.shipping_details,
//       },
//     });

//     // Create order in Printful
//     await createPrintfulOrder(order as Order & { variant: Variant }, session);
//   }
// }

// async function createPrintfulOrder(order: Order & { variant: Variant }, session: Stripe.Checkout.Session) {
//   try {
//     const shippingDetails = session.shipping_details;

//     // Extract recipient details
//     const recipient = {
//       name: shippingDetails?.name || '',
//       address1: shippingDetails?.address?.line1 || '',
//       city: shippingDetails?.address?.city || '',
//       state_code: shippingDetails?.address?.state || '',
//       country_code: shippingDetails?.address?.country || '',
//       zip: shippingDetails?.address?.postal_code || '',
//     };

//     // Create order in Printful
//     await axios.post(
//       'https://api.printful.com/orders',
//       {
//         recipient,
//         items: [
//           {
//             variant_id: order.variant.printfulId,
//             quantity: 1,
//             files: [
//               {
//                 url: order.variant.mockupUrl!, // Use the mockup URL
//               },
//             ],
//           },
//         ],
//         shipping: 'STANDARD',
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
//         },
//       }
//     );

//     // Update order with Printful order ID
//     await prisma.order.update({
//       where: { id: order.id },
//       data: {
//         status: 'processing',
//         // Store Printful order details if needed
//       },
//     });
//   } catch (error) {
//     console.error('Error creating Printful order:', error);
//     // Handle error accordingly
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { PrismaShippingDetails, StripeShippingDetails } from "@/lib/constants";
// import { PrismaShippingDetails, StripeShippingDetails } from '@/types/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2024-09-30.acacia",
});

export async function POST(request: NextRequest) {
	const sig = request.headers.get("stripe-signature")!;
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

	let event: Stripe.Event;

	try {
		const body = await request.text();
		event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
	} catch (err) {
		console.error("Error verifying Stripe webhook:", err);
		return NextResponse.json(
			{ error: "Invalid signature" },
			{ status: 400 }
		);
	}

	switch (event.type) {
		case "checkout.session.completed":
			const session = event.data.object as Stripe.Checkout.Session;
			await handleCheckoutSessionCompleted(session);
			break;
		default:
			console.warn(`Unhandled event type ${event.type}`);
	}

	return NextResponse.json({ received: true });
}

function convertShippingDetails(
	stripeShipping: StripeShippingDetails | null
): PrismaShippingDetails {
	if (!stripeShipping) {
		return {
			name: null,
			address: null,
			phone: null,
		};
	}

	return {
		name: stripeShipping.name ?? null,
		address: stripeShipping.address
			? {
					line1: stripeShipping.address.line1 ?? null,
					line2: stripeShipping.address.line2 ?? null,
					city: stripeShipping.address.city ?? null,
					state: stripeShipping.address.state ?? null,
					country: stripeShipping.address.country ?? null,
					postal_code: stripeShipping.address.postal_code ?? null,
			  }
			: null,
		phone: stripeShipping.phone ?? null,
	};
}

function getRecipientDetails(shippingDetails: PrismaShippingDetails) {
	if (!shippingDetails.address) {
		throw new Error("Missing shipping address");
	}

	return {
		name: shippingDetails.name || "",
		address1: shippingDetails.address.line1 || "",
		address2: shippingDetails.address.line2 || "",
		city: shippingDetails.address.city || "",
		state_code: shippingDetails.address.state || "",
		country_code: shippingDetails.address.country || "",
		zip: shippingDetails.address.postal_code || "",
		phone: shippingDetails.phone || "",
	};
}

async function handleCheckoutSessionCompleted(
	session: Stripe.Checkout.Session
) {
	const order = await prisma.order.findUnique({
		where: { stripeSessionId: session.id },
		include: { variant: true },
	});

	if (order && order.status === "pending") {
		const shippingDetails = convertShippingDetails(
			session.shipping_details
		);

		await prisma.order.update({
			where: { id: order.id },
			data: {
				status: "paid",
				shippingDetails: shippingDetails, // Now compatible with Prisma's JSON field
			},
		});

		await createPrintfulOrder(order.variant.printfulId, shippingDetails);
	}
}

async function createPrintfulOrder(
	printfulVariantId: number,
	shippingDetails: PrismaShippingDetails
): Promise<void> {
	try {
		const recipient = getRecipientDetails(shippingDetails);

		await axios.post(
			"https://api.printful.com/orders",
			{
				recipient,
				items: [
					{
						variant_id: printfulVariantId,
						quantity: 1,
					},
				],
				shipping: "STANDARD",
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
				},
			}
		);
	} catch (error) {
		console.error("Error creating Printful order:", error);
		throw error;
	}
}
