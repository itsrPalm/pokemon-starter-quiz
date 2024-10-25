// // // // // // src/app/api/products/route.ts

// // // // // import { NextResponse } from 'next/server';
// // // // // import {prisma} from '@/lib/prisma';
// // // // // import axios from 'axios';

// // // // // interface PrintfulProduct {
// // // // //   id: number;
// // // // //   name: string;
// // // // //   description: string;
// // // // //   variants: PrintfulVariant[];
// // // // // }

// // // // // interface PrintfulVariant {
// // // // //   id: number;
// // // // //   name: string;
// // // // //   size: string;
// // // // //   color: string;
// // // // //   price: string;
// // // // // }

// // // // // export async function GET() {
// // // // //   try {
// // // // //     let products = await prisma.product.findMany({
// // // // //       include: { variants: true },
// // // // //     });

// // // // //     if (products.length === 0) {
// // // // //       // Fetch products from Printful API
// // // // //       const response = await axios.get('https://api.printful.com/products', {
// // // // //         headers: {
// // // // //           'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
// // // // //         },
// // // // //       });

// // // // //       const printfulProducts: PrintfulProduct[] = response.data.result;

// // // // //       // Save products and variants to database
// // // // //       for (const product of printfulProducts) {
// // // // //         await prisma.product.create({
// // // // //           data: {
// // // // //             printfulId: product.id,
// // // // //             name: product.name,
// // // // //             description: product.description,
// // // // //             variants: {
// // // // //               create: product.variants.map((variant: PrintfulVariant) => ({
// // // // //                 printfulId: variant.id,
// // // // //                 name: variant.name,
// // // // //                 size: variant.size,
// // // // //                 color: variant.color,
// // // // //                 printfulPrice: parseFloat(variant.price),
// // // // //                 retailPrice: parseFloat(variant.price) * 2, // Adjust pricing logic as needed
// // // // //               })),
// // // // //             },
// // // // //           },
// // // // //         });
// // // // //       }

// // // // //       products = await prisma.product.findMany({
// // // // //         include: { variants: true },
// // // // //       });
// // // // //     }

// // // // //     return NextResponse.json(products);
// // // // //   } catch (error) {
// // // // //     console.error('Error fetching products:', error);
// // // // //     return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
// // // // //   }
// // // // // }

// // // // import { NextResponse } from 'next/server';
// // // // import { prisma } from '@/lib/prisma';
// // // // import axios from 'axios';

// // // // interface PrintfulProduct {
// // // //   id: number;
// // // //   name: string;
// // // //   description: string;
// // // //   variants: PrintfulVariant[];
// // // // }

// // // // interface PrintfulVariant {
// // // //   id: number;
// // // //   name: string;
// // // //   size: string;
// // // //   color: string;
// // // //   price: string;
// // // // }

// // // // export async function GET() {
// // // //   try {
// // // //     let products = await prisma.product.findMany({
// // // //       include: { variants: true },
// // // //     });

// // // //     if (products.length === 0) {
// // // //       const response = await axios.get('https://api.printful.com/products', {
// // // //         headers: {
// // // //           'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
// // // //         },
// // // //       });

// // // //       const printfulProducts: PrintfulProduct[] = response.data.result;

// // // //       for (const product of printfulProducts) {
// // // //         await prisma.product.create({
// // // //           data: {
// // // //             printfulId: product.id,
// // // //             name: product.name,
// // // //             description: product.description,
// // // //             variants: {
// // // //               create: product.variants.map((variant: PrintfulVariant) => ({
// // // //                 printfulId: variant.id,
// // // //                 name: variant.name,
// // // //                 size: variant.size,
// // // //                 color: variant.color,
// // // //                 printfulPrice: parseFloat(variant.price),
// // // //                 retailPrice: parseFloat(variant.price) * 2,
// // // //               })),
// // // //             },
// // // //           },
// // // //         });
// // // //       }

