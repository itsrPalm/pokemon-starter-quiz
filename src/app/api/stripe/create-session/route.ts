// // src/app/api/stripe/create-session/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import {prisma} from '@/lib/prisma';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-09-30.acacia', // Use the latest stable API version
// });

// export async function POST(request: NextRequest) {
//   try {
//     const { variantId, mockupUrl } = await request.json();

//     const variant = await prisma.variant.findUnique({ where: { id: variantId } });

//     if (!variant) {
//       return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
//     }

//     // Create or retrieve Stripe Price
//     let stripePriceId = variant.stripePriceId;
//     if (!stripePriceId) {
//       const product = await stripe.products.create({
//         name: variant.name,
//         images: [mockupUrl],
//       });

//       const price = await stripe.prices.create({
//         unit_amount: Math.round(variant.retailPrice * 100),
//         currency: 'usd',
//         product: product.id,
//       });

//       stripePriceId = price.id;

//       await prisma.variant.update({
//         where: { id: variantId },
//         data: { stripePriceId },
//       });
//     }

//     const origin = request.headers.get('origin');

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price: stripePriceId,
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${origin}/cancel`,
//       shipping_address_collection: {
//         allowed_countries: ['US', 'CA'], // Adjust as needed
//       },
//       shipping_options: [
//         {
//           shipping_rate_data: {
//             type: 'fixed_amount',
//             fixed_amount: {
//               amount: 500, // $5.00 shipping
//               currency: 'usd',
//             },
//             display_name: 'Standard shipping',
//           },
//         },
//       ],
//     });

//     // Save the order to the database
//     await prisma.order.create({
//       data: {
//         variantId,
//         stripeSessionId: session.id,
//         status: 'pending',
//         shippingDetails: {}, // Initialize as empty object
//       },
//     });

//     return NextResponse.json({ sessionId: session.id });
//   } catch (error) {
//     console.error('Error creating Stripe session:', error);
//     return NextResponse.json({ error: 'Failed to create Stripe session' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2024-09-30.acacia",
});

export async function POST(request: NextRequest) {
	try {
		const { variantId, mockupUrl } = await request.json();

		const variant = await prisma.variant.findUnique({
			where: { id: variantId },
		});

		if (!variant) {
			return NextResponse.json(
				{ error: "Variant not found" },
				{ status: 404 }
			);
		}

		let stripePriceId = variant.stripePriceId;
		if (!stripePriceId) {
			const product = await stripe.products.create({
				name: variant.name,
				images: [mockupUrl],
			});

			const price = await stripe.prices.create({
				unit_amount: Math.round(variant.retailPrice * 100),
				currency: "usd",
				product: product.id,
			});

			stripePriceId = price.id;

			await prisma.variant.update({
				where: { id: variantId },
				data: {
					stripePriceId,
					mockupUrl,
				},
			});
		}

		const origin = request.headers.get("origin");

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price: stripePriceId,
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/cancel`,
			shipping_address_collection: {
				allowed_countries: ["US", "CA"],
			},
			shipping_options: [
				{
					shipping_rate_data: {
						type: "fixed_amount",
						fixed_amount: {
							amount: 500,
							currency: "usd",
						},
						display_name: "Standard shipping",
					},
				},
			],
		});

		await prisma.order.create({
			data: {
				variantId,
				stripeSessionId: session.id,
				status: "pending",
				shippingDetails: {},
			},
		});

		return NextResponse.json({ sessionId: session.id });
	} catch (error) {
		console.error("Error creating Stripe session:", error);
		return NextResponse.json(
			{ error: "Failed to create Stripe session" },
			{ status: 500 }
		);
	}
}
