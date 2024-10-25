// // // // src/graphql/resolvers.ts

// // // import { PrismaClient } from '@prisma/client';
// // // import { ProductCatalogProcessor, ProcessedProduct } from '@/lib/productProcessor';
// // // import { IResolvers } from '@graphql-tools/utils';
// // // import { GraphQLResolveInfo } from 'graphql';

// // // // Define the shape of the arguments for each resolver
// // // interface ProductsArgs {
// // //   query?: string;
// // //   limit?: number;
// // // }

// // // interface ProductArgs {
// // //   id: string;
// // // }

// // // interface SearchProductsArgs {
// // //   query: string;
// // // }

// // // export const resolvers = (processor: ProductCatalogProcessor): IResolvers => ({
// // //   Query: {
// // //     products: async (
// // //       _: any,
// // //       { query, limit = 10 }: ProductsArgs,
// // //       context: { prisma: PrismaClient },
// // //       info: GraphQLResolveInfo
// // //     ): Promise<ProcessedProduct[]> => {
// // //       if (query) {
// // //         const results = await processor.findRelevantProducts(query, limit);
// // //         return results;
// // //       }
// // //       return context.prisma.product.findMany({
// // //         include: { variants: true },
// // //         take: limit,
// // //       });
// // //     },
// // //     product: async (
// // //       _: any,
// // //       { id }: ProductArgs,
// // //       context: { prisma: PrismaClient },
// // //       info: GraphQLResolveInfo
// // //     ) => {
// // //       return context.prisma.product.findUnique({
// // //         where: { id },
// // //         include: { variants: true },
// // //       });
// // //     },
// // //     searchProducts: async (
// // //       _: any,
// // //       { query }: SearchProductsArgs,
// // //       context: { prisma: PrismaClient },
// // //       info: GraphQLResolveInfo
// // //     ): Promise<ProcessedProduct[]> => {
// // //       return processor.findRelevantProducts(query);
// // //     },
// // //   },
// // //   Mutation: {
// // //     syncProducts: async (
// // //       _: any,
// // //       args: any,
// // //       context: { prisma: PrismaClient },
// // //       info: GraphQLResolveInfo
// // //     ): Promise<ProcessedProduct[]> => {
// // //       const results = await processor.findRelevantProducts("all products", 100);

// // //       // Batch create/update products
// // //       const products = await Promise.all(
// // //         results.map(async (product) => {
// // //           return context.prisma.product.upsert({
// // //             where: { printfulId: parseInt(product.id, 10) },
// // //             update: {
// // //               name: product.name,
// // //               description: product.description,
// // //               type: product.type,
// // //               variants: {
// // //                 upsert: product.variants.map((variant) => ({
// // //                   where: { printfulId: parseInt(variant.id, 10) },
// // //                   update: {
// // //                     name: variant.name,
// // //                     size: variant.size,
// // //                     color: variant.color,
// // //                     printfulPrice: variant.price,
// // //                     retailPrice: variant.price * 1.5,
// // //                   },
// // //                   create: {
// // //                     printfulId: parseInt(variant.id, 10),
// // //                     name: variant.name,
// // //                     size: variant.size,
// // //                     color: variant.color,
// // //                     printfulPrice: variant.price,
// // //                     retailPrice: variant.price * 1.5,
// // //                   },
// // //                 })),
// // //               },
// // //             },
// // //             create: {
// // //               printfulId: parseInt(product.id, 10),
// // //               name: product.name,
// // //               description: product.description,
// // //               type: product.type,
// // //               variants: {
// // //                 create: product.variants.map((variant) => ({
// // //                   printfulId: parseInt(variant.id, 10),
// // //                   name: variant.name,
// // //                   size: variant.size,
// // //                   color: variant.color,
// // //                   printfulPrice: variant.price,
// // //                   retailPrice: variant.price * 1.5,
// // //                 })),
// // //               },
// // //             },
// // //             include: { variants: true },
// // //           });
// // //         })
// // //       );

// // //       return products;
// // //     },
// // //   },
// // // });

// // // src/graphql/resolvers.ts

// // import { IResolvers } from "@graphql-tools/utils";
// // import { GraphQLResolveInfo } from "graphql";
// // import { PrismaClient } from "@prisma/client";
// // import {
// // 	ProductCatalogProcessor,
// // 	ProcessedProduct,
// // } from "@/lib/productProcessor";

// // // Define resolver arguments types
// // interface ProductsArgs {
// // 	query?: string;
// // 	limit?: number;
// // }

// // interface ProductArgs {
// // 	id: string;
// // }

// // interface SearchProductsArgs {
// // 	query: string;
// // }

// // type SyncProductsArgs = Record<string, never>; // Already addressed

// // // Define context type
// // interface ResolverContext {
// // 	prisma: PrismaClient;
// // 	processor: ProductCatalogProcessor;
// // }