// // // //       products = await prisma.product.findMany({
// // // //         include: { variants: true },
// // // //       });
// // // //     }

// // // //     return NextResponse.json(products);
// // // //   } catch (error) {
// // // //     console.error('Error fetching products:', error);
// // // //     return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
// // // //   }
// // // // }

// // // // src/app/api/products/route.ts

// // // import { NextResponse } from "next/server";
// // // import { prisma } from "@/lib/prisma";
// // // import axios from "axios";

// // // interface PrintfulProduct {
// // // 	id: number;
// // // 	name: string;
// // // 	description: string;
// // // 	variants: PrintfulVariant[];
// // // }

// // // interface PrintfulVariant {
// // // 	id: number;
// // // 	name: string;
// // // 	size: string;
// // // 	color: string;
// // // 	price: string;
// // // }

// // // export async function GET() {
// // // 	try {
// // // 		const products = await prisma.product.findMany({
// // // 			include: {
// // // 				variants: true,
// // // 			},
// // // 		});

// // // 		if (products.length === 0) {
// // // 			// Fetch products from Printful API
// // // 			const response = await axios.get(
// // // 				"https://api.printful.com/products",
// // // 				{
// // // 					headers: {
// // // 						Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// // // 					},
// // // 				}
// // // 			);

// // // 			// Verify the response contains the expected data
// // // 			if (
// // // 				!response.data?.result ||
// // // 				!Array.isArray(response.data.result)
// // // 			) {
// // // 				throw new Error("Invalid response from Printful API");
// // // 			}

// // // 			const printfulProducts: PrintfulProduct[] = response.data.result;

// // // 			// Save products and variants to database
// // // 			const createdProducts = await Promise.all(
// // // 				printfulProducts.map(async (product) => {
// // // 					return prisma.product.create({
// // // 						data: {
// // // 							printfulId: product.id,
// // // 							name: product.name,
// // // 							description: product.description || "",
// // // 							variants: {
// // // 								create: product.variants.map((variant) => ({
// // // 									printfulId: variant.id,
// // // 									name: variant.name,
// // // 									size: variant.size,
// // // 									color: variant.color,
// // // 									printfulPrice: parseFloat(variant.price),
// // // 									retailPrice: parseFloat(variant.price) * 2,
// // // 								})),
// // // 							},
// // // 						},
// // // 						include: {
// // // 							variants: true,
// // // 						},
// // // 					});
// // // 				})
// // // 			);

// // // 			return NextResponse.json(createdProducts);
// // // 		}

// // // 		return NextResponse.json(products);
// // // 	} catch (error) {
// // // 		console.error("Error fetching products:", error);
// // // 		return NextResponse.json(
// // // 			{ error: "Failed to fetch products" },
// // // 			{ status: 500 }
// // // 		);
// // // 	}
// // // }

// // // src/app/api/products/route.ts

// // // import { NextResponse } from "next/server";
// // // import { prisma } from "@/lib/prisma";
// // // import axios from "axios";

// // // interface PrintfulProduct {
// // // 	id: number;
// // // 	name: string;
// // // 	description: string;
// // // 	variants: PrintfulVariant[];
// // // 	type: string;
// // // 	type_name: string;
// // // }

// // // interface PrintfulVariant {
// // // 	id: number;
// // // 	name: string;
// // // 	size: string;
// // // 	color: string;
// // // 	price: string;
// // // }

// // // const ALLOWED_PRODUCT_TYPES = [
// // // 	"T-SHIRT",
// // // 	"HAT",
// // // 	"HOODIE",
// // // 	"SWEATSHIRT",
// // // 	"TANK_TOP",
// // // ];

// // // export async function GET() {
// // // 	try {
// // // 		// First check if we have any products
// // // 		const products = await prisma.product.findMany({
// // // 			include: {
// // // 				variants: true,
// // // 			},
// // // 			where: {
// // // 				type: {
// // // 					in: ALLOWED_PRODUCT_TYPES,
// // // 				},
// // // 			},
// // // 		});

