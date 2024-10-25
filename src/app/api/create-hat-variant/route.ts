// // src/app/api/create-hat-variant/route.ts

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { printfulClient } from "@/lib/printfulClient";
// import Stripe from "stripe";

// // Initialize Stripe
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// 	apiVersion: "2024-09-30.acacia",
// });

// // Define interfaces for Printful API responses
// interface PrintfulVariantResponse {
// 	result: PrintfulVariant[];
// }

// interface PrintfulVariant {
// 	id: number;
// 	product_id: number;
// 	name: string;
// 	size: string;
// 	color: string;
// 	color_code: string;
// 	image: string;
// 	price: string;
// 	retail_price: string;
// 	currency: string;
// 	in_stock: boolean;
// 	availability_regions: string[];
// }

// export async function GET() {
// 	try {
// 		// Fetch variants data from Printful API
// 		const response = await printfulClient.get<PrintfulVariantResponse>(
// 			"products/91/variants"
// 		);
// 		const variantsData = response.data.result;

// 		// Iterate over the variants data with proper typing
// 		const createdVariants = await Promise.all(
// 			variantsData.map(async (variant: PrintfulVariant) => {
// 				// Calculate the new price (twice the original retail price)
// 				const retailPrice = parseFloat(variant.retail_price);
// 				const newRetailPrice = retailPrice * 2;

// 				// Create a new Stripe product
// 				const stripeProduct = await stripe.products.create({
// 					name: variant.name,
// 					description: `Custom ${variant.name}`,
// 					images: [variant.image],
// 				});

// 				// Create a new Stripe price
// 				const stripePrice = await stripe.prices.create({
// 					unit_amount: Math.round(newRetailPrice * 100), // Amount in cents
// 					currency: variant.currency.toLowerCase(),
// 					product: stripeProduct.id,
// 				});

// 				// Prepare variant data
// 				const variantData = {
// 					printfulId: variant.id,
// 					name: variant.name,
// 					color: variant.color,
// 					size: variant.size,
// 					image: variant.image,
// 					retailPrice: newRetailPrice,
// 					currency: variant.currency,
// 					stripePriceId: stripePrice.id,
// 					hatProduct: {
// 						connect: { printfulId: variant.product_id },
// 					},
// 				};

// 				// Create or update the variant in the database
// 				const createdVariant = await prisma.hatVariant.upsert({
// 					where: { printfulId: variant.id },
// 					update: {
// 						name: variant.name,
// 						color: variant.color,
// 						size: variant.size,
// 						image: variant.image,
// 						retailPrice: newRetailPrice,
// 						currency: variant.currency,
// 						stripePriceId: stripePrice.id,
// 						hatProduct: {
// 							connect: { printfulId: variant.product_id },
// 						},
// 					},
// 					create: variantData,
// 				});

// 				return createdVariant;
// 			})
// 		);

// 		return NextResponse.json({ variants: createdVariants });
// 	} catch (error) {
// 		console.error("Error creating hat variants:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to create hat variants" },
// 			{ status: 500 }
// 		);
// 	}
// }

export {};