// // export const resolvers: IResolvers<unknown, ResolverContext> = {
// // 	// Changed from <{}, ResolverContext> to <unknown, ResolverContext>
// // 	Query: {
// // 		products: async (
// // 			_parent: unknown,
// // 			{ query, limit = 10 }: ProductsArgs,
// // 			context: ResolverContext,
// // 			_info: GraphQLResolveInfo
// // 		): Promise<ProcessedProduct[]> => {
// // 			if (query) {
// // 				const results = await context.processor.findRelevantProducts(
// // 					query,
// // 					limit
// // 				);
// // 				return results;
// // 			}
// // 			const prismaResults = await context.prisma.product.findMany({
// // 				include: { variants: true },
// // 				take: limit,
// // 			});

// // 			// Map Prisma results to ProcessedProduct[], ensuring description is non-null
// // 			return prismaResults.map((product) => ({
// // 				id: product.id,
// // 				name: product.name,
// // 				type: product.type,
// // 				description: product.description ?? "",
// // 				printfulId: product.printfulId,
// // 				variants: product.variants.map((variant) => ({
// // 					id: variant.id,
// // 					name: variant.name,
// // 					size: variant.size ?? null,
// // 					color: variant.color ?? null,
// // 					price: variant.retailPrice, // Assuming 'price' in GraphQL is retailPrice
// // 					printfulId: variant.printfulId,
// // 					retailPrice: variant.retailPrice,
// // 				})),
// // 			}));
// // 		},
// // 		product: async (
// // 			_parent: unknown,
// // 			{ id }: ProductArgs,
// // 			context: ResolverContext,
// // 			_info: GraphQLResolveInfo
// // 		): Promise<ProcessedProduct | null> => {
// // 			const product = await context.prisma.product.findUnique({
// // 				where: { id },
// // 				include: { variants: true },
// // 			});

// // 			if (!product) {
// // 				return null;
// // 			}

// // 			return {
// // 				id: product.id,
// // 				name: product.name,
// // 				type: product.type,
// // 				description: product.description ?? "",
// // 				printfulId: product.printfulId,
// // 				variants: product.variants.map((variant) => ({
// // 					id: variant.id,
// // 					name: variant.name,
// // 					size: variant.size ?? null,
// // 					color: variant.color ?? null,
// // 					price: variant.retailPrice, // Assuming 'price' is retailPrice
// // 					printfulId: variant.printfulId,
// // 					retailPrice: variant.retailPrice,
// // 				})),
// // 			};
// // 		},
// // 		searchProducts: async (
// // 			_parent: unknown,
// // 			{ query }: SearchProductsArgs,
// // 			context: ResolverContext,
// // 			_info: GraphQLResolveInfo
// // 		): Promise<ProcessedProduct[]> => {
// // 			return context.processor.findRelevantProducts(query);
// // 		},
// // 	},
// // 	Mutation: {
// // 		syncProducts: async (
// // 			_parent: unknown,
// // 			_args: SyncProductsArgs,
// // 			context: ResolverContext,
// // 			_info: GraphQLResolveInfo
// // 		): Promise<ProcessedProduct[]> => {
// // 			const results = await context.processor.findRelevantProducts(
// // 				"all products",
// // 				100
// // 			);

// // 			// Batch create/update products
// // 			const products = await Promise.all(
// // 				results.map(async (product) => {
// // 					const prismaProduct = await context.prisma.product.upsert({
// // 						where: { printfulId: product.printfulId },
// // 						update: {
// // 							name: product.name,
// // 							description: product.description,
// // 							type: product.type,
// // 							variants: {
// // 								upsert: product.variants.map((variant) => ({
// // 									where: { printfulId: variant.printfulId },
// // 									update: {
// // 										name: variant.name,
// // 										size: variant.size,
// // 										color: variant.color,
// // 										printfulPrice: variant.price,
// // 										retailPrice: variant.retailPrice,
// // 									},
// // 									create: {
// // 										printfulId: variant.printfulId,
// // 										name: variant.name,
// // 										size: variant.size,
// // 										color: variant.color,
// // 										printfulPrice: variant.price,
// // 										retailPrice: variant.retailPrice,
// // 									},
// // 								})),
// // 							},
// // 						},
// // 						create: {
// // 							printfulId: product.printfulId,
// // 							name: product.name,
// // 							description: product.description,
// // 							type: product.type,
// // 							variants: {
// // 								create: product.variants.map((variant) => ({
// // 									printfulId: variant.printfulId,
// // 									name: variant.name,
// // 									size: variant.size,
// // 									color: variant.color,
// // 									printfulPrice: variant.price,
// // 									retailPrice: variant.retailPrice,
// // 								})),
// // 							},
// // 						},
// // 						include: { variants: true },
// // 					});