// // // 		if (products.length === 0) {
// // // 			// Fetch products from Printful API
// // // 			const response = await axios.get(
// // // 				"https://api.printful.com/sync/products",
// // // 				{
// // // 					headers: {
// // // 						Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// // // 					},
// // // 				}
// // // 			);

// // // 			if (!response.data?.result) {
// // // 				throw new Error("Invalid response from Printful API");
// // // 			}

// // // 			const printfulProducts: PrintfulProduct[] = response.data.result;

// // // 			// Filter for shirts and hats
// // // 			const filteredProducts = printfulProducts.filter((product) =>
// // // 				ALLOWED_PRODUCT_TYPES.some((type) =>
// // // 					product.type_name.toUpperCase().includes(type)
// // // 				)
// // // 			);

// // // 			// Save filtered products and variants to database
// // // 			const createdProducts = await Promise.all(
// // // 				filteredProducts.map(async (product) => {
// // // 					return prisma.product.create({
// // // 						data: {
// // // 							printfulId: product.id,
// // // 							name: product.name,
// // // 							description: product.description || "",
// // // 							type: product.type_name.toUpperCase(),
// // // 							variants: {
// // // 								create: product.variants.map((variant) => ({
// // // 									printfulId: variant.id,
// // // 									name: variant.name,
// // // 									size: variant.size,
// // // 									color: variant.color,
// // // 									printfulPrice: parseFloat(variant.price),
// // // 									retailPrice: parseFloat(variant.price) * 2,
// // // 								})),
// // // 							},
// // // 						},
// // // 						include: {
// // // 							variants: true,
// // // 						},
// // // 					});
// // // 				})
// // // 			);

// // // 			return NextResponse.json(createdProducts);
// // // 		}

// // // 		return NextResponse.json(products);
// // // 	} catch (error) {
// // // 		console.error("Error fetching products:", error);
// // // 		return NextResponse.json(
// // // 			{ error: "Failed to fetch products" },
// // // 			{ status: 500 }
// // // 		);
// // // 	}
// // // }

// // // src/app/api/products/route.ts

// // // import { NextResponse } from "next/server";
// // // import { prisma } from "@/lib/prisma";
// // // import axios from "axios";

// // // const PRINTFUL_API_URL = "https://api.printful.com";

// // // interface PrintfulVariant {
// // // 	id: number;
// // // 	name: string;
// // // 	size: string;
// // // 	color: string;
// // // 	retail_price: string;
// // // 	variant_id: number;
// // // 	product_id: number;
// // // }

// // // interface PrintfulSyncVariant {
// // // 	id: number;
// // // 	name: string;
// // // 	size: string;
// // // 	color: string;
// // // 	retail_price: string;
// // // 	sync_product_id: number;
// // // }

// // // interface PrintfulProduct {
// // // 	id: number;
// // // 	name: string;
// // // 	description: string;
// // // 	sync_variants?: PrintfulSyncVariant[];
// // // 	external_id?: string;
// // // 	variants?: PrintfulVariant[];
// // // }

// // // interface PrintfulResponse {
// // // 	code: number;
// // // 	result: PrintfulProduct;
// // // }

// // // interface PrintfulListResponse {
// // // 	code: number;
// // // 	result: PrintfulProduct[];
// // // }

// // // export async function GET() {
// // // 	try {
// // // 		let products = await prisma.product.findMany({
// // // 			include: {
// // // 				variants: true,
// // // 			},
// // // 		});

// // // 		if (products.length === 0) {
// // // 			console.log("No products in database, fetching from Printful...");

// // // 			const response = await axios.get<PrintfulListResponse>(
// // // 				`${PRINTFUL_API_URL}/store/products`,
// // // 				{
// // // 					headers: {
// // // 						Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// // // 					},
// // // 				}
// // // 			);

