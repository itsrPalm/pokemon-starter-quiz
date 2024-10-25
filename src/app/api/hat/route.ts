// // src/app/api/hat/route.ts

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { printfulClient } from "@/lib/printfulClient";
// import Stripe from "stripe";
// import { Prisma } from "@prisma/client";

// // Initialize Stripe
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// 	apiVersion: "2024-09-30.acacia",
// });

// // Define interfaces for Printful API responses
// interface ProductOption {
// 	id: string;
// 	title: string;
// 	type: string;
// 	values: string[];
// 	additional_price?: string;
// 	additional_weight?: string;
// }

// interface ProductTechnique {
// 	technique: string;
// 	locations: string[];
// }

// interface ProductFile {
// 	type: string;
// 	title: string;
// 	additional_price: string;
// 	accept_only_attachments: boolean;
// }

// interface PrintfulProduct {
// 	id: number;
// 	main_category_id: number;
// 	type: string;
// 	description: string;
// 	title: string;
// 	brand: string;
// 	model: string;
// 	image: string;
// 	variant_count: number;
// 	currency: string;
// 	options: ProductOption[];
// 	techniques: ProductTechnique[];
// 	files: ProductFile[];
// }

// interface PrintfulVariant {
// 	id: number;
// 	product_id: number;
// 	name: string;
// 	size: string;
// 	color: string;
// 	image: string;
// 	retail_price: string;
// 	currency: string;
// }

// export async function GET() {
// 	try {
// 		// Check if the hat product already exists in the database
// 		let hatProduct = await prisma.hatProduct.findUnique({
// 			where: { printfulId: 91 },
// 			include: { variants: true },
// 		});

// 		if (!hatProduct) {
// 			// Fetch product data from Printful API
// 			const productResponse = await printfulClient.get<{
// 				result: PrintfulProduct;
// 			}>("products/91");
// 			const productData = productResponse.data.result;

// 			// Fetch variants data from Printful API
// 			const variantsResponse = await printfulClient.get<{
// 				result: PrintfulVariant[];
// 			}>("products/91/variants");
// 			const variantsData = variantsResponse.data.result;

// 			// Prepare the data to be saved
// 			const hatProductData: Prisma.HatProductCreateInput = {
// 				printfulId: productData.id,
// 				mainCategoryId: productData.main_category_id,
// 				type: productData.type,
// 				description: productData.description,
// 				title: productData.title,
// 				brand: productData.brand,
// 				model: productData.model,
// 				image: productData.image,
// 				variantCount: productData.variant_count,
// 				currency: productData.currency,
// 				options:
// 					productData.options as unknown as Prisma.InputJsonValue,
// 				techniques:
// 					productData.techniques as unknown as Prisma.InputJsonValue,
// 				files: productData.files as unknown as Prisma.InputJsonValue,
// 				variants: {
// 					create: await Promise.all(
// 						variantsData.map(async (variant: PrintfulVariant) => {
// 							// Calculate the new price (twice the original retail price)
// 							const retailPrice = parseFloat(
// 								variant.retail_price
// 							);
// 							const newRetailPrice = retailPrice * 2;

// 							// Create a new Stripe product
// 							const stripeProduct = await stripe.products.create({
// 								name: variant.name,
// 								description: `Custom ${variant.name}`,
// 								images: [variant.image],
// 							});

// 							// Create a new Stripe price
// 							const stripePrice = await stripe.prices.create({
// 								unit_amount: Math.round(newRetailPrice * 100), // Amount in cents
// 								currency: variant.currency.toLowerCase(),
// 								product: stripeProduct.id,
// 							});

// 							return {
// 								printfulId: variant.id,
// 								name: variant.name,
// 								color: variant.color,
// 								size: variant.size,
// 								image: variant.image,
// 								retailPrice: newRetailPrice,
// 								currency: variant.currency,
// 								stripePriceId: stripePrice.id,
// 							};
// 						})
// 					),
// 				},
// 			};

// 			// Save the product and its variants to the database
// 			hatProduct = await prisma.hatProduct.create({
// 				data: hatProductData,
// 				include: { variants: true },
// 			});
// 		} else {
// 			// Ensure variants are included
// 			hatProduct = await prisma.hatProduct.findUnique({
// 				where: { id: hatProduct.id },
// 				include: { variants: true },
// 			});
// 		}

// 		return NextResponse.json(hatProduct);
// 	} catch (error) {
// 		console.error("Error fetching hat product:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to fetch hat product" },
// 			{ status: 500 }
// 		);
// 	}
// }

export {};