// // 					// Map the upserted product to ProcessedProduct
// // 					return {
// // 						id: prismaProduct.id,
// // 						name: prismaProduct.name,
// // 						type: prismaProduct.type,
// // 						description: prismaProduct.description ?? "",
// // 						printfulId: prismaProduct.printfulId,
// // 						variants: prismaProduct.variants.map((variant) => ({
// // 							id: variant.id,
// // 							name: variant.name,
// // 							size: variant.size ?? null,
// // 							color: variant.color ?? null,
// // 							price: variant.retailPrice, // Assuming 'price' is retailPrice
// // 							printfulId: variant.printfulId,
// // 							retailPrice: variant.retailPrice,
// // 						})),
// // 					};
// // 				})
// // 			);

// // 			return products;
// // 		},
// // 	},
// // };

// // src/graphql/resolvers.ts

// import { IResolvers } from "@graphql-tools/utils";
// import { GraphQLResolveInfo } from "graphql";
// import { PrismaClient } from "@prisma/client";
// import {
// 	ProductCatalogProcessor,
// 	ProcessedProduct,
// } from "@/lib/productProcessor";
// import logger from "@/lib/logger";

// // Define resolver arguments types
// interface ProductsArgs {
// 	query?: string;
// 	limit?: number;
// }

// interface ProductArgs {
// 	id: string;
// }

// interface SearchProductsArgs {
// 	query: string;
// }

// type SyncProductsArgs = Record<string, never>; // No arguments expected

// // Define context type
// interface ResolverContext {
// 	prisma: PrismaClient;
// 	processor: ProductCatalogProcessor;
// }

// export const resolvers: IResolvers<unknown, ResolverContext> = {
// 	Query: {
// 		products: async (
// 			_parent: unknown,
// 			{ query, limit = 10 }: ProductsArgs,
// 			context: ResolverContext,
// 			_info: GraphQLResolveInfo // Prefixed with underscore
// 		): Promise<ProcessedProduct[]> => {
// 			logger.info(
// 				`Resolver: Query 'products' called with query='${query}' and limit=${limit}`
// 			);
// 			try {
// 				let products: ProcessedProduct[] = [];
// 				if (query) {
// 					logger.info(
// 						`Resolver: Performing search with query='${query}' and limit=${limit}`
// 					);
// 					products = await context.processor.findRelevantProducts(
// 						query,
// 						limit
// 					);
// 					logger.info(
// 						`Resolver: Search completed with ${products.length} results`
// 					);
// 				} else {
// 					logger.info(
// 						`Resolver: Fetching all products with limit=${limit}`
// 					);
// 					const prismaResults = await context.prisma.product.findMany(
// 						{
// 							include: { variants: true },
// 							take: limit,
// 						}
// 					);
// 					logger.info(
// 						`Resolver: Retrieved ${prismaResults.length} products from Prisma`
// 					);

// 					// Map Prisma results to ProcessedProduct[], ensuring description is non-null
// 					products = prismaResults.map((product) => ({
// 						id: product.id,
// 						name: product.name,
// 						type: product.type,
// 						description: product.description ?? "",
// 						printfulId: product.printfulId,
// 						variants: product.variants.map((variant) => ({
// 							id: variant.id,
// 							name: variant.name,
// 							size: variant.size ?? null,
// 							color: variant.color ?? null,
// 							price: variant.retailPrice, // Assuming 'price' in GraphQL is retailPrice
// 							retailPrice: variant.retailPrice,
// 							printfulId: variant.printfulId,
// 						})),
// 					}));
// 					logger.info(
// 						`Resolver: Mapped Prisma results to ProcessedProduct format`
// 					);
// 				}
// 				return products;
// 			} catch (error) {
// 				logger.error(`Resolver: Error in 'products' query - ${error}`);
// 				throw error; // Let Apollo handle the error response
// 			}
// 		},
// 		product: async (
// 			_parent: unknown,
// 			{ id }: ProductArgs,
// 			context: ResolverContext,
// 			_info: GraphQLResolveInfo // Prefixed with underscore
// 		): Promise<ProcessedProduct | null> => {
// 			logger.info(`Resolver: Query 'product' called with id='${id}'`);
// 			try {
// 				const product = await context.prisma.product.findUnique({
// 					where: { id },
// 					include: { variants: true },
// 				});
// 				logger.info(
// 					`Resolver: Retrieved product: ${
// 						product ? product.name : "None"
// 					}`
// 				);

// 				if (!product) {
// 					return null;
// 				}