// // // 			console.log("Printful API response:", response.data);

// // // 			if (!response.data?.result) {
// // // 				throw new Error("Invalid Printful API response");
// // // 			}

// // // 			const productsWithVariants = await Promise.all(
// // // 				response.data.result.map(async (product: PrintfulProduct) => {
// // // 					const variantResponse = await axios.get<PrintfulResponse>(
// // // 						`${PRINTFUL_API_URL}/store/products/${product.id}`,
// // // 						{
// // // 							headers: {
// // // 								Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// // // 							},
// // // 						}
// // // 					);

// // // 					console.log(
// // // 						`Variant details for product ${product.id}:`,
// // // 						variantResponse.data
// // // 					);

// // // 					return {
// // // 						...product,
// // // 						variants:
// // // 							variantResponse.data.result.sync_variants || [],
// // // 					};
// // // 				})
// // // 			);

// // // 			await Promise.all(
// // // 				productsWithVariants.map(async (product) => {
// // // 					return prisma.product.create({
// // // 						data: {
// // // 							printfulId: product.id,
// // // 							name: product.name,
// // // 							description: product.description || "",
// // // 							type: determineProductType(product.name), // Helper function to determine type
// // // 							variants: {
// // // 								create: product.variants.map((variant) => ({
// // // 									printfulId: variant.id,
// // // 									name: variant.name,
// // // 									size: variant.size,
// // // 									color: variant.color,
// // // 									printfulPrice: parseFloat(
// // // 										variant.retail_price
// // // 									),
// // // 									retailPrice:
// // // 										parseFloat(variant.retail_price) * 1.5,
// // // 								})),
// // // 							},
// // // 						},
// // // 					});
// // // 				})
// // // 			);

// // // 			products = await prisma.product.findMany({
// // // 				include: {
// // // 					variants: true,
// // // 				},
// // // 			});
// // // 		}

// // // 		console.log("Returning products:", products);
// // // 		return NextResponse.json(products);
// // // 	} catch (error) {
// // // 		console.error("Error in products API:", error);
// // // 		return NextResponse.json(
// // // 			{
// // // 				error: "Failed to fetch products",
// // // 				details:
// // // 					error instanceof Error ? error.message : "Unknown error",
// // // 			},
// // // 			{ status: 500 }
// // // 		);
// // // 	}
// // // }

// // // function determineProductType(productName: string): string {
// // // 	const name = productName.toLowerCase();
// // // 	if (name.includes("shirt") || name.includes("tee")) return "T-SHIRT";
// // // 	if (name.includes("hoodie")) return "HOODIE";
// // // 	if (name.includes("sweatshirt")) return "SWEATSHIRT";
// // // 	if (name.includes("tank")) return "TANK_TOP";
// // // 	if (name.includes("hat") || name.includes("cap")) return "HAT";
// // // 	return "OTHER";
// // // }

// // // src/app/api/products/route.ts

// // import { ApolloServer } from "@apollo/server";
// // import { startServerAndCreateNextHandler } from "@as-integrations/next";
// // import { typeDefs } from "@/graphql/schema";
// // import { resolvers } from "@/graphql/resolvers";
// // import { PrismaClient } from "@prisma/client";
// // import { ProductCatalogProcessor } from "@/lib/productProcessor";

// // // Define ResolverContext interface (must match resolvers.ts)
// // interface ResolverContext {
// // 	prisma: PrismaClient;
// // 	processor: ProductCatalogProcessor;
// // }

// // // Initialize Prisma Client
// // const prisma = new PrismaClient();

// // // Initialize ProductCatalogProcessor singleton
// // const processor = ProductCatalogProcessor.getInstance();

// // // Create Apollo Server with typeDefs and resolvers
// // const server = new ApolloServer<ResolverContext>({
// // 	typeDefs,
// // 	resolvers,
// // });