// 				const mappedProduct: ProcessedProduct = {
// 					id: product.id,
// 					name: product.name,
// 					type: product.type,
// 					description: product.description ?? "",
// 					printfulId: product.printfulId,
// 					variants: product.variants.map((variant) => ({
// 						id: variant.id,
// 						name: variant.name,
// 						size: variant.size ?? null,
// 						color: variant.color ?? null,
// 						price: variant.retailPrice, // Assuming 'price' is retailPrice
// 						retailPrice: variant.retailPrice,
// 						printfulId: variant.printfulId,
// 					})),
// 				};
// 				logger.info(
// 					`Resolver: Mapped product to ProcessedProduct format`
// 				);
// 				return mappedProduct;
// 			} catch (error) {
// 				logger.error(`Resolver: Error in 'product' query - ${error}`);
// 				throw error;
// 			}
// 		},
// 		searchProducts: async (
// 			_parent: unknown,
// 			{ query }: SearchProductsArgs,
// 			context: ResolverContext,
// 			_info: GraphQLResolveInfo // Prefixed with underscore
// 		): Promise<ProcessedProduct[]> => {
// 			logger.info(
// 				`Resolver: Query 'searchProducts' called with query='${query}'`
// 			);
// 			try {
// 				const results = await context.processor.findRelevantProducts(
// 					query
// 				);
// 				logger.info(
// 					`Resolver: Search completed with ${results.length} results`
// 				);
// 				return results;
// 			} catch (error) {
// 				logger.error(
// 					`Resolver: Error in 'searchProducts' query - ${error}`
// 				);
// 				throw error;
// 			}
// 		},
// 	},
// 	Mutation: {
// 		syncProducts: async (
// 			_parent: unknown,
// 			_args: SyncProductsArgs, // No arguments expected
// 			context: ResolverContext,
// 			_info: GraphQLResolveInfo // Prefixed with underscore
// 		): Promise<ProcessedProduct[]> => {
// 			logger.info(`Resolver: Mutation 'syncProducts' called`);
// 			try {
// 				const results = await context.processor.findRelevantProducts(
// 					"all products",
// 					100
// 				);
// 				logger.info(
// 					`Resolver: Retrieved ${results.length} products from findRelevantProducts`
// 				);

// 				// Batch create/update products
// 				const products = await Promise.all(
// 					results.map(async (product) => {
// 						logger.info(
// 							`Resolver: Upserting product with Printful ID ${product.printfulId}`
// 						);
// 						const prismaProduct =
// 							await context.prisma.product.upsert({
// 								where: { printfulId: product.printfulId },
// 								update: {
// 									name: product.name,
// 									description: product.description,
// 									type: product.type,
// 									variants: {
// 										upsert: product.variants.map(
// 											(variant) => ({
// 												where: {
// 													printfulId:
// 														variant.printfulId,
// 												},
// 												update: {
// 													name: variant.name,
// 													size: variant.size,
// 													color: variant.color,
// 													printfulPrice:
// 														variant.price,
// 													retailPrice:
// 														variant.retailPrice,
// 												},
// 												create: {
// 													printfulId:
// 														variant.printfulId,
// 													name: variant.name,
// 													size: variant.size,
// 													color: variant.color,
// 													printfulPrice:
// 														variant.price,
// 													retailPrice:
// 														variant.retailPrice,
// 												},
// 											})
// 										),
// 									},
// 								},
// 								create: {
// 									printfulId: product.printfulId,
// 									name: product.name,
// 									description: product.description,
// 									type: product.type,
// 									variants: {
// 										create: product.variants.map(
// 											(variant) => ({
// 												printfulId: variant.printfulId,
// 												name: variant.name,
// 												size: variant.size,
// 												color: variant.color,
// 												printfulPrice: variant.price,
// 												retailPrice:
// 													variant.retailPrice,
// 											})
// 										),
// 									},
// 								},
// 								include: { variants: true },
// 							});
// 						logger.info(
// 							`Resolver: Upserted product '${prismaProduct.name}'`
// 						);

// 						// Map the upserted product to ProcessedProduct
// 						const mappedProduct: ProcessedProduct = {
// 							id: prismaProduct.id,
// 							name: prismaProduct.name,
// 							type: prismaProduct.type,
// 							description: prismaProduct.description ?? "",
// 							printfulId: prismaProduct.printfulId,
// 							variants: prismaProduct.variants.map((variant) => ({
// 								id: variant.id,
// 								name: variant.name,
// 								size: variant.size ?? null,
// 								color: variant.color ?? null,
// 								price: variant.retailPrice, // Assuming 'price' is retailPrice
// 								retailPrice: variant.retailPrice,
// 								printfulId: variant.printfulId,
// 							})),
// 						};
// 						return mappedProduct;
// 					})
// 				);

// 				logger.info(
// 					`Resolver: Mutation 'syncProducts' completed with ${products.length} products`
// 				);
// 				return products;
// 			} catch (error) {
// 				logger.error(
// 					`Resolver: Error in 'syncProducts' mutation - ${error}`
// 				);
// 				throw error;
// 			}
// 		},
// 	},
// };

export {};