// // // Create Next.js API route handler with context
// // const handler = startServerAndCreateNextHandler(server, {
// // 	context: async () => {
// // 		await processor.initialize();
// // 		return { prisma, processor };
// // 	},
// // });

// // // Export the handler for POST requests
// // export { handler as POST };

// // // Handle GET requests (optional)
// // export async function GET(_req: Request) {
// // 	// Respond with 405 Method Not Allowed for GET requests
// // 	return new Response(
// // 		"GET method not supported. Use POST for GraphQL queries.",
// // 		{ status: 405 }
// // 	);
// // }

// // src/app/api/products/route.ts

// import { ApolloServer } from "@apollo/server";
// import { startServerAndCreateNextHandler } from "@as-integrations/next";
// import { typeDefs } from "@/graphql/schema";
// import { resolvers } from "@/graphql/resolvers";
// import { PrismaClient } from "@prisma/client";
// import { ProductCatalogProcessor } from "@/lib/productProcessor";

// // Define ResolverContext interface
// interface ResolverContext {
// 	prisma: PrismaClient;
// 	processor: ProductCatalogProcessor;
// }

// // Initialize Prisma Client
// const prisma = new PrismaClient();

// // Initialize ProductCatalogProcessor singleton
// const processor = ProductCatalogProcessor.getInstance();

// // Create Apollo Server with typeDefs and resolvers
// const server = new ApolloServer<ResolverContext>({
// 	typeDefs,
// 	resolvers,
// });

// // Create Next.js API route handler with context
// const handler = startServerAndCreateNextHandler(server, {
// 	context: async () => {
// 		await processor.initialize();
// 		return { prisma, processor };
// 	},
// });

// // Export the handler for POST requests
// export { handler as POST };

// // Handle GET requests (optional)
// export async function GET(_req: Request) {
// 	// Prefix with underscore to indicate unused
// 	// Respond with 405 Method Not Allowed for GET requests
// 	return new Response(
// 		"GET method not supported. Use POST for GraphQL queries.",
// 		{ status: 405 }
// 	);
// }

// src/app/api/products/route.ts

// import { ApolloServer } from "@apollo/server";
// import { startServerAndCreateNextHandler } from "@as-integrations/next";
// import { typeDefs } from "@/graphql/schema";
// import { resolvers } from "@/graphql/resolvers";
// import { PrismaClient } from "@prisma/client";
// import { ProductCatalogProcessor } from "@/lib/productProcessor";
// import logger from "@/lib/logger";

// // Define ResolverContext interface
// interface ResolverContext {
// 	prisma: PrismaClient;
// 	processor: ProductCatalogProcessor;
// }

// logger.info("API Route: Initializing Prisma Client");
// const prisma = new PrismaClient();

// logger.info("API Route: Retrieving ProductCatalogProcessor instance");
// const processor = ProductCatalogProcessor.getInstance();

// logger.info("API Route: Creating Apollo Server instance");
// const server = new ApolloServer<ResolverContext>({
// 	typeDefs,
// 	resolvers,
// });

// logger.info("API Route: Creating Next.js API route handler with context");
// const handler = startServerAndCreateNextHandler(server, {
// 	context: async () => {
// 		logger.info("API Route: Initializing ProductCatalogProcessor");
// 		await processor.initialize();
// 		logger.info("API Route: ProductCatalogProcessor initialized");
// 		return { prisma, processor };
// 	},
// });

// // Export the handler for POST requests
// export { handler as POST };
// logger.info("API Route: Exported POST handler");

// // Handle GET requests (optional)
// export async function GET(_req: Request) {
// 	// Prefix with underscore to indicate unused
// 	logger.info("API Route: Received GET request");
// 	// Respond with 405 Method Not Allowed for GET requests
// 	return new Response(
// 		"GET method not supported. Use POST for GraphQL queries.",
// 		{ status: 405 }
// 	);
// }

export {};
