// // // // // // // // // // // // // src/app/api/get-hat-variants/route.ts

// // // // // // // // // // // // import { NextResponse } from "next/server";
// // // // // // // // // // // // import { prisma } from "@/lib/prisma";
// // // // // // // // // // // // import { printfulClient } from "@/lib/printfulClient";
// // // // // // // // // // // // import Stripe from "stripe";
// // // // // // // // // // // // import { Prisma } from "@prisma/client";

// // // // // // // // // // // // // Initialize Stripe
// // // // // // // // // // // // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// // // // // // // // // // // // 	apiVersion: "2024-09-30.acacia",
// // // // // // // // // // // // });

// // // // // // // // // // // // // Define interfaces for Printful API responses
// // // // // // // // // // // // interface MockupTaskCreationResponse {
// // // // // // // // // // // // 	result: {
// // // // // // // // // // // // 		task_key: string;
// // // // // // // // // // // // 	};
// // // // // // // // // // // // }

// // // // // // // // // // // // interface MockupTaskResponse {
// // // // // // // // // // // // 	result: {
// // // // // // // // // // // // 		status: "pending" | "completed" | "failed";
// // // // // // // // // // // // 		mockups?: {
// // // // // // // // // // // // 			mockup_url: string;
// // // // // // // // // // // // 			option: string;
// // // // // // // // // // // // 		}[];
// // // // // // // // // // // // 	};
// // // // // // // // // // // // }

// // // // // // // // // // // // export async function POST(request: Request) {
// // // // // // // // // // // // 	try {
// // // // // // // // // // // // 		// Parse the request body to get the necessary data
// // // // // // // // // // // // 		const { resultId } = await request.json();

// // // // // // // // // // // // 		if (!resultId) {
// // // // // // // // // // // // 			return NextResponse.json(
// // // // // // // // // // // // 				{ error: "Missing required parameter: resultId" },
// // // // // // // // // // // // 				{ status: 400 }
// // // // // // // // // // // // 			);
// // // // // // // // // // // // 		}

// // // // // // // // // // // // 		// Fetch the generated PNG for the Pokémon card from the database
// // // // // // // // // // // // 		const quizResult = await prisma.quizResult.findUnique({
// // // // // // // // // // // // 			where: { id: resultId },
// // // // // // // // // // // // 			select: {
// // // // // // // // // // // // 				base64ImageMap: true,
// // // // // // // // // // // // 			},
// // // // // // // // // // // // 		});

// // // // // // // // // // // // 		if (!quizResult || !quizResult.base64ImageMap) {
// // // // // // // // // // // // 			return NextResponse.json(
// // // // // // // // // // // // 				{ error: "Pokémon card image not found" },
// // // // // // // // // // // // 				{ status: 404 }
// // // // // // // // // // // // 			);
// // // // // // // // // // // // 		}

// // // // // // // // // // // // 		// Cast base64ImageMap to the correct type
// // // // // // // // // // // // 		const base64ImageMap = quizResult.base64ImageMap as Record<
// // // // // // // // // // // // 			string,
// // // // // // // // // // // // 			string
// // // // // // // // // // // // 		>;
// // // // // // // // // // // // 		const pngBase64 = base64ImageMap["pokemonCard"];

// // // // // // // // // // // // 		if (!pngBase64) {
// // // // // // // // // // // // 			return NextResponse.json(
// // // // // // // // // // // // 				{ error: "Pokémon card image not found" },
// // // // // // // // // // // // 				{ status: 404 }
// // // // // // // // // // // // 			);
// // // // // // // // // // // // 		}

// // // // // // // // // // // // 		// Upload the image to Printful as a temporary file
// // // // // // // // // // // // 		const uploadResponse = await printfulClient.post("/files", {
// // // // // // // // // // // // 			contents: pngBase64,
// // // // // // // // // // // // 			filename: "pokemon_card_design.png",
// // // // // // // // // // // // 		});

// // // // // // // // // // // // 		const uploadedFileUrl = uploadResponse.data.result.url;

// // // // // // // // // // // // 		// Generate a mockup using the uploaded image
// // // // // // // // // // // // 		const mockupResponse =
// // // // // // // // // // // // 			await printfulClient.post<MockupTaskCreationResponse>(
// // // // // // // // // // // // 				"/mockup-generator/create-task",
// // // // // // // // // // // // 				{
// // // // // // // // // // // // 					template_id: 903, // Replace with the appropriate template ID for your hat
// // // // // // // // // // // // 					variant_ids: [4011], // Replace with the appropriate variant ID(s)
// // // // // // // // // // // // 					files: [
// // // // // // // // // // // // 						{
// // // // // // // // // // // // 							placement: "front",
// // // // // // // // // // // // 							image_url: uploadedFileUrl,
// // // // // // // // // // // // 						},
// // // // // // // // // // // // 					],
// // // // // // // // // // // // 				}
// // // // // // // // // // // // 			);

// // // // // // // // // // // // 		// Get the task key
// // // // // // // // // // // // 		const taskKey = mockupResponse.data.result.task_key;
// // // // // // // // // // // // 		let mockupResult = null;

// // // // // // // // // // // // 		// Poll the mockup generation task until it's completed
// // // // // // // // // // // // 		while (!mockupResult) {
// // // // // // // // // // // // 			const taskResponse = await printfulClient.get<MockupTaskResponse>(
// // // // // // // // // // // // 				`/mockup-generator/task?task_key=${taskKey}`
// // // // // // // // // // // // 			);

// // // // // // // // // // // // 			if (taskResponse.data.result.status === "completed") {
// // // // // // // // // // // // 				mockupResult = taskResponse.data.result.mockups![0];
// // // // // // // // // // // // 			} else if (taskResponse.data.result.status === "failed") {
// // // // // // // // // // // // 				return NextResponse.json(
// // // // // // // // // // // // 					{ error: "Mockup generation failed" },
// // // // // // // // // // // // 					{ status: 500 }
// // // // // // // // // // // // 				);
// // // // // // // // // // // // 			} else {
// // // // // // // // // // // // 				// Wait for a short period before checking again
// // // // // // // // // // // // 				await new Promise((resolve) => setTimeout(resolve, 1000));
// // // // // // // // // // // // 			}
// // // // // // // // // // // // 		}

// // // // // // // // // // // // 		const mockupUrl = mockupResult.mockup_url;

// // // // // // // // // // // // 		// Create a new Stripe product
// // // // // // // // // // // // 		const stripeProduct = await stripe.products.create({
// // // // // // // // // // // // 			name: "Custom Pokémon Hat",
// // // // // // // // // // // // 			description: "A custom hat featuring your Pokémon card design.",
// // // // // // // // // // // // 			images: [mockupUrl],
// // // // // // // // // // // // 		});

// // // // // // // // // // // // 		// Create a new Stripe price
// // // // // // // // // // // // 		const stripePrice = await stripe.prices.create({
// // // // // // // // // // // // 			unit_amount: 2500, // Amount in cents
// // // // // // // // // // // // 			currency: "usd",
// // // // // // // // // // // // 			product: stripeProduct.id,
// // // // // // // // // // // // 		});

// // // // // // // // // // // // 		// Create a new variant in the database associated with this mockup and Stripe product
// // // // // // // // // // // // 		const newVariant = await prisma.hatVariant.create({
// // // // // // // // // // // // 			data: {
// // // // // // // // // // // // 				printfulId: 0, // Assuming 0 for custom variant, adjust as needed
// // // // // // // // // // // // 				name: "Custom Pokémon Hat",
// // // // // // // // // // // // 				color: "Custom",
// // // // // // // // // // // // 				size: "One Size",
// // // // // // // // // // // // 				image: mockupUrl,
// // // // // // // // // // // // 				retailPrice: 25.0, // Set your desired price
// // // // // // // // // // // // 				currency: "USD",
// // // // // // // // // // // // 				stripePriceId: stripePrice.id,
// // // // // // // // // // // // 				hatProduct: {
// // // // // // // // // // // // 					connectOrCreate: {
// // // // // // // // // // // // 						where: { printfulId: 91 },
// // // // // // // // // // // // 						create: {
// // // // // // // // // // // // 							printfulId: 91,
// // // // // // // // // // // // 							mainCategoryId: 41,
// // // // // // // // // // // // 							type: "EMBROIDERY",
// // // // // // // // // // // // 							description: "Custom Pokémon Hat",
// // // // // // // // // // // // 							title: "Custom Pokémon Hat",
// // // // // // // // // // // // 							brand: "Custom",
// // // // // // // // // // // // 							model: "Custom Model",
// // // // // // // // // // // // 							image: mockupUrl,
// // // // // // // // // // // // 							variantCount: 1,
// // // // // // // // // // // // 							currency: "USD",
// // // // // // // // // // // // 							options: {} as Prisma.JsonObject,
// // // // // // // // // // // // 							techniques: {} as Prisma.JsonObject,
// // // // // // // // // // // // 							files: {} as Prisma.JsonObject,
// // // // // // // // // // // // 						},
// // // // // // // // // // // // 					},
// // // // // // // // // // // // 				},
// // // // // // // // // // // // 			},
// // // // // // // // // // // // 		});

// // // // // // // // // // // // 		// Return the new variant as the response
// // // // // // // // // // // // 		return NextResponse.json({ variant: newVariant });
// // // // // // // // // // // // 	} catch (error) {
// // // // // // // // // // // // 		console.error("Error generating hat variant:", error);
// // // // // // // // // // // // 		return NextResponse.json(
// // // // // // // // // // // // 			{ error: "Failed to generate hat variant" },
// // // // // // // // // // // // 			{ status: 500 }
// // // // // // // // // // // // 		);
// // // // // // // // // // // // 	}
// // // // // // // // // // // // }

// // // // // // // // // // // import { NextResponse } from "next/server";
// // // // // // // // // // // import { prisma } from "@/lib/prisma";
// // // // // // // // // // // import { printfulClient } from "@/lib/printfulClient";
// // // // // // // // // // // import Stripe from "stripe";
// // // // // // // // // // // import { Prisma } from "@prisma/client";

// // // // // // // // // // // // Initialize Stripe
// // // // // // // // // // // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// // // // // // // // // // // 	apiVersion: "2024-09-30.acacia",
// // // // // // // // // // // });

// // // // // // // // // // // // Define interfaces for Printful API responses
// // // // // // // // // // // interface MockupTaskCreationResponse {
// // // // // // // // // // // 	result: {
// // // // // // // // // // // 		task_key: string;
// // // // // // // // // // // 	};
// // // // // // // // // // // }

// // // // // // // // // // // interface MockupTaskResponse {
// // // // // // // // // // // 	result: {
// // // // // // // // // // // 		status: "pending" | "completed" | "failed";
// // // // // // // // // // // 		mockups?: {
// // // // // // // // // // // 			mockup_url: string;
// // // // // // // // // // // 			option: string;
// // // // // // // // // // // 		}[];
// // // // // // // // // // // 	};
// // // // // // // // // // // }

// // // // // // // // // // // export async function POST(request: Request) {
// // // // // // // // // // // 	try {
// // // // // // // // // // // 		console.log("Received POST request to /api/get-hat-variants");

// // // // // // // // // // // 		// Parse the request body to get the necessary data
// // // // // // // // // // // 		const { resultId } = await request.json();

// // // // // // // // // // // 		if (!resultId) {
// // // // // // // // // // // 			return NextResponse.json(
// // // // // // // // // // // 				{ error: "Missing required parameter: resultId" },
// // // // // // // // // // // 				{ status: 400 }
// // // // // // // // // // // 			);
// // // // // // // // // // // 		}

// // // // // // // // // // // 		// Fetch the generated PNG for the Pokémon card from the database
// // // // // // // // // // // 		const quizResult = await prisma.quizResult.findUnique({
// // // // // // // // // // // 			where: { id: resultId },
// // // // // // // // // // // 			select: {
// // // // // // // // // // // 				base64ImageMap: true,
// // // // // // // // // // // 			},
// // // // // // // // // // // 		});

// // // // // // // // // // // 		if (!quizResult || !quizResult.base64ImageMap) {
// // // // // // // // // // // 			return NextResponse.json(
// // // // // // // // // // // 				{ error: "Pokémon card image not found" },
// // // // // // // // // // // 				{ status: 404 }
// // // // // // // // // // // 			);
// // // // // // // // // // // 		}

// // // // // // // // // // // 		// Cast base64ImageMap to the correct type
// // // // // // // // // // // 		const base64ImageMap = quizResult.base64ImageMap as Record<
// // // // // // // // // // // 			string,
// // // // // // // // // // // 			string
// // // // // // // // // // // 		>;
// // // // // // // // // // // 		const pngBase64 = base64ImageMap["pokemonCard"];

// // // // // // // // // // // 		if (!pngBase64) {
// // // // // // // // // // // 			return NextResponse.json(
// // // // // // // // // // // 				{ error: "Pokémon card image not found" },
// // // // // // // // // // // 				{ status: 404 }
// // // // // // // // // // // 			);
// // // // // // // // // // // 		}

// // // // // // // // // // // 		// Upload the image to Printful as a temporary file
// // // // // // // // // // // 		const uploadResponse = await printfulClient.post("/files", {
// // // // // // // // // // // 			contents: pngBase64,
// // // // // // // // // // // 			filename: "pokemon_card_design.png",
// // // // // // // // // // // 		});

// // // // // // // // // // // 		const uploadedFileUrl = uploadResponse.data.result.url;

// // // // // // // // // // // 		// Generate a mockup using the uploaded image
// // // // // // // // // // // 		const mockupResponse =
// // // // // // // // // // // 			await printfulClient.post<MockupTaskCreationResponse>(
// // // // // // // // // // // 				"/mockup-generator/create-task",
// // // // // // // // // // // 				{
// // // // // // // // // // // 					template_id: 903, // Replace with the appropriate template ID for your hat
// // // // // // // // // // // 					variant_ids: [4011], // Replace with the appropriate variant ID(s)
// // // // // // // // // // // 					files: [
// // // // // // // // // // // 						{
// // // // // // // // // // // 							placement: "front",
// // // // // // // // // // // 							image_url: uploadedFileUrl,
// // // // // // // // // // // 						},
// // // // // // // // // // // 					],
// // // // // // // // // // // 				}
// // // // // // // // // // // 			);

// // // // // // // // // // // 		// Get the task key
// // // // // // // // // // // 		const taskKey = mockupResponse.data.result.task_key;
// // // // // // // // // // // 		let mockupResult = null;

// // // // // // // // // // // 		// Poll the mockup generation task until it's completed
// // // // // // // // // // // 		while (!mockupResult) {
// // // // // // // // // // // 			const taskResponse = await printfulClient.get<MockupTaskResponse>(
// // // // // // // // // // // 				`/mockup-generator/task?task_key=${taskKey}`
// // // // // // // // // // // 			);

// // // // // // // // // // // 			if (taskResponse.data.result.status === "completed") {
// // // // // // // // // // // 				mockupResult = taskResponse.data.result.mockups![0];
// // // // // // // // // // // 			} else if (taskResponse.data.result.status === "failed") {
// // // // // // // // // // // 				return NextResponse.json(
// // // // // // // // // // // 					{ error: "Mockup generation failed" },
// // // // // // // // // // // 					{ status: 500 }
// // // // // // // // // // // 				);
// // // // // // // // // // // 			} else {
// // // // // // // // // // // 				// Wait for a short period before checking again
// // // // // // // // // // // 				await new Promise((resolve) => setTimeout(resolve, 1000));
// // // // // // // // // // // 			}
// // // // // // // // // // // 		}

// // // // // // // // // // // 		const mockupUrl = mockupResult.mockup_url;

// // // // // // // // // // // 		// Create a new Stripe product
// // // // // // // // // // // 		const stripeProduct = await stripe.products.create({
// // // // // // // // // // // 			name: "Custom Pokémon Hat",
// // // // // // // // // // // 			description: "A custom hat featuring your Pokémon card design.",
// // // // // // // // // // // 			images: [mockupUrl],
// // // // // // // // // // // 		});

// // // // // // // // // // // 		// Create a new Stripe price
// // // // // // // // // // // 		const stripePrice = await stripe.prices.create({
// // // // // // // // // // // 			unit_amount: 2500, // Amount in cents
// // // // // // // // // // // 			currency: "usd",
// // // // // // // // // // // 			product: stripeProduct.id,
// // // // // // // // // // // 		});

// // // // // // // // // // // 		// Create a new variant in the database associated with this mockup and Stripe product
// // // // // // // // // // // 		const newVariant = await prisma.hatVariant.create({
// // // // // // // // // // // 			data: {
// // // // // // // // // // // 				printfulId: 0, // Assuming 0 for custom variant, adjust as needed
// // // // // // // // // // // 				name: "Custom Pokémon Hat",
// // // // // // // // // // // 				color: "Custom",
// // // // // // // // // // // 				size: "One Size",
// // // // // // // // // // // 				image: mockupUrl,
// // // // // // // // // // // 				retailPrice: 25.0, // Set your desired price
// // // // // // // // // // // 				currency: "USD",
// // // // // // // // // // // 				stripePriceId: stripePrice.id,
// // // // // // // // // // // 				hatProduct: {
// // // // // // // // // // // 					connectOrCreate: {
// // // // // // // // // // // 						where: { printfulId: 91 },
// // // // // // // // // // // 						create: {
// // // // // // // // // // // 							printfulId: 91,
// // // // // // // // // // // 							mainCategoryId: 41,
// // // // // // // // // // // 							type: "EMBROIDERY",
// // // // // // // // // // // 							description: "Custom Pokémon Hat",
// // // // // // // // // // // 							title: "Custom Pokémon Hat",
// // // // // // // // // // // 							brand: "Custom",
// // // // // // // // // // // 							model: "Custom Model",
// // // // // // // // // // // 							image: mockupUrl,
// // // // // // // // // // // 							variantCount: 1,
// // // // // // // // // // // 							currency: "USD",
// // // // // // // // // // // 							options: {} as Prisma.JsonObject,
// // // // // // // // // // // 							techniques: {} as Prisma.JsonObject,
// // // // // // // // // // // 							files: {} as Prisma.JsonObject,
// // // // // // // // // // // 						},
// // // // // // // // // // // 					},
// // // // // // // // // // // 				},
// // // // // // // // // // // 			},
// // // // // // // // // // // 		});

// // // // // // // // // // // 		console.log("Successfully created Stripe product and price");
// // // // // // // // // // // 		console.log("Returning new variant:", newVariant);

// // // // // // // // // // // 		// Return the new variant as the response
// // // // // // // // // // // 		return NextResponse.json({ variant: newVariant });
// // // // // // // // // // // 	} catch (error) {
// // // // // // // // // // // 		console.error("Error generating hat variant:", error);
// // // // // // // // // // // 		return NextResponse.json(
// // // // // // // // // // // 			{ error: "Failed to generate hat variant" },
// // // // // // // // // // // 			{ status: 500 }
// // // // // // // // // // // 		);
// // // // // // // // // // // 	}
// // // // // // // // // // // }

// // // // // // // // // // import { NextResponse } from "next/server";
// // // // // // // // // // import { prisma } from "@/lib/prisma";
// // // // // // // // // // import { printfulClient } from "@/lib/printfulClient";
// // // // // // // // // // import Stripe from "stripe";
// // // // // // // // // // import { Prisma } from "@prisma/client";

// // // // // // // // // // // Initialize Stripe
// // // // // // // // // // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// // // // // // // // // // 	apiVersion: "2024-09-30.acacia", // Ensure this is a valid API version
// // // // // // // // // // });

// // // // // // // // // // // Define interfaces for Printful API responses
// // // // // // // // // // interface MockupTaskCreationResponse {
// // // // // // // // // // 	result: {
// // // // // // // // // // 		task_key: string;
// // // // // // // // // // 	};
// // // // // // // // // // }

// // // // // // // // // // interface MockupTaskResponse {
// // // // // // // // // // 	result: {
// // // // // // // // // // 		status: "pending" | "completed" | "failed";
// // // // // // // // // // 		mockups?: {
// // // // // // // // // // 			mockup_url: string;
// // // // // // // // // // 			option: string;
// // // // // // // // // // 		}[];
// // // // // // // // // // 	};
// // // // // // // // // // }

// // // // // // // // // // export async function POST(request: Request) {
// // // // // // // // // // 	try {
// // // // // // // // // // 		console.log("Received POST request to /api/get-hat-variants");

// // // // // // // // // // 		// Parse the request body to get the necessary data
// // // // // // // // // // 		const { resultId } = await request.json();
// // // // // // // // // // 		console.log("Extracted resultId:", resultId);

// // // // // // // // // // 		if (!resultId) {
// // // // // // // // // // 			console.error("Missing resultId in request body");
// // // // // // // // // // 			return NextResponse.json(
// // // // // // // // // // 				{ error: "Missing required parameter: resultId" },
// // // // // // // // // // 				{ status: 400 }
// // // // // // // // // // 			);
// // // // // // // // // // 		}

// // // // // // // // // // 		// Fetch the generated PNG for the Pokémon card from the database
// // // // // // // // // // 		const quizResult = await prisma.quizResult.findUnique({
// // // // // // // // // // 			where: { id: resultId },
// // // // // // // // // // 			select: {
// // // // // // // // // // 				base64ImageMap: true,
// // // // // // // // // // 			},
// // // // // // // // // // 		});
// // // // // // // // // // 		console.log("Fetched quizResult:", quizResult);

// // // // // // // // // // 		if (!quizResult || !quizResult.base64ImageMap) {
// // // // // // // // // // 			console.error(
// // // // // // // // // // 				"QuizResult or base64ImageMap not found for resultId:",
// // // // // // // // // // 				resultId
// // // // // // // // // // 			);
// // // // // // // // // // 			return NextResponse.json(
// // // // // // // // // // 				{ error: "Pokémon card image not found" },
// // // // // // // // // // 				{ status: 404 }
// // // // // // // // // // 			);
// // // // // // // // // // 		}

// // // // // // // // // // 		// Cast base64ImageMap to the correct type
// // // // // // // // // // 		const base64ImageMap = quizResult.base64ImageMap as Record<
// // // // // // // // // // 			string,
// // // // // // // // // // 			string
// // // // // // // // // // 		>;
// // // // // // // // // // 		const pngBase64 = base64ImageMap["pokemonCard"];
// // // // // // // // // // 		console.log("Extracted pngBase64:", pngBase64);

// // // // // // // // // // 		if (!pngBase64) {
// // // // // // // // // // 			console.error(
// // // // // // // // // // 				"pokemonCard key not found in base64ImageMap for resultId:",
// // // // // // // // // // 				resultId
// // // // // // // // // // 			);
// // // // // // // // // // 			return NextResponse.json(
// // // // // // // // // // 				{ error: "Pokémon card image not found" },
// // // // // // // // // // 				{ status: 404 }
// // // // // // // // // // 			);
// // // // // // // // // // 		}

// // // // // // // // // // 		// Upload the image to Printful as a temporary file
// // // // // // // // // // 		const uploadResponse = await printfulClient.post("/files", {
// // // // // // // // // // 			contents: pngBase64,
// // // // // // // // // // 			filename: "pokemon_card_design.png",
// // // // // // // // // // 		});
// // // // // // // // // // 		console.log("Printful upload response:", uploadResponse.data);

// // // // // // // // // // 		const uploadedFileUrl = uploadResponse.data.result.url;
// // // // // // // // // // 		console.log("Uploaded File URL:", uploadedFileUrl);

// // // // // // // // // // 		// Generate a mockup using the uploaded image
// // // // // // // // // // 		const mockupResponse =
// // // // // // // // // // 			await printfulClient.post<MockupTaskCreationResponse>(
// // // // // // // // // // 				"/mockup-generator/create-task",
// // // // // // // // // // 				{
// // // // // // // // // // 					template_id: 903, // Replace with the appropriate template ID for your hat
// // // // // // // // // // 					variant_ids: [4011], // Replace with the appropriate variant ID(s)
// // // // // // // // // // 					files: [
// // // // // // // // // // 						{
// // // // // // // // // // 							placement: "front",
// // // // // // // // // // 							image_url: uploadedFileUrl,
// // // // // // // // // // 						},
// // // // // // // // // // 					],
// // // // // // // // // // 				}
// // // // // // // // // // 			);
// // // // // // // // // // 		console.log("Mockup creation response:", mockupResponse.data);

// // // // // // // // // // 		// Get the task key
// // // // // // // // // // 		const taskKey = mockupResponse.data.result.task_key;
// // // // // // // // // // 		console.log("Generated taskKey:", taskKey);

// // // // // // // // // // 		let mockupResult = null;

// // // // // // // // // // 		// Poll the mockup generation task until it's completed
// // // // // // // // // // 		while (!mockupResult) {
// // // // // // // // // // 			const taskResponse = await printfulClient.get<MockupTaskResponse>(
// // // // // // // // // // 				`/mockup-generator/task?task_key=${taskKey}`
// // // // // // // // // // 			);
// // // // // // // // // // 			console.log("Mockup task status:", taskResponse.data.result.status);

// // // // // // // // // // 			if (taskResponse.data.result.status === "completed") {
// // // // // // // // // // 				mockupResult = taskResponse.data.result.mockups![0];
// // // // // // // // // // 				console.log("Mockup completed:", mockupResult);
// // // // // // // // // // 			} else if (taskResponse.data.result.status === "failed") {
// // // // // // // // // // 				console.error("Mockup generation failed for taskKey:", taskKey);
// // // // // // // // // // 				return NextResponse.json(
// // // // // // // // // // 					{ error: "Mockup generation failed" },
// // // // // // // // // // 					{ status: 500 }
// // // // // // // // // // 				);
// // // // // // // // // // 			} else {
// // // // // // // // // // 				// Wait for a short period before checking again
// // // // // // // // // // 				await new Promise((resolve) => setTimeout(resolve, 1000));
// // // // // // // // // // 			}
// // // // // // // // // // 		}

// // // // // // // // // // 		const mockupUrl = mockupResult.mockup_url;
// // // // // // // // // // 		console.log("Final mockup URL:", mockupUrl);

// // // // // // // // // // 		// Create a new Stripe product
// // // // // // // // // // 		const stripeProduct = await stripe.products.create({
// // // // // // // // // // 			name: "Custom Pokémon Hat",
// // // // // // // // // // 			description: "A custom hat featuring your Pokémon card design.",
// // // // // // // // // // 			images: [mockupUrl],
// // // // // // // // // // 		});
// // // // // // // // // // 		console.log("Created Stripe product:", stripeProduct.id);

// // // // // // // // // // 		// Create a new Stripe price
// // // // // // // // // // 		const stripePrice = await stripe.prices.create({
// // // // // // // // // // 			unit_amount: 2500, // Amount in cents
// // // // // // // // // // 			currency: "usd",
// // // // // // // // // // 			product: stripeProduct.id,
// // // // // // // // // // 		});
// // // // // // // // // // 		console.log("Created Stripe price:", stripePrice.id);

// // // // // // // // // // 		// Create a new variant in the database associated with this mockup and Stripe product
// // // // // // // // // // 		const newVariant = await prisma.hatVariant.create({
// // // // // // // // // // 			data: {
// // // // // // // // // // 				printfulId: 0, // Assuming 0 for custom variant, adjust as needed
// // // // // // // // // // 				name: "Custom Pokémon Hat",
// // // // // // // // // // 				color: "Custom",
// // // // // // // // // // 				size: "One Size",
// // // // // // // // // // 				image: mockupUrl,
// // // // // // // // // // 				retailPrice: 25.0, // Set your desired price
// // // // // // // // // // 				currency: "USD",
// // // // // // // // // // 				stripePriceId: stripePrice.id,
// // // // // // // // // // 				hatProduct: {
// // // // // // // // // // 					connectOrCreate: {
// // // // // // // // // // 						where: { printfulId: 91 },
// // // // // // // // // // 						create: {
// // // // // // // // // // 							printfulId: 91,
// // // // // // // // // // 							mainCategoryId: 41,
// // // // // // // // // // 							type: "EMBROIDERY",
// // // // // // // // // // 							description: "Custom Pokémon Hat",
// // // // // // // // // // 							title: "Custom Pokémon Hat",
// // // // // // // // // // 							brand: "Custom",
// // // // // // // // // // 							model: "Custom Model",
// // // // // // // // // // 							image: mockupUrl,
// // // // // // // // // // 							variantCount: 1,
// // // // // // // // // // 							currency: "USD",
// // // // // // // // // // 							options: {} as Prisma.JsonObject,
// // // // // // // // // // 							techniques: {} as Prisma.JsonObject,
// // // // // // // // // // 							files: {} as Prisma.JsonObject,
// // // // // // // // // // 						},
// // // // // // // // // // 					},
// // // // // // // // // // 				},
// // // // // // // // // // 			},
// // // // // // // // // // 		});
// // // // // // // // // // 		console.log("Created new hatVariant:", newVariant);

// // // // // // // // // // 		// Return the new variant as the response
// // // // // // // // // // 		return NextResponse.json({ variant: newVariant });
// // // // // // // // // // 	} catch (error) {
// // // // // // // // // // 		console.error("Error generating hat variant:", error);
// // // // // // // // // // 		return NextResponse.json(
// // // // // // // // // // 			{ error: "Failed to generate hat variant" },
// // // // // // // // // // 			{ status: 500 }
// // // // // // // // // // 		);
// // // // // // // // // // 	}
// // // // // // // // // // }

// // // // // // // // // // src/app/api/get-hat-variants/route.ts

// // // // // // // // // import { NextResponse } from "next/server";
// // // // // // // // // import { prisma } from "@/lib/prisma";
// // // // // // // // // import { printfulClient } from "@/lib/printfulClient";
// // // // // // // // // import Stripe from "stripe";
// // // // // // // // // import { Prisma } from "@prisma/client";

// // // // // // // // // // Initialize Stripe
// // // // // // // // // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// // // // // // // // //   apiVersion: "2024-09-30.acacia", // Use a valid Stripe API version
// // // // // // // // // });

// // // // // // // // // // Define interfaces for Printful API responses
// // // // // // // // // interface MockupTaskCreationResponse {
// // // // // // // // //   result: {
// // // // // // // // //     task_key: string;
// // // // // // // // //   };
// // // // // // // // // }

// // // // // // // // // interface MockupTaskResponse {
// // // // // // // // //   result: {
// // // // // // // // //     status: "pending" | "completed" | "failed";
// // // // // // // // //     mockups?: {
// // // // // // // // //       mockup_url: string;
// // // // // // // // //       option: string;
// // // // // // // // //     }[];
// // // // // // // // //   };
// // // // // // // // // }

// // // // // // // // // export async function POST(request: Request) {
// // // // // // // // //   try {
// // // // // // // // //     console.log("Received POST request to /api/get-hat-variants");

// // // // // // // // //     // Parse the request body to get the necessary data
// // // // // // // // //     const { resultId } = await request.json();
// // // // // // // // //     console.log("Extracted resultId:", resultId);

// // // // // // // // //     if (!resultId) {
// // // // // // // // //       console.error("Missing resultId in request body");
// // // // // // // // //       return NextResponse.json(
// // // // // // // // //         { error: "Missing required parameter: resultId" },
// // // // // // // // //         { status: 400 }
// // // // // // // // //       );
// // // // // // // // //     }

// // // // // // // // //     // Fetch the generated PNG for the Pokémon card from the database
// // // // // // // // //     const quizResult = await prisma.quizResult.findUnique({
// // // // // // // // //       where: { id: resultId },
// // // // // // // // //       select: {
// // // // // // // // //         base64ImageMap: true,
// // // // // // // // //       },
// // // // // // // // //     });
// // // // // // // // //     console.log("Fetched quizResult:", quizResult);

// // // // // // // // //     if (!quizResult || !quizResult.base64ImageMap) {
// // // // // // // // //       console.error("QuizResult or base64ImageMap not found for resultId:", resultId);
// // // // // // // // //       return NextResponse.json(
// // // // // // // // //         { error: "Pokémon card image not found" },
// // // // // // // // //         { status: 404 }
// // // // // // // // //       );
// // // // // // // // //     }

// // // // // // // // //     // Cast base64ImageMap to the correct type
// // // // // // // // //     const base64ImageMap = quizResult.base64ImageMap as Record<string, string>;
// // // // // // // // //     const pngBase64 = base64ImageMap["pokemonCard"];
// // // // // // // // //     console.log("Extracted pngBase64:", pngBase64);

// // // // // // // // //     if (!pngBase64) {
// // // // // // // // //       console.error("pokemonCard key not found in base64ImageMap for resultId:", resultId);
// // // // // // // // //       return NextResponse.json(
// // // // // // // // //         { error: "Pokémon card image not found" },
// // // // // // // // //         { status: 404 }
// // // // // // // // //       );
// // // // // // // // //     }

// // // // // // // // //     // Upload the image to Printful as a temporary file
// // // // // // // // //     const uploadResponse = await printfulClient.post("/files", {
// // // // // // // // //       contents: pngBase64,
// // // // // // // // //       filename: "pokemon_card_design.png",
// // // // // // // // //     });
// // // // // // // // //     console.log("Printful upload response:", uploadResponse.data);

// // // // // // // // //     const uploadedFileUrl = uploadResponse.data.result.url;
// // // // // // // // //     console.log("Uploaded File URL:", uploadedFileUrl);

// // // // // // // // //     // Generate a mockup using the uploaded image
// // // // // // // // //     const mockupResponse = await printfulClient.post<MockupTaskCreationResponse>(
// // // // // // // // //       "/mockup-generator/create-task",
// // // // // // // // //       {
// // // // // // // // //         template_id: 903, // Replace with the appropriate template ID for your hat
// // // // // // // // //         variant_ids: [4011], // Replace with the appropriate variant ID(s)
// // // // // // // // //         files: [
// // // // // // // // //           {
// // // // // // // // //             placement: "front",
// // // // // // // // //             image_url: uploadedFileUrl,
// // // // // // // // //           },
// // // // // // // // //         ],
// // // // // // // // //       }
// // // // // // // // //     );
// // // // // // // // //     console.log("Mockup creation response:", mockupResponse.data);

// // // // // // // // //     // Get the task key
// // // // // // // // //     const taskKey = mockupResponse.data.result.task_key;
// // // // // // // // //     console.log("Generated taskKey:", taskKey);

// // // // // // // // //     let mockupResult = null;

// // // // // // // // //     // Poll the mockup generation task until it's completed
// // // // // // // // //     while (!mockupResult) {
// // // // // // // // //       const taskResponse = await printfulClient.get<MockupTaskResponse>(
// // // // // // // // //         `/mockup-generator/task?task_key=${taskKey}`
// // // // // // // // //       );
// // // // // // // // //       console.log("Mockup task status:", taskResponse.data.result.status);

// // // // // // // // //       if (taskResponse.data.result.status === "completed") {
// // // // // // // // //         mockupResult = taskResponse.data.result.mockups![0];
// // // // // // // // //         console.log("Mockup completed:", mockupResult);
// // // // // // // // //       } else if (taskResponse.data.result.status === "failed") {
// // // // // // // // //         console.error("Mockup generation failed for taskKey:", taskKey);
// // // // // // // // //         return NextResponse.json(
// // // // // // // // //           { error: "Mockup generation failed" },
// // // // // // // // //           { status: 500 }
// // // // // // // // //         );
// // // // // // // // //       } else {
// // // // // // // // //         // Wait for a short period before checking again
// // // // // // // // //         console.log("Mockup still pending. Waiting to retry...");
// // // // // // // // //         await new Promise((resolve) => setTimeout(resolve, 1000));
// // // // // // // // //       }
// // // // // // // // //     }

// // // // // // // // //     const mockupUrl = mockupResult.mockup_url;
// // // // // // // // //     console.log("Final mockup URL:", mockupUrl);

// // // // // // // // //     // Create a new Stripe product
// // // // // // // // //     const stripeProduct = await stripe.products.create({
// // // // // // // // //       name: "Custom Pokémon Hat",
// // // // // // // // //       description: "A custom hat featuring your Pokémon card design.",
// // // // // // // // //       images: [mockupUrl],
// // // // // // // // //     });
// // // // // // // // //     console.log("Created Stripe product:", stripeProduct.id);

// // // // // // // // //     // Create a new Stripe price
// // // // // // // // //     const stripePrice = await stripe.prices.create({
// // // // // // // // //       unit_amount: 2500, // Amount in cents
// // // // // // // // //       currency: "usd",
// // // // // // // // //       product: stripeProduct.id,
// // // // // // // // //     });
// // // // // // // // //     console.log("Created Stripe price:", stripePrice.id);

// // // // // // // // //     // Create a new variant in the database associated with this mockup and Stripe product
// // // // // // // // //     const newVariant = await prisma.hatVariant.create({
// // // // // // // // //       data: {
// // // // // // // // //         printfulId: 0, // Assuming 0 for custom variant, adjust as needed
// // // // // // // // //         name: "Custom Pokémon Hat",
// // // // // // // // //         color: "Custom",
// // // // // // // // //         size: "One Size",
// // // // // // // // //         image: mockupUrl,
// // // // // // // // //         retailPrice: 25.0, // Set your desired price
// // // // // // // // //         currency: "USD",
// // // // // // // // //         stripePriceId: stripePrice.id,
// // // // // // // // //         hatProduct: {
// // // // // // // // //           connectOrCreate: {
// // // // // // // // //             where: { printfulId: 91 },
// // // // // // // // //             create: {
// // // // // // // // //               printfulId: 91,
// // // // // // // // //               mainCategoryId: 41,
// // // // // // // // //               type: "EMBROIDERY",
// // // // // // // // //               description: "Custom Pokémon Hat",
// // // // // // // // //               title: "Custom Pokémon Hat",
// // // // // // // // //               brand: "Custom",
// // // // // // // // //               model: "Custom Model",
// // // // // // // // //               image: mockupUrl,
// // // // // // // // //               variantCount: 1,
// // // // // // // // //               currency: "USD",
// // // // // // // // //               options: {} as Prisma.JsonObject,
// // // // // // // // //               techniques: {} as Prisma.JsonObject,
// // // // // // // // //               files: {} as Prisma.JsonObject,
// // // // // // // // //             },
// // // // // // // // //           },
// // // // // // // // //         },
// // // // // // // // //       },
// // // // // // // // //     });
// // // // // // // // //     console.log("Created new hatVariant:", newVariant);

// // // // // // // // //     // Return the new variant as the response
// // // // // // // // //     return NextResponse.json({ variant: newVariant });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     console.error("Error generating hat variant:", error);
// // // // // // // // //     return NextResponse.json(
// // // // // // // // //       { error: "Failed to generate hat variant" },
// // // // // // // // //       { status: 500 }
// // // // // // // // //     );
// // // // // // // // //   }
// // // // // // // // // }

// // // // // // // // // src/app/api/get-hat-variants/route.ts

// // // // // // // // import { NextResponse } from "next/server";
// // // // // // // // import { printfulClient } from "@/lib/printfulClient"; // Ensure this is correctly configured
// // // // // // // // import Stripe from "stripe";
// // // // // // // // import { PrismaClient, Prisma } from "@prisma/client";

// // // // // // // // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// // // // // // // // 	apiVersion: "2024-09-30.acacia",
// // // // // // // // });

// // // // // // // // const prisma = new PrismaClient();

// // // // // // // // export async function POST(request: Request) {
// // // // // // // // 	try {
// // // // // // // // 		const { resultId, pngBase64 } = await request.json();

// // // // // // // // 		if (!resultId || !pngBase64) {
// // // // // // // // 			return NextResponse.json(
// // // // // // // // 				{
// // // // // // // // 					error: "Missing required parameters: resultId and pngBase64",
// // // // // // // // 				},
// // // // // // // // 				{ status: 400 }
// // // // // // // // 			);
// // // // // // // // 		}

// // // // // // // // 		// Upload the image to Printful
// // // // // // // // 		const uploadResponse = await printfulClient.post("/files", {
// // // // // // // // 			content: pngBase64,
// // // // // // // // 			filename: "pokemon_card_design.png",
// // // // // // // // 		});

// // // // // // // // 		const uploadedFileUrl = uploadResponse.data.result.url;

// // // // // // // // 		// Generate mockup with Printful
// // // // // // // // 		const mockupResponse = await printfulClient.post(
// // // // // // // // 			"/mockup-generator/create-task",
// // // // // // // // 			{
// // // // // // // // 				template_id: 903, // Replace with your actual template ID from Printful
// // // // // // // // 				variant_ids: [4011], // Replace with your actual variant IDs from Printful
// // // // // // // // 				files: [
// // // // // // // // 					{
// // // // // // // // 						placement: "front",
// // // // // // // // 						image_url: uploadedFileUrl,
// // // // // // // // 					},
// // // // // // // // 				],
// // // // // // // // 			}
// // // // // // // // 		);

// // // // // // // // 		const taskKey = mockupResponse.data.result.task_key;

// // // // // // // // 		// Polling for mockup completion
// // // // // // // // 		let mockupResult = null;
// // // // // // // // 		while (!mockupResult) {
// // // // // // // // 			const taskResponse = await printfulClient.get(
// // // // // // // // 				`/mockup-generator/task?task_key=${taskKey}`
// // // // // // // // 			);
// // // // // // // // 			const status = taskResponse.data.result.status;

// // // // // // // // 			if (status === "completed") {
// // // // // // // // 				mockupResult = taskResponse.data.result.mockups[0];
// // // // // // // // 			} else if (status === "failed") {
// // // // // // // // 				return NextResponse.json(
// // // // // // // // 					{ error: "Mockup generation failed" },
// // // // // // // // 					{ status: 500 }
// // // // // // // // 				);
// // // // // // // // 			} else {
// // // // // // // // 				await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
// // // // // // // // 			}
// // // // // // // // 		}

// // // // // // // // 		const mockupUrl = mockupResult.mockup_url;

// // // // // // // // 		// Create Stripe product
// // // // // // // // 		const stripeProduct = await stripe.products.create({
// // // // // // // // 			name: "Custom Pokémon Hat",
// // // // // // // // 			description: "A custom hat featuring your Pokémon card design.",
// // // // // // // // 			images: [mockupUrl],
// // // // // // // // 		});

// // // // // // // // 		// Create Stripe price
// // // // // // // // 		const stripePrice = await stripe.prices.create({
// // // // // // // // 			unit_amount: 2500, // Amount in cents ($25.00)
// // // // // // // // 			currency: "usd",
// // // // // // // // 			product: stripeProduct.id,
// // // // // // // // 		});

// // // // // // // // 		// Create HatVariant in database
// // // // // // // // 		const newVariant = await prisma.hatVariant.create({
// // // // // // // // 			data: {
// // // // // // // // 				id: resultId, // Use resultId as the identifier
// // // // // // // // 				name: "Custom Pokémon Hat",
// // // // // // // // 				color: "Custom",
// // // // // // // // 				size: "One Size",
// // // // // // // // 				image: mockupUrl,
// // // // // // // // 				retailPrice: 25.0,
// // // // // // // // 				currency: "USD",
// // // // // // // // 				stripePriceId: stripePrice.id,
// // // // // // // // 				hatProduct: {
// // // // // // // // 					connectOrCreate: {
// // // // // // // // 						where: { printfulId: 91 }, // Replace with your actual printfulId
// // // // // // // // 						create: {
// // // // // // // // 							printfulId: 91,
// // // // // // // // 							mainCategoryId: 41,
// // // // // // // // 							type: "EMBROIDERY",
// // // // // // // // 							description: "Custom Pokémon Hat",
// // // // // // // // 							title: "Custom Pokémon Hat",
// // // // // // // // 							brand: "Custom",
// // // // // // // // 							model: "Custom Model",
// // // // // // // // 							image: mockupUrl,
// // // // // // // // 							variantCount: 1,
// // // // // // // // 							currency: "USD",
// // // // // // // // 							options: {} as Prisma.JsonObject,
// // // // // // // // 							techniques: {} as Prisma.JsonObject,
// // // // // // // // 							files: {} as Prisma.JsonObject,
// // // // // // // // 						},
// // // // // // // // 					},
// // // // // // // // 				},
// // // // // // // // 			},
// // // // // // // // 		});

// // // // // // // // 		return NextResponse.json({ variant: newVariant });
// // // // // // // // 	} catch (error) {
// // // // // // // // 		console.error("Error generating hat variant:", error);
// // // // // // // // 		return NextResponse.json(
// // // // // // // // 			{ error: "Failed to generate hat variant" },
// // // // // // // // 			{ status: 500 }
// // // // // // // // 		);
// // // // // // // // 	} finally {
// // // // // // // // 		await prisma.$disconnect();
// // // // // // // // 	}
// // // // // // // // }

// // // // // // // // src/app/api/get-hat-variants/route.ts

// // // // // // // import { NextRequest, NextResponse } from 'next/server';
// // // // // // // import axios from 'axios';
// // // // // // // import { PrismaClient } from '@prisma/client';
// // // // // // // import { v4 as uuidv4 } from 'uuid';

// // // // // // // const prisma = new PrismaClient();

// // // // // // // const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

// // // // // // // if (!PRINTFUL_API_KEY) {
// // // // // // //   throw new Error('PRINTFUL_API_KEY is not defined in environment variables');
// // // // // // // }

// // // // // // // export async function POST(req: NextRequest) {
// // // // // // //   try {
// // // // // // //     const { resultId, pngBase64 } = await req.json();

// // // // // // //     // Input validation
// // // // // // //     if (!resultId || !pngBase64) {
// // // // // // //       return NextResponse.json(
// // // // // // //         { error: 'Missing resultId or pngBase64 in request body.' },
// // // // // // //         { status: 400 }
// // // // // // //       );
// // // // // // //     }

// // // // // // //     // Remove data URL prefix if present
// // // // // // //     const base64Data = pngBase64.startsWith('data:image/png;base64,')
// // // // // // //       ? pngBase64.replace(/^data:image\/png;base64,/, '')
// // // // // // //       : pngBase64;

// // // // // // //     // Prepare payload for Printful
// // // // // // //     const printfulPayload = {
// // // // // // //       contents: base64Data,
// // // // // // //       type: 'default', // You can adjust the type as needed
// // // // // // //     };

// // // // // // //     // Send request to Printful's /files endpoint
// // // // // // //     const printfulResponse = await axios.post(
// // // // // // //       'https://api.printful.com/files',
// // // // // // //       printfulPayload,
// // // // // // //       {
// // // // // // //         headers: {
// // // // // // //           'Content-Type': 'application/json',
// // // // // // //           'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
// // // // // // //         },
// // // // // // //       }
// // // // // // //     );

// // // // // // //     // Extract data from Printful's response
// // // // // // //     const { id: printfulFileId, url } = printfulResponse.data.result;

// // // // // // //     // Create a new HatVariant in your database
// // // // // // //     const variant = await prisma.hatVariant.create({
// // // // // // //       data: {
// // // // // // //         id: uuidv4(),
// // // // // // //         printfulFileId: printfulFileId,
// // // // // // //         name: 'Custom Hat', // Replace with dynamic data as needed
// // // // // // //         color: 'Red',        // Replace with dynamic data as needed
// // // // // // //         size: 'M',           // Replace with dynamic data as needed
// // // // // // //         image: url,
// // // // // // //         retailPrice: 29.99,  // Replace with dynamic data as needed
// // // // // // //         currency: 'USD',     // Replace with dynamic data as needed
// // // // // // //         stripePriceId: 'price_12345', // Replace with dynamic data as needed
// // // // // // //         hatProductId: 'product_uuid',   // Replace with dynamic data as needed
// // // // // // //         createdAt: new Date(),
// // // // // // //         updatedAt: new Date(),
// // // // // // //       },
// // // // // // //     });

// // // // // // //     // Respond with the created variant
// // // // // // //     return NextResponse.json({ variant }, { status: 200 });
// // // // // // //   } catch (error: unknown) {
// // // // // // //     if (axios.isAxiosError(error)) {
// // // // // // //       console.error('Axios error:', error.response?.data);
// // // // // // //       return NextResponse.json(
// // // // // // //         { error: 'Failed to generate hat variant.', details: error.response?.data },
// // // // // // //         { status: error.response?.status || 500 }
// // // // // // //       );
// // // // // // //     } else if (error instanceof Error) {
// // // // // // //       console.error('General error:', error.message);
// // // // // // //       return NextResponse.json(
// // // // // // //         { error: 'Internal Server Error.' },
// // // // // // //         { status: 500 }
// // // // // // //       );
// // // // // // //     } else {
// // // // // // //       console.error('Unexpected error:', error);
// // // // // // //       return NextResponse.json(
// // // // // // //         { error: 'An unexpected error occurred.' },
// // // // // // //         { status: 500 }
// // // // // // //       );
// // // // // // //     }
// // // // // // //   }
// // // // // // // }

// // // // // // // src/app/api/get-hat-variants/route.ts

// // // // // // import { NextRequest, NextResponse } from "next/server";
// // // // // // import axios from "axios";
// // // // // // import { PrismaClient } from "@prisma/client";
// // // // // // import { v4 as uuidv4 } from "uuid";
// // // // // // import Stripe from "stripe";

// // // // // // const prisma = new PrismaClient();

// // // // // // const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
// // // // // // const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// // // // // // if (!PRINTFUL_API_KEY) {
// // // // // // 	throw new Error("PRINTFUL_API_KEY is not defined in environment variables");
// // // // // // }

// // // // // // if (!STRIPE_SECRET_KEY) {
// // // // // // 	throw new Error(
// // // // // // 		"STRIPE_SECRET_KEY is not defined in environment variables"
// // // // // // 	);
// // // // // // }

// // // // // // const stripe = new Stripe(STRIPE_SECRET_KEY, {
// // // // // // 	apiVersion: "2024-09-30.acacia",
// // // // // // });

// // // // // // // Define TypeScript interfaces

// // // // // // interface Option {
// // // // // // 	id: string;
// // // // // // 	title: string;
// // // // // // 	type: "radio" | "multi_select" | "text";
// // // // // // 	values: Record<string, string> | null;
// // // // // // 	additional_price: string | null;
// // // // // // 	additional_price_breakdown: Record<string, string>;
// // // // // // }

// // // // // // interface Technique {
// // // // // // 	key: string;
// // // // // // 	display_name: string;
// // // // // // 	is_default: boolean;
// // // // // // }

// // // // // // interface FileOption {
// // // // // // 	id: string;
// // // // // // 	type: "bool";
// // // // // // 	title: string;
// // // // // // 	additional_price: number;
// // // // // // }

// // // // // // interface File {
// // // // // // 	id: string;
// // // // // // 	type:
// // // // // // 		| "embroidery_front_large"
// // // // // // 		| "embroidery_front"
// // // // // // 		| "embroidery_back"
// // // // // // 		| "embroidery_right"
// // // // // // 		| "embroidery_left"
// // // // // // 		| "mockup";
// // // // // // 	title: string;
// // // // // // 	additional_price: string | null;
// // // // // // 	options: FileOption[];
// // // // // // }

// // // // // // interface HatProduct {
// // // // // // 	id: string;
// // // // // // 	printfulId: number;
// // // // // // 	mainCategoryId: number;
// // // // // // 	type: string;
// // // // // // 	description: string;
// // // // // // 	title: string;
// // // // // // 	brand: string;
// // // // // // 	model: string;
// // // // // // 	image: string;
// // // // // // 	variantCount: number;
// // // // // // 	currency: string;
// // // // // // 	options: Option[] | null;
// // // // // // 	techniques: Technique[] | null;
// // // // // // 	files: File[] | null;
// // // // // // 	origin_country: string | null;
// // // // // // }

// // // // // // export async function POST(req: NextRequest) {
// // // // // // 	try {
// // // // // // 		const { resultId, pngBase64 } = await req.json();

// // // // // // 		// Input validation
// // // // // // 		if (!resultId || !pngBase64) {
// // // // // // 			return NextResponse.json(
// // // // // // 				{ error: "Missing resultId or pngBase64 in request body." },
// // // // // // 				{ status: 400 }
// // // // // // 			);
// // // // // // 		}

// // // // // // 		// Remove data URL prefix if present
// // // // // // 		const base64Data = pngBase64.startsWith("data:image/png;base64,")
// // // // // // 			? pngBase64.replace(/^data:image\/png;base64,/, "")
// // // // // // 			: pngBase64;

// // // // // // 		// Prepare payload for Printful
// // // // // // 		const printfulPayload = {
// // // // // // 			contents: base64Data,
// // // // // // 			type: "default",
// // // // // // 		};

// // // // // // 		// Send request to Printful's /files endpoint
// // // // // // 		const printfulResponse = await axios.post(
// // // // // // 			"https://api.printful.com/files",
// // // // // // 			printfulPayload,
// // // // // // 			{
// // // // // // 				headers: {
// // // // // // 					"Content-Type": "application/json",
// // // // // // 					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// // // // // // 				},
// // // // // // 			}
// // // // // // 		);

// // // // // // 		// Extract data from Printful's response
// // // // // // 		const { id: printfulFileId, url } = printfulResponse.data.result;

// // // // // // 		// Fetch the HatProduct from the database
// // // // // // 		const hatProductRaw = await prisma.hatProduct.findFirst();

// // // // // // 		if (!hatProductRaw) {
// // // // // // 			return NextResponse.json(
// // // // // // 				{ error: "HatProduct not found in the database." },
// // // // // // 				{ status: 404 }
// // // // // // 			);
// // // // // // 		}

// // // // // // 		// Cast the JSON fields to the appropriate TypeScript interfaces
// // // // // // 		const hatProduct: HatProduct = {
// // // // // // 			...hatProductRaw,
// // // // // // 			options: hatProductRaw.options as Option[] | null,
// // // // // // 			techniques: hatProductRaw.techniques as Technique[] | null,
// // // // // // 			files: hatProductRaw.files as File[] | null,
// // // // // // 			origin_country: hatProductRaw.origin_country,
// // // // // // 		};

// // // // // // 		if (!hatProduct.options) {
// // // // // // 			return NextResponse.json(
// // // // // // 				{ error: "HatProduct options are missing." },
// // // // // // 				{ status: 500 }
// // // // // // 			);
// // // // // // 		}

// // // // // // 		// Select random values from available options
// // // // // // 		const selectedOptions: Record<string, string | string[] | null> = {};

// // // // // // 		hatProduct.options.forEach((option) => {
// // // // // // 			if (option.type === "radio" && option.values) {
// // // // // // 				const keys = Object.keys(option.values);
// // // // // // 				const randomKey = keys[Math.floor(Math.random() * keys.length)];
// // // // // // 				selectedOptions[option.id] = randomKey;
// // // // // // 			} else if (option.type === "multi_select" && option.values) {
// // // // // // 				const keys = Object.keys(option.values);
// // // // // // 				const numberOfSelections =
// // // // // // 					Math.floor(Math.random() * keys.length) + 1;
// // // // // // 				const shuffled = keys.sort(() => 0.5 - Math.random());
// // // // // // 				selectedOptions[option.id] = shuffled.slice(
// // // // // // 					0,
// // // // // // 					numberOfSelections
// // // // // // 				);
// // // // // // 			} else if (option.type === "text") {
// // // // // // 				selectedOptions[option.id] = "Default note";
// // // // // // 			}
// // // // // // 		});

// // // // // // 		// Extract selected options
// // // // // // 		const embroideryType = selectedOptions["embroidery_type"] as
// // // // // // 			| string
// // // // // // 			| undefined;
// // // // // // 		const threadColors = selectedOptions["thread_colors"] as
// // // // // // 			| string[]
// // // // // // 			| string
// // // // // // 			| null;
// // // // // // 		const threadColors3d = selectedOptions["thread_colors_3d"] as
// // // // // // 			| string[]
// // // // // // 			| string
// // // // // // 			| null;
// // // // // // 		const threadColorsFrontLarge = selectedOptions[
// // // // // // 			"thread_colors_front_large"
// // // // // // 		] as string[] | string | null;
// // // // // // 		const threadColors3dFrontLarge = selectedOptions[
// // // // // // 			"thread_colors_3d_front_large"
// // // // // // 		] as string[] | string | null;
// // // // // // 		const threadColorsBack = selectedOptions["thread_colors_back"] as
// // // // // // 			| string[]
// // // // // // 			| string
// // // // // // 			| null;
// // // // // // 		const threadColorsRight = selectedOptions["thread_colors_right"] as
// // // // // // 			| string[]
// // // // // // 			| string
// // // // // // 			| null;
// // // // // // 		const threadColorsLeft = selectedOptions["thread_colors_left"] as
// // // // // // 			| string[]
// // // // // // 			| string
// // // // // // 			| null;
// // // // // // 		const notes = selectedOptions["notes"] as string | null;

// // // // // // 		// Build color string by combining all selected thread colors
// // // // // // 		const selectedColors = [
// // // // // // 			threadColors,
// // // // // // 			threadColors3d,
// // // // // // 			threadColorsFrontLarge,
// // // // // // 			threadColors3dFrontLarge,
// // // // // // 			threadColorsBack,
// // // // // // 			threadColorsRight,
// // // // // // 			threadColorsLeft,
// // // // // // 		];

// // // // // // 		const color =
// // // // // // 			selectedColors
// // // // // // 				.filter((c) => c)
// // // // // // 				.flatMap((c) => (Array.isArray(c) ? c : [c]))
// // // // // // 				.join(", ") || "Default Color";

// // // // // // 		// Calculate prices
// // // // // // 		const retailPrice = 29.99;
// // // // // // 		const calculatedPrice = retailPrice * 2;
// // // // // // 		const currency = hatProduct.currency;

// // // // // // 		// Create Stripe product
// // // // // // 		const stripeProduct = await stripe.products.create({
// // // // // // 			name: hatProduct.title,
// // // // // // 			description: hatProduct.description,
// // // // // // 			images: [hatProduct.image],
// // // // // // 		});

// // // // // // 		// Create Stripe price
// // // // // // 		const stripePrice = await stripe.prices.create({
// // // // // // 			unit_amount: Math.round(calculatedPrice * 100), // Convert to cents
// // // // // // 			currency: currency.toLowerCase(),
// // // // // // 			product: stripeProduct.id,
// // // // // // 		});

// // // // // // 		// Generate dynamic name based on embroidery type and notes
// // // // // // 		let variantName = "Custom Hat";
// // // // // // 		if (embroideryType === "flat") {
// // // // // // 			variantName = "Flat Embroidery Hat";
// // // // // // 		} else if (embroideryType === "3d") {
// // // // // // 			variantName = "3D Puff Hat";
// // // // // // 		} else if (embroideryType === "both") {
// // // // // // 			variantName = "Partial 3D Puff Hat";
// // // // // // 		}

// // // // // // 		if (notes) {
// // // // // // 			variantName += ` - ${notes}`;
// // // // // // 		}

// // // // // // 		// Create a new HatVariant in the database
// // // // // // 		const variant = await prisma.hatVariant.create({
// // // // // // 			data: {
// // // // // // 				id: uuidv4(),
// // // // // // 				printfulFileId: printfulFileId,
// // // // // // 				name: variantName,
// // // // // // 				color: color,
// // // // // // 				size: "M", // Assuming 'M' as default size. Adjust if needed.
// // // // // // 				image: url,
// // // // // // 				retailPrice: retailPrice,
// // // // // // 				currency: currency,
// // // // // // 				stripePriceId: stripePrice.id,
// // // // // // 				hatProductId: hatProduct.id,
// // // // // // 				createdAt: new Date(),
// // // // // // 				updatedAt: new Date(),
// // // // // // 			},
// // // // // // 		});

// // // // // // 		// Respond with the created variant
// // // // // // 		return NextResponse.json({ variant }, { status: 200 });
// // // // // // 	} catch (error: unknown) {
// // // // // // 		if (axios.isAxiosError(error)) {
// // // // // // 			console.error("Axios error:", error.response?.data);
// // // // // // 			return NextResponse.json(
// // // // // // 				{
// // // // // // 					error: "Failed to generate hat variant.",
// // // // // // 					details: error.response?.data,
// // // // // // 				},
// // // // // // 				{ status: error.response?.status || 500 }
// // // // // // 			);
// // // // // // 		} else if (error instanceof Error) {
// // // // // // 			console.error("General error:", error.message);
// // // // // // 			return NextResponse.json(
// // // // // // 				{ error: "Internal Server Error." },
// // // // // // 				{ status: 500 }
// // // // // // 			);
// // // // // // 		} else {
// // // // // // 			console.error("Unexpected error:", error);
// // // // // // 			return NextResponse.json(
// // // // // // 				{ error: "An unexpected error occurred." },
// // // // // // 				{ status: 500 }
// // // // // // 			);
// // // // // // 		}
// // // // // // 	}
// // // // // // }

// // // // // // src/app/api/get-hat-variants/route.ts

// // // // // import { NextRequest, NextResponse } from "next/server";
// // // // // import axios from "axios";
// // // // // import { PrismaClient } from "@prisma/client"; // Removed JsonValue
// // // // // import { v4 as uuidv4 } from "uuid";
// // // // // import Stripe from "stripe";

// // // // // const prisma = new PrismaClient();

// // // // // const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
// // // // // const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// // // // // if (!PRINTFUL_API_KEY) {
// // // // // 	throw new Error("PRINTFUL_API_KEY is not defined in environment variables");
// // // // // }

// // // // // if (!STRIPE_SECRET_KEY) {
// // // // // 	throw new Error(
// // // // // 		"STRIPE_SECRET_KEY is not defined in environment variables"
// // // // // 	);
// // // // // }

// // // // // const stripe = new Stripe(STRIPE_SECRET_KEY, {
// // // // // 	apiVersion: "2024-09-30.acacia", // Updated API version as per your configuration
// // // // // });

// // // // // // Define TypeScript interfaces

// // // // // interface Option {
// // // // // 	id: string;
// // // // // 	title: string;
// // // // // 	type: "radio" | "multi_select" | "text";
// // // // // 	values: Record<string, string> | null;
// // // // // 	additional_price: string | null;
// // // // // 	additional_price_breakdown: Record<string, string>;
// // // // // }

// // // // // interface Technique {
// // // // // 	key: string;
// // // // // 	display_name: string;
// // // // // 	is_default: boolean;
// // // // // }

// // // // // interface FileOption {
// // // // // 	id: string;
// // // // // 	type: "bool";
// // // // // 	title: string;
// // // // // 	additional_price: number;
// // // // // }

// // // // // interface File {
// // // // // 	id: string;
// // // // // 	type:
// // // // // 		| "embroidery_front_large"
// // // // // 		| "embroidery_front"
// // // // // 		| "embroidery_back"
// // // // // 		| "embroidery_right"
// // // // // 		| "embroidery_left"
// // // // // 		| "mockup";
// // // // // 	title: string;
// // // // // 	additional_price: string | null;
// // // // // 	options: FileOption[];
// // // // // }

// // // // // interface HatProduct {
// // // // // 	id: string;
// // // // // 	printfulId: number;
// // // // // 	mainCategoryId: number;
// // // // // 	type: string;
// // // // // 	description: string;
// // // // // 	title: string;
// // // // // 	brand: string;
// // // // // 	model: string;
// // // // // 	image: string;
// // // // // 	variantCount: number;
// // // // // 	currency: string;
// // // // // 	options: Option[] | null;
// // // // // 	techniques: Technique[] | null;
// // // // // 	files: File[] | null;
// // // // // 	origin_country: string | null;
// // // // // }

// // // // // export async function POST(req: NextRequest) {
// // // // // 	try {
// // // // // 		const { resultId, pngBase64 } = await req.json();

// // // // // 		// Input validation
// // // // // 		if (!resultId || !pngBase64) {
// // // // // 			return NextResponse.json(
// // // // // 				{ error: "Missing resultId or pngBase64 in request body." },
// // // // // 				{ status: 400 }
// // // // // 			);
// // // // // 		}

// // // // // 		// Remove data URL prefix if present
// // // // // 		const base64Data = pngBase64.startsWith("data:image/png;base64,")
// // // // // 			? pngBase64.replace(/^data:image\/png;base64,/, "")
// // // // // 			: pngBase64;

// // // // // 		// Prepare payload for Printful
// // // // // 		const printfulPayload = {
// // // // // 			role: "printfile", // Required by Printful API
// // // // // 			contents: base64Data,
// // // // // 			filename: `hat_variant_${uuidv4()}.png`, // Dynamic filename
// // // // // 			visible: true, // Optional: set to false if you don't want it visible in Printful's File Library
// // // // // 		};

// // // // // 		// Send request to Printful's /v2/files endpoint
// // // // // 		const printfulResponse = await axios.post(
// // // // // 			"https://api.printful.com/v2/files",
// // // // // 			printfulPayload,
// // // // // 			{
// // // // // 				headers: {
// // // // // 					"Content-Type": "application/json",
// // // // // 					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// // // // // 				},
// // // // // 			}
// // // // // 		);

// // // // // 		// Extract data from Printful's response
// // // // // 		const { id: printfulFileId, url } = printfulResponse.data.result;

// // // // // 		// Fetch the HatProduct from the database
// // // // // 		const hatProductRaw = await prisma.hatProduct.findFirst();

// // // // // 		if (!hatProductRaw) {
// // // // // 			return NextResponse.json(
// // // // // 				{ error: "HatProduct not found in the database." },
// // // // // 				{ status: 404 }
// // // // // 			);
// // // // // 		}

// // // // // 		// Cast the JSON fields to the appropriate TypeScript interfaces
// // // // // 		const hatProduct: HatProduct = {
// // // // // 			...hatProductRaw,
// // // // // 			options: hatProductRaw.options as Option[] | null,
// // // // // 			techniques: hatProductRaw.techniques as Technique[] | null,
// // // // // 			files: hatProductRaw.files as File[] | null,
// // // // // 			origin_country: hatProductRaw.origin_country,
// // // // // 		};

// // // // // 		if (!hatProduct.options) {
// // // // // 			return NextResponse.json(
// // // // // 				{ error: "HatProduct options are missing." },
// // // // // 				{ status: 500 }
// // // // // 			);
// // // // // 		}

// // // // // 		// Select random values from available options
// // // // // 		const selectedOptions: Record<string, string | string[] | null> = {};

// // // // // 		hatProduct.options.forEach((option: Option) => {
// // // // // 			if (option.type === "radio" && option.values) {
// // // // // 				const keys = Object.keys(option.values);
// // // // // 				const randomKey = keys[Math.floor(Math.random() * keys.length)];
// // // // // 				selectedOptions[option.id] = randomKey;
// // // // // 			} else if (option.type === "multi_select" && option.values) {
// // // // // 				const keys = Object.keys(option.values);
// // // // // 				const numberOfSelections =
// // // // // 					Math.floor(Math.random() * keys.length) + 1;
// // // // // 				const shuffled = keys.sort(() => 0.5 - Math.random());
// // // // // 				selectedOptions[option.id] = shuffled.slice(
// // // // // 					0,
// // // // // 					numberOfSelections
// // // // // 				);
// // // // // 			} else if (option.type === "text") {
// // // // // 				selectedOptions[option.id] = "Default note";
// // // // // 			}
// // // // // 		});

// // // // // 		// Extract selected options
// // // // // 		const embroideryType = selectedOptions["embroidery_type"] as
// // // // // 			| string
// // // // // 			| undefined;
// // // // // 		const threadColors = selectedOptions["thread_colors"] as
// // // // // 			| string[]
// // // // // 			| string
// // // // // 			| null;
// // // // // 		const threadColors3d = selectedOptions["thread_colors_3d"] as
// // // // // 			| string[]
// // // // // 			| string
// // // // // 			| null;
// // // // // 		const threadColorsFrontLarge = selectedOptions[
// // // // // 			"thread_colors_front_large"
// // // // // 		] as string[] | string | null;
// // // // // 		const threadColors3dFrontLarge = selectedOptions[
// // // // // 			"thread_colors_3d_front_large"
// // // // // 		] as string[] | string | null;
// // // // // 		const threadColorsBack = selectedOptions["thread_colors_back"] as
// // // // // 			| string[]
// // // // // 			| string
// // // // // 			| null;
// // // // // 		const threadColorsRight = selectedOptions["thread_colors_right"] as
// // // // // 			| string[]
// // // // // 			| string
// // // // // 			| null;
// // // // // 		const threadColorsLeft = selectedOptions["thread_colors_left"] as
// // // // // 			| string[]
// // // // // 			| string
// // // // // 			| null;
// // // // // 		const notes = selectedOptions["notes"] as string | null;

// // // // // 		// Build color string by combining all selected thread colors
// // // // // 		const selectedColors = [
// // // // // 			threadColors,
// // // // // 			threadColors3d,
// // // // // 			threadColorsFrontLarge,
// // // // // 			threadColors3dFrontLarge,
// // // // // 			threadColorsBack,
// // // // // 			threadColorsRight,
// // // // // 			threadColorsLeft,
// // // // // 		];

// // // // // 		const color =
// // // // // 			selectedColors
// // // // // 				.filter((c): c is string | string[] => c !== null)
// // // // // 				.flatMap((c) => (Array.isArray(c) ? c : [c]))
// // // // // 				.join(", ") || "Default Color";

// // // // // 		// Calculate prices
// // // // // 		const retailPrice = 29.99;
// // // // // 		const calculatedPrice = retailPrice * 2;
// // // // // 		const currency = hatProduct.currency;

// // // // // 		// Create Stripe product
// // // // // 		const stripeProduct = await stripe.products.create({
// // // // // 			name: hatProduct.title,
// // // // // 			description: hatProduct.description,
// // // // // 			images: [hatProduct.image],
// // // // // 		});

// // // // // 		// Create Stripe price
// // // // // 		const stripePrice = await stripe.prices.create({
// // // // // 			unit_amount: Math.round(calculatedPrice * 100), // Convert to cents
// // // // // 			currency: currency.toLowerCase(),
// // // // // 			product: stripeProduct.id,
// // // // // 		});

// // // // // 		// Generate dynamic name based on embroidery type and notes
// // // // // 		let variantName = "Custom Hat";
// // // // // 		if (embroideryType === "flat") {
// // // // // 			variantName = "Flat Embroidery Hat";
// // // // // 		} else if (embroideryType === "3d") {
// // // // // 			variantName = "3D Puff Hat";
// // // // // 		} else if (embroideryType === "both") {
// // // // // 			variantName = "Partial 3D Puff Hat";
// // // // // 		}

// // // // // 		if (notes) {
// // // // // 			variantName += ` - ${notes}`;
// // // // // 		}

// // // // // 		// Create a new HatVariant in the database
// // // // // 		const variant = await prisma.hatVariant.create({
// // // // // 			data: {
// // // // // 				id: uuidv4(),
// // // // // 				printfulFileId: printfulFileId,
// // // // // 				name: variantName,
// // // // // 				color: color,
// // // // // 				size: "M", // Assuming 'M' as default size. Adjust if needed.
// // // // // 				image: url,
// // // // // 				retailPrice: retailPrice,
// // // // // 				currency: currency,
// // // // // 				stripePriceId: stripePrice.id,
// // // // // 				hatProductId: hatProduct.id,
// // // // // 				createdAt: new Date(),
// // // // // 				updatedAt: new Date(),
// // // // // 			},
// // // // // 		});

// // // // // 		// Respond with the created variant
// // // // // 		return NextResponse.json({ variant }, { status: 200 });
// // // // // 	} catch (error: unknown) {
// // // // // 		if (axios.isAxiosError(error)) {
// // // // // 			console.error("Axios error:", error.response?.data);
// // // // // 			return NextResponse.json(
// // // // // 				{
// // // // // 					error: "Failed to generate hat variant.",
// // // // // 					details: error.response?.data,
// // // // // 				},
// // // // // 				{ status: error.response?.status || 500 }
// // // // // 			);
// // // // // 		} else if (error instanceof Error) {
// // // // // 			console.error("General error:", error.message);
// // // // // 			return NextResponse.json(
// // // // // 				{ error: "Internal Server Error." },
// // // // // 				{ status: 500 }
// // // // // 			);
// // // // // 		} else {
// // // // // 			console.error("Unexpected error:", error);
// // // // // 			return NextResponse.json(
// // // // // 				{ error: "An unexpected error occurred." },
// // // // // 				{ status: 500 }
// // // // // 			);
// // // // // 		}
// // // // // 	}
// // // // // }

// // // // // src/app/api/get-hat-variants/route.ts

// // // // import { NextRequest, NextResponse } from "next/server";
// // // // import axios from "axios";
// // // // import { PrismaClient } from "@prisma/client"; // Removed JsonValue
// // // // import { v4 as uuidv4 } from "uuid";
// // // // import Stripe from "stripe";

// // // // const prisma = new PrismaClient();

// // // // const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
// // // // const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// // // // if (!PRINTFUL_API_KEY) {
// // // // 	throw new Error("PRINTFUL_API_KEY is not defined in environment variables");
// // // // }

// // // // if (!STRIPE_SECRET_KEY) {
// // // // 	throw new Error(
// // // // 		"STRIPE_SECRET_KEY is not defined in environment variables"
// // // // 	);
// // // // }

// // // // const stripe = new Stripe(STRIPE_SECRET_KEY, {
// // // // 	apiVersion: "2024-09-30.acacia", // Updated API version as per your configuration
// // // // });

// // // // // Define TypeScript interfaces

// // // // interface Option {
// // // // 	id: string;
// // // // 	title: string;
// // // // 	type: "radio" | "multi_select" | "text";
// // // // 	values: Record<string, string> | null;
// // // // 	additional_price: string | null;
// // // // 	additional_price_breakdown: Record<string, string>;
// // // // }

// // // // interface Technique {
// // // // 	key: string;
// // // // 	display_name: string;
// // // // 	is_default: boolean;
// // // // }

// // // // interface FileOption {
// // // // 	id: string;
// // // // 	type: "bool";
// // // // 	title: string;
// // // // 	additional_price: number;
// // // // }

// // // // interface File {
// // // // 	id: string;
// // // // 	type:
// // // // 		| "embroidery_front_large"
// // // // 		| "embroidery_front"
// // // // 		| "embroidery_back"
// // // // 		| "embroidery_right"
// // // // 		| "embroidery_left"
// // // // 		| "mockup";
// // // // 	title: string;
// // // // 	additional_price: string | null;
// // // // 	options: FileOption[];
// // // // }

// // // // interface HatProduct {
// // // // 	id: string;
// // // // 	printfulId: number;
// // // // 	mainCategoryId: number;
// // // // 	type: string;
// // // // 	description: string;
// // // // 	title: string;
// // // // 	brand: string;
// // // // 	model: string;
// // // // 	image: string;
// // // // 	variantCount: number;
// // // // 	currency: string;
// // // // 	options: Option[] | null;
// // // // 	techniques: Technique[] | null;
// // // // 	files: File[] | null;
// // // // 	origin_country: string | null;
// // // // }

// // // // export async function POST(req: NextRequest) {
// // // // 	try {
// // // // 		const { resultId, pngBase64 } = await req.json();

// // // // 		// Input validation
// // // // 		if (!resultId || !pngBase64) {
// // // // 			return NextResponse.json(
// // // // 				{ error: "Missing resultId or pngBase64 in request body." },
// // // // 				{ status: 400 }
// // // // 			);
// // // // 		}

// // // // 		// Remove data URL prefix if present
// // // // 		const base64Data = pngBase64.startsWith("data:image/png;base64,")
// // // // 			? pngBase64.replace(/^data:image\/png;base64,/, "")
// // // // 			: pngBase64;

// // // // 		// Verify that base64Data is a valid base64 string
// // // // 		const isValidBase64 =
// // // // 			/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
// // // // 				base64Data
// // // // 			);
// // // // 		if (!isValidBase64) {
// // // // 			return NextResponse.json(
// // // // 				{ error: "Invalid base64 string provided in pngBase64." },
// // // // 				{ status: 400 }
// // // // 			);
// // // // 		}

// // // // 		// Prepare payload for Printful
// // // // 		const printfulPayload = {
// // // // 			role: "printfile", // Required by Printful API
// // // // 			contents: base64Data,
// // // // 			filename: `hat_variant_${uuidv4()}.png`, // Dynamic filename
// // // // 			visible: true, // Optional: set to false if you don't want it visible in Printful's File Library
// // // // 		};

// // // // 		// Debugging: Log the payload (Ensure to remove or secure logs in production)
// // // // 		console.log("Printful Payload:", printfulPayload);

// // // // 		// Send request to Printful's /v2/files endpoint
// // // // 		const printfulResponse = await axios.post(
// // // // 			"https://api.printful.com/v2/files",
// // // // 			printfulPayload,
// // // // 			{
// // // // 				headers: {
// // // // 					"Content-Type": "application/json",
// // // // 					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// // // // 				},
// // // // 			}
// // // // 		);

// // // // 		// Extract data from Printful's response
// // // // 		const { id: printfulFileId, url } = printfulResponse.data.result;

// // // // 		// Fetch the HatProduct from the database
// // // // 		const hatProductRaw = await prisma.hatProduct.findFirst();

// // // // 		if (!hatProductRaw) {
// // // // 			return NextResponse.json(
// // // // 				{ error: "HatProduct not found in the database." },
// // // // 				{ status: 404 }
// // // // 			);
// // // // 		}

// // // // 		// Cast the JSON fields to the appropriate TypeScript interfaces
// // // // 		const hatProduct: HatProduct = {
// // // // 			...hatProductRaw,
// // // // 			options: hatProductRaw.options as Option[] | null,
// // // // 			techniques: hatProductRaw.techniques as Technique[] | null,
// // // // 			files: hatProductRaw.files as File[] | null,
// // // // 			origin_country: hatProductRaw.origin_country,
// // // // 		};

// // // // 		if (!hatProduct.options) {
// // // // 			return NextResponse.json(
// // // // 				{ error: "HatProduct options are missing." },
// // // // 				{ status: 500 }
// // // // 			);
// // // // 		}

// // // // 		// Select random values from available options
// // // // 		const selectedOptions: Record<string, string | string[] | null> = {};

// // // // 		hatProduct.options.forEach((option: Option) => {
// // // // 			if (option.type === "radio" && option.values) {
// // // // 				const keys = Object.keys(option.values);
// // // // 				const randomKey = keys[Math.floor(Math.random() * keys.length)];
// // // // 				selectedOptions[option.id] = randomKey;
// // // // 			} else if (option.type === "multi_select" && option.values) {
// // // // 				const keys = Object.keys(option.values);
// // // // 				const numberOfSelections =
// // // // 					Math.floor(Math.random() * keys.length) + 1;
// // // // 				const shuffled = keys.sort(() => 0.5 - Math.random());
// // // // 				selectedOptions[option.id] = shuffled.slice(
// // // // 					0,
// // // // 					numberOfSelections
// // // // 				);
// // // // 			} else if (option.type === "text") {
// // // // 				selectedOptions[option.id] = "Default note";
// // // // 			}
// // // // 		});

// // // // 		// Extract selected options
// // // // 		const embroideryType = selectedOptions["embroidery_type"] as
// // // // 			| string
// // // // 			| undefined;
// // // // 		const threadColors = selectedOptions["thread_colors"] as
// // // // 			| string[]
// // // // 			| string
// // // // 			| null;
// // // // 		const threadColors3d = selectedOptions["thread_colors_3d"] as
// // // // 			| string[]
// // // // 			| string
// // // // 			| null;
// // // // 		const threadColorsFrontLarge = selectedOptions[
// // // // 			"thread_colors_front_large"
// // // // 		] as string[] | string | null;
// // // // 		const threadColors3dFrontLarge = selectedOptions[
// // // // 			"thread_colors_3d_front_large"
// // // // 		] as string[] | string | null;
// // // // 		const threadColorsBack = selectedOptions["thread_colors_back"] as
// // // // 			| string[]
// // // // 			| string
// // // // 			| null;
// // // // 		const threadColorsRight = selectedOptions["thread_colors_right"] as
// // // // 			| string[]
// // // // 			| string
// // // // 			| null;
// // // // 		const threadColorsLeft = selectedOptions["thread_colors_left"] as
// // // // 			| string[]
// // // // 			| string
// // // // 			| null;
// // // // 		const notes = selectedOptions["notes"] as string | null;

// // // // 		// Build color string by combining all selected thread colors
// // // // 		const selectedColors = [
// // // // 			threadColors,
// // // // 			threadColors3d,
// // // // 			threadColorsFrontLarge,
// // // // 			threadColors3dFrontLarge,
// // // // 			threadColorsBack,
// // // // 			threadColorsRight,
// // // // 			threadColorsLeft,
// // // // 		];

// // // // 		const color =
// // // // 			selectedColors
// // // // 				.filter((c): c is string | string[] => c !== null)
// // // // 				.flatMap((c) => (Array.isArray(c) ? c : [c]))
// // // // 				.join(", ") || "Default Color";

// // // // 		// Calculate prices
// // // // 		const retailPrice = 29.99;
// // // // 		const calculatedPrice = retailPrice * 2;
// // // // 		const currency = hatProduct.currency;

// // // // 		// Create Stripe product
// // // // 		const stripeProduct = await stripe.products.create({
// // // // 			name: hatProduct.title,
// // // // 			description: hatProduct.description,
// // // // 			images: [hatProduct.image],
// // // // 		});

// // // // 		// Create Stripe price
// // // // 		const stripePrice = await stripe.prices.create({
// // // // 			unit_amount: Math.round(calculatedPrice * 100), // Convert to cents
// // // // 			currency: currency.toLowerCase(),
// // // // 			product: stripeProduct.id,
// // // // 		});

// // // // 		// Generate dynamic name based on embroidery type and notes
// // // // 		let variantName = "Custom Hat";
// // // // 		if (embroideryType === "flat") {
// // // // 			variantName = "Flat Embroidery Hat";
// // // // 		} else if (embroideryType === "3d") {
// // // // 			variantName = "3D Puff Hat";
// // // // 		} else if (embroideryType === "both") {
// // // // 			variantName = "Partial 3D Puff Hat";
// // // // 		}

// // // // 		if (notes) {
// // // // 			variantName += ` - ${notes}`;
// // // // 		}

// // // // 		// Create a new HatVariant in the database
// // // // 		const variant = await prisma.hatVariant.create({
// // // // 			data: {
// // // // 				id: uuidv4(),
// // // // 				printfulFileId: printfulFileId,
// // // // 				name: variantName,
// // // // 				color: color,
// // // // 				size: "M", // Assuming 'M' as default size. Adjust if needed.
// // // // 				image: url,
// // // // 				retailPrice: retailPrice,
// // // // 				currency: currency,
// // // // 				stripePriceId: stripePrice.id,
// // // // 				hatProductId: hatProduct.id,
// // // // 				createdAt: new Date(),
// // // // 				updatedAt: new Date(),
// // // // 			},
// // // // 		});

// // // // 		// Respond with the created variant
// // // // 		return NextResponse.json({ variant }, { status: 200 });
// // // // 	} catch (error: unknown) {
// // // // 		if (axios.isAxiosError(error)) {
// // // // 			console.error("Axios error:", error.response?.data);
// // // // 			return NextResponse.json(
// // // // 				{
// // // // 					error: "Failed to generate hat variant.",
// // // // 					details: error.response?.data,
// // // // 				},
// // // // 				{ status: error.response?.status || 500 }
// // // // 			);
// // // // 		} else if (error instanceof Error) {
// // // // 			console.error("General error:", error.message);
// // // // 			return NextResponse.json(
// // // // 				{ error: "Internal Server Error." },
// // // // 				{ status: 500 }
// // // // 			);
// // // // 		} else {
// // // // 			console.error("Unexpected error:", error);
// // // // 			return NextResponse.json(
// // // // 				{ error: "An unexpected error occurred." },
// // // // 				{ status: 500 }
// // // // 			);
// // // // 		}
// // // // 	}
// // // // }

// // // // src/app/api/get-hat-variants/route.ts

// // // import { NextRequest, NextResponse } from "next/server";
// // // import axios from "axios";
// // // import { PrismaClient } from "@prisma/client";
// // // import { v4 as uuidv4 } from "uuid";
// // // import Stripe from "stripe";

// // // const prisma = new PrismaClient();

// // // const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
// // // const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
// // // const NEXT_PUBLIC_BASE_URL =
// // // 	process.env.NEXT_PUBLIC_BASE_URL || "${process.env.NEXT_PUBLIC_BASE_URL}/";

// // // if (!PRINTFUL_API_KEY) {
// // // 	throw new Error("PRINTFUL_API_KEY is not defined in environment variables");
// // // }

// // // if (!STRIPE_SECRET_KEY) {
// // // 	throw new Error(
// // // 		"STRIPE_SECRET_KEY is not defined in environment variables"
// // // 	);
// // // }

// // // const stripe = new Stripe(STRIPE_SECRET_KEY, {
// // // 	apiVersion: "2024-09-30.acacia", // Update as per your Stripe setup
// // // });

// // // // Define TypeScript interfaces

// // // interface Option {
// // // 	id: string;
// // // 	title: string;
// // // 	type: "radio" | "multi_select" | "text";
// // // 	values: Record<string, string> | null;
// // // 	additional_price: string | null;
// // // 	additional_price_breakdown: Record<string, string>;
// // // }

// // // interface Technique {
// // // 	key: string;
// // // 	display_name: string;
// // // 	is_default: boolean;
// // // }

// // // interface FileOption {
// // // 	id: string;
// // // 	type: "bool";
// // // 	title: string;
// // // 	additional_price: number;
// // // }

// // // interface File {
// // // 	id: string;
// // // 	type:
// // // 		| "embroidery_front_large"
// // // 		| "embroidery_front"
// // // 		| "embroidery_back"
// // // 		| "embroidery_right"
// // // 		| "embroidery_left"
// // // 		| "mockup";
// // // 	title: string;
// // // 	additional_price: string | null;
// // // 	options: FileOption[];
// // // }

// // // interface HatProduct {
// // // 	id: string;
// // // 	printfulId: number;
// // // 	mainCategoryId: number;
// // // 	type: string;
// // // 	description: string;
// // // 	title: string;
// // // 	brand: string;
// // // 	model: string;
// // // 	image: string;
// // // 	variantCount: number;
// // // 	currency: string;
// // // 	options: Option[] | null;
// // // 	techniques: Technique[] | null;
// // // 	files: File[] | null;
// // // 	origin_country: string | null;
// // // }

// // // export async function POST(req: NextRequest) {
// // // 	try {
// // // 		const { resultId, pngBase64 } = await req.json();

// // // 		// Input validation
// // // 		if (!resultId || !pngBase64) {
// // // 			return NextResponse.json(
// // // 				{ error: "Missing resultId or pngBase64 in request body." },
// // // 				{ status: 400 }
// // // 			);
// // // 		}

// // // 		// Upload the image to the database via the upload endpoint
// // // 		const uploadResponse = await axios.post(
// // // 			`${NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// // // 			{
// // // 				pngBase64,
// // // 				filename: `hat_variant_${uuidv4()}.png`,
// // // 			},
// // // 			{
// // // 				headers: {
// // // 					"Content-Type": "application/json",
// // // 				},
// // // 			}
// // // 		);

// // // 		// Removed 'imageId' to eliminate ESLint warning
// // // 		const { url: imageUrl } = uploadResponse.data;

// // // 		// Prepare payload for Printful
// // // 		const printfulPayload = {
// // // 			role: "printfile", // Required by Printful API
// // // 			url: imageUrl, // Use the URL from the image upload
// // // 			filename: `hat_variant_${uuidv4()}.png`, // Dynamic filename
// // // 			visible: true, // Optional: set to false if you don't want it visible in Printful's File Library
// // // 		};

// // // 		// Debugging: Log the payload (Ensure to remove or secure logs in production)
// // // 		console.log("Printful Payload:", printfulPayload);

// // // 		// Send request to Printful's /v2/files endpoint
// // // 		const printfulResponse = await axios.post(
// // // 			"https://api.printful.com/v2/files",
// // // 			printfulPayload,
// // // 			{
// // // 				headers: {
// // // 					"Content-Type": "application/json",
// // // 					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// // // 				},
// // // 			}
// // // 		);

// // // 		// Extract data from Printful's response
// // // 		const { id: printfulFileId, url: printfulUrl } =
// // // 			printfulResponse.data.result;

// // // 		// Fetch the HatProduct from the database with 'options' included in 'files'
// // // 		const hatProductRaw = await prisma.hatProduct.findFirst({
// // // 			include: {
// // // 				options: true,
// // // 				techniques: true,
// // // 				files: {
// // // 					include: {
// // // 						options: true, // Ensure 'options' are included for each file
// // // 					},
// // // 				},
// // // 			},
// // // 		});

// // // 		if (!hatProductRaw) {
// // // 			return NextResponse.json(
// // // 				{ error: "HatProduct not found in the database." },
// // // 				{ status: 404 }
// // // 			);
// // // 		}

// // // 		// Cast the JSON fields to the appropriate TypeScript interfaces
// // // 		const hatProduct: HatProduct = {
// // // 			...hatProductRaw,
// // // 			options: hatProductRaw.options as Option[] | null,
// // // 			techniques: hatProductRaw.techniques as Technique[] | null,
// // // 			files: hatProductRaw.files as File[] | null,
// // // 			origin_country: hatProductRaw.origin_country,
// // // 		};

// // // 		if (!hatProduct.options) {
// // // 			return NextResponse.json(
// // // 				{ error: "HatProduct options are missing." },
// // // 				{ status: 500 }
// // // 			);
// // // 		}

// // // 		// Select random values from available options
// // // 		const selectedOptions: Record<string, string | string[] | null> = {};

// // // 		hatProduct.options.forEach((option: Option) => {
// // // 			if (option.type === "radio" && option.values) {
// // // 				const keys = Object.keys(option.values);
// // // 				const randomKey = keys[Math.floor(Math.random() * keys.length)];
// // // 				selectedOptions[option.id] = randomKey;
// // // 			} else if (option.type === "multi_select" && option.values) {
// // // 				const keys = Object.keys(option.values);
// // // 				const numberOfSelections =
// // // 					Math.floor(Math.random() * keys.length) + 1;
// // // 				const shuffled = keys.sort(() => 0.5 - Math.random());
// // // 				selectedOptions[option.id] = shuffled.slice(
// // // 					0,
// // // 					numberOfSelections
// // // 				);
// // // 			} else if (option.type === "text") {
// // // 				selectedOptions[option.id] = "Default note";
// // // 			}
// // // 		});

// // // 		// Extract selected options
// // // 		const embroideryType = selectedOptions["embroidery_type"] as
// // // 			| string
// // // 			| undefined;
// // // 		const threadColors = selectedOptions["thread_colors"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const threadColors3d = selectedOptions["thread_colors_3d"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const threadColorsFrontLarge = selectedOptions[
// // // 			"thread_colors_front_large"
// // // 		] as string[] | string | null;
// // // 		const threadColors3dFrontLarge = selectedOptions[
// // // 			"thread_colors_3d_front_large"
// // // 		] as string[] | string | null;
// // // 		const threadColorsBack = selectedOptions["thread_colors_back"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const threadColorsRight = selectedOptions["thread_colors_right"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const threadColorsLeft = selectedOptions["thread_colors_left"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const notes = selectedOptions["notes"] as string | null;

// // // 		// Build color string by combining all selected thread colors
// // // 		const selectedColors = [
// // // 			threadColors,
// // // 			threadColors3d,
// // // 			threadColorsFrontLarge,
// // // 			threadColors3dFrontLarge,
// // // 			threadColorsBack,
// // // 			threadColorsRight,
// // // 			threadColorsLeft,
// // // 		];

// // // 		const color =
// // // 			selectedColors
// // // 				.filter((c): c is string | string[] => c !== null)
// // // 				.flatMap((c) => (Array.isArray(c) ? c : [c]))
// // // 				.join(", ") || "Default Color";

// // // 		// Calculate prices
// // // 		const retailPrice = 29.99;
// // // 		const calculatedPrice = retailPrice * 2;
// // // 		const currency = hatProduct.currency;

// // // 		// Create Stripe product
// // // 		const stripeProduct = await stripe.products.create({
// // // 			name: hatProduct.title,
// // // 			description: hatProduct.description,
// // // 			images: [hatProduct.image],
// // // 		});

// // // 		// Create Stripe price
// // // 		const stripePrice = await stripe.prices.create({
// // // 			unit_amount: Math.round(calculatedPrice * 100), // Convert to cents
// // // 			currency: currency.toLowerCase(),
// // // 			product: stripeProduct.id,
// // // 		});

// // // 		// Generate dynamic name based on embroidery type and notes
// // // 		let variantName = "Custom Hat";
// // // 		if (embroideryType === "flat") {
// // // 			variantName = "Flat Embroidery Hat";
// // // 		} else if (embroideryType === "3d") {
// // // 			variantName = "3D Puff Hat";
// // // 		} else if (embroideryType === "both") {
// // // 			variantName = "Partial 3D Puff Hat";
// // // 		}

// // // 		if (notes) {
// // // 			variantName += ` - ${notes}`;
// // // 		}

// // // 		// Create a new HatVariant in the database
// // // 		const variant = await prisma.hatVariant.create({
// // // 			data: {
// // // 				id: uuidv4(),
// // // 				printfulFileId: printfulFileId,
// // // 				name: variantName,
// // // 				color: color,
// // // 				size: "M", // Assuming 'M' as default size. Adjust if needed.
// // // 				image: printfulUrl, // URL from Printful
// // // 				retailPrice: retailPrice,
// // // 				currency: currency,
// // // 				stripePriceId: stripePrice.id,
// // // 				hatProductId: hatProduct.id,
// // // 				// imageId: imageId, // Uncomment if you decide to use imageId
// // // 				createdAt: new Date(),
// // // 				updatedAt: new Date(),
// // // 			},
// // // 		});

// // // 		// Respond with the created variant
// // // 		return NextResponse.json({ variant }, { status: 200 });
// // // 	} catch (error: unknown) {
// // // 		if (axios.isAxiosError(error)) {
// // // 			console.error("Axios error:", error.response?.data);
// // // 			return NextResponse.json(
// // // 				{
// // // 					error: "Failed to generate hat variant.",
// // // 					details: error.response?.data,
// // // 				},
// // // 				{ status: error.response?.status || 500 }
// // // 			);
// // // 		} else if (error instanceof Error) {
// // // 			console.error("General error:", error.message);
// // // 			return NextResponse.json(
// // // 				{ error: "Internal Server Error." },
// // // 				{ status: 500 }
// // // 			);
// // // 		} else {
// // // 			console.error("Unexpected error:", error);
// // // 			return NextResponse.json(
// // // 				{ error: "An unexpected error occurred." },
// // // 				{ status: 500 }
// // // 			);
// // // 		}
// // // 	}
// // // }

// // // src/app/api/get-hat-variants/route.ts

// // // import { NextRequest, NextResponse } from "next/server";
// // // import axios from "axios";
// // // import axiosRetry from "axios-retry"; // Ensure axios-retry is installed and typed
// // // import { PrismaClient } from "@prisma/client";
// // // import { v4 as uuidv4 } from "uuid";
// // // import Stripe from "stripe";

// // // const prisma = new PrismaClient();

// // // const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
// // // const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
// // // const NEXT_PUBLIC_BASE_URL =
// // // 	process.env.NEXT_PUBLIC_BASE_URL ||
// // // 	"${process.env.NEXT_PUBLIC_BASE_URL}/";

// // // if (!PRINTFUL_API_KEY) {
// // // 	throw new Error("PRINTFUL_API_KEY is not defined in environment variables");
// // // }

// // // if (!STRIPE_SECRET_KEY) {
// // // 	throw new Error(
// // // 		"STRIPE_SECRET_KEY is not defined in environment variables"
// // // 	);
// // // }

// // // const stripe = new Stripe(STRIPE_SECRET_KEY, {
// // // 	apiVersion: "2024-09-30.acacia", // Update as per your Stripe setup
// // // });

// // // // Initialize axios-retry for transient errors
// // // axiosRetry(axios, {
// // // 	retries: 3,
// // // 	retryDelay: axiosRetry.exponentialDelay,
// // // 	retryCondition: (error) => {
// // // 		return (
// // // 			axiosRetry.isNetworkError(error) ||
// // // 			axiosRetry.isRetryableError(error)
// // // 		);
// // // 	},
// // // });

// // // // Define TypeScript interfaces

// // // interface Option {
// // // 	id: string;
// // // 	title: string;
// // // 	type: "radio" | "multi_select" | "text";
// // // 	values: Record<string, string> | null;
// // // 	additional_price: string | null;
// // // 	additional_price_breakdown: Record<string, string>;
// // // }

// // // interface Technique {
// // // 	key: string;
// // // 	display_name: string;
// // // 	is_default: boolean;
// // // }

// // // interface FileOption {
// // // 	id: string;
// // // 	type: "bool";
// // // 	title: string;
// // // 	additional_price: number;
// // // }

// // // interface File {
// // // 	id: string;
// // // 	type:
// // // 		| "embroidery_front_large"
// // // 		| "embroidery_front"
// // // 		| "embroidery_back"
// // // 		| "embroidery_right"
// // // 		| "embroidery_left"
// // // 		| "mockup";
// // // 	title: string;
// // // 	additional_price: string | null;
// // // 	options: FileOption[];
// // // }

// // // interface HatProduct {
// // // 	id: string;
// // // 	printfulId: number;
// // // 	mainCategoryId: number;
// // // 	type: string;
// // // 	description: string;
// // // 	title: string;
// // // 	brand: string;
// // // 	model: string;
// // // 	image: string;
// // // 	variantCount: number;
// // // 	currency: string;
// // // 	options: Option[] | null;
// // // 	techniques: Technique[] | null;
// // // 	files: File[] | null;
// // // 	origin_country: string | null;
// // // }

// // // export async function POST(req: NextRequest) {
// // // 	try {
// // // 		const { resultId, pngBase64 } = await req.json();

// // // 		// Input validation
// // // 		if (!resultId || !pngBase64) {
// // // 			return NextResponse.json(
// // // 				{ error: "Missing resultId or pngBase64 in request body." },
// // // 				{ status: 400 }
// // // 			);
// // // 		}

// // // 		// Upload the image to the database via the upload endpoint
// // // 		const uploadResponse = await axios.post(
// // // 			`${NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// // // 			{
// // // 				pngBase64,
// // // 				filename: `hat_variant_${uuidv4()}.png`,
// // // 			},
// // // 			{
// // // 				headers: {
// // // 					"Content-Type": "application/json",
// // // 				},
// // // 			}
// // // 		);

// // // 		// Removed 'imageId' to eliminate ESLint warning
// // // 		const { url: imageUrl } = uploadResponse.data;

// // // 		// Prepare payload for Printful
// // // 		const printfulPayload = {
// // // 			role: "printfile", // Required by Printful API
// // // 			url: imageUrl, // Use the URL from the image upload
// // // 			filename: `hat_variant_${uuidv4()}.png`, // Dynamic filename
// // // 			visible: true, // Optional: set to false if you don't want it visible in Printful's File Library
// // // 		};

// // // 		// Debugging: Log the payload (Ensure to remove or secure logs in production)
// // // 		console.log("Printful Payload:", printfulPayload);

// // // 		// Send request to Printful's /v2/files endpoint
// // // 		let printfulResponse;
// // // 		try {
// // // 			printfulResponse = await axios.post(
// // // 				"https://api.printful.com/v2/files",
// // // 				printfulPayload,
// // // 				{
// // // 					headers: {
// // // 						"Content-Type": "application/json",
// // // 						Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// // // 					},
// // // 				}
// // // 			);
// // // 		} catch (printfulError: unknown) {
// // // 			if (axios.isAxiosError(printfulError)) {
// // // 				console.error(
// // // 					"Printful API Error:",
// // // 					printfulError.response?.data || printfulError.message
// // // 				);
// // // 				return NextResponse.json(
// // // 					{
// // // 						error: "Failed to communicate with Printful API.",
// // // 						details:
// // // 							printfulError.response?.data ||
// // // 							printfulError.message,
// // // 					},
// // // 					{ status: printfulError.response?.status || 500 }
// // // 				);
// // // 			} else if (printfulError instanceof Error) {
// // // 				console.error("Printful General Error:", printfulError.message);
// // // 				return NextResponse.json(
// // // 					{ error: "Internal Server Error." },
// // // 					{ status: 500 }
// // // 				);
// // // 			} else {
// // // 				console.error("Printful Unexpected Error:", printfulError);
// // // 				return NextResponse.json(
// // // 					{ error: "An unexpected error occurred." },
// // // 					{ status: 500 }
// // // 				);
// // // 			}
// // // 		}

// // // 		// Check if 'result' exists in Printful's response
// // // 		if (!printfulResponse.data || !printfulResponse.data.result) {
// // // 			console.error("Printful API Response:", printfulResponse.data);
// // // 			return NextResponse.json(
// // // 				{
// // // 					error: "Invalid response from Printful API.",
// // // 					details: printfulResponse.data,
// // // 				},
// // // 				{ status: 500 }
// // // 			);
// // // 		}

// // // 		// Extract data from Printful's response
// // // 		const { id: printfulFileId, url: printfulUrl } =
// // // 			printfulResponse.data.result;

// // // 		// Fetch the HatProduct from the database with 'options' included in 'files'
// // // 		const hatProductRaw = await prisma.hatProduct.findFirst({
// // // 			include: {
// // // 				options: true,
// // // 				techniques: true,
// // // 				files: {
// // // 					include: {
// // // 						options: true, // Ensure 'options' are included for each file
// // // 					},
// // // 				},
// // // 			},
// // // 		});

// // // 		if (!hatProductRaw) {
// // // 			return NextResponse.json(
// // // 				{ error: "HatProduct not found in the database." },
// // // 				{ status: 404 }
// // // 			);
// // // 		}

// // // 		// Cast the JSON fields to the appropriate TypeScript interfaces
// // // 		const hatProduct: HatProduct = {
// // // 			...hatProductRaw,
// // // 			options: hatProductRaw.options as Option[] | null,
// // // 			techniques: hatProductRaw.techniques as Technique[] | null,
// // // 			files: hatProductRaw.files as File[] | null,
// // // 			origin_country: hatProductRaw.origin_country,
// // // 		};

// // // 		if (!hatProduct.options) {
// // // 			return NextResponse.json(
// // // 				{ error: "HatProduct options are missing." },
// // // 				{ status: 500 }
// // // 			);
// // // 		}

// // // 		// Select random values from available options
// // // 		const selectedOptions: Record<string, string | string[] | null> = {};

// // // 		hatProduct.options.forEach((option: Option) => {
// // // 			if (option.type === "radio" && option.values) {
// // // 				const keys = Object.keys(option.values);
// // // 				const randomKey = keys[Math.floor(Math.random() * keys.length)];
// // // 				selectedOptions[option.id] = randomKey;
// // // 			} else if (option.type === "multi_select" && option.values) {
// // // 				const keys = Object.keys(option.values);
// // // 				const numberOfSelections =
// // // 					Math.floor(Math.random() * keys.length) + 1;
// // // 				const shuffled = keys.sort(() => 0.5 - Math.random());
// // // 				selectedOptions[option.id] = shuffled.slice(
// // // 					0,
// // // 					numberOfSelections
// // // 				);
// // // 			} else if (option.type === "text") {
// // // 				selectedOptions[option.id] = "Default note";
// // // 			}
// // // 		});

// // // 		// Extract selected options
// // // 		const embroideryType = selectedOptions["embroidery_type"] as
// // // 			| string
// // // 			| undefined;
// // // 		const threadColors = selectedOptions["thread_colors"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const threadColors3d = selectedOptions["thread_colors_3d"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const threadColorsFrontLarge = selectedOptions[
// // // 			"thread_colors_front_large"
// // // 		] as string[] | string | null;
// // // 		const threadColors3dFrontLarge = selectedOptions[
// // // 			"thread_colors_3d_front_large"
// // // 		] as string[] | string | null;
// // // 		const threadColorsBack = selectedOptions["thread_colors_back"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const threadColorsRight = selectedOptions["thread_colors_right"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const threadColorsLeft = selectedOptions["thread_colors_left"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const notes = selectedOptions["notes"] as string | null;

// // // 		// Build color string by combining all selected thread colors
// // // 		const selectedColors = [
// // // 			threadColors,
// // // 			threadColors3d,
// // // 			threadColorsFrontLarge,
// // // 			threadColors3dFrontLarge,
// // // 			threadColorsBack,
// // // 			threadColorsRight,
// // // 			threadColorsLeft,
// // // 		];

// // // 		const color =
// // // 			selectedColors
// // // 				.filter((c): c is string | string[] => c !== null)
// // // 				.flatMap((c) => (Array.isArray(c) ? c : [c]))
// // // 				.join(", ") || "Default Color";

// // // 		// Calculate prices
// // // 		const retailPrice = 29.99;
// // // 		const calculatedPrice = retailPrice * 2;
// // // 		const currency = hatProduct.currency;

// // // 		// Create Stripe product
// // // 		const stripeProduct = await stripe.products.create({
// // // 			name: hatProduct.title,
// // // 			description: hatProduct.description,
// // // 			images: [hatProduct.image],
// // // 		});

// // // 		// Create Stripe price
// // // 		const stripePrice = await stripe.prices.create({
// // // 			unit_amount: Math.round(calculatedPrice * 100), // Convert to cents
// // // 			currency: currency.toLowerCase(),
// // // 			product: stripeProduct.id,
// // // 		});

// // // 		// Generate dynamic name based on embroidery type and notes
// // // 		let variantName = "Custom Hat";
// // // 		if (embroideryType === "flat") {
// // // 			variantName = "Flat Embroidery Hat";
// // // 		} else if (embroideryType === "3d") {
// // // 			variantName = "3D Puff Hat";
// // // 		} else if (embroideryType === "both") {
// // // 			variantName = "Partial 3D Puff Hat";
// // // 		}

// // // 		if (notes) {
// // // 			variantName += ` - ${notes}`;
// // // 		}

// // // 		// Create a new HatVariant in the database
// // // 		const variant = await prisma.hatVariant.create({
// // // 			data: {
// // // 				id: uuidv4(),
// // // 				printfulFileId: printfulFileId,
// // // 				name: variantName,
// // // 				color: color,
// // // 				size: "M", // Assuming 'M' as default size. Adjust if needed.
// // // 				image: printfulUrl, // URL from Printful
// // // 				retailPrice: retailPrice,
// // // 				currency: currency,
// // // 				stripePriceId: stripePrice.id,
// // // 				hatProductId: hatProduct.id,
// // // 				// imageId: imageId, // Uncomment if you decide to use imageId
// // // 				createdAt: new Date(),
// // // 				updatedAt: new Date(),
// // // 			},
// // // 		});

// // // 		// Respond with the created variant
// // // 		return NextResponse.json({ variant }, { status: 200 });
// // // 	} catch (error: unknown) {
// // // 		if (axios.isAxiosError(error)) {
// // // 			console.error("Axios error:", error.response?.data);
// // // 			return NextResponse.json(
// // // 				{
// // // 					error: "Failed to generate hat variant.",
// // // 					details: error.response?.data,
// // // 				},
// // // 				{ status: error.response?.status || 500 }
// // // 			);
// // // 		} else if (error instanceof Error) {
// // // 			console.error("General error:", error.message);
// // // 			return NextResponse.json(
// // // 				{ error: "Internal Server Error." },
// // // 				{ status: 500 }
// // // 			);
// // // 		} else {
// // // 			console.error("Unexpected error:", error);
// // // 			return NextResponse.json(
// // // 				{ error: "An unexpected error occurred." },
// // // 				{ status: 500 }
// // // 			);
// // // 		}
// // // 	}
// // // }

// // // src/app/api/get-hat-variants/route.ts

// // // import { NextRequest, NextResponse } from "next/server";
// // // import axios from "axios";
// // // import axiosRetry from "axios-retry"; // Ensure axios-retry is installed and typed
// // // import { PrismaClient } from "@prisma/client";
// // // import { v4 as uuidv4 } from "uuid";
// // // import Stripe from "stripe";

// // // const prisma = new PrismaClient();

// // // const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
// // // const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
// // // const NEXT_PUBLIC_BASE_URL =
// // // 	process.env.NEXT_PUBLIC_BASE_URL || "${process.env.NEXT_PUBLIC_BASE_URL}";

// // // if (!PRINTFUL_API_KEY) {
// // // 	throw new Error("PRINTFUL_API_KEY is not defined in environment variables");
// // // }

// // // if (!STRIPE_SECRET_KEY) {
// // // 	throw new Error(
// // // 		"STRIPE_SECRET_KEY is not defined in environment variables"
// // // 	);
// // // }

// // // const stripe = new Stripe(STRIPE_SECRET_KEY, {
// // // 	apiVersion: "2024-09-30.acacia", // Update as per your Stripe setup
// // // });

// // // // Initialize axios-retry for transient errors
// // // axiosRetry(axios, {
// // // 	retries: 3,
// // // 	retryDelay: axiosRetry.exponentialDelay,
// // // 	retryCondition: (error) => {
// // // 		return (
// // // 			axiosRetry.isNetworkError(error) ||
// // // 			axiosRetry.isRetryableError(error)
// // // 		);
// // // 	},
// // // });

// // // // Define TypeScript interfaces

// // // interface Option {
// // // 	id: string;
// // // 	title: string;
// // // 	type: "radio" | "multi_select" | "text";
// // // 	values: Record<string, string> | null;
// // // 	additional_price: string | null;
// // // 	additional_price_breakdown: Record<string, string>;
// // // }

// // // interface Technique {
// // // 	key: string;
// // // 	display_name: string;
// // // 	is_default: boolean;
// // // }

// // // interface FileOption {
// // // 	id: string;
// // // 	type: "bool";
// // // 	title: string;
// // // 	additional_price: number;
// // // }

// // // interface File {
// // // 	id: string;
// // // 	type:
// // // 		| "embroidery_front_large"
// // // 		| "embroidery_front"
// // // 		| "embroidery_back"
// // // 		| "embroidery_right"
// // // 		| "embroidery_left"
// // // 		| "mockup";
// // // 	title: string;
// // // 	additional_price: string | null;
// // // 	options: FileOption[];
// // // }

// // // interface HatProduct {
// // // 	id: string;
// // // 	printfulId: number;
// // // 	mainCategoryId: number;
// // // 	type: string;
// // // 	description: string;
// // // 	title: string;
// // // 	brand: string;
// // // 	model: string;
// // // 	image: string;
// // // 	variantCount: number;
// // // 	currency: string;
// // // 	options: Option[] | null;
// // // 	techniques: Technique[] | null;
// // // 	files: File[] | null;
// // // 	origin_country: string | null;
// // // }

// // // export async function POST(req: NextRequest) {
// // // 	try {
// // // 		const { resultId, pngBase64 } = await req.json();

// // // 		// Input validation
// // // 		if (!resultId || !pngBase64) {
// // // 			return NextResponse.json(
// // // 				{ error: "Missing resultId or pngBase64 in request body." },
// // // 				{ status: 400 }
// // // 			);
// // // 		}

// // // 		// Upload the image to the database via the upload endpoint
// // // 		const uploadResponse = await axios.post(
// // // 			`${NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// // // 			{
// // // 				pngBase64,
// // // 				filename: `hat_variant_${uuidv4()}.png`,
// // // 			},
// // // 			{
// // // 				headers: {
// // // 					"Content-Type": "application/json",
// // // 				},
// // // 			}
// // // 		);

// // // 		// Removed 'imageId' to eliminate ESLint warning
// // // 		const { url: imageUrl } = uploadResponse.data;

// // // 		// Prepare payload for Printful
// // // 		const printfulPayload = {
// // // 			role: "printfile", // Required by Printful API
// // // 			url: imageUrl, // Use the URL from the image upload
// // // 			filename: `hat_variant_${uuidv4()}.png`, // Dynamic filename
// // // 			visible: true, // Optional: set to false if you don't want it visible in Printful's File Library
// // // 		};

// // // 		// Debugging: Log the payload (Ensure to remove or secure logs in production)
// // // 		console.log("Printful Payload:", printfulPayload);

// // // 		// Send request to Printful's /files endpoint (corrected)
// // // 		let printfulResponse;
// // // 		try {
// // // 			printfulResponse = await axios.post(
// // // 				"https://api.printful.com/files", // Corrected endpoint
// // // 				printfulPayload,
// // // 				{
// // // 					headers: {
// // // 						"Content-Type": "application/json",
// // // 						Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// // // 					},
// // // 				}
// // // 			);
// // // 		} catch (printfulError: unknown) {
// // // 			if (axios.isAxiosError(printfulError)) {
// // // 				console.error(
// // // 					"Printful API Error:",
// // // 					printfulError.response?.data || printfulError.message
// // // 				);
// // // 				return NextResponse.json(
// // // 					{
// // // 						error: "Failed to communicate with Printful API.",
// // // 						details:
// // // 							printfulError.response?.data ||
// // // 							printfulError.message,
// // // 					},
// // // 					{ status: printfulError.response?.status || 500 }
// // // 				);
// // // 			} else if (printfulError instanceof Error) {
// // // 				console.error("Printful General Error:", printfulError.message);
// // // 				return NextResponse.json(
// // // 					{ error: "Internal Server Error." },
// // // 					{ status: 500 }
// // // 				);
// // // 			} else {
// // // 				console.error("Printful Unexpected Error:", printfulError);
// // // 				return NextResponse.json(
// // // 					{ error: "An unexpected error occurred." },
// // // 					{ status: 500 }
// // // 				);
// // // 			}
// // // 		}

// // // 		// Check if 'data' exists in Printful's response
// // // 		if (!printfulResponse.data) {
// // // 			console.error("Printful API Response:", printfulResponse.data);
// // // 			return NextResponse.json(
// // // 				{
// // // 					error: "Invalid response from Printful API.",
// // // 					details: printfulResponse.data,
// // // 				},
// // // 				{ status: 500 }
// // // 			);
// // // 		}

// // // 		// Extract data from Printful's response
// // // 		const { id: printfulFileId, url: printfulUrl } = printfulResponse.data;

// // // 		// Fetch the HatProduct from the database with 'options' included in 'files'
// // // 		const hatProductRaw = await prisma.hatProduct.findFirst({
// // // 			include: {
// // // 				options: true,
// // // 				techniques: true,
// // // 				files: {
// // // 					include: {
// // // 						options: true, // Ensure 'options' are included for each file
// // // 					},
// // // 				},
// // // 			},
// // // 		});

// // // 		if (!hatProductRaw) {
// // // 			return NextResponse.json(
// // // 				{ error: "HatProduct not found in the database." },
// // // 				{ status: 404 }
// // // 			);
// // // 		}

// // // 		// Cast the JSON fields to the appropriate TypeScript interfaces
// // // 		const hatProduct: HatProduct = {
// // // 			...hatProductRaw,
// // // 			options: hatProductRaw.options as Option[] | null,
// // // 			techniques: hatProductRaw.techniques as Technique[] | null,
// // // 			files: hatProductRaw.files as File[] | null,
// // // 			origin_country: hatProductRaw.origin_country,
// // // 		};

// // // 		if (!hatProduct.options) {
// // // 			return NextResponse.json(
// // // 				{ error: "HatProduct options are missing." },
// // // 				{ status: 500 }
// // // 			);
// // // 		}

// // // 		// Select random values from available options
// // // 		const selectedOptions: Record<string, string | string[] | null> = {};

// // // 		hatProduct.options.forEach((option: Option) => {
// // // 			if (option.type === "radio" && option.values) {
// // // 				const keys = Object.keys(option.values);
// // // 				const randomKey = keys[Math.floor(Math.random() * keys.length)];
// // // 				selectedOptions[option.id] = randomKey;
// // // 			} else if (option.type === "multi_select" && option.values) {
// // // 				const keys = Object.keys(option.values);
// // // 				const numberOfSelections =
// // // 					Math.floor(Math.random() * keys.length) + 1;
// // // 				const shuffled = keys.sort(() => 0.5 - Math.random());
// // // 				selectedOptions[option.id] = shuffled.slice(
// // // 					0,
// // // 					numberOfSelections
// // // 				);
// // // 			} else if (option.type === "text") {
// // // 				selectedOptions[option.id] = "Default note";
// // // 			}
// // // 		});

// // // 		// Extract selected options
// // // 		const embroideryType = selectedOptions["embroidery_type"] as
// // // 			| string
// // // 			| undefined;
// // // 		const threadColors = selectedOptions["thread_colors"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const threadColors3d = selectedOptions["thread_colors_3d"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const threadColorsFrontLarge = selectedOptions[
// // // 			"thread_colors_front_large"
// // // 		] as string[] | string | null;
// // // 		const threadColors3dFrontLarge = selectedOptions[
// // // 			"thread_colors_3d_front_large"
// // // 		] as string[] | string | null;
// // // 		const threadColorsBack = selectedOptions["thread_colors_back"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const threadColorsRight = selectedOptions["thread_colors_right"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const threadColorsLeft = selectedOptions["thread_colors_left"] as
// // // 			| string[]
// // // 			| string
// // // 			| null;
// // // 		const notes = selectedOptions["notes"] as string | null;

// // // 		// Build color string by combining all selected thread colors
// // // 		const selectedColors = [
// // // 			threadColors,
// // // 			threadColors3d,
// // // 			threadColorsFrontLarge,
// // // 			threadColors3dFrontLarge,
// // // 			threadColorsBack,
// // // 			threadColorsRight,
// // // 			threadColorsLeft,
// // // 		];

// // // 		const color =
// // // 			selectedColors
// // // 				.filter((c): c is string | string[] => c !== null)
// // // 				.flatMap((c) => (Array.isArray(c) ? c : [c]))
// // // 				.join(", ") || "Default Color";

// // // 		// Calculate prices
// // // 		const retailPrice = 29.99;
// // // 		const calculatedPrice = retailPrice * 2;
// // // 		const currency = hatProduct.currency;

// // // 		// Create Stripe product
// // // 		const stripeProduct = await stripe.products.create({
// // // 			name: hatProduct.title,
// // // 			description: hatProduct.description,
// // // 			images: [hatProduct.image],
// // // 		});

// // // 		// Create Stripe price
// // // 		const stripePrice = await stripe.prices.create({
// // // 			unit_amount: Math.round(calculatedPrice * 100), // Convert to cents
// // // 			currency: currency.toLowerCase(),
// // // 			product: stripeProduct.id,
// // // 		});

// // // 		// Generate dynamic name based on embroidery type and notes
// // // 		let variantName = "Custom Hat";
// // // 		if (embroideryType === "flat") {
// // // 			variantName = "Flat Embroidery Hat";
// // // 		} else if (embroideryType === "3d") {
// // // 			variantName = "3D Puff Hat";
// // // 		} else if (embroideryType === "both") {
// // // 			variantName = "Partial 3D Puff Hat";
// // // 		}

// // // 		if (notes) {
// // // 			variantName += ` - ${notes}`;
// // // 		}

// // // 		// Create a new HatVariant in the database
// // // 		const variant = await prisma.hatVariant.create({
// // // 			data: {
// // // 				id: uuidv4(),
// // // 				printfulFileId: printfulFileId,
// // // 				name: variantName,
// // // 				color: color,
// // // 				size: "M", // Assuming 'M' as default size. Adjust if needed.
// // // 				image: printfulUrl, // URL from Printful
// // // 				retailPrice: retailPrice,
// // // 				currency: currency,
// // // 				stripePriceId: stripePrice.id,
// // // 				hatProductId: hatProduct.id,
// // // 				// imageId: imageId, // Uncomment if you decide to use imageId
// // // 				createdAt: new Date(),
// // // 				updatedAt: new Date(),
// // // 			},
// // // 		});

// // // 		// Respond with the created variant
// // // 		return NextResponse.json({ variant }, { status: 200 });
// // // 	} catch (error: unknown) {
// // // 		if (axios.isAxiosError(error)) {
// // // 			console.error("Axios error:", error.response?.data);
// // // 			return NextResponse.json(
// // // 				{
// // // 					error: "Failed to generate hat variant.",
// // // 					details: error.response?.data,
// // // 				},
// // // 				{ status: error.response?.status || 500 }
// // // 			);
// // // 		} else if (error instanceof Error) {
// // // 			console.error("General error:", error.message);
// // // 			return NextResponse.json(
// // // 				{ error: "Internal Server Error." },
// // // 				{ status: 500 }
// // // 			);
// // // 		} else {
// // // 			console.error("Unexpected error:", error);
// // // 			return NextResponse.json(
// // // 				{ error: "An unexpected error occurred." },
// // // 				{ status: 500 }
// // // 			);
// // // 		}
// // // 	}
// // // }

// // import { NextRequest, NextResponse } from "next/server";
// // import axios from "axios";
// // import axiosRetry from "axios-retry"; // Ensure axios-retry is installed and typed
// // import { PrismaClient } from "@prisma/client";
// // import { v4 as uuidv4 } from "uuid";
// // import Stripe from "stripe";

// // const prisma = new PrismaClient();

// // const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
// // const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
// // const NEXT_PUBLIC_BASE_URL =
// // 	process.env.NEXT_PUBLIC_BASE_URL ||
// // 	"${process.env.NEXT_PUBLIC_BASE_URL}";

// // if (!PRINTFUL_API_KEY) {
// // 	throw new Error("PRINTFUL_API_KEY is not defined in environment variables");
// // }

// // if (!STRIPE_SECRET_KEY) {
// // 	throw new Error(
// // 		"STRIPE_SECRET_KEY is not defined in environment variables"
// // 	);
// // }

// // const stripe = new Stripe(STRIPE_SECRET_KEY, {
// // 	apiVersion: "2024-09-30.acacia", // Update as per your Stripe setup
// // });

// // // Initialize axios-retry for transient errors
// // axiosRetry(axios, {
// // 	retries: 3,
// // 	retryDelay: axiosRetry.exponentialDelay,
// // 	retryCondition: (error) => {
// // 		return (
// // 			axiosRetry.isNetworkError(error) ||
// // 			axiosRetry.isRetryableError(error)
// // 		);
// // 	},
// // });

// // // Define TypeScript interfaces

// // interface Option {
// // 	id: string;
// // 	title: string;
// // 	type: "radio" | "multi_select" | "text";
// // 	values: Record<string, string> | null;
// // 	additional_price: string | null;
// // 	additional_price_breakdown: Record<string, string>;
// // }

// // interface Technique {
// // 	key: string;
// // 	display_name: string;
// // 	is_default: boolean;
// // }

// // interface FileOption {
// // 	id: string;
// // 	type: "bool";
// // 	title: string;
// // 	additional_price: number;
// // }

// // interface File {
// // 	id: string;
// // 	type:
// // 		| "embroidery_front_large"
// // 		| "embroidery_front"
// // 		| "embroidery_back"
// // 		| "embroidery_right"
// // 		| "embroidery_left"
// // 		| "mockup";
// // 	title: string;
// // 	additional_price: string | null;
// // 	options: FileOption[];
// // }

// // interface HatProduct {
// // 	id: string;
// // 	printfulId: number;
// // 	mainCategoryId: number;
// // 	type: string;
// // 	description: string;
// // 	title: string;
// // 	brand: string;
// // 	model: string;
// // 	image: string;
// // 	variantCount: number;
// // 	currency: string;
// // 	options: Option[] | null;
// // 	techniques: Technique[] | null;
// // 	files: File[] | null;
// // 	origin_country: string | null;
// // }

// // export async function POST(req: NextRequest) {
// // 	try {
// // 		const { resultId, pngBase64 } = await req.json();

// // 		// Input validation
// // 		if (!resultId || !pngBase64) {
// // 			return NextResponse.json(
// // 				{ error: "Missing resultId or pngBase64 in request body." },
// // 				{ status: 400 }
// // 			);
// // 		}

// // 		// Upload the image to the database via the upload endpoint
// // 		const uploadResponse = await axios.post(
// // 			`${NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// // 			{
// // 				pngBase64,
// // 				filename: `hat_variant_${uuidv4()}.png`,
// // 			},
// // 			{
// // 				headers: {
// // 					"Content-Type": "application/json",
// // 				},
// // 			}
// // 		);

// // 		// Removed 'imageId' to eliminate ESLint warning
// // 		const { url: imageUrl } = uploadResponse.data;

// // 		// Prepare payload for Printful
// // 		const printfulPayload = {
// // 			role: "printfile", // Required by Printful API
// // 			url: imageUrl, // Use the URL from the image upload
// // 			filename: `hat_variant_${uuidv4()}.png`, // Dynamic filename
// // 			visible: true, // Optional: set to false if you don't want it visible in Printful's File Library
// // 		};

// // 		// Debugging: Log the payload (Ensure to remove or secure logs in production)
// // 		console.log("Printful Payload:", printfulPayload);

// // 		// Send request to Printful's /v2/files endpoint
// // 		let printfulResponse;
// // 		try {
// // 			printfulResponse = await axios.post(
// // 				"https://api.printful.com/v2/files",
// // 				printfulPayload,
// // 				{
// // 					headers: {
// // 						"Content-Type": "application/json",
// // 						Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// // 					},
// // 				}
// // 			);
// // 		} catch (printfulError: unknown) {
// // 			if (axios.isAxiosError(printfulError)) {
// // 				console.error(
// // 					"Printful API Error:",
// // 					printfulError.response?.data || printfulError.message
// // 				);
// // 				return NextResponse.json(
// // 					{
// // 						error: "Failed to communicate with Printful API.",
// // 						details:
// // 							printfulError.response?.data ||
// // 							printfulError.message,
// // 					},
// // 					{ status: printfulError.response?.status || 500 }
// // 				);
// // 			} else if (printfulError instanceof Error) {
// // 				console.error("Printful General Error:", printfulError.message);
// // 				return NextResponse.json(
// // 					{ error: "Internal Server Error." },
// // 					{ status: 500 }
// // 				);
// // 			} else {
// // 				console.error("Printful Unexpected Error:", printfulError);
// // 				return NextResponse.json(
// // 					{ error: "An unexpected error occurred." },
// // 					{ status: 500 }
// // 				);
// // 			}
// // 		}

// // 		// Check if 'result' exists in Printful's response
// // 		if (!printfulResponse.data || !printfulResponse.data.result) {
// // 			console.error("Printful API Response:", printfulResponse.data);
// // 			return NextResponse.json(
// // 				{
// // 					error: "Invalid response from Printful API.",
// // 					details: printfulResponse.data,
// // 				},
// // 				{ status: 500 }
// // 			);
// // 		}

// // 		// Extract data from Printful's response
// // 		const { id: printfulFileId, url: printfulUrl } =
// // 			printfulResponse.data.result;

// // 		// Fetch the HatProduct from the database with 'options' included in 'files'
// // 		const hatProductRaw = await prisma.hatProduct.findFirst({
// // 			include: {
// // 				options: true,
// // 				techniques: true,
// // 				files: {
// // 					include: {
// // 						options: true, // Ensure 'options' are included for each file
// // 					},
// // 				},
// // 			},
// // 		});

// // 		if (!hatProductRaw) {
// // 			return NextResponse.json(
// // 				{ error: "HatProduct not found in the database." },
// // 				{ status: 404 }
// // 			);
// // 		}

// // 		// Cast the JSON fields to the appropriate TypeScript interfaces
// // 		const hatProduct: HatProduct = {
// // 			...hatProductRaw,
// // 			options: hatProductRaw.options as Option[] | null,
// // 			techniques: hatProductRaw.techniques as Technique[] | null,
// // 			files: hatProductRaw.files as File[] | null,
// // 			origin_country: hatProductRaw.origin_country,
// // 		};

// // 		if (!hatProduct.options) {
// // 			return NextResponse.json(
// // 				{ error: "HatProduct options are missing." },
// // 				{ status: 500 }
// // 			);
// // 		}

// // 		// Select random values from available options
// // 		const selectedOptions: Record<string, string | string[] | null> = {};

// // 		hatProduct.options.forEach((option: Option) => {
// // 			if (option.type === "radio" && option.values) {
// // 				const keys = Object.keys(option.values);
// // 				const randomKey = keys[Math.floor(Math.random() * keys.length)];
// // 				selectedOptions[option.id] = randomKey;
// // 			} else if (option.type === "multi_select" && option.values) {
// // 				const keys = Object.keys(option.values);
// // 				const numberOfSelections =
// // 					Math.floor(Math.random() * keys.length) + 1;
// // 				const shuffled = keys.sort(() => 0.5 - Math.random());
// // 				selectedOptions[option.id] = shuffled.slice(
// // 					0,
// // 					numberOfSelections
// // 				);
// // 			} else if (option.type === "text") {
// // 				selectedOptions[option.id] = "Default note";
// // 			}
// // 		});

// // 		// Extract selected options
// // 		const embroideryType = selectedOptions["embroidery_type"] as
// // 			| string
// // 			| undefined;
// // 		const threadColors = selectedOptions["thread_colors"] as
// // 			| string[]
// // 			| string
// // 			| null;
// // 		const threadColors3d = selectedOptions["thread_colors_3d"] as
// // 			| string[]
// // 			| string
// // 			| null;
// // 		const threadColorsFrontLarge = selectedOptions[
// // 			"thread_colors_front_large"
// // 		] as string[] | string | null;
// // 		const threadColors3dFrontLarge = selectedOptions[
// // 			"thread_colors_3d_front_large"
// // 		] as string[] | string | null;
// // 		const threadColorsBack = selectedOptions["thread_colors_back"] as
// // 			| string[]
// // 			| string
// // 			| null;
// // 		const threadColorsRight = selectedOptions["thread_colors_right"] as
// // 			| string[]
// // 			| string
// // 			| null;
// // 		const threadColorsLeft = selectedOptions["thread_colors_left"] as
// // 			| string[]
// // 			| string
// // 			| null;
// // 		const notes = selectedOptions["notes"] as string | null;

// // 		// Build color string by combining all selected thread colors
// // 		const selectedColors = [
// // 			threadColors,
// // 			threadColors3d,
// // 			threadColorsFrontLarge,
// // 			threadColors3dFrontLarge,
// // 			threadColorsBack,
// // 			threadColorsRight,
// // 			threadColorsLeft,
// // 		];

// // 		const color =
// // 			selectedColors
// // 				.filter((c): c is string | string[] => c !== null)
// // 				.flatMap((c) => (Array.isArray(c) ? c : [c]))
// // 				.join(", ") || "Default Color";

// // 		// Calculate prices
// // 		const retailPrice = 29.99;
// // 		const calculatedPrice = retailPrice * 2;
// // 		const currency = hatProduct.currency;

// // 		// Create Stripe product
// // 		const stripeProduct = await stripe.products.create({
// // 			name: hatProduct.title,
// // 			description: hatProduct.description,
// // 			images: [hatProduct.image],
// // 		});

// // 		// Create Stripe price
// // 		const stripePrice = await stripe.prices.create({
// // 			unit_amount: Math.round(calculatedPrice * 100), // Convert to cents
// // 			currency: currency.toLowerCase(),
// // 			product: stripeProduct.id,
// // 		});

// // 		// Generate dynamic name based on embroidery type and notes
// // 		let variantName = "Custom Hat";
// // 		if (embroideryType === "flat") {
// // 			variantName = "Flat Embroidery Hat";
// // 		} else if (embroideryType === "3d") {
// // 			variantName = "3D Puff Hat";
// // 		} else if (embroideryType === "both") {
// // 			variantName = "Partial 3D Puff Hat";
// // 		}

// // 		if (notes) {
// // 			variantName += ` - ${notes}`;
// // 		}

// // 		// Create a new HatVariant in the database
// // 		const variant = await prisma.hatVariant.create({
// // 			data: {
// // 				id: uuidv4(),
// // 				printfulFileId: printfulFileId,
// // 				name: variantName,
// // 				color: color,
// // 				size: "M", // Assuming 'M' as default size. Adjust if needed.
// // 				image: printfulUrl, // URL from Printful
// // 				retailPrice: retailPrice,
// // 				currency: currency,
// // 				stripePriceId: stripePrice.id,
// // 				hatProductId: hatProduct.id,
// // 				// imageId: imageId, // Uncomment if you decide to use imageId
// // 				createdAt: new Date(),
// // 				updatedAt: new Date(),
// // 			},
// // 		});

// // 		// Respond with the created variant
// // 		return NextResponse.json({ variant }, { status: 200 });
// // 	} catch (error: unknown) {
// // 		if (axios.isAxiosError(error)) {
// // 			console.error("Axios error:", error.response?.data);
// // 			return NextResponse.json(
// // 				{
// // 					error: "Failed to generate hat variant.",
// // 					details: error.response?.data,
// // 				},
// // 				{ status: error.response?.status || 500 }
// // 			);
// // 		} else if (error instanceof Error) {
// // 			console.error("General error:", error.message);
// // 			return NextResponse.json(
// // 				{ error: "Internal Server Error." },
// // 				{ status: 500 }
// // 			);
// // 		} else {
// // 			console.error("Unexpected error:", error);
// // 			return NextResponse.json(
// // 				{ error: "An unexpected error occurred." },
// // 				{ status: 500 }
// // 			);
// // 		}
// // 	}
// // }

// // // // import { NextRequest, NextResponse } from "next/server";
// // // // import { PrismaClient, QuizResult, HatProduct, Option, Technique, File, FileOption, HatVariant } from "@prisma/client";
// // // // import { v4 as uuidv4 } from "uuid";
// // // // import axios from "axios";
// // // // import Stripe from "stripe";
// // // // const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, { apiVersion: '2024-09-30.acacia' });

// // // // const prisma = new PrismaClient();

// // // // // Define interfaces to match the nested relations
// // // // interface ExtendedHatProduct extends HatProduct {
// // // //   options: Option[];
// // // //   techniques: Technique[];
// // // //   files: (File & { options: FileOption[] })[];
// // // // }

// // // // interface ExtendedQuizResult extends QuizResult {
// // // //   hatProduct: ExtendedHatProduct;
// // // // }

// // // // export async function POST(req: NextRequest) {
// // // //   try {
// // // //     const { resultId, pngBase64 } = await req.json();

// // // //     // Validate request body
// // // //     if (!resultId || !pngBase64) {
// // // //       return NextResponse.json(
// // // //         { error: "Missing resultId or pngBase64 in request body." },
// // // //         { status: 400 }
// // // //       );
// // // //     }

// // // //     // Fetch QuizResult with HatProduct and related data
// // // //     const quizResult: ExtendedQuizResult | null = await prisma.quizResult.findUnique({
// // // //       where: { id: resultId },
// // // //       include: {
// // // //         hatProduct: {
// // // //           include: {
// // // //             options: true,
// // // //             techniques: true,
// // // //             files: {
// // // //               include: {
// // // //                 options: true,
// // // //               },
// // // //             },
// // // //           },
// // // //         },
// // // //       },
// // // //     });

// // // //     // Handle case where QuizResult or HatProduct is not found
// // // //     if (!quizResult || !quizResult.hatProduct) {
// // // //       return NextResponse.json(
// // // //         { error: "QuizResult or associated HatProduct not found." },
// // // //         { status: 404 }
// // // //       );
// // // //     }

// // // //     const { hatProduct } = quizResult;

// // // //     // Ensure nested relations are present
// // // //     if (!hatProduct.options || !hatProduct.techniques || !hatProduct.files) {
// // // //       return NextResponse.json(
// // // //         { error: "Incomplete HatProduct data." },
// // // //         { status: 500 }
// // // //       );
// // // //     }

// // // //     // Step 1: Upload the image to Printful
// // // //     const printfulResponse = await axios.post(
// // // //       "https://api.printful.com/files",
// // // //       { file: pngBase64 },
// // // //       {
// // // //         headers: {
// // // //           Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// // // //           "Content-Type": "application/json",
// // // //         },
// // // //       }
// // // //     );

// // // //     const { id: printfulFileId, status: printfulStatus } = printfulResponse.data.result;

// // // //     // Step 2: Handle Printful's response
// // // //     if (printfulStatus === "waiting") {
// // // //       // Implement polling to check the status
// // // //       const pollFileStatus = async (
// // // //         fileId: number,
// // // //         retries = 5,
// // // //         interval = 3000
// // // //       ): Promise<void> => {
// // // //         for (let i = 0; i < retries; i++) {
// // // //           try {
// // // //             const response = await axios.get(
// // // //               `https://api.printful.com/files/${fileId}`,
// // // //               {
// // // //                 headers: {
// // // //                   Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// // // //                 },
// // // //               }
// // // //             );

// // // //             const currentStatus = response.data.result.status;

// // // //             console.log(`Printful File Status [Attempt ${i + 1}]: ${currentStatus}`);

// // // //             if (currentStatus === "ready") {
// // // //               return;
// // // //             }

// // // //             if (currentStatus === "error") {
// // // //               throw new Error("Printful file processing failed.");
// // // //             }
// // // //           } catch (error) {
// // // //             console.error("Error fetching Printful file status:", error);
// // // //             throw error;
// // // //           }

// // // //           // Wait before the next retry
// // // //           await new Promise((resolve) => setTimeout(resolve, interval));
// // // //         }

// // // //         throw new Error("Printful file processing timed out.");
// // // //       };

// // // //       try {
// // // //         await pollFileStatus(printfulFileId);
// // // //         console.log("Printful file is ready.");
// // // //       } catch (pollError: unknown) {
// // // //         console.error("Polling Error:", pollError);
// // // //         return NextResponse.json(
// // // //           { error: "Failed to process file with Printful.", details: String(pollError) },
// // // //           { status: 500 }
// // // //         );
// // // //       }
// // // //     } else if (printfulStatus === "error") {
// // // //       console.error("Printful file processing failed.");
// // // //       return NextResponse.json(
// // // //         { error: "Printful file processing failed." },
// // // //         { status: 500 }
// // // //       );
// // // //     }

// // // //     // Step 3: Create a new HatVariant in the database
// // // //     const hatVariant: HatVariant = await prisma.hatVariant.create({
// // // //       data: {
// // // //         id: uuidv4(),
// // // //         printfulFileId,
// // // //         name: `${hatProduct.title} - Variant`,
// // // //         color: "Default Color", // Replace with actual logic
// // // //         size: "M", // Replace with actual logic
// // // //         image: `${process.env.BASE_URL}/api/images/${printfulFileId}`, // Adjust as needed
// // // //         retailPrice: 29.99, // Replace with actual logic
// // // //         currency: hatProduct.currency,
// // // //         stripePriceId: "", // To be updated after Stripe integration
// // // //         hatProductId: hatProduct.id,
// // // //       },
// // // //     });

// // // //     // Create Stripe Product
// // // //     const stripeProduct = await stripe.products.create({
// // // //       name: hatVariant.name,
// // // //       description: hatProduct.description,
// // // //       images: [hatVariant.image],
// // // //     });

// // // //     // Create Stripe Price
// // // //     const stripePrice = await stripe.prices.create({
// // // //       product: stripeProduct.id,
// // // //       unit_amount: Math.round(hatVariant.retailPrice * 100), // in cents
// // // //       currency: hatVariant.currency.toLowerCase(),
// // // //     });

// // // //     // Update HatVariant with Stripe Price ID
// // // //     await prisma.hatVariant.update({
// // // //       where: { id: hatVariant.id },
// // // //       data: { stripePriceId: stripePrice.id },
// // // //     });

// // // //     // Respond with the created HatVariant
// // // //     return NextResponse.json({ variant: hatVariant }, { status: 200 });

// // // //   } catch (error) {
// // // //     console.error("Error in /api/get-hat-variants:", error);
// // // //     return NextResponse.json(
// // // //       { error: "Internal Server Error." },
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }

// // src/app/api/get-hat-variants/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry"; // Ensure axios-retry is installed and typed
// import { PrismaClient, HatVariant } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";

// // Initialize Prisma Client
// const prisma = new PrismaClient();

// // Retrieve Environment Variables
// const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
// const NEXT_PUBLIC_BASE_URL =
// 	process.env.NEXT_PUBLIC_BASE_URL ||
// 	"${process.env.NEXT_PUBLIC_BASE_URL}"; // Replace with your actual default URL

// // Validate Environment Variables
// if (!PRINTFUL_API_KEY) {
// 	throw new Error("PRINTFUL_API_KEY is not defined in environment variables");
// }

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error(
// 		"STRIPE_SECRET_KEY is not defined in environment variables"
// 	);
// }

// // Initialize Stripe
// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia", // Use the latest stable API version
// });

// // Initialize axios-retry for transient errors
// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// // Define TypeScript interfaces

// interface Option {
// 	id: string;
// 	title: string;
// 	type: "radio" | "multi_select" | "text";
// 	values: Record<string, string> | null;
// 	additional_price: string | null;
// 	additional_price_breakdown: Record<string, string>;
// }

// interface Technique {
// 	key: string;
// 	display_name: string;
// 	is_default: boolean;
// }

// interface FileOption {
// 	id: string;
// 	type: "bool";
// 	title: string;
// 	additional_price: number;
// }

// interface File {
// 	id: string;
// 	type:
// 		| "embroidery_front_large"
// 		| "embroidery_front"
// 		| "embroidery_back"
// 		| "embroidery_right"
// 		| "embroidery_left"
// 		| "mockup";
// 	title: string;
// 	additional_price: string | null;
// 	options: FileOption[];
// }

// interface HatProduct {
// 	id: string;
// 	printfulId: number;
// 	mainCategoryId: number;
// 	type: string;
// 	description: string;
// 	title: string;
// 	brand: string;
// 	model: string;
// 	image: string;
// 	variantCount: number;
// 	currency: string;
// 	options: Option[] | null;
// 	techniques: Technique[] | null;
// 	files: File[] | null;
// 	origin_country: string | null;
// }

// export async function POST(req: NextRequest) {
// 	try {
// 		const { resultId, pngBase64 } = await req.json();

// 		// Input validation
// 		if (!resultId || !pngBase64) {
// 			return NextResponse.json(
// 				{ error: "Missing resultId or pngBase64 in request body." },
// 				{ status: 400 }
// 			);
// 		}

// 		// Step 1: Upload the image via the existing upload endpoint
// 		const uploadResponse = await axios.post(
// 			`${NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 			{
// 				pngBase64,
// 				filename: `hat_variant_${uuidv4()}.png`,
// 			},
// 			{
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			}
// 		);

// 		// Extract the image URL from the upload response
// 		const { url: imageUrl } = uploadResponse.data;

// 		// Step 2: Prepare payload for Printful
// 		const printfulPayload = {
// 			role: "printfile", // Required by Printful API
// 			url: imageUrl, // Use the URL from the image upload
// 			filename: `hat_variant_${uuidv4()}.png`, // Dynamic filename
// 			visible: true, // Optional: set to false if you don't want it visible in Printful's File Library
// 		};

// 		// Debugging: Log the payload (Ensure to remove or secure logs in production)
// 		console.log("Printful Payload:", printfulPayload);

// 		// Step 3: Send request to Printful's /v2/files endpoint
// 		let printfulResponse;
// 		try {
// 			printfulResponse = await axios.post(
// 				"https://api.printful.com/v2/files",
// 				printfulPayload,
// 				{
// 					headers: {
// 						"Content-Type": "application/json",
// 						Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// 					},
// 				}
// 			);

// 			console.log("PRINTFUL_RESPONSE [GET-HAT-VARIANTS]: ", {
// 				...printfulResponse,
// 			});
// 		} catch (printfulError: unknown) {
// 			if (axios.isAxiosError(printfulError)) {
// 				console.error(
// 					"Printful API Error:",
// 					printfulError.response?.data || printfulError.message
// 				);
// 				return NextResponse.json(
// 					{
// 						error: "Failed to communicate with Printful API.",
// 						details:
// 							printfulError.response?.data ||
// 							printfulError.message,
// 					},
// 					{ status: printfulError.response?.status || 500 }
// 				);
// 			} else if (printfulError instanceof Error) {
// 				console.error("Printful General Error:", printfulError.message);
// 				return NextResponse.json(
// 					{ error: "Internal Server Error." },
// 					{ status: 500 }
// 				);
// 			} else {
// 				console.error("Printful Unexpected Error:", printfulError);
// 				return NextResponse.json(
// 					{ error: "An unexpected error occurred." },
// 					{ status: 500 }
// 				);
// 			}
// 		}

// 		// Step 4: Check if 'result' exists in Printful's response
// 		if (!printfulResponse.data || !printfulResponse.data.result) {
// 			console.error("Printful API Response:", printfulResponse.data);
// 			console.log("PRINTFUL_RESPONSE!DATA[GET-HAT-VARIANTS]: ", {
// 				...printfulResponse,
// 			});
// 			return NextResponse.json(
// 				{
// 					error: "Invalid response from Printful API.",
// 					details: printfulResponse.data,
// 				},
// 				{ status: 500 }
// 			);
// 		}

// 		// Step 5: Extract data from Printful's response
// 		const { id: printfulFileId, url: printfulUrl } =
// 			printfulResponse.data.result;

// 		// Step 6: Fetch the HatProduct from the database with related data
// 		const hatProductRaw = await prisma.hatProduct.findUnique({
// 			where: { id: resultId }, // Assuming resultId corresponds to HatProduct ID
// 			include: {
// 				options: true,
// 				techniques: true,
// 				files: {
// 					include: {
// 						options: true,
// 					},
// 				},
// 			},
// 		});

// 		if (!hatProductRaw) {
// 			return NextResponse.json(
// 				{ error: "HatProduct not found in the database." },
// 				{ status: 404 }
// 			);
// 		}

// 		// Cast the JSON fields to the appropriate TypeScript interfaces
// 		const hatProduct: HatProduct = {
// 			...hatProductRaw,
// 			options: hatProductRaw.options as Option[] | null,
// 			techniques: hatProductRaw.techniques as Technique[] | null,
// 			files: hatProductRaw.files as File[] | null,
// 			origin_country: hatProductRaw.origin_country,
// 		};

// 		if (!hatProduct.options) {
// 			return NextResponse.json(
// 				{ error: "HatProduct options are missing." },
// 				{ status: 500 }
// 			);
// 		}

// 		// Step 7: Select random values from available options
// 		const selectedOptions: Record<string, string | string[] | null> = {};

// 		hatProduct.options.forEach((option: Option) => {
// 			if (option.type === "radio" && option.values) {
// 				const keys = Object.keys(option.values);
// 				const randomKey = keys[Math.floor(Math.random() * keys.length)];
// 				selectedOptions[option.id] = randomKey;
// 			} else if (option.type === "multi_select" && option.values) {
// 				const keys = Object.keys(option.values);
// 				const numberOfSelections =
// 					Math.floor(Math.random() * keys.length) + 1;
// 				const shuffled = keys.sort(() => 0.5 - Math.random());
// 				selectedOptions[option.id] = shuffled.slice(
// 					0,
// 					numberOfSelections
// 				);
// 			} else if (option.type === "text") {
// 				selectedOptions[option.id] = "Default note";
// 			}
// 		});

// 		// Step 8: Extract selected options for processing
// 		const embroideryType = selectedOptions["embroidery_type"] as
// 			| string
// 			| undefined;
// 		const threadColors = selectedOptions["thread_colors"] as
// 			| string[]
// 			| string
// 			| null;
// 		const threadColors3d = selectedOptions["thread_colors_3d"] as
// 			| string[]
// 			| string
// 			| null;
// 		const threadColorsFrontLarge = selectedOptions[
// 			"thread_colors_front_large"
// 		] as string[] | string | null;
// 		const threadColors3dFrontLarge = selectedOptions[
// 			"thread_colors_3d_front_large"
// 		] as string[] | string | null;
// 		const threadColorsBack = selectedOptions["thread_colors_back"] as
// 			| string[]
// 			| string
// 			| null;
// 		const threadColorsRight = selectedOptions["thread_colors_right"] as
// 			| string[]
// 			| string
// 			| null;
// 		const threadColorsLeft = selectedOptions["thread_colors_left"] as
// 			| string[]
// 			| string
// 			| null;
// 		const notes = selectedOptions["notes"] as string | null;

// 		// Step 9: Build color string by combining all selected thread colors
// 		const selectedColors = [
// 			threadColors,
// 			threadColors3d,
// 			threadColorsFrontLarge,
// 			threadColors3dFrontLarge,
// 			threadColorsBack,
// 			threadColorsRight,
// 			threadColorsLeft,
// 		];

// 		const color =
// 			selectedColors
// 				.filter((c): c is string | string[] => c !== null)
// 				.flatMap((c) => (Array.isArray(c) ? c : [c]))
// 				.join(", ") || "Default Color";

// 		// Step 10: Calculate total additional price based on selected options
// 		let totalAdditionalPrice = 0;

// 		// Function to parse additional price strings to float
// 		const parsePrice = (price: string | null): number => {
// 			if (!price) return 0;
// 			const parsed = parseFloat(price.replace(/[^0-9.-]+/g, ""));
// 			return isNaN(parsed) ? 0 : parsed;
// 		};

// 		// Iterate through selectedOptions to accumulate additional prices
// 		Object.entries(selectedOptions).forEach(([optionId, value]) => {
// 			const option = hatProduct.options?.find(
// 				(opt) => opt.id === optionId
// 			);
// 			if (option) {
// 				if (option.type === "radio" && typeof value === "string") {
// 					const additionalPrice = parsePrice(
// 						option.additional_price_breakdown[value]
// 					);
// 					totalAdditionalPrice += additionalPrice;
// 				} else if (
// 					option.type === "multi_select" &&
// 					Array.isArray(value)
// 				) {
// 					value.forEach((val) => {
// 						const additionalPrice = parsePrice(
// 							option.additional_price_breakdown[val]
// 						);
// 						totalAdditionalPrice += additionalPrice;
// 					});
// 				} else if (
// 					option.type === "text" &&
// 					typeof value === "string"
// 				) {
// 					const additionalPrice = parsePrice(option.additional_price);
// 					totalAdditionalPrice += additionalPrice;
// 				}
// 			}
// 		});

// 		// Step 11: Calculate final retail price
// 		const basePrice = 29.99;
// 		const finalRetailPrice = basePrice + totalAdditionalPrice;

// 		// Step 12: Create Stripe Product
// 		const stripeProduct = await stripe.products.create({
// 			name: `${hatProduct.title} - ${
// 				embroideryType ? embroideryType.toUpperCase() : "STANDARD"
// 			}`,
// 			description: hatProduct.description,
// 			images: [hatProduct.image],
// 		});

// 		// Step 13: Create Stripe Price
// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100), // Convert to cents
// 			currency: hatProduct.currency.toLowerCase(),
// 		});

// 		// Step 14: Generate dynamic name based on embroidery type and notes
// 		let variantName = hatProduct.title;
// 		if (embroideryType === "flat") {
// 			variantName += " - Flat Embroidery";
// 		} else if (embroideryType === "3d") {
// 			variantName += " - 3D Puff Embroidery";
// 		} else if (embroideryType === "both") {
// 			variantName += " - Partial 3D Puff Embroidery";
// 		}

// 		if (notes) {
// 			variantName += ` (${notes})`;
// 		}

// 		// Step 15: Create a new HatVariant in the database with selectedOptions
// 		const variant: HatVariant = await prisma.hatVariant.create({
// 			data: {
// 				id: uuidv4(),
// 				printfulFileId: printfulFileId,
// 				name: variantName,
// 				color: color,
// 				size: "M", // Assuming 'M' as default size. Adjust if needed.
// 				image: printfulUrl, // URL from Printful
// 				retailPrice: finalRetailPrice,
// 				currency: hatProduct.currency,
// 				stripePriceId: stripePrice.id,
// 				hatProductId: hatProduct.id,
// 				selectedOptions: selectedOptions, // Store selected options
// 				createdAt: new Date(),
// 				updatedAt: new Date(),
// 			},
// 		});

// 		// Step 16: Respond with the created variant, including selected options
// 		return NextResponse.json({ variant }, { status: 200 });
// 	} catch (error: unknown) {
// 		if (axios.isAxiosError(error)) {
// 			console.error("Axios error:", error.response?.data);
// 			return NextResponse.json(
// 				{
// 					error: "Failed to generate hat variant.",
// 					details: error.response?.data,
// 				},
// 				{ status: error.response?.status || 500 }
// 			);
// 		} else if (error instanceof Error) {
// 			console.error("General error:", error.message);
// 			return NextResponse.json(
// 				{ error: "Internal Server Error." },
// 				{ status: 500 }
// 			);
// 		} else {
// 			console.error("Unexpected error:", error);
// 			return NextResponse.json(
// 				{ error: "An unexpected error occurred." },
// 				{ status: 500 }
// 			);
// 		}
// 	}
// }

// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// import { PrismaClient, Prisma } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";

// const prisma = new PrismaClient();

// const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
// const NEXT_PUBLIC_BASE_URL =
// 	process.env.NEXT_PUBLIC_BASE_URL ||
// 	"${process.env.NEXT_PUBLIC_BASE_URL}";

// if (!PRINTFUL_API_KEY) {
// 	throw new Error("PRINTFUL_API_KEY is not defined in environment variables");
// }

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error(
// 		"STRIPE_SECRET_KEY is not defined in environment variables"
// 	);
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia",
// });

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// // Constants for available options
// const THREAD_COLORS = {
// 	"#FFFFFF": "1801 White",
// 	"#000000": "1800 Black",
// 	"#96A1A8": "1718 Grey",
// 	"#A67843": "1672 Old Gold",
// 	"#FFCC00": "1951 Gold",
// 	"#E25C27": "1987 Orange",
// 	"#CC3366": "1910 Flamingo",
// 	"#CC3333": "1839 Red",
// 	"#660000": "1784 Maroon",
// 	"#333366": "1966 Navy",
// 	"#005397": "1842 Royal",
// 	"#3399FF": "1695 Aqua/Teal",
// 	"#6B5294": "1832 Purple",
// 	"#01784E": "1751 Kelly Green",
// 	"#7BA35A": "1848 Kiwi Green",
// };

// const EMBROIDERY_POSITIONS = {
// 	front: { id: "embroidery_front", price: 2.95 },
// 	front_large: { id: "embroidery_front_large", price: 2.95 },
// 	back: { id: "embroidery_back", price: 2.95 },
// 	right: { id: "embroidery_right", price: 2.95 },
// 	left: { id: "embroidery_left", price: 2.95 },
// };

// const EMBROIDERY_TYPES = {
// 	flat: { title: "Flat Embroidery", price: 0.0 },
// 	"3d": { title: "3D Puff", price: 1.5 },
// 	both: { title: "Partial 3D Puff", price: 1.5 },
// };

// interface Option {
// 	id: string;
// 	title: string;
// 	type: "radio" | "multi_select" | "text";
// 	values: Record<string, string> | null;
// 	additional_price: string | null;
// 	additional_price_breakdown: Record<string, string>;
// }

// interface Technique {
// 	key: string;
// 	display_name: string;
// 	is_default: boolean;
// }

// interface FileOption {
// 	id: string;
// 	type: "bool";
// 	title: string;
// 	additional_price: number;
// }

// interface File {
// 	id: string;
// 	type:
// 		| "embroidery_front_large"
// 		| "embroidery_front"
// 		| "embroidery_back"
// 		| "embroidery_right"
// 		| "embroidery_left"
// 		| "mockup";
// 	title: string;
// 	additional_price: string | null;
// 	options: FileOption[];
// }

// interface HatProduct {
// 	id: string;
// 	printfulId: number;
// 	mainCategoryId: number;
// 	type: string;
// 	description: string;
// 	title: string;
// 	brand: string;
// 	model: string;
// 	image: string;
// 	variantCount: number;
// 	currency: string;
// 	options: Option[] | null;
// 	techniques: Technique[] | null;
// 	files: File[] | null;
// 	origin_country: string | null;
// }

// interface VariantData extends Prisma.HatVariantCreateInput {
// 	selectedOptions: Record<string, string | string[] | null>;
// }

// async function uploadToImage(pngBase64: string): Promise<string> {
// 	const uploadResponse = await axios.post(
// 		`${NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 		{
// 			pngBase64,
// 			filename: `hat_variant_${uuidv4()}.png`,
// 		},
// 		{
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		}
// 	);

// 	return uploadResponse.data.url;
// }

// async function uploadToPrintful(
// 	imageUrl: string
// ): Promise<{ id: number; url: string }> {
// 	const printfulPayload = {
// 		role: "printfile",
// 		url: imageUrl,
// 		filename: `hat_variant_${uuidv4()}.png`,
// 		visible: true,
// 	};

// 	const printfulResponse = await axios.post(
// 		"https://api.printful.com/v2/files",
// 		printfulPayload,
// 		{
// 			headers: {
// 				"Content-Type": "application/json",
// 				Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// 			},
// 		}
// 	);

// 	if (!printfulResponse.data?.result) {
// 		throw new Error("Invalid response from Printful API");
// 	}

// 	// Wait for file to be processed
// 	let fileStatus = printfulResponse.data.result.status;
// 	let retries = 0;
// 	const maxRetries = 5;

// 	while (fileStatus !== "ok" && retries < maxRetries) {
// 		await new Promise((resolve) => setTimeout(resolve, 2000));

// 		const statusResponse = await axios.get(
// 			`https://api.printful.com/v2/files/${printfulResponse.data.result.id}`,
// 			{
// 				headers: {
// 					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// 				},
// 			}
// 		);

// 		fileStatus = statusResponse.data?.result?.status;
// 		if (fileStatus === "failed") {
// 			throw new Error("File processing failed");
// 		}

// 		retries++;
// 	}

// 	return {
// 		id: printfulResponse.data.result.id,
// 		url: printfulResponse.data.result.url,
// 	};
// }

// function randomizeThreadColors(): string[] {
// 	const colorKeys = Object.keys(THREAD_COLORS);
// 	const numberOfColors = Math.floor(Math.random() * 3) + 1; // 1-3 colors
// 	return colorKeys.sort(() => Math.random() - 0.5).slice(0, numberOfColors);
// }

// function selectRandomEmbroideryType(): string {
// 	const types = Object.keys(EMBROIDERY_TYPES);
// 	return types[Math.floor(Math.random() * types.length)];
// }

// function getRandomEmbroideryPositions(): string[] {
// 	const positions = Object.keys(EMBROIDERY_POSITIONS);
// 	const numberOfPositions =
// 		Math.floor(Math.random() * (positions.length - 1)) + 1;
// 	return positions
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfPositions);
// }

// function generateOptions(): Record<string, string | string[] | null> {
// 	const selectedOptions: Record<string, string | string[] | null> = {};

// 	// Select embroidery type
// 	const embroideryType = selectRandomEmbroideryType();
// 	selectedOptions["embroidery_type"] = embroideryType;

// 	// Select thread colors based on embroidery type
// 	if (embroideryType === "flat" || embroideryType === "both") {
// 		selectedOptions["thread_colors"] = randomizeThreadColors();
// 	}
// 	if (embroideryType === "3d" || embroideryType === "both") {
// 		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
// 	}

// 	// Randomly select positions and assign colors
// 	const selectedPositions = getRandomEmbroideryPositions();
// 	selectedPositions.forEach((position) => {
// 		const optionKey =
// 			position === "front_large"
// 				? embroideryType === "3d"
// 					? "thread_colors_3d_front_large"
// 					: "thread_colors_front_large"
// 				: `thread_colors_${position}`;

// 		selectedOptions[optionKey] = randomizeThreadColors();
// 	});

// 	// Add notes
// 	selectedOptions["notes"] = "Custom embroidered design";

// 	return selectedOptions;
// }

// function calculateTotalPrice(
// 	selectedOptions: Record<string, string | string[] | null>
// ): number {
// 	let totalPrice = 29.99; // Base price

// 	// Add embroidery type price
// 	const embroideryType = selectedOptions["embroidery_type"] as string;
// 	totalPrice +=
// 		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;

// 	// Add position prices
// 	Object.keys(selectedOptions).forEach((key) => {
// 		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
// 			const position = key
// 				.replace("thread_colors_", "")
// 				.replace("_3d", "");
// 			if (
// 				EMBROIDERY_POSITIONS[
// 					position as keyof typeof EMBROIDERY_POSITIONS
// 				]
// 			) {
// 				totalPrice +=
// 					EMBROIDERY_POSITIONS[
// 						position as keyof typeof EMBROIDERY_POSITIONS
// 					].price;
// 			}
// 		}
// 	});

// 	// Double the price for retail
// 	return totalPrice * 2;
// }

// function generateVariantName(
// 	baseTitle: string,
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	let name = baseTitle;

// 	// Add embroidery type
// 	const embroideryType = selectedOptions[
// 		"embroidery_type"
// 	] as keyof typeof EMBROIDERY_TYPES;
// 	name += ` - ${EMBROIDERY_TYPES[embroideryType].title}`;

// 	// Add positions if any
// 	const positions: string[] = [];
// 	if (selectedOptions["thread_colors_back"]) positions.push("Back");
// 	if (selectedOptions["thread_colors_right"]) positions.push("Right");
// 	if (selectedOptions["thread_colors_left"]) positions.push("Left");
// 	if (
// 		selectedOptions["thread_colors_front_large"] ||
// 		selectedOptions["thread_colors_3d_front_large"]
// 	) {
// 		positions.push("Large Front");
// 	}

// 	if (positions.length > 0) {
// 		name += ` with ${positions.join(", ")} Embroidery`;
// 	}

// 	// Add notes if present
// 	const notes = selectedOptions["notes"];
// 	if (notes && typeof notes === "string") {
// 		name += ` (${notes})`;
// 	}

// 	return name;
// }

// function getSelectedColorNames(
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	const colorSet = new Set<string>();

// 	Object.entries(selectedOptions)
// 		.filter(([key]) => key.includes("thread_colors"))
// 		.forEach(([_, colors]) => {
// 			if (Array.isArray(colors)) {
// 				colors.forEach((color) => {
// 					const colorName =
// 						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
// 					if (colorName) colorSet.add(colorName);
// 				});
// 			}
// 		});

// 	return Array.from(colorSet).join(", ") || "Default Colors";
// }

// export async function POST(req: NextRequest) {
// 	try {
// 		const { resultId, pngBase64 } = await req.json();

// 		if (!resultId || !pngBase64) {
// 			return NextResponse.json(
// 				{ error: "Missing required parameters" },
// 				{ status: 400 }
// 			);
// 		}

// 		// Step 1: Upload the image
// 		console.log("Uploading image...");
// 		const imageUrl = await uploadToImage(pngBase64);
// 		console.log("Image uploaded successfully");

// 		// Step 2: Upload to Printful and wait for processing
// 		console.log("Uploading to Printful...");
// 		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
// 			imageUrl
// 		);
// 		console.log("Printful upload complete");

// 		// Step 3: Fetch the HatProduct
// 		const hatProductRaw = await prisma.hatProduct.findUnique({
// 			where: { id: resultId },
// 			include: {
// 				options: true,
// 				techniques: true,
// 				files: {
// 					include: {
// 						options: true,
// 					},
// 				},
// 			},
// 		});

// 		if (!hatProductRaw) {
// 			return NextResponse.json(
// 				{ error: "HatProduct not found" },
// 				{ status: 404 }
// 			);
// 		}

// 		const hatProduct: HatProduct = {
// 			...hatProductRaw,
// 			options: hatProductRaw.options as Option[] | null,
// 			techniques: hatProductRaw.techniques as Technique[] | null,
// 			files: hatProductRaw.files as File[] | null,
// 			origin_country: hatProductRaw.origin_country,
// 		};

// 		// Step 4: Generate random options
// 		const selectedOptions = generateOptions();

// 		// Step 5: Calculate price and generate names
// 		const finalRetailPrice = calculateTotalPrice(selectedOptions);
// 		const variantName = generateVariantName(
// 			hatProduct.title,
// 			selectedOptions
// 		);
// 		const selectedColors = getSelectedColorNames(selectedOptions);

// 		// Step 6: Create Stripe product and price
// 		const stripeProduct = await stripe.products.create({
// 			name: variantName,
// 			description: hatProduct.description || undefined,
// 			images: [printfulUrl],
// 		});

// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100),
// 			currency: hatProduct.currency.toLowerCase(),
// 		});

// 		// Step 7: Create variant
// 		const variantData: VariantData = {
// 			id: uuidv4(),
// 			printfulFileId,
// 			name: variantName,
// 			color: selectedColors,
// 			size: "M",
// 			image: printfulUrl,
// 			retailPrice: finalRetailPrice,
// 			currency: hatProduct.currency,
// 			stripePriceId: stripePrice.id,
// 			hatProduct: {
// 				connect: {
// 					id: hatProduct.id,
// 				},
// 			},
// 			selectedOptions,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		};

// 		const variant = await prisma.hatVariant.create({
// 			data: variantData,
// 		});

// 		return NextResponse.json({ variant }, { status: 200 });
// 	} catch (error: unknown) {
// 		if (axios.isAxiosError(error)) {
// 			console.error("Axios error:", error.response?.data);
// 			return NextResponse.json(
// 				{
// 					error: "Failed to generate hat variant.",
// 					details: error.response?.data,
// 				},
// 				{ status: error.response?.status || 500 }
// 			);
// 		} else if (error instanceof Error) {
// 			console.error("General error:", error.message);
// 			return NextResponse.json(
// 				{ error: "Internal Server Error." },
// 				{ status: 500 }
// 			);
// 		} else {
// 			console.error("Unexpected error:", error);
// 			return NextResponse.json(
// 				{ error: "An unexpected error occurred." },
// 				{ status: 500 }
// 			);
// 		}
// 	} finally {
// 		try {
// 			await prisma.$disconnect();
// 		} catch (disconnectError) {
// 			console.error("Error disconnecting from Prisma:", disconnectError);
// 		}
// 	}
// }

// //-------------------------------

// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";

// const prisma = new PrismaClient();

// const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// if (!PRINTFUL_API_KEY) {
// 	throw new Error("PRINTFUL_API_KEY is not defined in environment variables");
// }

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error(
// 		"STRIPE_SECRET_KEY is not defined in environment variables"
// 	);
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia",
// });

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// // Constants for available options
// const THREAD_COLORS = {
// 	"#FFFFFF": "1801 White",
// 	"#000000": "1800 Black",
// 	"#96A1A8": "1718 Grey",
// 	"#A67843": "1672 Old Gold",
// 	"#FFCC00": "1951 Gold",
// 	"#E25C27": "1987 Orange",
// 	"#CC3366": "1910 Flamingo",
// 	"#CC3333": "1839 Red",
// 	"#660000": "1784 Maroon",
// 	"#333366": "1966 Navy",
// 	"#005397": "1842 Royal",
// 	"#3399FF": "1695 Aqua/Teal",
// 	"#6B5294": "1832 Purple",
// 	"#01784E": "1751 Kelly Green",
// 	"#7BA35A": "1848 Kiwi Green",
// };

// const EMBROIDERY_POSITIONS = {
// 	front: { id: "embroidery_front", price: 2.95 },
// 	front_large: { id: "embroidery_front_large", price: 2.95 },
// 	back: { id: "embroidery_back", price: 2.95 },
// 	right: { id: "embroidery_right", price: 2.95 },
// 	left: { id: "embroidery_left", price: 2.95 },
// };

// const EMBROIDERY_TYPES = {
// 	flat: { title: "Flat Embroidery", price: 0.0 },
// 	"3d": { title: "3D Puff", price: 1.5 },
// 	both: { title: "Partial 3D Puff", price: 1.5 },
// };

// interface VariantData {
// 	id: string;
// 	printfulFileId: number;
// 	name: string;
// 	color: string;
// 	size: string;
// 	image: string;
// 	retailPrice: number;
// 	currency: string;
// 	stripePriceId: string;
// 	hatProduct: { connect: { id: string } };
// 	selectedOptions: Record<string, string | string[] | null>;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// function randomizeThreadColors(): string[] {
// 	const colorKeys = Object.keys(THREAD_COLORS);
// 	const numberOfColors = Math.floor(Math.random() * 3) + 1; // 1-3 colors
// 	return colorKeys.sort(() => Math.random() - 0.5).slice(0, numberOfColors);
// }

// function selectRandomEmbroideryType(): string {
// 	const types = Object.keys(EMBROIDERY_TYPES);
// 	return types[Math.floor(Math.random() * types.length)];
// }

// function getRandomEmbroideryPositions(): string[] {
// 	const positions = Object.keys(EMBROIDERY_POSITIONS);
// 	const numberOfPositions =
// 		Math.floor(Math.random() * (positions.length - 1)) + 1;
// 	return positions
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfPositions);
// }

// function generateOptions(): Record<string, string | string[] | null> {
// 	const selectedOptions: Record<string, string | string[] | null> = {};

// 	// Select embroidery type
// 	const embroideryType = selectRandomEmbroideryType();
// 	selectedOptions["embroidery_type"] = embroideryType;

// 	// Select thread colors based on embroidery type
// 	if (embroideryType === "flat" || embroideryType === "both") {
// 		selectedOptions["thread_colors"] = randomizeThreadColors();
// 	}
// 	if (embroideryType === "3d" || embroideryType === "both") {
// 		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
// 	}

// 	// Randomly select positions and assign colors
// 	const selectedPositions = getRandomEmbroideryPositions();
// 	selectedPositions.forEach((position) => {
// 		const optionKey =
// 			position === "front_large"
// 				? embroideryType === "3d"
// 					? "thread_colors_3d_front_large"
// 					: "thread_colors_front_large"
// 				: `thread_colors_${position}`;

// 		selectedOptions[optionKey] = randomizeThreadColors();
// 	});

// 	// Add notes
// 	selectedOptions["notes"] = "Custom embroidered design";

// 	return selectedOptions;
// }

// function calculateTotalPrice(
// 	selectedOptions: Record<string, string | string[] | null>
// ): number {
// 	let totalPrice = 29.99; // Base price

// 	// Add embroidery type price
// 	const embroideryType = selectedOptions["embroidery_type"] as string;
// 	totalPrice +=
// 		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;

// 	// Add position prices
// 	Object.keys(selectedOptions).forEach((key) => {
// 		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
// 			const position = key
// 				.replace("thread_colors_", "")
// 				.replace("_3d", "");
// 			if (
// 				EMBROIDERY_POSITIONS[
// 					position as keyof typeof EMBROIDERY_POSITIONS
// 				]
// 			) {
// 				totalPrice +=
// 					EMBROIDERY_POSITIONS[
// 						position as keyof typeof EMBROIDERY_POSITIONS
// 					].price;
// 			}
// 		}
// 	});

// 	// Double the price for retail
// 	return totalPrice * 2;
// }

// function generateVariantName(
// 	baseTitle: string,
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	let name = baseTitle;

// 	// Add embroidery type
// 	const embroideryType = selectedOptions[
// 		"embroidery_type"
// 	] as keyof typeof EMBROIDERY_TYPES;
// 	name += ` - ${EMBROIDERY_TYPES[embroideryType].title}`;

// 	// Add positions if any
// 	const positions: string[] = [];
// 	if (selectedOptions["thread_colors_back"]) positions.push("Back");
// 	if (selectedOptions["thread_colors_right"]) positions.push("Right");
// 	if (selectedOptions["thread_colors_left"]) positions.push("Left");
// 	if (
// 		selectedOptions["thread_colors_front_large"] ||
// 		selectedOptions["thread_colors_3d_front_large"]
// 	) {
// 		positions.push("Large Front");
// 	}

// 	if (positions.length > 0) {
// 		name += ` with ${positions.join(", ")} Embroidery`;
// 	}

// 	// Add notes if present
// 	const notes = selectedOptions["notes"];
// 	if (notes && typeof notes === "string") {
// 		name += ` (${notes})`;
// 	}

// 	return name;
// }

// function getSelectedColorNames(
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	const colorSet = new Set<string>();

// 	Object.entries(selectedOptions)
// 		.filter(([key]) => key.includes("thread_colors"))
// 		.forEach(([_, colors]) => {
// 			if (Array.isArray(colors)) {
// 				colors.forEach((color) => {
// 					const colorName =
// 						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
// 					if (colorName) colorSet.add(colorName);
// 				});
// 			}
// 		});

// 	return Array.from(colorSet).join(", ") || "Default Colors";
// }

// async function checkFileStatus(fileId: number) {
// 	const statusUrl = `https://api.printful.com/v2/files/${fileId}`;
// 	let attempts = 0;
// 	const maxRetries = 30;
// 	const delayBetweenRetries = 10000; // 5 seconds

// 	while (attempts < maxRetries) {
// 		try {
// 			const response = await axios.get(statusUrl, {
// 				headers: {
// 					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// 				},
// 			});

// 			const status = response.data.data.status;

// 			// Log for tracking each status check
// 			console.log(`Status Check Attempt ${attempts + 1}: ${status}`);

// 			if (status === "ok") {
// 				console.log("File processing completed successfully.");
// 				return response.data.data; // Return the correct data when processed
// 			} else if (status === "waiting") {
// 				console.log("File is still processing. Waiting...");
// 				await new Promise((resolve) =>
// 					setTimeout(resolve, delayBetweenRetries)
// 				);
// 				attempts++;
// 			} else {
// 				console.error("File processing failed:", response.data);
// 				throw new Error("File processing failed");
// 			}
// 		} catch (error) {
// 			console.error("Error checking file status:", error);
// 			throw error;
// 		}
// 	}

// 	throw new Error(
// 		"File processing did not complete within the expected time."
// 	);
// }

// async function uploadToImage(pngBase64: string): Promise<string> {
// 	try {
// 		console.log("Initiating image upload...");
// 		const uploadResponse = await axios.post(
// 			`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 			{
// 				pngBase64,
// 				filename: `hat_variant_${uuidv4()}.png`,
// 			},
// 			{
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			}
// 		);
// 		console.log("Image uploaded successfully:", uploadResponse.data.url);
// 		return uploadResponse.data.url;
// 	} catch (error) {
// 		console.error("Error uploading image:", error);
// 		throw new Error("Failed to upload image.");
// 	}
// }

// async function uploadToPrintful(
// 	imageUrl: string
// ): Promise<{ id: number; url: string }> {
// 	try {
// 		console.log("Initiating upload to Printful...");
// 		const printfulPayload = {
// 			role: "printfile",
// 			url: imageUrl,
// 			filename: `hat_variant_${uuidv4()}.png`,
// 			visible: true,
// 		};

// 		const printfulResponse = await axios.post(
// 			"https://api.printful.com/v2/files",
// 			printfulPayload,
// 			{
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// 				},
// 			}
// 		);

// 		// Log the response to debug
// 		console.log(
// 			"Printful response:",
// 			JSON.stringify(printfulResponse.data, null, 2)
// 		);

// 		const fileId = printfulResponse.data.data.id;
// 		if (!fileId) {
// 			console.error(
// 				"Invalid response from Printful:",
// 				printfulResponse.data
// 			);
// 			throw new Error("Invalid response from Printful API");
// 		}

// 		// Poll for status until the file is ready
// 		const fileResult = await checkFileStatus(fileId);

// 		console.log("Printful file processed successfully.");
// 		return {
// 			id: fileResult.id,
// 			url: fileResult.url,
// 		};
// 	} catch (error) {
// 		console.error("Error uploading to Printful:", error);
// 		throw new Error("Failed to upload to Printful.");
// 	}
// }

// export async function POST(req: NextRequest) {
// 	try {
// 		console.log("POST request initiated.");
// 		const { resultId, pngBase64 } = await req.json();

// 		if (!resultId || !pngBase64) {
// 			console.error("Missing required parameters.");
// 			return NextResponse.json(
// 				{ error: "Missing required parameters" },
// 				{ status: 400 }
// 			);
// 		}

// 		console.log(`Processing HatProduct ID: ${resultId}`);

// 		const imageUrl = await uploadToImage(pngBase64);

// 		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
// 			imageUrl
// 		);

// 		const hatProductRaw = await prisma.hatProduct.findUnique({
// 			where: { id: resultId },
// 			include: {
// 				options: true,
// 				techniques: true,
// 				files: {
// 					include: {
// 						options: true,
// 					},
// 				},
// 			},
// 		});

// 		if (!hatProductRaw) {
// 			console.error("HatProduct not found:", resultId);
// 			return NextResponse.json(
// 				{ error: "HatProduct not found" },
// 				{ status: 404 }
// 			);
// 		}

// 		console.log("Generating options for variant...");
// 		const selectedOptions = generateOptions();

// 		console.log("Calculating total price...");
// 		const finalRetailPrice = calculateTotalPrice(selectedOptions);

// 		console.log("Generating variant name...");
// 		const variantName = generateVariantName(
// 			hatProductRaw.title,
// 			selectedOptions
// 		);

// 		console.log("Creating Stripe product...");
// 		const stripeProduct = await stripe.products.create({
// 			name: variantName,
// 			description: hatProductRaw.description || undefined,
// 			images: [printfulUrl],
// 		});

// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100),
// 			currency: hatProductRaw.currency.toLowerCase(),
// 		});

// 		const variantData: VariantData = {
// 			id: uuidv4(),
// 			printfulFileId,
// 			name: variantName,
// 			color: getSelectedColorNames(selectedOptions),
// 			size: "M",
// 			image: printfulUrl,
// 			retailPrice: finalRetailPrice,
// 			currency: hatProductRaw.currency,
// 			stripePriceId: stripePrice.id,
// 			hatProduct: {
// 				connect: {
// 					id: hatProductRaw.id,
// 				},
// 			},
// 			selectedOptions,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		};

// 		console.log("Saving new variant to database...");
// 		const variant = await prisma.hatVariant.create({ data: variantData });

// 		console.log("Variant successfully created:", variant.id);
// 		return NextResponse.json({ variant }, { status: 200 });
// 	} catch (error: unknown) {
// 		if (axios.isAxiosError(error)) {
// 			console.error("Axios error:", error.response?.data);
// 			return NextResponse.json(
// 				{
// 					error: "Failed to generate hat variant.",
// 					details: error.response?.data,
// 				},
// 				{ status: error.response?.status || 500 }
// 			);
// 		} else if (error instanceof Error) {
// 			console.error("General error:", error.message);
// 			return NextResponse.json(
// 				{ error: "Internal Server Error." },
// 				{ status: 500 }
// 			);
// 		} else {
// 			console.error("Unexpected error:", error);
// 			return NextResponse.json(
// 				{ error: "An unexpected error occurred." },
// 				{ status: 500 }
// 			);
// 		}
// 	} finally {
// 		try {
// 			console.log("Disconnecting Prisma client...");
// 			await prisma.$disconnect();
// 		} catch (disconnectError) {
// 			console.error("Error disconnecting from Prisma:", disconnectError);
// 		}
// 	}
// }

// api token
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";
// // import sharp from "sharp";

// const prisma = new PrismaClient();

// const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// if (!PRINTFUL_API_KEY) {
// 	throw new Error("PRINTFUL_API_KEY is not defined in environment variables");
// }

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error(
// 		"STRIPE_SECRET_KEY is not defined in environment variables"
// 	);
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia",
// });

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// // Constants for available options
// const THREAD_COLORS = {
// 	"#FFFFFF": "1801 White",
// 	"#000000": "1800 Black",
// 	"#96A1A8": "1718 Grey",
// 	"#A67843": "1672 Old Gold",
// 	"#FFCC00": "1951 Gold",
// 	"#E25C27": "1987 Orange",
// 	"#CC3366": "1910 Flamingo",
// 	"#CC3333": "1839 Red",
// 	"#660000": "1784 Maroon",
// 	"#333366": "1966 Navy",
// 	"#005397": "1842 Royal",
// 	"#3399FF": "1695 Aqua/Teal",
// 	"#6B5294": "1832 Purple",
// 	"#01784E": "1751 Kelly Green",
// 	"#7BA35A": "1848 Kiwi Green",
// };

// const EMBROIDERY_POSITIONS = {
// 	front: { id: "embroidery_front", price: 2.95 },
// 	front_large: { id: "embroidery_front_large", price: 2.95 },
// 	back: { id: "embroidery_back", price: 2.95 },
// 	right: { id: "embroidery_right", price: 2.95 },
// 	left: { id: "embroidery_left", price: 2.95 },
// };

// const EMBROIDERY_TYPES = {
// 	flat: { title: "Flat Embroidery", price: 0.0 },
// 	"3d": { title: "3D Puff", price: 1.5 },
// 	both: { title: "Partial 3D Puff", price: 1.5 },
// };

// interface VariantData {
// 	id: string;
// 	printfulFileId: number;
// 	name: string;
// 	color: string;
// 	size: string;
// 	image: string;
// 	retailPrice: number;
// 	currency: string;
// 	stripePriceId: string;
// 	hatProduct: { connect: { id: string } };
// 	selectedOptions: Record<string, string | string[] | null>;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// function randomizeThreadColors(): string[] {
// 	const colorKeys = Object.keys(THREAD_COLORS);
// 	const numberOfColors = Math.floor(Math.random() * 3) + 1; // 1-3 colors
// 	return colorKeys.sort(() => Math.random() - 0.5).slice(0, numberOfColors);
// }

// function selectRandomEmbroideryType(): string {
// 	const types = Object.keys(EMBROIDERY_TYPES);
// 	return types[Math.floor(Math.random() * types.length)];
// }

// function getRandomEmbroideryPositions(): string[] {
// 	const positions = Object.keys(EMBROIDERY_POSITIONS);
// 	const numberOfPositions =
// 		Math.floor(Math.random() * (positions.length - 1)) + 1;
// 	return positions
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfPositions);
// }

// function generateOptions(): Record<string, string | string[] | null> {
// 	const selectedOptions: Record<string, string | string[] | null> = {};

// 	// Select embroidery type
// 	const embroideryType = selectRandomEmbroideryType();
// 	selectedOptions["embroidery_type"] = embroideryType;

// 	// Select thread colors based on embroidery type
// 	if (embroideryType === "flat" || embroideryType === "both") {
// 		selectedOptions["thread_colors"] = randomizeThreadColors();
// 	}
// 	if (embroideryType === "3d" || embroideryType === "both") {
// 		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
// 	}

// 	// Randomly select positions and assign colors
// 	const selectedPositions = getRandomEmbroideryPositions();
// 	selectedPositions.forEach((position) => {
// 		const optionKey =
// 			position === "front_large"
// 				? embroideryType === "3d"
// 					? "thread_colors_3d_front_large"
// 					: "thread_colors_front_large"
// 				: `thread_colors_${position}`;

// 		selectedOptions[optionKey] = randomizeThreadColors();
// 	});

// 	// Add notes
// 	selectedOptions["notes"] = "Custom embroidered design";

// 	return selectedOptions;
// }

// function calculateTotalPrice(
// 	selectedOptions: Record<string, string | string[] | null>
// ): number {
// 	let totalPrice = 29.99; // Base price

// 	// Add embroidery type price
// 	const embroideryType = selectedOptions["embroidery_type"] as string;
// 	totalPrice +=
// 		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;

// 	// Add position prices
// 	Object.keys(selectedOptions).forEach((key) => {
// 		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
// 			const position = key
// 				.replace("thread_colors_", "")
// 				.replace("_3d", "");
// 			if (
// 				EMBROIDERY_POSITIONS[
// 					position as keyof typeof EMBROIDERY_POSITIONS
// 				]
// 			) {
// 				totalPrice +=
// 					EMBROIDERY_POSITIONS[
// 						position as keyof typeof EMBROIDERY_POSITIONS
// 					].price;
// 			}
// 		}
// 	});

// 	// Double the price for retail
// 	return totalPrice * 2;
// }

// function generateVariantName(
// 	baseTitle: string,
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	let name = baseTitle;

// 	// Add embroidery type
// 	const embroideryType = selectedOptions[
// 		"embroidery_type"
// 	] as keyof typeof EMBROIDERY_TYPES;
// 	name += ` - ${EMBROIDERY_TYPES[embroideryType].title}`;

// 	// Add positions if any
// 	const positions: string[] = [];
// 	if (selectedOptions["thread_colors_back"]) positions.push("Back");
// 	if (selectedOptions["thread_colors_right"]) positions.push("Right");
// 	if (selectedOptions["thread_colors_left"]) positions.push("Left");
// 	if (
// 		selectedOptions["thread_colors_front_large"] ||
// 		selectedOptions["thread_colors_3d_front_large"]
// 	) {
// 		positions.push("Large Front");
// 	}

// 	if (positions.length > 0) {
// 		name += ` with ${positions.join(", ")} Embroidery`;
// 	}

// 	// Add notes if present
// 	const notes = selectedOptions["notes"];
// 	if (notes && typeof notes === "string") {
// 		name += ` (${notes})`;
// 	}

// 	return name;
// }

// function getSelectedColorNames(
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	const colorSet = new Set<string>();

// 	Object.entries(selectedOptions)
// 		.filter(([key]) => key.includes("thread_colors"))
// 		.forEach(([_, colors]) => {
// 			if (Array.isArray(colors)) {
// 				colors.forEach((color) => {
// 					const colorName =
// 						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
// 					if (colorName) colorSet.add(colorName);
// 				});
// 			}
// 		});

// 	return Array.from(colorSet).join(", ") || "Default Colors";
// }

// async function processAndUploadImage(pngBase64: string): Promise<string> {
// 	try {
// 		// console.log("Processing and resizing image...");
// 		// const buffer = Buffer.from(pngBase64, "base64");
// 		// const metadata = await sharp(buffer).metadata();

// 		// console.log("PNG Metadata:", metadata);

// 		// Resize and convert to RGB
// 		// const resizedImageBuffer = await sharp(buffer)
// 		// 	.resize({ width: 3000, height: 3000, fit: "inside" })
// 		// 	.removeAlpha()
// 		// 	.toFormat("png")
// 		// 	.toBuffer();

// 		// const resizedImageBase64 = resizedImageBuffer.toString("base64");

// 		console.log("Initiating image upload...");
// 		const uploadResponse = await axios.post(
// 			`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 			{
// 				// pngBase64: resizedImageBase64,
// 				pngBase64,

// 				filename: `hat_variant_${uuidv4()}.png`,
// 			},
// 			{
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			}
// 		);

// 		console.log("Image uploaded successfully:", uploadResponse.data.url);
// 		return uploadResponse.data.url;
// 	} catch (error) {
// 		console.error("Error processing and uploading image:", error);
// 		throw new Error("Failed to process and upload image.");
// 	}
// }

// async function checkFileStatus(fileId: number) {
// 	const statusUrl = `https://api.printful.com/v2/files/${fileId}`;
// 	let attempts = 0;
// 	const maxRetries = 30;
// 	const delayBetweenRetries = 10000; // 10 seconds

// 	while (attempts < maxRetries) {
// 		try {
// 			const response = await axios.get(statusUrl, {
// 				headers: {
// 					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// 				},
// 			});

// 			const status = response.data.data.status;

// 			// Log for tracking each status check
// 			console.log(`Status Check Attempt ${attempts + 1}: ${status}`);

// 			if (status === "ok") {
// 				console.log("File processing completed successfully.");
// 				return response.data.data; // Return the correct data when processed
// 			} else if (status === "waiting") {
// 				console.log("File is still processing. Waiting...");
// 				await new Promise((resolve) =>
// 					setTimeout(resolve, delayBetweenRetries)
// 				);
// 				attempts++;
// 			} else {
// 				console.error("File processing failed:", response.data);
// 				throw new Error("File processing failed");
// 			}
// 		} catch (error) {
// 			console.error("Error checking file status:", error);
// 			throw error;
// 		}
// 	}

// 	throw new Error(
// 		"File processing did not complete within the expected time."
// 	);
// }

// async function uploadToPrintful(
// 	imageUrl: string
// ): Promise<{ id: number; url: string }> {
// 	try {
// 		console.log("Initiating upload to Printful...");
// 		const printfulPayload = {
// 			role: "printfile",
// 			url: imageUrl,
// 			filename: `hat_variant_${uuidv4()}.png`,
// 			visible: true,
// 		};

// 		const printfulResponse = await axios.post(
// 			"https://api.printful.com/v2/files",
// 			printfulPayload,
// 			{
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// 				},
// 			}
// 		);

// 		// Log the response to debug
// 		console.log(
// 			"Printful response:",
// 			JSON.stringify(printfulResponse.data, null, 2)
// 		);

// 		const fileId = printfulResponse.data.data.id;
// 		if (!fileId) {
// 			console.error(
// 				"Invalid response from Printful:",
// 				printfulResponse.data
// 			);
// 			throw new Error("Invalid response from Printful API");
// 		}

// 		// Poll for status until the file is ready
// 		const fileResult = await checkFileStatus(fileId);

// 		console.log("Printful file processed successfully.");
// 		return {
// 			id: fileResult.id,
// 			url: fileResult.url,
// 		};
// 	} catch (error) {
// 		console.error("Error uploading to Printful:", error);
// 		throw new Error("Failed to upload to Printful.");
// 	}
// }

// export async function POST(req: NextRequest) {
// 	try {
// 		console.log("POST request initiated.");
// 		const { resultId, pngBase64 } = await req.json();

// 		if (!resultId || !pngBase64) {
// 			console.error("Missing required parameters.");
// 			return NextResponse.json(
// 				{ error: "Missing required parameters" },
// 				{ status: 400 }
// 			);
// 		}

// 		console.log(`Processing HatProduct ID: ${resultId}`);

// 		const imageUrl = await processAndUploadImage(pngBase64);

// 		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
// 			imageUrl
// 		);

// 		const hatProductRaw = await prisma.hatProduct.findUnique({
// 			where: { id: resultId },
// 			include: {
// 				options: true,
// 				techniques: true,
// 				files: {
// 					include: {
// 						options: true,
// 					},
// 				},
// 			},
// 		});

// 		if (!hatProductRaw) {
// 			console.error("HatProduct not found:", resultId);
// 			return NextResponse.json(
// 				{ error: "HatProduct not found" },
// 				{ status: 404 }
// 			);
// 		}

// 		console.log("Generating options for variant...");
// 		const selectedOptions = generateOptions();

// 		console.log("Calculating total price...");
// 		const finalRetailPrice = calculateTotalPrice(selectedOptions);

// 		console.log("Generating variant name...");
// 		const variantName = generateVariantName(
// 			hatProductRaw.title,
// 			selectedOptions
// 		);

// 		console.log("Creating Stripe product...");
// 		const stripeProduct = await stripe.products.create({
// 			name: variantName,
// 			description: hatProductRaw.description || undefined,
// 			images: [printfulUrl],
// 		});

// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100),
// 			currency: hatProductRaw.currency.toLowerCase(),
// 		});

// 		const variantData: VariantData = {
// 			id: uuidv4(),
// 			printfulFileId,
// 			name: variantName,
// 			color: getSelectedColorNames(selectedOptions),
// 			size: "M",
// 			image: printfulUrl,
// 			retailPrice: finalRetailPrice,
// 			currency: hatProductRaw.currency,
// 			stripePriceId: stripePrice.id,
// 			hatProduct: {
// 				connect: {
// 					id: hatProductRaw.id,
// 				},
// 			},
// 			selectedOptions,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		};

// 		console.log("Saving new variant to database...");
// 		const variant = await prisma.hatVariant.create({ data: variantData });

// 		console.log("Variant successfully created:", variant.id);
// 		return NextResponse.json({ variant }, { status: 200 });
// 	} catch (error: unknown) {
// 		if (axios.isAxiosError(error)) {
// 			console.error("Axios error:", error.response?.data);
// 			return NextResponse.json(
// 				{
// 					error: "Failed to generate hat variant.",
// 					details: error.response?.data,
// 				},
// 				{ status: error.response?.status || 500 }
// 			);
// 		} else if (error instanceof Error) {
// 			console.error("General error:", error.message);
// 			return NextResponse.json(
// 				{ error: "Internal Server Error." },
// 				{ status: 500 }
// 			);
// 		} else {
// 			console.error("Unexpected error:", error);
// 			return NextResponse.json(
// 				{ error: "An unexpected error occurred." },
// 				{ status: 500 }
// 			);
// 		}
// 	} finally {
// 		try {
// 			console.log("Disconnecting Prisma client...");
// 			await prisma.$disconnect();
// 		} catch (disconnectError) {
// 			console.error("Error disconnecting from Prisma:", disconnectError);
// 		}
// 	}
// }

// // access & refresh
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";
// import { getPrintfulClient } from "@/lib/printful/printful-auth"; // Import the new Printful auth method

// const prisma = new PrismaClient();

// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error(
// 		"STRIPE_SECRET_KEY is not defined in environment variables"
// 	);
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia",
// });

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// // Constants for available options
// const THREAD_COLORS = {
// 	"#FFFFFF": "1801 White",
// 	"#000000": "1800 Black",
// 	"#96A1A8": "1718 Grey",
// 	"#A67843": "1672 Old Gold",
// 	"#FFCC00": "1951 Gold",
// 	"#E25C27": "1987 Orange",
// 	"#CC3366": "1910 Flamingo",
// 	"#CC3333": "1839 Red",
// 	"#660000": "1784 Maroon",
// 	"#333366": "1966 Navy",
// 	"#005397": "1842 Royal",
// 	"#3399FF": "1695 Aqua/Teal",
// 	"#6B5294": "1832 Purple",
// 	"#01784E": "1751 Kelly Green",
// 	"#7BA35A": "1848 Kiwi Green",
// };

// const EMBROIDERY_POSITIONS = {
// 	front: { id: "embroidery_front", price: 2.95 },
// 	front_large: { id: "embroidery_front_large", price: 2.95 },
// 	back: { id: "embroidery_back", price: 2.95 },
// 	right: { id: "embroidery_right", price: 2.95 },
// 	left: { id: "embroidery_left", price: 2.95 },
// };

// const EMBROIDERY_TYPES = {
// 	flat: { title: "Flat Embroidery", price: 0.0 },
// 	"3d": { title: "3D Puff", price: 1.5 },
// 	both: { title: "Partial 3D Puff", price: 1.5 },
// };

// interface VariantData {
// 	id: string;
// 	printfulFileId: number;
// 	name: string;
// 	color: string;
// 	size: string;
// 	image: string;
// 	retailPrice: number;
// 	currency: string;
// 	stripePriceId: string;
// 	hatProduct: { connect: { id: string } };
// 	selectedOptions: Record<string, string | string[] | null>;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// function randomizeThreadColors(): string[] {
// 	const colorKeys = Object.keys(THREAD_COLORS);
// 	const numberOfColors = Math.floor(Math.random() * 3) + 1; // 1-3 colors
// 	return colorKeys.sort(() => Math.random() - 0.5).slice(0, numberOfColors);
// }

// function selectRandomEmbroideryType(): string {
// 	const types = Object.keys(EMBROIDERY_TYPES);
// 	return types[Math.floor(Math.random() * types.length)];
// }

// function getRandomEmbroideryPositions(): string[] {
// 	const positions = Object.keys(EMBROIDERY_POSITIONS);
// 	const numberOfPositions =
// 		Math.floor(Math.random() * (positions.length - 1)) + 1;
// 	return positions
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfPositions);
// }

// function generateOptions(): Record<string, string | string[] | null> {
// 	const selectedOptions: Record<string, string | string[] | null> = {};

// 	const embroideryType = selectRandomEmbroideryType();
// 	selectedOptions["embroidery_type"] = embroideryType;

// 	if (embroideryType === "flat" || embroideryType === "both") {
// 		selectedOptions["thread_colors"] = randomizeThreadColors();
// 	}
// 	if (embroideryType === "3d" || embroideryType === "both") {
// 		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
// 	}

// 	const selectedPositions = getRandomEmbroideryPositions();
// 	selectedPositions.forEach((position) => {
// 		const optionKey =
// 			position === "front_large"
// 				? embroideryType === "3d"
// 					? "thread_colors_3d_front_large"
// 					: "thread_colors_front_large"
// 				: `thread_colors_${position}`;

// 		selectedOptions[optionKey] = randomizeThreadColors();
// 	});

// 	selectedOptions["notes"] = "Custom embroidered design";

// 	return selectedOptions;
// }

// function calculateTotalPrice(
// 	selectedOptions: Record<string, string | string[] | null>
// ): number {
// 	let totalPrice = 29.99; // Base price

// 	const embroideryType = selectedOptions["embroidery_type"] as string;
// 	totalPrice +=
// 		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;

// 	Object.keys(selectedOptions).forEach((key) => {
// 		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
// 			const position = key
// 				.replace("thread_colors_", "")
// 				.replace("_3d", "");
// 			if (
// 				EMBROIDERY_POSITIONS[
// 					position as keyof typeof EMBROIDERY_POSITIONS
// 				]
// 			) {
// 				totalPrice +=
// 					EMBROIDERY_POSITIONS[
// 						position as keyof typeof EMBROIDERY_POSITIONS
// 					].price;
// 			}
// 		}
// 	});

// 	return totalPrice * 2;
// }

// function generateVariantName(
// 	baseTitle: string,
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	let name = baseTitle;

// 	const embroideryType = selectedOptions[
// 		"embroidery_type"
// 	] as keyof typeof EMBROIDERY_TYPES;
// 	name += ` - ${EMBROIDERY_TYPES[embroideryType].title}`;

// 	const positions: string[] = [];
// 	if (selectedOptions["thread_colors_back"]) positions.push("Back");
// 	if (selectedOptions["thread_colors_right"]) positions.push("Right");
// 	if (selectedOptions["thread_colors_left"]) positions.push("Left");
// 	if (
// 		selectedOptions["thread_colors_front_large"] ||
// 		selectedOptions["thread_colors_3d_front_large"]
// 	) {
// 		positions.push("Large Front");
// 	}

// 	if (positions.length > 0) {
// 		name += ` with ${positions.join(", ")} Embroidery`;
// 	}

// 	const notes = selectedOptions["notes"];
// 	if (notes && typeof notes === "string") {
// 		name += ` (${notes})`;
// 	}

// 	return name;
// }

// function getSelectedColorNames(
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	const colorSet = new Set<string>();

// 	Object.entries(selectedOptions)
// 		.filter(([key]) => key.includes("thread_colors"))
// 		.forEach(([_, colors]) => {
// 			if (Array.isArray(colors)) {
// 				colors.forEach((color) => {
// 					const colorName =
// 						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
// 					if (colorName) colorSet.add(colorName);
// 				});
// 			}
// 		});

// 	return Array.from(colorSet).join(", ") || "Default Colors";
// }

// async function processAndUploadImage(pngBase64: string): Promise<string> {
// 	try {
// 		const uploadResponse = await axios.post(
// 			`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 			{
// 				pngBase64,
// 				filename: `hat_variant_${uuidv4()}.png`,
// 			},
// 			{
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			}
// 		);

// 		return uploadResponse.data.url;
// 	} catch (error) {
// 		throw new Error(`Failed to process and upload image:\n${error}`);
// 	}
// }

// async function uploadToPrintful(
// 	imageUrl: string
// ): Promise<{ id: number; url: string }> {
// 	try {
// 		const printfulClient = await getPrintfulClient();
// 		const printfulPayload = {
// 			role: "printfile",
// 			url: imageUrl,
// 			filename: `hat_variant_${uuidv4()}.png`,
// 			visible: true,
// 		};

// 		const printfulResponse = (await printfulClient.post(
// 			"v2/files",
// 			printfulPayload
// 		)) as { data: { id: number; url: string } };
// 		const fileId = printfulResponse.data.id;

// 		if (!fileId) {
// 			throw new Error("Invalid response from Printful API");
// 		}

// 		return { id: fileId, url: imageUrl };
// 	} catch (error) {
// 		throw new Error(`Failed to upload to Printful:\n${error}`);
// 	}
// }

// export async function POST(req: NextRequest) {
// 	try {
// 		const { resultId, pngBase64 } = await req.json();

// 		if (!resultId || !pngBase64) {
// 			return NextResponse.json(
// 				{ error: "Missing required parameters" },
// 				{ status: 400 }
// 			);
// 		}

// 		const imageUrl = await processAndUploadImage(pngBase64);
// 		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
// 			imageUrl
// 		);

// 		const hatProductRaw = await prisma.hatProduct.findUnique({
// 			where: { id: resultId },
// 			include: { options: true, techniques: true },
// 		});

// 		if (!hatProductRaw) {
// 			return NextResponse.json(
// 				{ error: "HatProduct not found" },
// 				{ status: 404 }
// 			);
// 		}

// 		const selectedOptions = generateOptions();
// 		const finalRetailPrice = calculateTotalPrice(selectedOptions);
// 		const variantName = generateVariantName(
// 			hatProductRaw.title,
// 			selectedOptions
// 		);

// 		const stripeProduct = await stripe.products.create({
// 			name: variantName,
// 			description: hatProductRaw.description || undefined,
// 			images: [printfulUrl],
// 		});

// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100),
// 			currency: hatProductRaw.currency.toLowerCase(),
// 		});

// 		const variantData: VariantData = {
// 			id: uuidv4(),
// 			printfulFileId,
// 			name: variantName,
// 			color: getSelectedColorNames(selectedOptions),
// 			size: "M",
// 			image: printfulUrl,
// 			retailPrice: finalRetailPrice,
// 			currency: hatProductRaw.currency,
// 			stripePriceId: stripePrice.id,
// 			hatProduct: { connect: { id: hatProductRaw.id } },
// 			selectedOptions,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		};

// 		const variant = await prisma.hatVariant.create({ data: variantData });

// 		return NextResponse.json({ variant }, { status: 200 });
// 	} catch (error: unknown) {
// 		if (axios.isAxiosError(error)) {
// 			return NextResponse.json(
// 				{
// 					error: "Failed to generate hat variant.",
// 					details: error.response?.data,
// 				},
// 				{ status: error.response?.status || 500 }
// 			);
// 		} else if (error instanceof Error) {
// 			return NextResponse.json(
// 				{ error: "Internal Server Error." },
// 				{ status: 500 }
// 			);
// 		} else {
// 			return NextResponse.json(
// 				{ error: "An unexpected error occurred." },
// 				{ status: 500 }
// 			);
// 		}
// 	} finally {
// 		await prisma.$disconnect();
// 	}
// }

// error with image size probably
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";
// import { getPrintfulClient } from "@/lib/printful/printful-auth";

// const prisma = new PrismaClient();

// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error(
// 		"STRIPE_SECRET_KEY is not defined in environment variables"
// 	);
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia",
// });

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// // Constants
// const THREAD_COLORS = {
// 	"#FFFFFF": "1801 White",
// 	"#000000": "1800 Black",
// 	"#96A1A8": "1718 Grey",
// 	"#A67843": "1672 Old Gold",
// 	"#FFCC00": "1951 Gold",
// 	"#E25C27": "1987 Orange",
// 	"#CC3366": "1910 Flamingo",
// 	"#CC3333": "1839 Red",
// 	"#660000": "1784 Maroon",
// 	"#333366": "1966 Navy",
// 	"#005397": "1842 Royal",
// 	"#3399FF": "1695 Aqua/Teal",
// 	"#6B5294": "1832 Purple",
// 	"#01784E": "1751 Kelly Green",
// 	"#7BA35A": "1848 Kiwi Green",
// };

// const EMBROIDERY_POSITIONS = {
// 	front: { id: "embroidery_front", price: 2.95 },
// 	front_large: { id: "embroidery_front_large", price: 2.95 },
// 	back: { id: "embroidery_back", price: 2.95 },
// 	right: { id: "embroidery_right", price: 2.95 },
// 	left: { id: "embroidery_left", price: 2.95 },
// };

// const EMBROIDERY_TYPES = {
// 	flat: { title: "Flat Embroidery", price: 0.0 },
// 	"3d": { title: "3D Puff", price: 1.5 },
// 	both: { title: "Partial 3D Puff", price: 1.5 },
// };

// // Logging utilities
// const logRequest = (message: string, data?: any) => {
// 	console.log(`[${new Date().toISOString()}] ${message}`, data ? data : "");
// };

// const logError = (message: string, error: any) => {
// 	console.error(`[${new Date().toISOString()}] ERROR: ${message}`, {
// 		error:
// 			error instanceof Error
// 				? {
// 						message: error.message,
// 						stack: error.stack,
// 						name: error.name,
// 				  }
// 				: error,
// 		...(axios.isAxiosError(error) && {
// 			response: {
// 				status: error.response?.status,
// 				data: error.response?.data,
// 				headers: error.response?.headers,
// 			},
// 		}),
// 	});
// };

// // Option generation functions with logging
// function randomizeThreadColors(): string[] {
// 	const colorKeys = Object.keys(THREAD_COLORS);
// 	const numberOfColors = Math.floor(Math.random() * 3) + 1;
// 	const selectedColors = colorKeys
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfColors);

// 	logRequest("Generated random thread colors", {
// 		numberOfColors,
// 		selectedColors,
// 		colorNames: selectedColors.map(
// 			(color) => THREAD_COLORS[color as keyof typeof THREAD_COLORS]
// 		),
// 	});

// 	return selectedColors;
// }

// function selectRandomEmbroideryType(): string {
// 	const types = Object.keys(EMBROIDERY_TYPES);
// 	const selectedType = types[Math.floor(Math.random() * types.length)];

// 	logRequest("Selected random embroidery type", {
// 		selectedType,
// 		typeDetails:
// 			EMBROIDERY_TYPES[selectedType as keyof typeof EMBROIDERY_TYPES],
// 	});

// 	return selectedType;
// }

// function getRandomEmbroideryPositions(): string[] {
// 	const positions = Object.keys(EMBROIDERY_POSITIONS);
// 	const numberOfPositions =
// 		Math.floor(Math.random() * (positions.length - 1)) + 1;
// 	const selectedPositions = positions
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfPositions);

// 	logRequest("Generated random embroidery positions", {
// 		numberOfPositions,
// 		selectedPositions,
// 		positionDetails: selectedPositions.map(
// 			(pos) =>
// 				EMBROIDERY_POSITIONS[pos as keyof typeof EMBROIDERY_POSITIONS]
// 		),
// 	});

// 	return selectedPositions;
// }

// function generateOptions(): Record<string, string | string[] | null> {
// 	logRequest("Starting options generation");

// 	const selectedOptions: Record<string, string | string[] | null> = {};

// 	const embroideryType = selectRandomEmbroideryType();
// 	selectedOptions["embroidery_type"] = embroideryType;

// 	if (embroideryType === "flat" || embroideryType === "both") {
// 		selectedOptions["thread_colors"] = randomizeThreadColors();
// 	}
// 	if (embroideryType === "3d" || embroideryType === "both") {
// 		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
// 	}

// 	const selectedPositions = getRandomEmbroideryPositions();
// 	selectedPositions.forEach((position) => {
// 		const optionKey =
// 			position === "front_large"
// 				? embroideryType === "3d"
// 					? "thread_colors_3d_front_large"
// 					: "thread_colors_front_large"
// 				: `thread_colors_${position}`;

// 		selectedOptions[optionKey] = randomizeThreadColors();
// 	});

// 	selectedOptions["notes"] = "Custom embroidered design";

// 	logRequest("Generated options", { selectedOptions });
// 	return selectedOptions;
// }

// function calculateTotalPrice(
// 	selectedOptions: Record<string, string | string[] | null>
// ): number {
// 	let totalPrice = 29.99; // Base price

// 	const embroideryType = selectedOptions["embroidery_type"] as string;
// 	const typePrice =
// 		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;
// 	totalPrice += typePrice;

// 	let positionPrices = 0;
// 	Object.keys(selectedOptions).forEach((key) => {
// 		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
// 			const position = key
// 				.replace("thread_colors_", "")
// 				.replace("_3d", "");
// 			if (
// 				EMBROIDERY_POSITIONS[
// 					position as keyof typeof EMBROIDERY_POSITIONS
// 				]
// 			) {
// 				positionPrices +=
// 					EMBROIDERY_POSITIONS[
// 						position as keyof typeof EMBROIDERY_POSITIONS
// 					].price;
// 			}
// 		}
// 	});

// 	totalPrice += positionPrices;
// 	const finalPrice = totalPrice * 2;

// 	logRequest("Calculated total price", {
// 		basePrice: 29.99,
// 		embroideryTypePrice: typePrice,
// 		positionPrices,
// 		finalPrice,
// 	});

// 	return finalPrice;
// }

// // API Endpoint
// export async function POST(req: NextRequest) {
// 	const requestId = uuidv4();
// 	logRequest(`Starting hat variant generation request ${requestId}`);

// 	try {
// 		const { resultId, pngBase64, pokemonName } = await req.json();
// 		logRequest("Received request parameters", {
// 			requestId,
// 			resultId,
// 			pokemonName,
// 			pngBase64Length: pngBase64?.length,
// 		});

// 		if (!resultId || !pngBase64) {
// 			logError("Missing parameters", {
// 				requestId,
// 				hasResultId: !!resultId,
// 				hasPngBase64: !!pngBase64,
// 			});
// 			return NextResponse.json(
// 				{ error: "Missing required parameters" },
// 				{ status: 400 }
// 			);
// 		}

// 		// Upload image and get URL
// 		logRequest("Starting image upload", { requestId });
// 		const imageUrl = await processAndUploadImage(pngBase64);
// 		logRequest("Image upload completed", { requestId, imageUrl });

// 		// Upload to Printful
// 		logRequest("Starting Printful upload", { requestId });
// 		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
// 			imageUrl
// 		);
// 		logRequest("Printful upload completed", {
// 			requestId,
// 			printfulFileId,
// 			printfulUrl,
// 		});

// 		// Get hat product
// 		logRequest("Fetching hat product", { requestId, resultId });
// 		const hatProductRaw = await prisma.hatProduct.findUnique({
// 			where: { id: resultId },
// 			include: { options: true, techniques: true },
// 		});

// 		if (!hatProductRaw) {
// 			logError("Hat product not found", { requestId, resultId });
// 			return NextResponse.json(
// 				{ error: "HatProduct not found" },
// 				{ status: 404 }
// 			);
// 		}

// 		logRequest("Found hat product", {
// 			requestId,
// 			productId: hatProductRaw.id,
// 			title: hatProductRaw.title,
// 		});

// 		// Generate options and calculate price
// 		const selectedOptions = generateOptions();
// 		const finalRetailPrice = calculateTotalPrice(selectedOptions);
// 		const variantName = `${pokemonName || hatProductRaw.title} Custom Hat`;

// 		// Create Stripe product
// 		logRequest("Creating Stripe product", {
// 			requestId,
// 			variantName,
// 			finalRetailPrice,
// 		});

// 		const stripeProduct = await stripe.products.create({
// 			name: variantName,
// 			description: hatProductRaw.description || undefined,
// 			images: [printfulUrl],
// 		});

// 		logRequest("Created Stripe product", {
// 			requestId,
// 			stripeProductId: stripeProduct.id,
// 		});

// 		// Create Stripe price
// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100),
// 			currency: hatProductRaw.currency.toLowerCase(),
// 		});

// 		logRequest("Created Stripe price", {
// 			requestId,
// 			stripePriceId: stripePrice.id,
// 			amount: finalRetailPrice,
// 		});

// 		// Create variant
// 		const variantData = {
// 			id: uuidv4(),
// 			printfulFileId,
// 			name: variantName,
// 			color: getSelectedColorNames(selectedOptions),
// 			size: "M",
// 			image: printfulUrl,
// 			retailPrice: finalRetailPrice,
// 			currency: hatProductRaw.currency,
// 			stripePriceId: stripePrice.id,
// 			hatProduct: { connect: { id: hatProductRaw.id } },
// 			selectedOptions,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		};

// 		logRequest("Creating variant in database", {
// 			requestId,
// 			variantData: {
// 				...variantData,
// 				selectedOptions: JSON.stringify(variantData.selectedOptions),
// 			},
// 		});

// 		const variant = await prisma.hatVariant.create({ data: variantData });

// 		logRequest("Created variant successfully", {
// 			requestId,
// 			variantId: variant.id,
// 			variantName: variant.name,
// 		});

// 		return NextResponse.json({ variant }, { status: 200 });
// 	} catch (error: unknown) {
// 		logError(`Request ${requestId} failed`, error);

// 		if (axios.isAxiosError(error)) {
// 			const errorResponse = {
// 				error: "Failed to generate hat variant.",
// 				details: error.response?.data,
// 				status: error.response?.status,
// 			};
// 			logError("Axios error details", errorResponse);
// 			return NextResponse.json(errorResponse, {
// 				status: error.response?.status || 500,
// 			});
// 		} else if (error instanceof Error) {
// 			const errorResponse = {
// 				error: "Internal Server Error.",
// 				details: error.message,
// 				stack: error.stack,
// 			};
// 			logError("Error details", errorResponse);
// 			return NextResponse.json(errorResponse, { status: 500 });
// 		} else {
// 			const errorResponse = {
// 				error: "An unexpected error occurred.",
// 				details: String(error),
// 			};
// 			logError("Unexpected error details", errorResponse);
// 			return NextResponse.json(errorResponse, { status: 500 });
// 		}
// 	} finally {
// 		logRequest(`Request ${requestId} finished processing`);
// 		await prisma.$disconnect();
// 	}
// }

// // Helper functions for image processing
// async function processAndUploadImage(pngBase64: string): Promise<string> {
// 	logRequest("Starting image processing");
// 	try {
// 		const filename = `hat_variant_${uuidv4()}.png`;
// 		logRequest("Uploading image", { filename });

// 		const uploadResponse = await axios.post(
// 			`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 			{ pngBase64, filename },
// 			{ headers: { "Content-Type": "application/json" } }
// 		);

// 		logRequest("Image upload successful", { url: uploadResponse.data.url });
// 		return uploadResponse.data.url;
// 	} catch (error) {
// 		logError("Image processing failed", error);
// 		throw error;
// 	}
// }

// async function uploadToPrintful(
// 	imageUrl: string
// ): Promise<{ id: number; url: string }> {
// 	logRequest("Starting Printful upload", { imageUrl });
// 	try {
// 		const printfulClient = await getPrintfulClient();
// 		const filename = `hat_variant_${uuidv4()}.png`;

// 		const printfulPayload = {
// 			role: "printfile",
// 			url: imageUrl,
// 			filename,
// 			visible: true,
// 		};

// 		logRequest("Sending request to Printful", { payload: printfulPayload });

// 		const printfulResponse = (await printfulClient.post(
// 			"v2/files",
// 			printfulPayload
// 		)) as { data: { id: string } };
// 		const fileId = printfulResponse.data.id;

// 		if (!fileId) {
// 			throw new Error("Invalid response from Printful API");
// 		}

// 		logRequest("Printful upload successful", {
// 			fileId,
// 			url: imageUrl,
// 		});

// 		return { id: Number(fileId), url: imageUrl }; // Convert fileId to a number
// 	} catch (error) {
// 		logError("Printful upload failed", error);
// 		throw error;
// 	}
// }

// function getSelectedColorNames(
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	const colorSet = new Set<string>();

// 	Object.entries(selectedOptions)
// 		.filter(([key]) => key.includes("thread_colors"))
// 		.forEach(([_, colors]) => {
// 			if (Array.isArray(colors)) {
// 				colors.forEach((color) => {
// 					const colorName =
// 						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
// 					if (colorName) colorSet.add(colorName);
// 				});
// 			}
// 		});

// 	const colorNames = Array.from(colorSet).join(", ");
// 	logRequest("Generated color names", { colorNames });
// 	return colorNames || "Default Colors";
// }

// src/app/api/get-hat-variants/route.ts
// file size 0
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";
// import { getPrintfulClient } from "@/lib/printful/printful-auth";

// interface PrintfulFile {
// 	id: number;
// 	url: string;
// 	hash: string | null;
// 	filename: string;
// 	mime_type: string | null;
// 	size: number;
// 	width: number | null;
// 	height: number | null;
// 	dpi: number | null;
// 	status: "waiting" | "processing" | "accepted" | "rejected";
// 	created: string;
// 	thumbnail_url: string | null;
// 	preview_url: string | null;
// 	visible: boolean;
// 	is_temporary: boolean;
// 	_links: {
// 		self: { href: string };
// 	};
// }

// const prisma = new PrismaClient();
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error("STRIPE_SECRET_KEY is not defined");
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia",
// });

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// const THREAD_COLORS = {
// 	"#FFFFFF": "1801 White",
// 	"#000000": "1800 Black",
// 	"#96A1A8": "1718 Grey",
// 	"#A67843": "1672 Old Gold",
// 	"#FFCC00": "1951 Gold",
// 	"#E25C27": "1987 Orange",
// 	"#CC3366": "1910 Flamingo",
// 	"#CC3333": "1839 Red",
// 	"#660000": "1784 Maroon",
// 	"#333366": "1966 Navy",
// 	"#005397": "1842 Royal",
// 	"#3399FF": "1695 Aqua/Teal",
// 	"#6B5294": "1832 Purple",
// 	"#01784E": "1751 Kelly Green",
// 	"#7BA35A": "1848 Kiwi Green",
// };

// const EMBROIDERY_POSITIONS = {
// 	front: { id: "embroidery_front", price: 2.95 },
// 	front_large: { id: "embroidery_front_large", price: 2.95 },
// 	back: { id: "embroidery_back", price: 2.95 },
// 	right: { id: "embroidery_right", price: 2.95 },
// 	left: { id: "embroidery_left", price: 2.95 },
// };

// const EMBROIDERY_TYPES = {
// 	flat: { title: "Flat Embroidery", price: 0.0 },
// 	"3d": { title: "3D Puff", price: 1.5 },
// 	both: { title: "Partial 3D Puff", price: 1.5 },
// };

// async function waitForFile(
// 	client: any,
// 	fileId: number,
// 	maxAttempts = 30, // Increased from 10 to 30 attempts
// 	delayBetweenAttempts = 2000 // 2 seconds between attempts
// ): Promise<PrintfulFile> {
// 	console.log(`Starting file polling for file ${fileId}...`);

// 	for (let i = 0; i < maxAttempts; i++) {
// 		console.log(`Poll attempt ${i + 1}/${maxAttempts} for file ${fileId}`);

// 		const response = await client.get(`v2/files/${fileId}`);
// 		const fileData = response.data;

// 		console.log(`File ${fileId} status:`, {
// 			attempt: i + 1,
// 			status: fileData.status,
// 			details: fileData,
// 		});

// 		if (fileData.status === "accepted") {
// 			console.log(`File ${fileId} successfully processed`);
// 			return fileData;
// 		} else if (fileData.status === "failed") {
// 			console.error(`File ${fileId} processing failed:`, fileData);
// 			throw new Error(
// 				`File processing failed: ${JSON.stringify(fileData)}`
// 			);
// 		} else if (fileData.status === "rejected") {
// 			console.error(`File ${fileId} was rejected:`, fileData);
// 			throw new Error("File was rejected by Printful");
// 		}

// 		// Add exponential backoff
// 		const delay = Math.min(delayBetweenAttempts * Math.pow(1.5, i), 10000); // Max 10 seconds
// 		console.log(`Waiting ${delay}ms before next attempt...`);
// 		await new Promise((resolve) => setTimeout(resolve, delay));
// 	}

// 	console.error(
// 		`File ${fileId} processing timed out after ${maxAttempts} attempts`
// 	);
// 	throw new Error(`File processing timed out after ${maxAttempts} attempts`);
// }

// function randomizeThreadColors(): string[] {
// 	const colorKeys = Object.keys(THREAD_COLORS);
// 	const numberOfColors = Math.floor(Math.random() * 3) + 1;
// 	const selectedColors = colorKeys
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfColors);

// 	console.log("Generated random thread colors", {
// 		numberOfColors,
// 		selectedColors,
// 		colorNames: selectedColors.map(
// 			(color) => THREAD_COLORS[color as keyof typeof THREAD_COLORS]
// 		),
// 	});

// 	return selectedColors;
// }

// function selectRandomEmbroideryType(): string {
// 	const types = Object.keys(EMBROIDERY_TYPES);
// 	const selectedType = types[Math.floor(Math.random() * types.length)];

// 	console.log("Selected random embroidery type", {
// 		selectedType,
// 		typeDetails:
// 			EMBROIDERY_TYPES[selectedType as keyof typeof EMBROIDERY_TYPES],
// 	});

// 	return selectedType;
// }

// function getRandomEmbroideryPositions(): string[] {
// 	const positions = Object.keys(EMBROIDERY_POSITIONS);
// 	const numberOfPositions =
// 		Math.floor(Math.random() * (positions.length - 1)) + 1;
// 	const selectedPositions = positions
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfPositions);

// 	console.log("Generated random embroidery positions", {
// 		numberOfPositions,
// 		selectedPositions,
// 		positionDetails: selectedPositions.map(
// 			(pos) =>
// 				EMBROIDERY_POSITIONS[pos as keyof typeof EMBROIDERY_POSITIONS]
// 		),
// 	});

// 	return selectedPositions;
// }

// function generateOptions(): Record<string, string | string[] | null> {
// 	console.log("Starting options generation");

// 	const selectedOptions: Record<string, string | string[] | null> = {};

// 	const embroideryType = selectRandomEmbroideryType();
// 	selectedOptions["embroidery_type"] = embroideryType;

// 	if (embroideryType === "flat" || embroideryType === "both") {
// 		selectedOptions["thread_colors"] = randomizeThreadColors();
// 	}
// 	if (embroideryType === "3d" || embroideryType === "both") {
// 		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
// 	}

// 	const selectedPositions = getRandomEmbroideryPositions();
// 	selectedPositions.forEach((position) => {
// 		const optionKey =
// 			position === "front_large"
// 				? embroideryType === "3d"
// 					? "thread_colors_3d_front_large"
// 					: "thread_colors_front_large"
// 				: `thread_colors_${position}`;

// 		selectedOptions[optionKey] = randomizeThreadColors();
// 	});

// 	selectedOptions["notes"] = "Custom embroidered design";

// 	console.log("Final generated options", { selectedOptions });
// 	return selectedOptions;
// }

// function calculateTotalPrice(
// 	selectedOptions: Record<string, string | string[] | null>
// ): number {
// 	let totalPrice = 29.99;

// 	const embroideryType = selectedOptions["embroidery_type"] as string;
// 	const typePrice =
// 		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;
// 	totalPrice += typePrice;

// 	let positionPrices = 0;
// 	Object.keys(selectedOptions).forEach((key) => {
// 		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
// 			const position = key
// 				.replace("thread_colors_", "")
// 				.replace("_3d", "");
// 			if (
// 				EMBROIDERY_POSITIONS[
// 					position as keyof typeof EMBROIDERY_POSITIONS
// 				]
// 			) {
// 				positionPrices +=
// 					EMBROIDERY_POSITIONS[
// 						position as keyof typeof EMBROIDERY_POSITIONS
// 					].price;
// 			}
// 		}
// 	});

// 	totalPrice += positionPrices;
// 	const finalPrice = totalPrice * 2;

// 	console.log("Calculated total price", {
// 		basePrice: 29.99,
// 		embroideryTypePrice: typePrice,
// 		positionPrices,
// 		finalPrice,
// 	});

// 	return finalPrice;
// }

// function getSelectedColorNames(
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	const colorSet = new Set<string>();

// 	Object.entries(selectedOptions)
// 		.filter(([key]) => key.includes("thread_colors"))
// 		.forEach(([_, colors]) => {
// 			if (Array.isArray(colors)) {
// 				colors.forEach((color) => {
// 					const colorName =
// 						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
// 					if (colorName) colorSet.add(colorName);
// 				});
// 			}
// 		});

// 	const colorNames = Array.from(colorSet).join(", ");
// 	console.log("Generated color names", { colorNames });
// 	return colorNames || "Default Colors";
// }

// async function processAndUploadImage(pngBase64: string): Promise<string> {
// 	try {
// 		console.log("Starting image processing");
// 		const filename = `hat_variant_${uuidv4()}.png`;
// 		console.log("Uploading image", { filename });

// 		const uploadResponse = await axios.post(
// 			`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 			{ pngBase64, filename },
// 			{ headers: { "Content-Type": "application/json" } }
// 		);

// 		console.log("Image upload successful", {
// 			url: uploadResponse.data.url,
// 		});
// 		return uploadResponse.data.url;
// 	} catch (error) {
// 		console.error("Image processing failed:", error);
// 		throw error;
// 	}
// }

// async function uploadToPrintful(
// 	imageUrl: string
// ): Promise<{ id: number; url: string }> {
// 	console.log("Starting Printful upload", { imageUrl });

// 	try {
// 		const printfulClient = await getPrintfulClient();
// 		const filename = `hat_variant_${uuidv4()}.png`;

// 		const payload = {
// 			role: "printfile",
// 			url: imageUrl,
// 			filename,
// 			visible: true,
// 		};

// 		console.log("Sending request to Printful", { payload });

// 		const response = await printfulClient.post("v2/files", payload);
// 		console.log("Printful raw response:", response);

// 		if (!response || !response.data) {
// 			throw new Error("Invalid response from Printful API");
// 		}

// 		const fileData = response.data;
// 		console.log("Initial file data:", fileData);

// 		if (!fileData || !fileData.id) {
// 			console.error("Unexpected Printful response structure:", response);
// 			throw new Error("Invalid response structure from Printful API");
// 		}

// 		// Initial waiting period before starting polling
// 		console.log("Waiting 5 seconds before starting status checks...");
// 		await new Promise((resolve) => setTimeout(resolve, 5000));

// 		if (fileData.status !== "accepted") {
// 			console.log("Starting file status polling...");
// 			const processedFile = await waitForFile(
// 				printfulClient,
// 				fileData.id
// 			);
// 			return {
// 				id: processedFile.id,
// 				url: processedFile.preview_url || imageUrl,
// 			};
// 		}

// 		return {
// 			id: fileData.id,
// 			url: fileData.preview_url || imageUrl,
// 		};
// 	} catch (error) {
// 		console.error("Printful upload failed:", {
// 			error,
// 			errorMessage:
// 				error instanceof Error ? error.message : "Unknown error",
// 			errorStack: error instanceof Error ? error.stack : undefined,
// 		});
// 		throw error;
// 	}
// }

// export async function POST(req: NextRequest) {
// 	const requestId = uuidv4();
// 	console.log(`Starting hat variant generation request ${requestId}`);

// 	try {
// 		const { resultId, pngBase64, pokemonName } = await req.json();
// 		console.log("Received request parameters", {
// 			requestId,
// 			resultId,
// 			pokemonName,
// 			pngBase64Length: pngBase64?.length,
// 		});

// 		if (!resultId || !pngBase64) {
// 			return NextResponse.json(
// 				{ error: "Missing required parameters" },
// 				{ status: 400 }
// 			);
// 		}

// 		const imageUrl = await processAndUploadImage(pngBase64);
// 		console.log("Image upload completed", { requestId, imageUrl });

// 		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
// 			imageUrl
// 		);
// 		console.log("Printful upload completed", {
// 			requestId,
// 			printfulFileId,
// 			printfulUrl,
// 		});

// 		const selectedOptions = generateOptions();
// 		const finalRetailPrice = calculateTotalPrice(selectedOptions);
// 		const variantName = `${
// 			pokemonName || "Custom Pokemon"
// 		} Hat with Embroidery`;

// 		const stripeProduct = await stripe.products.create({
// 			name: variantName,
// 			description: "Custom embroidered Pokemon-inspired hat",
// 			images: [printfulUrl],
// 		});

// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100),
// 			currency: "usd",
// 		});

// 		const variantData = {
// 			id: uuidv4(),
// 			printfulFileId,
// 			name: variantName,
// 			color: getSelectedColorNames(selectedOptions),
// 			size: "M",
// 			image: printfulUrl,
// 			retailPrice: finalRetailPrice,
// 			currency: "USD",
// 			stripePriceId: stripePrice.id,
// 			selectedOptions,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		};

// 		console.log("Created variant data", {
// 			requestId,
// 			variantId: variantData.id,
// 			variantName: variantData.name,
// 			options: variantData.selectedOptions,
// 		});

// 		return NextResponse.json({ variant: variantData }, { status: 200 });
// 	} catch (error) {
// 		console.error(`Request ${requestId} failed:`, error);

// 		if (axios.isAxiosError(error)) {
// 			return NextResponse.json(
// 				{
// 					error: "Failed to generate hat variant.",
// 					details: error.response?.data,
// 				},
// 				{ status: error.response?.status || 500 }
// 			);
// 		} else {
// 			return NextResponse.json(
// 				{
// 					error: "Internal Server Error.",
// 					details:
// 						error instanceof Error ? error.message : String(error),
// 				},
// 				{ status: 500 }
// 			);
// 		}
// 	}
// }

// src/app/api/get-hat-variants/route.ts
// ...
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";
// import { getPrintfulClient } from "@/lib/printful/printful-auth";

// interface PrintfulFile {
// 	id: number;
// 	url: string;
// 	hash: string | null;
// 	filename: string;
// 	mime_type: string | null;
// 	size: number;
// 	width: number | null;
// 	height: number | null;
// 	dpi: number | null;
// 	status: "waiting" | "processing" | "accepted" | "rejected" | "failed";
// 	created: string;
// 	thumbnail_url: string | null;
// 	preview_url: string | null;
// 	visible: boolean;
// 	is_temporary: boolean;
// 	type?: string;
// 	_links: {
// 		self: { href: string };
// 	};
// }

// interface PrintfulUploadResponse {
// 	code: number;
// 	result: PrintfulFile;
// 	extra?: any[];
// }

// const prisma = new PrismaClient();
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error("STRIPE_SECRET_KEY is not defined");
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia",
// });

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// const THREAD_COLORS = {
// 	"#FFFFFF": "1801 White",
// 	"#000000": "1800 Black",
// 	"#96A1A8": "1718 Grey",
// 	"#A67843": "1672 Old Gold",
// 	"#FFCC00": "1951 Gold",
// 	"#E25C27": "1987 Orange",
// 	"#CC3366": "1910 Flamingo",
// 	"#CC3333": "1839 Red",
// 	"#660000": "1784 Maroon",
// 	"#333366": "1966 Navy",
// 	"#005397": "1842 Royal",
// 	"#3399FF": "1695 Aqua/Teal",
// 	"#6B5294": "1832 Purple",
// 	"#01784E": "1751 Kelly Green",
// 	"#7BA35A": "1848 Kiwi Green",
// };

// const EMBROIDERY_POSITIONS = {
// 	front: { id: "embroidery_front", price: 2.95 },
// 	front_large: { id: "embroidery_front_large", price: 2.95 },
// 	back: { id: "embroidery_back", price: 2.95 },
// 	right: { id: "embroidery_right", price: 2.95 },
// 	left: { id: "embroidery_left", price: 2.95 },
// };

// const EMBROIDERY_TYPES = {
// 	flat: { title: "Flat Embroidery", price: 0.0 },
// 	"3d": { title: "3D Puff", price: 1.5 },
// 	both: { title: "Partial 3D Puff", price: 1.5 },
// };

// function randomizeThreadColors(): string[] {
// 	const colorKeys = Object.keys(THREAD_COLORS);
// 	const numberOfColors = Math.floor(Math.random() * 3) + 1;
// 	const selectedColors = colorKeys
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfColors);

// 	console.log("Generated random thread colors", {
// 		numberOfColors,
// 		selectedColors,
// 		colorNames: selectedColors.map(
// 			(color) => THREAD_COLORS[color as keyof typeof THREAD_COLORS]
// 		),
// 	});

// 	return selectedColors;
// }

// function selectRandomEmbroideryType(): string {
// 	const types = Object.keys(EMBROIDERY_TYPES);
// 	const selectedType = types[Math.floor(Math.random() * types.length)];

// 	console.log("Selected random embroidery type", {
// 		selectedType,
// 		typeDetails:
// 			EMBROIDERY_TYPES[selectedType as keyof typeof EMBROIDERY_TYPES],
// 	});

// 	return selectedType;
// }

// function getRandomEmbroideryPositions(): string[] {
// 	const positions = Object.keys(EMBROIDERY_POSITIONS);
// 	const numberOfPositions =
// 		Math.floor(Math.random() * (positions.length - 1)) + 1;
// 	const selectedPositions = positions
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfPositions);

// 	console.log("Generated random embroidery positions", {
// 		numberOfPositions,
// 		selectedPositions,
// 		positionDetails: selectedPositions.map(
// 			(pos) =>
// 				EMBROIDERY_POSITIONS[pos as keyof typeof EMBROIDERY_POSITIONS]
// 		),
// 	});

// 	return selectedPositions;
// }

// function generateOptions(): Record<string, string | string[] | null> {
// 	console.log("Starting options generation");

// 	const selectedOptions: Record<string, string | string[] | null> = {};

// 	const embroideryType = selectRandomEmbroideryType();
// 	selectedOptions["embroidery_type"] = embroideryType;

// 	if (embroideryType === "flat" || embroideryType === "both") {
// 		selectedOptions["thread_colors"] = randomizeThreadColors();
// 	}
// 	if (embroideryType === "3d" || embroideryType === "both") {
// 		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
// 	}

// 	const selectedPositions = getRandomEmbroideryPositions();
// 	selectedPositions.forEach((position) => {
// 		const optionKey =
// 			position === "front_large"
// 				? embroideryType === "3d"
// 					? "thread_colors_3d_front_large"
// 					: "thread_colors_front_large"
// 				: `thread_colors_${position}`;

// 		selectedOptions[optionKey] = randomizeThreadColors();
// 	});

// 	selectedOptions["notes"] = "Custom embroidered design";

// 	console.log("Final generated options", { selectedOptions });
// 	return selectedOptions;
// }

// function calculateTotalPrice(
// 	selectedOptions: Record<string, string | string[] | null>
// ): number {
// 	let totalPrice = 29.99;

// 	const embroideryType = selectedOptions["embroidery_type"] as string;
// 	const typePrice =
// 		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;
// 	totalPrice += typePrice;

// 	let positionPrices = 0;
// 	Object.keys(selectedOptions).forEach((key) => {
// 		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
// 			const position = key
// 				.replace("thread_colors_", "")
// 				.replace("_3d", "");
// 			if (
// 				EMBROIDERY_POSITIONS[
// 					position as keyof typeof EMBROIDERY_POSITIONS
// 				]
// 			) {
// 				positionPrices +=
// 					EMBROIDERY_POSITIONS[
// 						position as keyof typeof EMBROIDERY_POSITIONS
// 					].price;
// 			}
// 		}
// 	});

// 	totalPrice += positionPrices;
// 	const finalPrice = totalPrice * 2;

// 	console.log("Calculated total price", {
// 		basePrice: 29.99,
// 		embroideryTypePrice: typePrice,
// 		positionPrices,
// 		finalPrice,
// 	});

// 	return finalPrice;
// }

// function getSelectedColorNames(
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	const colorSet = new Set<string>();

// 	Object.entries(selectedOptions)
// 		.filter(([key]) => key.includes("thread_colors"))
// 		.forEach(([_, colors]) => {
// 			if (Array.isArray(colors)) {
// 				colors.forEach((color) => {
// 					const colorName =
// 						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
// 					if (colorName) colorSet.add(colorName);
// 				});
// 			}
// 		});

// 	const colorNames = Array.from(colorSet).join(", ");
// 	console.log("Generated color names", { colorNames });
// 	return colorNames || "Default Colors";
// }

// async function getImageAsBlob(url: string): Promise<Blob> {
// 	const response = await fetch(url);
// 	const arrayBuffer = await response.arrayBuffer();
// 	return new Blob([arrayBuffer], { type: "image/png" });
// }

// async function processAndUploadImage(pngBase64: string): Promise<string> {
// 	try {
// 		console.log("Starting image processing");
// 		const filename = `hat_variant_${uuidv4()}.png`;
// 		console.log("Uploading image", { filename });

// 		const uploadResponse = await axios.post(
// 			`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 			{ pngBase64, filename },
// 			{ headers: { "Content-Type": "application/json" } }
// 		);

// 		console.log("Image upload successful", {
// 			url: uploadResponse.data.url,
// 		});
// 		return uploadResponse.data.url;
// 	} catch (error) {
// 		console.error("Image processing failed:", error);
// 		throw error;
// 	}
// }

// async function uploadToPrintful(
// 	imageUrl: string
// ): Promise<{ id: number; url: string }> {
// 	console.log("Starting Printful upload", { imageUrl });

// 	try {
// 		// Download the image from our server
// 		console.log("Downloading image from server");
// 		const blob = await getImageAsBlob(imageUrl);

// 		// Create form data
// 		const formData = new FormData();
// 		formData.append("file", blob, `design-${uuidv4()}.png`);

// 		// Upload file directly to Printful
// 		console.log("Uploading file to Printful");
// 		const uploadResponse = await fetch("https://api.printful.com/files", {
// 			method: "POST",
// 			headers: {
// 				Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// 			},
// 			body: formData,
// 		});

// 		if (!uploadResponse.ok) {
// 			const errorData = await uploadResponse.json();
// 			console.error("Direct file upload failed", errorData);
// 			throw new Error(
// 				`Printful upload failed: ${JSON.stringify(errorData)}`
// 			);
// 		}

// 		const uploadData =
// 			(await uploadResponse.json()) as PrintfulUploadResponse;
// 		console.log("File upload response:", uploadData);

// 		// Create printfile
// 		console.log("Creating printfile");
// 		const printfulClient = await getPrintfulClient();
// 		const printfileResponse = await printfulClient.post("v2/files", {
// 			role: "printfile",
// 			file_id: uploadData.result.id,
// 			visible: true,
// 		});

// 		console.log("Printfile creation response:", printfileResponse);

// 		if (!printfileResponse.data || !printfileResponse.data.id) {
// 			throw new Error("Failed to create printfile");
// 		}

// 		return {
// 			id: printfileResponse.data.id,
// 			url: uploadData.result.preview_url || imageUrl,
// 		};
// 	} catch (error) {
// 		console.error("Printful upload failed:", {
// 			error,
// 			errorMessage:
// 				error instanceof Error ? error.message : "Unknown error",
// 			errorStack: error instanceof Error ? error.stack : undefined,
// 		});
// 		throw error;
// 	}
// }

// export async function POST(req: NextRequest) {
// 	const requestId = uuidv4();
// 	console.log(`Starting hat variant generation request ${requestId}`);

// 	try {
// 		const { resultId, pngBase64, pokemonName } = await req.json();
// 		console.log("Received request parameters", {
// 			requestId,
// 			resultId,
// 			pokemonName,
// 			pngBase64Length: pngBase64?.length,
// 		});

// 		if (!resultId || !pngBase64) {
// 			return NextResponse.json(
// 				{ error: "Missing required parameters" },
// 				{ status: 400 }
// 			);
// 		}

// 		const imageUrl = await processAndUploadImage(pngBase64);
// 		console.log("Image upload completed", { requestId, imageUrl });

// 		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
// 			imageUrl
// 		);
// 		console.log("Printful upload completed", {
// 			requestId,
// 			printfulFileId,
// 			printfulUrl,
// 		});

// 		const selectedOptions = generateOptions();
// 		const finalRetailPrice = calculateTotalPrice(selectedOptions);
// 		const variantName = `${
// 			pokemonName || "Custom Pokemon"
// 		} Hat with Embroidery`;

// 		const stripeProduct = await stripe.products.create({
// 			name: variantName,
// 			description: "Custom embroidered Pokemon-inspired hat",
// 			images: [printfulUrl],
// 		});

// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100),
// 			currency: "usd",
// 		});

// 		const variantData = {
// 			id: uuidv4(),
// 			printfulFileId,
// 			name: variantName,
// 			color: getSelectedColorNames(selectedOptions),
// 			size: "M",
// 			image: printfulUrl,
// 			retailPrice: finalRetailPrice,
// 			currency: "USD",
// 			stripePriceId: stripePrice.id,
// 			selectedOptions,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		};

// 		console.log("Created variant data", {
// 			requestId,
// 			variantId: variantData.id,
// 			variantName: variantData.name,
// 			options: variantData.selectedOptions,
// 		});

// 		return NextResponse.json({ variant: variantData }, { status: 200 });
// 	} catch (error) {
// 		console.error(`Request ${requestId} failed:`, error);

// 		if (axios.isAxiosError(error)) {
// 			return NextResponse.json(
// 				{
// 					error: "Failed to generate hat variant.",
// 					details: error.response?.data,
// 				},
// 				{ status: error.response?.status || 500 }
// 			);
// 		} else {
// 			return NextResponse.json(
// 				{
// 					error: "Internal Server Error.",
// 					details:
// 						error instanceof Error ? error.message : String(error),
// 				},
// 				{ status: 500 }
// 			);
// 		}
// 	}
// }

// src/app/api/get-hat-variants/route.ts
// upload file errors
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";
// import { getPrintfulClient } from "@/lib/printful/printful-auth";

// interface PrintfulFile {
// 	id: number;
// 	url: string;
// 	hash: string | null;
// 	filename: string;
// 	mime_type: string | null;
// 	size: number;
// 	width: number | null;
// 	height: number | null;
// 	dpi: number | null;
// 	status: "waiting" | "processing" | "accepted" | "rejected" | "failed";
// 	created: string;
// 	thumbnail_url: string | null;
// 	preview_url: string | null;
// 	visible: boolean;
// 	is_temporary: boolean;
// 	type?: string;
// 	_links: {
// 		self: { href: string };
// 	};
// }

// interface PrintfulUploadResult {
// 	id: number;
// 	type: string;
// 	hash: string;
// 	url: string;
// 	filename: string;
// 	mime_type: string;
// 	size: number;
// 	width: number;
// 	height: number;
// 	dpi: number;
// 	status: string;
// 	preview_url: string;
// 	visible: boolean;
// }

// interface PrintfulUploadResponse {
// 	code: number;
// 	result: PrintfulUploadResult[];
// 	error?: {
// 		reason: string;
// 		message: string;
// 	};
// }

// const prisma = new PrismaClient();
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error("STRIPE_SECRET_KEY is not defined");
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia",
// });

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// const THREAD_COLORS = {
// 	"#FFFFFF": "1801 White",
// 	"#000000": "1800 Black",
// 	"#96A1A8": "1718 Grey",
// 	"#A67843": "1672 Old Gold",
// 	"#FFCC00": "1951 Gold",
// 	"#E25C27": "1987 Orange",
// 	"#CC3366": "1910 Flamingo",
// 	"#CC3333": "1839 Red",
// 	"#660000": "1784 Maroon",
// 	"#333366": "1966 Navy",
// 	"#005397": "1842 Royal",
// 	"#3399FF": "1695 Aqua/Teal",
// 	"#6B5294": "1832 Purple",
// 	"#01784E": "1751 Kelly Green",
// 	"#7BA35A": "1848 Kiwi Green",
// };

// const EMBROIDERY_POSITIONS = {
// 	front: { id: "embroidery_front", price: 2.95 },
// 	front_large: { id: "embroidery_front_large", price: 2.95 },
// 	back: { id: "embroidery_back", price: 2.95 },
// 	right: { id: "embroidery_right", price: 2.95 },
// 	left: { id: "embroidery_left", price: 2.95 },
// };

// const EMBROIDERY_TYPES = {
// 	flat: { title: "Flat Embroidery", price: 0.0 },
// 	"3d": { title: "3D Puff", price: 1.5 },
// 	both: { title: "Partial 3D Puff", price: 1.5 },
// };

// function randomizeThreadColors(): string[] {
// 	const colorKeys = Object.keys(THREAD_COLORS);
// 	const numberOfColors = Math.floor(Math.random() * 3) + 1;
// 	const selectedColors = colorKeys
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfColors);

// 	console.log("Generated random thread colors", {
// 		numberOfColors,
// 		selectedColors,
// 		colorNames: selectedColors.map(
// 			(color) => THREAD_COLORS[color as keyof typeof THREAD_COLORS]
// 		),
// 	});

// 	return selectedColors;
// }

// function selectRandomEmbroideryType(): string {
// 	const types = Object.keys(EMBROIDERY_TYPES);
// 	const selectedType = types[Math.floor(Math.random() * types.length)];

// 	console.log("Selected random embroidery type", {
// 		selectedType,
// 		typeDetails:
// 			EMBROIDERY_TYPES[selectedType as keyof typeof EMBROIDERY_TYPES],
// 	});

// 	return selectedType;
// }

// function getRandomEmbroideryPositions(): string[] {
// 	const positions = Object.keys(EMBROIDERY_POSITIONS);
// 	const numberOfPositions =
// 		Math.floor(Math.random() * (positions.length - 1)) + 1;
// 	const selectedPositions = positions
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfPositions);

// 	console.log("Generated random embroidery positions", {
// 		numberOfPositions,
// 		selectedPositions,
// 		positionDetails: selectedPositions.map(
// 			(pos) =>
// 				EMBROIDERY_POSITIONS[pos as keyof typeof EMBROIDERY_POSITIONS]
// 		),
// 	});

// 	return selectedPositions;
// }

// function generateOptions(): Record<string, string | string[] | null> {
// 	console.log("Starting options generation");

// 	const selectedOptions: Record<string, string | string[] | null> = {};

// 	const embroideryType = selectRandomEmbroideryType();
// 	selectedOptions["embroidery_type"] = embroideryType;

// 	if (embroideryType === "flat" || embroideryType === "both") {
// 		selectedOptions["thread_colors"] = randomizeThreadColors();
// 	}
// 	if (embroideryType === "3d" || embroideryType === "both") {
// 		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
// 	}

// 	const selectedPositions = getRandomEmbroideryPositions();
// 	selectedPositions.forEach((position) => {
// 		const optionKey =
// 			position === "front_large"
// 				? embroideryType === "3d"
// 					? "thread_colors_3d_front_large"
// 					: "thread_colors_front_large"
// 				: `thread_colors_${position}`;

// 		selectedOptions[optionKey] = randomizeThreadColors();
// 	});

// 	selectedOptions["notes"] = "Custom embroidered design";

// 	console.log("Final generated options", { selectedOptions });
// 	return selectedOptions;
// }

// function calculateTotalPrice(
// 	selectedOptions: Record<string, string | string[] | null>
// ): number {
// 	let totalPrice = 29.99;

// 	const embroideryType = selectedOptions["embroidery_type"] as string;
// 	const typePrice =
// 		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;
// 	totalPrice += typePrice;

// 	let positionPrices = 0;
// 	Object.keys(selectedOptions).forEach((key) => {
// 		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
// 			const position = key
// 				.replace("thread_colors_", "")
// 				.replace("_3d", "");
// 			if (
// 				EMBROIDERY_POSITIONS[
// 					position as keyof typeof EMBROIDERY_POSITIONS
// 				]
// 			) {
// 				positionPrices +=
// 					EMBROIDERY_POSITIONS[
// 						position as keyof typeof EMBROIDERY_POSITIONS
// 					].price;
// 			}
// 		}
// 	});

// 	totalPrice += positionPrices;
// 	const finalPrice = totalPrice * 2;

// 	console.log("Calculated total price", {
// 		basePrice: 29.99,
// 		embroideryTypePrice: typePrice,
// 		positionPrices,
// 		finalPrice,
// 	});

// 	return finalPrice;
// }

// function getSelectedColorNames(
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	const colorSet = new Set<string>();

// 	Object.entries(selectedOptions)
// 		.filter(([key]) => key.includes("thread_colors"))
// 		.forEach(([_, colors]) => {
// 			if (Array.isArray(colors)) {
// 				colors.forEach((color) => {
// 					const colorName =
// 						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
// 					if (colorName) colorSet.add(colorName);
// 				});
// 			}
// 		});

// 	const colorNames = Array.from(colorSet).join(", ");
// 	console.log("Generated color names", { colorNames });
// 	return colorNames || "Default Colors";
// }

// // Continuation of src/app/api/get-hat-variants/route.ts

// async function processAndUploadImage(pngBase64: string): Promise<string> {
// 	try {
// 		console.log("Starting image processing");
// 		const filename = `hat_variant_${uuidv4()}.png`;
// 		console.log("Uploading image", { filename });

// 		const uploadResponse = await axios.post(
// 			`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 			{ pngBase64, filename },
// 			{ headers: { "Content-Type": "application/json" } }
// 		);

// 		console.log("Image upload successful", {
// 			url: uploadResponse.data.url,
// 		});
// 		return uploadResponse.data.url;
// 	} catch (error) {
// 		console.error("Image processing failed:", error);
// 		throw error;
// 	}
// }

// async function uploadToPrintful(
// 	imageUrl: string
// ): Promise<{ id: number; url: string }> {
// 	console.log("Starting Printful upload", { imageUrl });

// 	try {
// 		// Download the image from our server
// 		console.log("Downloading image from server");
// 		const response = await fetch(imageUrl);
// 		const arrayBuffer = await response.arrayBuffer();
// 		const base64Data = Buffer.from(arrayBuffer).toString("base64");

// 		// Create the payload
// 		const params = new URLSearchParams();
// 		params.append("file_data", base64Data);

// 		console.log("Uploading file to Printful");
// 		const uploadResponse = await fetch("https://api.printful.com/files", {
// 			method: "POST",
// 			headers: {
// 				Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// 				"Content-Type": "application/x-www-form-urlencoded",
// 			},
// 			body: params,
// 		});

// 		const responseText = await uploadResponse.text();
// 		console.log("Raw Printful response:", responseText);

// 		let uploadData;
// 		try {
// 			uploadData = JSON.parse(responseText);
// 		} catch (e) {
// 			console.error("Failed to parse Printful response:", responseText);
// 			throw new Error("Invalid JSON response from Printful");
// 		}

// 		if (!uploadResponse.ok) {
// 			console.error("Direct file upload failed", uploadData);
// 			throw new Error(
// 				`Printful upload failed: ${JSON.stringify(uploadData)}`
// 			);
// 		}

// 		console.log("File upload response:", uploadData);

// 		// Rest of the function remains the same...
// 		const fileData = uploadData.result;

// 		// Create printfile
// 		console.log("Creating printfile", { fileId: fileData.id });
// 		const printfulClient = await getPrintfulClient();
// 		const printfileResponse = await printfulClient.post("v2/files", {
// 			role: "printfile",
// 			file_id: fileData.id,
// 			visible: true,
// 		});

// 		// Check if printfileResponse.data is defined
// 		if (!printfileResponse.data) {
// 			throw new Error("printfileResponse.data is undefined");
// 		}

// 		return {
// 			id: printfileResponse.data.id,
// 			url: fileData.preview_url || imageUrl,
// 		};
// 	} catch (error) {
// 		console.error("Printful upload failed:", {
// 			error,
// 			errorMessage:
// 				error instanceof Error ? error.message : "Unknown error",
// 			errorStack: error instanceof Error ? error.stack : undefined,
// 		});
// 		throw error;
// 	}
// }

// export async function POST(req: NextRequest) {
// 	const requestId = uuidv4();
// 	console.log(`Starting hat variant generation request ${requestId}`);

// 	try {
// 		const { resultId, pngBase64, pokemonName } = await req.json();
// 		console.log("Received request parameters", {
// 			requestId,
// 			resultId,
// 			pokemonName,
// 			pngBase64Length: pngBase64?.length,
// 		});

// 		if (!resultId || !pngBase64) {
// 			return NextResponse.json(
// 				{ error: "Missing required parameters" },
// 				{ status: 400 }
// 			);
// 		}

// 		const imageUrl = await processAndUploadImage(pngBase64);
// 		console.log("Image upload completed", { requestId, imageUrl });

// 		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
// 			imageUrl
// 		);
// 		console.log("Printful upload completed", {
// 			requestId,
// 			printfulFileId,
// 			printfulUrl,
// 		});

// 		const selectedOptions = generateOptions();
// 		const finalRetailPrice = calculateTotalPrice(selectedOptions);
// 		const variantName = `${
// 			pokemonName || "Custom Pokemon"
// 		} Hat with Embroidery`;

// 		const stripeProduct = await stripe.products.create({
// 			name: variantName,
// 			description: "Custom embroidered Pokemon-inspired hat",
// 			images: [printfulUrl],
// 		});

// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100),
// 			currency: "usd",
// 		});

// 		const variantData = {
// 			id: uuidv4(),
// 			printfulFileId,
// 			name: variantName,
// 			color: getSelectedColorNames(selectedOptions),
// 			size: "M",
// 			image: printfulUrl,
// 			retailPrice: finalRetailPrice,
// 			currency: "USD",
// 			stripePriceId: stripePrice.id,
// 			selectedOptions,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		};

// 		console.log("Created variant data", {
// 			requestId,
// 			variantId: variantData.id,
// 			variantName: variantData.name,
// 			options: variantData.selectedOptions,
// 		});

// 		return NextResponse.json({ variant: variantData }, { status: 200 });
// 	} catch (error) {
// 		console.error(`Request ${requestId} failed:`, error);

// 		if (axios.isAxiosError(error)) {
// 			return NextResponse.json(
// 				{
// 					error: "Failed to generate hat variant.",
// 					details: error.response?.data,
// 				},
// 				{ status: error.response?.status || 500 }
// 			);
// 		} else {
// 			return NextResponse.json(
// 				{
// 					error: "Internal Server Error.",
// 					details:
// 						error instanceof Error ? error.message : String(error),
// 				},
// 				{ status: 500 }
// 			);
// 		}
// 	}
// }

// src/app/api/get-hat-variants/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";
// import { getPrintfulClient } from "@/lib/printful/printful-auth";

// interface PrintfulFile {
// 	id: number;
// 	url: string;
// 	hash: string | null;
// 	filename: string;
// 	mime_type: string | null;
// 	size: number;
// 	width: number | null;
// 	height: number | null;
// 	dpi: number | null;
// 	status: "waiting" | "processing" | "accepted" | "rejected" | "failed";
// 	created: string;
// 	thumbnail_url: string | null;
// 	preview_url: string | null;
// 	visible: boolean;
// 	is_temporary: boolean;
// 	type?: string;
// 	_links: {
// 		self: { href: string };
// 	};
// }

// interface PrintfulResponse {
// 	code: number;
// 	result: {
// 		id: number;
// 		type: string;
// 		filename: string;
// 		url: string;
// 		preview_url?: string;
// 		visible: boolean;
// 	};
// }

// const prisma = new PrismaClient();
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error("STRIPE_SECRET_KEY is not defined");
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia",
// });

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// const THREAD_COLORS = {
// 	"#FFFFFF": "1801 White",
// 	"#000000": "1800 Black",
// 	"#96A1A8": "1718 Grey",
// 	"#A67843": "1672 Old Gold",
// 	"#FFCC00": "1951 Gold",
// 	"#E25C27": "1987 Orange",
// 	"#CC3366": "1910 Flamingo",
// 	"#CC3333": "1839 Red",
// 	"#660000": "1784 Maroon",
// 	"#333366": "1966 Navy",
// 	"#005397": "1842 Royal",
// 	"#3399FF": "1695 Aqua/Teal",
// 	"#6B5294": "1832 Purple",
// 	"#01784E": "1751 Kelly Green",
// 	"#7BA35A": "1848 Kiwi Green",
// };

// const EMBROIDERY_POSITIONS = {
// 	front: { id: "embroidery_front", price: 2.95 },
// 	front_large: { id: "embroidery_front_large", price: 2.95 },
// 	back: { id: "embroidery_back", price: 2.95 },
// 	right: { id: "embroidery_right", price: 2.95 },
// 	left: { id: "embroidery_left", price: 2.95 },
// };

// const EMBROIDERY_TYPES = {
// 	flat: { title: "Flat Embroidery", price: 0.0 },
// 	"3d": { title: "3D Puff", price: 1.5 },
// 	both: { title: "Partial 3D Puff", price: 1.5 },
// };

// function randomizeThreadColors(): string[] {
// 	const colorKeys = Object.keys(THREAD_COLORS);
// 	const numberOfColors = Math.floor(Math.random() * 3) + 1;
// 	const selectedColors = colorKeys
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfColors);

// 	console.log("Generated random thread colors", {
// 		numberOfColors,
// 		selectedColors,
// 		colorNames: selectedColors.map(
// 			(color) => THREAD_COLORS[color as keyof typeof THREAD_COLORS]
// 		),
// 	});

// 	return selectedColors;
// }

// function selectRandomEmbroideryType(): string {
// 	const types = Object.keys(EMBROIDERY_TYPES);
// 	const selectedType = types[Math.floor(Math.random() * types.length)];

// 	console.log("Selected random embroidery type", {
// 		selectedType,
// 		typeDetails:
// 			EMBROIDERY_TYPES[selectedType as keyof typeof EMBROIDERY_TYPES],
// 	});

// 	return selectedType;
// }

// function getRandomEmbroideryPositions(): string[] {
// 	const positions = Object.keys(EMBROIDERY_POSITIONS);
// 	const numberOfPositions =
// 		Math.floor(Math.random() * (positions.length - 1)) + 1;
// 	const selectedPositions = positions
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfPositions);

// 	console.log("Generated random embroidery positions", {
// 		numberOfPositions,
// 		selectedPositions,
// 		positionDetails: selectedPositions.map(
// 			(pos) =>
// 				EMBROIDERY_POSITIONS[pos as keyof typeof EMBROIDERY_POSITIONS]
// 		),
// 	});

// 	return selectedPositions;
// }

// function generateOptions(): Record<string, string | string[] | null> {
// 	console.log("Starting options generation");

// 	const selectedOptions: Record<string, string | string[] | null> = {};

// 	const embroideryType = selectRandomEmbroideryType();
// 	selectedOptions["embroidery_type"] = embroideryType;

// 	if (embroideryType === "flat" || embroideryType === "both") {
// 		selectedOptions["thread_colors"] = randomizeThreadColors();
// 	}
// 	if (embroideryType === "3d" || embroideryType === "both") {
// 		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
// 	}

// 	const selectedPositions = getRandomEmbroideryPositions();
// 	selectedPositions.forEach((position) => {
// 		const optionKey =
// 			position === "front_large"
// 				? embroideryType === "3d"
// 					? "thread_colors_3d_front_large"
// 					: "thread_colors_front_large"
// 				: `thread_colors_${position}`;

// 		selectedOptions[optionKey] = randomizeThreadColors();
// 	});

// 	selectedOptions["notes"] = "Custom embroidered design";

// 	console.log("Final generated options", { selectedOptions });
// 	return selectedOptions;
// }

// function calculateTotalPrice(
// 	selectedOptions: Record<string, string | string[] | null>
// ): number {
// 	let totalPrice = 29.99;

// 	const embroideryType = selectedOptions["embroidery_type"] as string;
// 	const typePrice =
// 		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;
// 	totalPrice += typePrice;

// 	let positionPrices = 0;
// 	Object.keys(selectedOptions).forEach((key) => {
// 		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
// 			const position = key
// 				.replace("thread_colors_", "")
// 				.replace("_3d", "");
// 			if (
// 				EMBROIDERY_POSITIONS[
// 					position as keyof typeof EMBROIDERY_POSITIONS
// 				]
// 			) {
// 				positionPrices +=
// 					EMBROIDERY_POSITIONS[
// 						position as keyof typeof EMBROIDERY_POSITIONS
// 					].price;
// 			}
// 		}
// 	});

// 	totalPrice += positionPrices;
// 	const finalPrice = totalPrice * 2;

// 	console.log("Calculated total price", {
// 		basePrice: 29.99,
// 		embroideryTypePrice: typePrice,
// 		positionPrices,
// 		finalPrice,
// 	});

// 	return finalPrice;
// }

// // Continuation of src/app/api/get-hat-variants/route.ts

// function getSelectedColorNames(
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	const colorSet = new Set<string>();

// 	Object.entries(selectedOptions)
// 		.filter(([key]) => key.includes("thread_colors"))
// 		.forEach(([_, colors]) => {
// 			if (Array.isArray(colors)) {
// 				colors.forEach((color) => {
// 					const colorName =
// 						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
// 					if (colorName) colorSet.add(colorName);
// 				});
// 			}
// 		});

// 	const colorNames = Array.from(colorSet).join(", ");
// 	console.log("Generated color names", { colorNames });
// 	return colorNames || "Default Colors";
// }

// async function processAndUploadImage(pngBase64: string): Promise<string> {
// 	try {
// 		console.log("Starting image processing");
// 		const filename = `hat_variant_${uuidv4()}.png`;
// 		console.log("Uploading image", { filename });

// 		const uploadResponse = await axios.post(
// 			`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 			{ pngBase64, filename },
// 			{ headers: { "Content-Type": "application/json" } }
// 		);

// 		console.log("Image upload successful", {
// 			url: uploadResponse.data.url,
// 		});
// 		return uploadResponse.data.url;
// 	} catch (error) {
// 		console.error("Image processing failed:", error);
// 		throw error;
// 	}
// }

// async function uploadToPrintful(
// 	imageUrl: string
// ): Promise<{ id: number; url: string }> {
// 	console.log("Starting Printful upload", { imageUrl });

// 	try {
// 		// Download the image from our server
// 		console.log("Downloading image from server");
// 		const response = await fetch(imageUrl);
// 		const arrayBuffer = await response.arrayBuffer();
// 		const base64Data = Buffer.from(arrayBuffer).toString("base64");

// 		// Create the JSON payload
// 		const payload = {
// 			file: base64Data,
// 			filename: `design-${uuidv4()}.png`,
// 			visible: true,
// 		};

// 		console.log("Uploading file to Printful with payload", {
// 			filename: payload.filename,
// 			fileSize: base64Data.length,
// 		});

// 		const uploadResponse = await fetch("https://api.printful.com/files", {
// 			method: "POST",
// 			headers: {
// 				Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify(payload),
// 		});

// 		const responseText = await uploadResponse.text();
// 		console.log("Raw Printful response:", responseText);

// 		let uploadData: PrintfulResponse;
// 		try {
// 			uploadData = JSON.parse(responseText);
// 		} catch (e) {
// 			console.error("Failed to parse Printful response:", responseText);
// 			throw new Error("Invalid JSON response from Printful");
// 		}

// 		if (!uploadResponse.ok) {
// 			console.error("Direct file upload failed", uploadData);
// 			throw new Error(
// 				`Printful upload failed: ${JSON.stringify(uploadData)}`
// 			);
// 		}

// 		console.log("File upload response:", uploadData);

// 		if (!uploadData.result || !uploadData.result.id) {
// 			throw new Error("Invalid upload response from Printful");
// 		}

// 		const fileData = uploadData.result;

// 		// Create printfile
// 		console.log("Creating printfile", {
// 			fileId: fileData.id,
// 			filename: fileData.filename,
// 		});

// 		// Since the file is already a printfile from the upload, we don't need to create another one
// 		return {
// 			id: fileData.id,
// 			url: fileData.preview_url || imageUrl,
// 		};
// 	} catch (error) {
// 		console.error("Printful upload failed:", {
// 			error,
// 			errorMessage:
// 				error instanceof Error ? error.message : "Unknown error",
// 			errorStack: error instanceof Error ? error.stack : undefined,
// 		});
// 		throw error;
// 	}
// }

// export async function POST(req: NextRequest) {
// 	const requestId = uuidv4();
// 	console.log(`Starting hat variant generation request ${requestId}`);

// 	try {
// 		const { resultId, pngBase64, pokemonName } = await req.json();
// 		console.log("Received request parameters", {
// 			requestId,
// 			resultId,
// 			pokemonName,
// 			pngBase64Length: pngBase64?.length,
// 		});

// 		if (!resultId || !pngBase64) {
// 			return NextResponse.json(
// 				{ error: "Missing required parameters" },
// 				{ status: 400 }
// 			);
// 		}

// 		const imageUrl = await processAndUploadImage(pngBase64);
// 		console.log("Image upload completed", { requestId, imageUrl });

// 		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
// 			imageUrl
// 		);
// 		console.log("Printful upload completed", {
// 			requestId,
// 			printfulFileId,
// 			printfulUrl,
// 		});

// 		const selectedOptions = generateOptions();
// 		const finalRetailPrice = calculateTotalPrice(selectedOptions);
// 		const variantName = `${
// 			pokemonName || "Custom Pokemon"
// 		} Hat with Embroidery`;

// 		const stripeProduct = await stripe.products.create({
// 			name: variantName,
// 			description: "Custom embroidered Pokemon-inspired hat",
// 			images: [printfulUrl],
// 		});

// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100),
// 			currency: "usd",
// 		});

// 		const variantData = {
// 			id: uuidv4(),
// 			printfulFileId,
// 			name: variantName,
// 			color: getSelectedColorNames(selectedOptions),
// 			size: "M",
// 			image: printfulUrl,
// 			retailPrice: finalRetailPrice,
// 			currency: "USD",
// 			stripePriceId: stripePrice.id,
// 			selectedOptions,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		};

// 		console.log("Created variant data", {
// 			requestId,
// 			variantId: variantData.id,
// 			variantName: variantData.name,
// 			options: variantData.selectedOptions,
// 		});

// 		return NextResponse.json({ variant: variantData }, { status: 200 });
// 	} catch (error) {
// 		console.error(`Request ${requestId} failed:`, error);

// 		if (axios.isAxiosError(error)) {
// 			return NextResponse.json(
// 				{
// 					error: "Failed to generate hat variant.",
// 					details: error.response?.data,
// 				},
// 				{ status: error.response?.status || 500 }
// 			);
// 		} else {
// 			return NextResponse.json(
// 				{
// 					error: "Internal Server Error.",
// 					details:
// 						error instanceof Error ? error.message : String(error),
// 				},
// 				{ status: 500 }
// 			);
// 		}
// 	}
// }

// src/app/api/get-hat-variants/route.ts
// full size
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";
// import { getPrintfulClient } from "@/lib/printful/printful-auth";

// interface PrintfulFile {
// 	id: number;
// 	url: string;
// 	hash: string | null;
// 	filename: string;
// 	mime_type: string | null;
// 	size: number;
// 	width: number | null;
// 	height: number | null;
// 	dpi: number | null;
// 	status: "waiting" | "processing" | "accepted" | "rejected";
// 	created: string;
// 	thumbnail_url: string | null;
// 	preview_url: string | null;
// 	visible: boolean;
// 	is_temporary: boolean;
// 	_links: {
// 		self: { href: string };
// 	};
// }

// const prisma = new PrismaClient();
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error("STRIPE_SECRET_KEY is not defined");
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia",
// });

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// const THREAD_COLORS = {
// 	"#FFFFFF": "1801 White",
// 	"#000000": "1800 Black",
// 	"#96A1A8": "1718 Grey",
// 	"#A67843": "1672 Old Gold",
// 	"#FFCC00": "1951 Gold",
// 	"#E25C27": "1987 Orange",
// 	"#CC3366": "1910 Flamingo",
// 	"#CC3333": "1839 Red",
// 	"#660000": "1784 Maroon",
// 	"#333366": "1966 Navy",
// 	"#005397": "1842 Royal",
// 	"#3399FF": "1695 Aqua/Teal",
// 	"#6B5294": "1832 Purple",
// 	"#01784E": "1751 Kelly Green",
// 	"#7BA35A": "1848 Kiwi Green",
// };

// const EMBROIDERY_POSITIONS = {
// 	front: { id: "embroidery_front", price: 2.95 },
// 	front_large: { id: "embroidery_front_large", price: 2.95 },
// 	back: { id: "embroidery_back", price: 2.95 },
// 	right: { id: "embroidery_right", price: 2.95 },
// 	left: { id: "embroidery_left", price: 2.95 },
// };

// const EMBROIDERY_TYPES = {
// 	flat: { title: "Flat Embroidery", price: 0.0 },
// 	"3d": { title: "3D Puff", price: 1.5 },
// 	both: { title: "Partial 3D Puff", price: 1.5 },
// };

// async function waitForFile(
// 	client: any,
// 	fileId: number,
// 	maxAttempts = 10
// ): Promise<PrintfulFile> {
// 	console.log(`Waiting for file ${fileId} to process...`);

// 	for (let i = 0; i < maxAttempts; i++) {
// 		const response = await client.get(`v2/files/${fileId}`);
// 		const fileData = response.data;

// 		console.log(`File status check ${i + 1}/${maxAttempts}:`, {
// 			fileId,
// 			status: fileData.status,
// 		});

// 		if (fileData.status === "accepted") {
// 			return fileData;
// 		} else if (fileData.status === "rejected") {
// 			throw new Error("File was rejected by Printful");
// 		}

// 		await new Promise((resolve) => setTimeout(resolve, 1000));
// 	}

// 	throw new Error("File processing timed out");
// }

// function randomizeThreadColors(): string[] {
// 	const colorKeys = Object.keys(THREAD_COLORS);
// 	const numberOfColors = Math.floor(Math.random() * 3) + 1;
// 	const selectedColors = colorKeys
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfColors);

// 	console.log("Generated random thread colors", {
// 		numberOfColors,
// 		selectedColors,
// 		colorNames: selectedColors.map(
// 			(color) => THREAD_COLORS[color as keyof typeof THREAD_COLORS]
// 		),
// 	});

// 	return selectedColors;
// }

// function selectRandomEmbroideryType(): string {
// 	const types = Object.keys(EMBROIDERY_TYPES);
// 	const selectedType = types[Math.floor(Math.random() * types.length)];

// 	console.log("Selected random embroidery type", {
// 		selectedType,
// 		typeDetails:
// 			EMBROIDERY_TYPES[selectedType as keyof typeof EMBROIDERY_TYPES],
// 	});

// 	return selectedType;
// }

// function getRandomEmbroideryPositions(): string[] {
// 	const positions = Object.keys(EMBROIDERY_POSITIONS);
// 	const numberOfPositions =
// 		Math.floor(Math.random() * (positions.length - 1)) + 1;
// 	const selectedPositions = positions
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfPositions);

// 	console.log("Generated random embroidery positions", {
// 		numberOfPositions,
// 		selectedPositions,
// 		positionDetails: selectedPositions.map(
// 			(pos) =>
// 				EMBROIDERY_POSITIONS[pos as keyof typeof EMBROIDERY_POSITIONS]
// 		),
// 	});

// 	return selectedPositions;
// }

// function generateOptions(): Record<string, string | string[] | null> {
// 	console.log("Starting options generation");

// 	const selectedOptions: Record<string, string | string[] | null> = {};

// 	const embroideryType = selectRandomEmbroideryType();
// 	selectedOptions["embroidery_type"] = embroideryType;

// 	if (embroideryType === "flat" || embroideryType === "both") {
// 		selectedOptions["thread_colors"] = randomizeThreadColors();
// 	}
// 	if (embroideryType === "3d" || embroideryType === "both") {
// 		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
// 	}

// 	const selectedPositions = getRandomEmbroideryPositions();
// 	selectedPositions.forEach((position) => {
// 		const optionKey =
// 			position === "front_large"
// 				? embroideryType === "3d"
// 					? "thread_colors_3d_front_large"
// 					: "thread_colors_front_large"
// 				: `thread_colors_${position}`;

// 		selectedOptions[optionKey] = randomizeThreadColors();
// 	});

// 	selectedOptions["notes"] = "Custom embroidered design";

// 	console.log("Final generated options", { selectedOptions });
// 	return selectedOptions;
// }

// function calculateTotalPrice(
// 	selectedOptions: Record<string, string | string[] | null>
// ): number {
// 	let totalPrice = 29.99;

// 	const embroideryType = selectedOptions["embroidery_type"] as string;
// 	const typePrice =
// 		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;
// 	totalPrice += typePrice;

// 	let positionPrices = 0;
// 	Object.keys(selectedOptions).forEach((key) => {
// 		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
// 			const position = key
// 				.replace("thread_colors_", "")
// 				.replace("_3d", "");
// 			if (
// 				EMBROIDERY_POSITIONS[
// 					position as keyof typeof EMBROIDERY_POSITIONS
// 				]
// 			) {
// 				positionPrices +=
// 					EMBROIDERY_POSITIONS[
// 						position as keyof typeof EMBROIDERY_POSITIONS
// 					].price;
// 			}
// 		}
// 	});

// 	totalPrice += positionPrices;
// 	const finalPrice = totalPrice * 2;

// 	console.log("Calculated total price", {
// 		basePrice: 29.99,
// 		embroideryTypePrice: typePrice,
// 		positionPrices,
// 		finalPrice,
// 	});

// 	return finalPrice;
// }

// function getSelectedColorNames(
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	const colorSet = new Set<string>();

// 	Object.entries(selectedOptions)
// 		.filter(([key]) => key.includes("thread_colors"))
// 		.forEach(([_, colors]) => {
// 			if (Array.isArray(colors)) {
// 				colors.forEach((color) => {
// 					const colorName =
// 						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
// 					if (colorName) colorSet.add(colorName);
// 				});
// 			}
// 		});

// 	const colorNames = Array.from(colorSet).join(", ");
// 	console.log("Generated color names", { colorNames });
// 	return colorNames || "Default Colors";
// }

// async function processAndUploadImage(pngBase64: string): Promise<string> {
// 	try {
// 		console.log("Starting image processing");
// 		const filename = `hat_variant_${uuidv4()}.png`;
// 		console.log("Uploading image", { filename });

// 		const uploadResponse = await axios.post(
// 			`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 			{ pngBase64, filename },
// 			{ headers: { "Content-Type": "application/json" } }
// 		);

// 		console.log("Image upload successful", {
// 			url: uploadResponse.data.url,
// 		});
// 		return uploadResponse.data.url;
// 	} catch (error) {
// 		console.error("Image processing failed:", error);
// 		throw error;
// 	}
// }

// async function uploadToPrintful(
// 	imageUrl: string
// ): Promise<{ id: number; url: string }> {
// 	console.log("Starting Printful upload", { imageUrl });

// 	try {
// 		const printfulClient = await getPrintfulClient();
// 		const filename = `hat_variant_${uuidv4()}.png`;

// 		const payload = {
// 			role: "printfile",
// 			url: imageUrl,
// 			filename,
// 			visible: true,
// 		};

// 		console.log("Sending request to Printful", { payload });

// 		const response = await printfulClient.post("v2/files", payload);
// 		console.log("Printful raw response:", response);

// 		if (!response || !response.data) {
// 			throw new Error("Invalid response from Printful API");
// 		}

// 		const fileData = response.data;
// 		console.log("Initial file data:", fileData);

// 		if (fileData.status === "waiting" || fileData.status === "processing") {
// 			console.log("Waiting for file to be processed...");
// 			const processedFile = await waitForFile(
// 				printfulClient,
// 				fileData.id
// 			);
// 			return {
// 				id: processedFile.id,
// 				url: processedFile.preview_url || imageUrl,
// 			};
// 		}

// 		return {
// 			id: fileData.id,
// 			url: fileData.preview_url || imageUrl,
// 		};
// 	} catch (error) {
// 		console.error("Printful upload failed:", {
// 			error,
// 			errorMessage:
// 				error instanceof Error ? error.message : "Unknown error",
// 			errorStack: error instanceof Error ? error.stack : undefined,
// 		});
// 		throw error;
// 	}
// }

// export async function POST(req: NextRequest) {
// 	const requestId = uuidv4();
// 	console.log(`Starting hat variant generation request ${requestId}`);

// 	try {
// 		const { resultId, pngBase64, pokemonName } = await req.json();
// 		console.log("Received request parameters", {
// 			requestId,
// 			resultId,
// 			pokemonName,
// 			pngBase64Length: pngBase64?.length,
// 		});

// 		if (!resultId || !pngBase64) {
// 			return NextResponse.json(
// 				{ error: "Missing required parameters" },
// 				{ status: 400 }
// 			);
// 		}

// 		const imageUrl = await processAndUploadImage(pngBase64);
// 		console.log("Image upload completed", { requestId, imageUrl });

// 		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
// 			imageUrl
// 		);
// 		console.log("Printful upload completed", {
// 			requestId,
// 			printfulFileId,
// 			printfulUrl,
// 		});

// 		const selectedOptions = generateOptions();
// 		const finalRetailPrice = calculateTotalPrice(selectedOptions);
// 		const variantName = `${
// 			pokemonName || "Custom Pokemon"
// 		} Hat with Embroidery`;

// 		const stripeProduct = await stripe.products.create({
// 			name: variantName,
// 			description: "Custom embroidered Pokemon-inspired hat",
// 			images: [printfulUrl],
// 		});

// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100),
// 			currency: "usd",
// 		});

// 		const variantData = {
// 			id: uuidv4(),
// 			printfulFileId,
// 			name: variantName,
// 			color: getSelectedColorNames(selectedOptions),
// 			size: "M",
// 			image: printfulUrl,
// 			retailPrice: finalRetailPrice,
// 			currency: "USD",
// 			stripePriceId: stripePrice.id,
// 			selectedOptions,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		};

// 		console.log("Created variant data", {
// 			requestId,
// 			variantId: variantData.id,
// 			variantName: variantData.name,
// 			options: variantData.selectedOptions,
// 		});

// 		return NextResponse.json({ variant: variantData }, { status: 200 });
// 	} catch (error) {
// 		console.error(`Request ${requestId} failed:`, error);

// 		if (axios.isAxiosError(error)) {
// 			return NextResponse.json(
// 				{
// 					error: "Failed to generate hat variant.",
// 					details: error.response?.data,
// 				},
// 				{ status: error.response?.status || 500 }
// 			);
// 		} else {
// 			return NextResponse.json(
// 				{
// 					error: "Internal Server Error.",
// 					details:
// 						error instanceof Error ? error.message : String(error),
// 				},
// 				{ status: 500 }
// 			);
// 		}
// 	}
// }

//1024x1024
// still not uploading
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import axiosRetry from "axios-retry";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import { getPrintfulClient } from "@/lib/printful/printful-auth";
import sharp from "sharp";

interface PrintfulFile {
	id: number;
	url: string;
	hash: string | null;
	filename: string;
	mime_type: string | null;
	size: number;
	width: number | null;
	height: number | null;
	dpi: number | null;
	status: "waiting" | "processing" | "accepted" | "rejected";
	created: string;
	thumbnail_url: string | null;
	preview_url: string | null;
	visible: boolean;
	is_temporary: boolean;
	_links: {
		self: { href: string };
	};
}

const prisma = new PrismaClient();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
	throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: "2024-09-30.acacia",
});

axiosRetry(axios, {
	retries: 3,
	retryDelay: axiosRetry.exponentialDelay,
	retryCondition: (error) => {
		return (
			axiosRetry.isNetworkError(error) ||
			axiosRetry.isRetryableError(error)
		);
	},
});

const THREAD_COLORS = {
	"#FFFFFF": "1801 White",
	"#000000": "1800 Black",
	"#96A1A8": "1718 Grey",
	"#A67843": "1672 Old Gold",
	"#FFCC00": "1951 Gold",
	"#E25C27": "1987 Orange",
	"#CC3366": "1910 Flamingo",
	"#CC3333": "1839 Red",
	"#660000": "1784 Maroon",
	"#333366": "1966 Navy",
	"#005397": "1842 Royal",
	"#3399FF": "1695 Aqua/Teal",
	"#6B5294": "1832 Purple",
	"#01784E": "1751 Kelly Green",
	"#7BA35A": "1848 Kiwi Green",
};

const EMBROIDERY_POSITIONS = {
	front: { id: "embroidery_front", price: 2.95 },
	front_large: { id: "embroidery_front_large", price: 2.95 },
	back: { id: "embroidery_back", price: 2.95 },
	right: { id: "embroidery_right", price: 2.95 },
	left: { id: "embroidery_left", price: 2.95 },
};

const EMBROIDERY_TYPES = {
	flat: { title: "Flat Embroidery", price: 0.0 },
	"3d": { title: "3D Puff", price: 1.5 },
	both: { title: "Partial 3D Puff", price: 1.5 },
};

async function waitForFile(
	client: any,
	fileId: number,
	maxAttempts = 10
): Promise<PrintfulFile> {
	console.log(`Waiting for file ${fileId} to process...`);

	for (let i = 0; i < maxAttempts; i++) {
		const response = await client.get(`v2/files/${fileId}`);
		const fileData = response.data;

		console.log(`File status check ${i + 1}/${maxAttempts}:`, {
			fileId,
			status: fileData.status,
		});

		if (fileData.status === "accepted") {
			return fileData;
		} else if (fileData.status === "rejected") {
			throw new Error("File was rejected by Printful");
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	throw new Error("File processing timed out");
}

function randomizeThreadColors(): string[] {
	const colorKeys = Object.keys(THREAD_COLORS);
	const numberOfColors = Math.floor(Math.random() * 3) + 1;
	const selectedColors = colorKeys
		.sort(() => Math.random() - 0.5)
		.slice(0, numberOfColors);

	console.log("Generated random thread colors", {
		numberOfColors,
		selectedColors,
		colorNames: selectedColors.map(
			(color) => THREAD_COLORS[color as keyof typeof THREAD_COLORS]
		),
	});

	return selectedColors;
}

function selectRandomEmbroideryType(): string {
	const types = Object.keys(EMBROIDERY_TYPES);
	const selectedType = types[Math.floor(Math.random() * types.length)];

	console.log("Selected random embroidery type", {
		selectedType,
		typeDetails:
			EMBROIDERY_TYPES[selectedType as keyof typeof EMBROIDERY_TYPES],
	});

	return selectedType;
}

function getRandomEmbroideryPositions(): string[] {
	const positions = Object.keys(EMBROIDERY_POSITIONS);
	const numberOfPositions =
		Math.floor(Math.random() * (positions.length - 1)) + 1;
	const selectedPositions = positions
		.sort(() => Math.random() - 0.5)
		.slice(0, numberOfPositions);

	console.log("Generated random embroidery positions", {
		numberOfPositions,
		selectedPositions,
		positionDetails: selectedPositions.map(
			(pos) =>
				EMBROIDERY_POSITIONS[pos as keyof typeof EMBROIDERY_POSITIONS]
		),
	});

	return selectedPositions;
}

function generateOptions(): Record<string, string | string[] | null> {
	console.log("Starting options generation");

	const selectedOptions: Record<string, string | string[] | null> = {};

	const embroideryType = selectRandomEmbroideryType();
	selectedOptions["embroidery_type"] = embroideryType;

	if (embroideryType === "flat" || embroideryType === "both") {
		selectedOptions["thread_colors"] = randomizeThreadColors();
	}
	if (embroideryType === "3d" || embroideryType === "both") {
		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
	}

	const selectedPositions = getRandomEmbroideryPositions();
	selectedPositions.forEach((position) => {
		const optionKey =
			position === "front_large"
				? embroideryType === "3d"
					? "thread_colors_3d_front_large"
					: "thread_colors_front_large"
				: `thread_colors_${position}`;

		selectedOptions[optionKey] = randomizeThreadColors();
	});

	selectedOptions["notes"] = "Custom embroidered design";

	console.log("Final generated options", { selectedOptions });
	return selectedOptions;
}

function calculateTotalPrice(
	selectedOptions: Record<string, string | string[] | null>
): number {
	let totalPrice = 29.99;

	const embroideryType = selectedOptions["embroidery_type"] as string;
	const typePrice =
		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;
	totalPrice += typePrice;

	let positionPrices = 0;
	Object.keys(selectedOptions).forEach((key) => {
		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
			const position = key
				.replace("thread_colors_", "")
				.replace("_3d", "");
			if (
				EMBROIDERY_POSITIONS[
					position as keyof typeof EMBROIDERY_POSITIONS
				]
			) {
				positionPrices +=
					EMBROIDERY_POSITIONS[
						position as keyof typeof EMBROIDERY_POSITIONS
					].price;
			}
		}
	});

	totalPrice += positionPrices;
	const finalPrice = totalPrice * 2;

	console.log("Calculated total price", {
		basePrice: 29.99,
		embroideryTypePrice: typePrice,
		positionPrices,
		finalPrice,
	});

	return finalPrice;
}

function getSelectedColorNames(
	selectedOptions: Record<string, string | string[] | null>
): string {
	const colorSet = new Set<string>();

	Object.entries(selectedOptions)
		.filter(([key]) => key.includes("thread_colors"))
		.forEach(([_, colors]) => {
			if (Array.isArray(colors)) {
				colors.forEach((color) => {
					const colorName =
						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
					if (colorName) colorSet.add(colorName);
				});
			}
		});

	const colorNames = Array.from(colorSet).join(", ");
	console.log("Generated color names", { colorNames });
	return colorNames || "Default Colors";
}

async function resizeImage(pngBase64: string): Promise<Buffer> {
	const imageBuffer = Buffer.from(pngBase64, "base64");
	const resizedImage = await sharp(imageBuffer)
		.resize(1024, 1024)
		.toFormat("png")
		.toBuffer();

	// Log the metadata to confirm the size
	const metadata = await sharp(resizedImage).metadata();
	console.log("Resized Image Metadata:", {
		width: metadata.width,
		height: metadata.height,
		size: resizedImage.length,
		format: metadata.format,
	});

	return resizedImage;
}

async function processAndUploadImage(pngBase64: string): Promise<string> {
	try {
		console.log("Starting image processing");
		const resizedBuffer = await resizeImage(pngBase64);
		const filename = `hat_variant_${uuidv4()}.png`;
		console.log("Uploading image", { filename });

		const uploadResponse = await axios.post(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
			{ pngBase64: resizedBuffer.toString("base64"), filename },
			{ headers: { "Content-Type": "application/json" } }
		);

		console.log("Image upload successful", {
			url: uploadResponse.data.url,
		});
		return uploadResponse.data.url;
	} catch (error) {
		console.error("Image processing failed:", error);
		throw error;
	}
}

async function uploadToPrintful(
	imageUrl: string
): Promise<{ id: number; url: string }> {
	console.log("Starting Printful upload", { imageUrl });

	try {
		const printfulClient = await getPrintfulClient();
		const filename = `hat_variant_${uuidv4()}.png`;

		const payload = {
			role: "printfile",
			url: imageUrl,
			filename,
			visible: true,
		};

		console.log("Sending request to Printful", { payload });

		const response = await printfulClient.post("v2/files", payload);
		console.log("Printful raw response:", response);

		if (!response || !response.data) {
			throw new Error("Invalid response from Printful API");
		}

		const fileData = response.data;
		console.log("Initial file data:", fileData);

		if (fileData.status === "waiting" || fileData.status === "processing") {
			console.log("Waiting for file to be processed...");
			const processedFile = await waitForFile(
				printfulClient,
				fileData.id
			);
			return {
				id: processedFile.id,
				url: processedFile.preview_url || imageUrl,
			};
		}

		return {
			id: fileData.id,
			url: fileData.preview_url || imageUrl,
		};
	} catch (error) {
		console.error("Printful upload failed:", {
			error,
			errorMessage:
				error instanceof Error ? error.message : "Unknown error",
			errorStack: error instanceof Error ? error.stack : undefined,
		});
		throw error;
	}
}

export async function POST(req: NextRequest) {
	const requestId = uuidv4();
	console.log(`Starting hat variant generation request ${requestId}`);

	try {
		const { resultId, pngBase64, pokemonName } = await req.json();
		console.log("Received request parameters", {
			requestId,
			resultId,
			pokemonName,
			pngBase64Length: pngBase64?.length,
		});

		if (!resultId || !pngBase64) {
			return NextResponse.json(
				{ error: "Missing required parameters" },
				{ status: 400 }
			);
		}

		const imageUrl = await processAndUploadImage(pngBase64);
		console.log("Image upload completed", { requestId, imageUrl });

		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
			imageUrl
		);
		console.log("Printful upload completed", {
			requestId,
			printfulFileId,
			printfulUrl,
		});

		const selectedOptions = generateOptions();
		const finalRetailPrice = calculateTotalPrice(selectedOptions);
		const variantName = `${
			pokemonName || "Custom Pokemon"
		} Hat with Embroidery`;

		const stripeProduct = await stripe.products.create({
			name: variantName,
			description: "Custom embroidered Pokemon-inspired hat",
			images: [printfulUrl],
		});

		const stripePrice = await stripe.prices.create({
			product: stripeProduct.id,
			unit_amount: Math.round(finalRetailPrice * 100),
			currency: "usd",
		});

		const variantData = {
			id: uuidv4(),
			printfulFileId,
			name: variantName,
			color: getSelectedColorNames(selectedOptions),
			size: "M",
			image: printfulUrl,
			retailPrice: finalRetailPrice,
			currency: "USD",
			stripePriceId: stripePrice.id,
			selectedOptions,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		console.log("Created variant data", {
			requestId,
			variantId: variantData.id,
			variantName: variantData.name,
			options: variantData.selectedOptions,
		});

		return NextResponse.json({ variant: variantData }, { status: 200 });
	} catch (error) {
		console.error(`Request ${requestId} failed:`, error);

		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error: "Failed to generate hat variant.",
					details: error.response?.data,
				},
				{ status: error.response?.status || 500 }
			);
		} else {
			return NextResponse.json(
				{
					error: "Internal Server Error.",
					details:
						error instanceof Error ? error.message : String(error),
				},
				{ status: 500 }
			);
		}
	}
}

// still no uploads
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";
// import { getPrintfulClient } from "@/lib/printful/printful-auth";
// import sharp from "sharp";

// const PRINTFUL_API_KEY = `${process.env.PRINTFUL_API_KEY}`;

// interface PrintfulFile {
// 	id: number;
// 	url: string;
// 	hash: string | null;
// 	filename: string;
// 	mime_type: string | null;
// 	size: number;
// 	width: number | null;
// 	height: number | null;
// 	dpi: number | null;
// 	status: "waiting" | "processing" | "accepted" | "rejected" | "failed";
// 	created: string;
// 	thumbnail_url: string | null;
// 	preview_url: string | null;
// 	visible: boolean;
// 	is_temporary: boolean;
// 	_links: {
// 		self: { href: string };
// 	};
// }

// const prisma = new PrismaClient();
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error("STRIPE_SECRET_KEY is not defined");
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia",
// });

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// const THREAD_COLORS = {
// 	"#FFFFFF": "1801 White",
// 	"#000000": "1800 Black",
// 	"#96A1A8": "1718 Grey",
// 	"#A67843": "1672 Old Gold",
// 	"#FFCC00": "1951 Gold",
// 	"#E25C27": "1987 Orange",
// 	"#CC3366": "1910 Flamingo",
// 	"#CC3333": "1839 Red",
// 	"#660000": "1784 Maroon",
// 	"#333366": "1966 Navy",
// 	"#005397": "1842 Royal",
// 	"#3399FF": "1695 Aqua/Teal",
// 	"#6B5294": "1832 Purple",
// 	"#01784E": "1751 Kelly Green",
// 	"#7BA35A": "1848 Kiwi Green",
// };

// const EMBROIDERY_POSITIONS = {
// 	front: { id: "embroidery_front", price: 2.95 },
// 	front_large: { id: "embroidery_front_large", price: 2.95 },
// 	back: { id: "embroidery_back", price: 2.95 },
// 	right: { id: "embroidery_right", price: 2.95 },
// 	left: { id: "embroidery_left", price: 2.95 },
// };

// const EMBROIDERY_TYPES = {
// 	flat: { title: "Flat Embroidery", price: 0.0 },
// 	"3d": { title: "3D Puff", price: 1.5 },
// 	both: { title: "Partial 3D Puff", price: 1.5 },
// };

// async function waitForFile(
// 	client: any,
// 	fileId: number,
// 	maxAttempts = 30, // Increased to 30 attempts
// 	delayMs = 5000 // Increased delay to 5 seconds between attempts
// ): Promise<PrintfulFile> {
// 	console.log(`Waiting for file ${fileId} to process...`);

// 	for (let i = 0; i < maxAttempts; i++) {
// 		const response = await client.get(`v2/files/${fileId}`);
// 		const fileData = response.data;

// 		console.log(`File status check ${i + 1}/${maxAttempts}:`, {
// 			fileId,
// 			status: fileData.status,
// 		});

// 		if (fileData.status === "accepted") {
// 			return fileData;
// 		} else if (
// 			fileData.status === "rejected" ||
// 			fileData.status === "failed"
// 		) {
// 			throw new Error(
// 				"File was rejected or failed to process by Printful"
// 			);
// 		}

// 		await new Promise((resolve) => setTimeout(resolve, delayMs));
// 	}

// 	throw new Error("File processing timed out");
// }

// function randomizeThreadColors(): string[] {
// 	const colorKeys = Object.keys(THREAD_COLORS);
// 	const numberOfColors = Math.floor(Math.random() * 3) + 1;
// 	const selectedColors = colorKeys
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfColors);

// 	console.log("Generated random thread colors", {
// 		numberOfColors,
// 		selectedColors,
// 		colorNames: selectedColors.map(
// 			(color) => THREAD_COLORS[color as keyof typeof THREAD_COLORS]
// 		),
// 	});

// 	return selectedColors;
// }

// function selectRandomEmbroideryType(): string {
// 	const types = Object.keys(EMBROIDERY_TYPES);
// 	const selectedType = types[Math.floor(Math.random() * types.length)];

// 	console.log("Selected random embroidery type", {
// 		selectedType,
// 		typeDetails:
// 			EMBROIDERY_TYPES[selectedType as keyof typeof EMBROIDERY_TYPES],
// 	});

// 	return selectedType;
// }

// function getRandomEmbroideryPositions(): string[] {
// 	const positions = Object.keys(EMBROIDERY_POSITIONS);
// 	const numberOfPositions =
// 		Math.floor(Math.random() * (positions.length - 1)) + 1;
// 	const selectedPositions = positions
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfPositions);

// 	console.log("Generated random embroidery positions", {
// 		numberOfPositions,
// 		selectedPositions,
// 		positionDetails: selectedPositions.map(
// 			(pos) =>
// 				EMBROIDERY_POSITIONS[pos as keyof typeof EMBROIDERY_POSITIONS]
// 		),
// 	});

// 	return selectedPositions;
// }

// function generateOptions(): Record<string, string | string[] | null> {
// 	console.log("Starting options generation");

// 	const selectedOptions: Record<string, string | string[] | null> = {};

// 	const embroideryType = selectRandomEmbroideryType();
// 	selectedOptions["embroidery_type"] = embroideryType;

// 	if (embroideryType === "flat" || embroideryType === "both") {
// 		selectedOptions["thread_colors"] = randomizeThreadColors();
// 	}
// 	if (embroideryType === "3d" || embroideryType === "both") {
// 		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
// 	}

// 	const selectedPositions = getRandomEmbroideryPositions();
// 	selectedPositions.forEach((position) => {
// 		const optionKey =
// 			position === "front_large"
// 				? embroideryType === "3d"
// 					? "thread_colors_3d_front_large"
// 					: "thread_colors_front_large"
// 				: `thread_colors_${position}`;

// 		selectedOptions[optionKey] = randomizeThreadColors();
// 	});

// 	selectedOptions["notes"] = "Custom embroidered design";

// 	console.log("Final generated options", { selectedOptions });
// 	return selectedOptions;
// }

// function calculateTotalPrice(
// 	selectedOptions: Record<string, string | string[] | null>
// ): number {
// 	let totalPrice = 29.99;

// 	const embroideryType = selectedOptions["embroidery_type"] as string;
// 	const typePrice =
// 		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;
// 	totalPrice += typePrice;

// 	let positionPrices = 0;
// 	Object.keys(selectedOptions).forEach((key) => {
// 		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
// 			const position = key
// 				.replace("thread_colors_", "")
// 				.replace("_3d", "");
// 			if (
// 				EMBROIDERY_POSITIONS[
// 					position as keyof typeof EMBROIDERY_POSITIONS
// 				]
// 			) {
// 				positionPrices +=
// 					EMBROIDERY_POSITIONS[
// 						position as keyof typeof EMBROIDERY_POSITIONS
// 					].price;
// 			}
// 		}
// 	});

// 	totalPrice += positionPrices;
// 	const finalPrice = totalPrice * 2;

// 	console.log("Calculated total price", {
// 		basePrice: 29.99,
// 		embroideryTypePrice: typePrice,
// 		positionPrices,
// 		finalPrice,
// 	});

// 	return finalPrice;
// }

// function getSelectedColorNames(
// 	selectedOptions: Record<string, string | string[] | null>
// ): string {
// 	const colorSet = new Set<string>();

// 	Object.entries(selectedOptions)
// 		.filter(([key]) => key.includes("thread_colors"))
// 		.forEach(([_, colors]) => {
// 			if (Array.isArray(colors)) {
// 				colors.forEach((color) => {
// 					const colorName =
// 						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
// 					if (colorName) colorSet.add(colorName);
// 				});
// 			}
// 		});

// 	const colorNames = Array.from(colorSet).join(", ");
// 	console.log("Generated color names", { colorNames });
// 	return colorNames || "Default Colors";
// }

// async function resizeImage(pngBase64: string): Promise<Buffer> {
// 	const imageBuffer = Buffer.from(pngBase64, "base64");
// 	const resizedImage = await sharp(imageBuffer)
// 		.resize(1024, 1024)
// 		.toFormat("png")
// 		.toBuffer();

// 	// Log the metadata to confirm the size
// 	const metadata = await sharp(resizedImage).metadata();
// 	console.log("Resized Image Metadata:", {
// 		width: metadata.width,
// 		height: metadata.height,
// 		size: resizedImage.length,
// 		format: metadata.format,
// 	});

// 	return resizedImage;
// }

// async function processAndUploadImage(pngBase64: string): Promise<string> {
// 	try {
// 		console.log("Starting image processing");
// 		const resizedBuffer = await resizeImage(pngBase64);
// 		const filename = `hat_variant_${uuidv4()}.png`;
// 		console.log("Uploading image", { filename });

// 		const uploadResponse = await axios.post(
// 			`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 			{ pngBase64: resizedBuffer.toString("base64"), filename },
// 			{ headers: { "Content-Type": "application/json" } }
// 		);

// 		console.log("Image upload successful", {
// 			url: uploadResponse.data.url,
// 		});
// 		return uploadResponse.data.url;
// 	} catch (error) {
// 		console.error("Image processing failed:", error);
// 		throw error;
// 	}
// }

// async function uploadToPrintful(imageUrl: string) {
// 	try {
// 		const payload = {
// 			role: "printfile",
// 			url: imageUrl,
// 			filename: `hat_variant_${uuidv4()}.png`,
// 			visible: true,
// 		};

// 		const response = await axios.post(
// 			"https://api.printful.com/v2/files",
// 			payload,
// 			{
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// 				},
// 			}
// 		);

// 		const { id, status } = response.data.data;

// 		if (status === "waiting") {
// 			// Polling until the file is processed
// 			let attempts = 0;
// 			while (attempts < 30) {
// 				const fileResponse = await axios.get(
// 					`https://api.printful.com/v2/files/${id}`,
// 					{
// 						headers: {
// 							Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// 						},
// 					}
// 				);

// 				const fileStatus = fileResponse.data.data.status;

// 				if (fileStatus === "ok") {
// 					console.log(
// 						"File successfully processed:",
// 						fileResponse.data.data
// 					);
// 					return fileResponse.data.data;
// 				} else if (fileStatus === "failed") {
// 					throw new Error(
// 						`File was rejected or failed to process by Printful. Please ensure the image meets Printful's requirements.`
// 					);
// 				}

// 				await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds before next check
// 				attempts++;
// 			}

// 			throw new Error(
// 				"File processing timed out after multiple attempts."
// 			);
// 		} else {
// 			throw new Error(
// 				'Initial file status is not "waiting", something went wrong.'
// 			);
// 		}
// 	} catch (error) {
// 		console.error("Printful upload failed:", error);
// 		throw error;
// 	}
// }

// export async function POST(req: NextRequest) {
// 	const requestId = uuidv4();
// 	console.log(`Starting hat variant generation request ${requestId}`);

// 	try {
// 		const { resultId, pngBase64, pokemonName } = await req.json();
// 		console.log("Received request parameters", {
// 			requestId,
// 			resultId,
// 			pokemonName,
// 			pngBase64Length: pngBase64?.length,
// 		});

// 		if (!resultId || !pngBase64) {
// 			return NextResponse.json(
// 				{ error: "Missing required parameters" },
// 				{ status: 400 }
// 			);
// 		}

// 		const imageUrl = await processAndUploadImage(pngBase64);
// 		console.log("Image upload completed", { requestId, imageUrl });

// 		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
// 			imageUrl
// 		);
// 		console.log("Printful upload completed", {
// 			requestId,
// 			printfulFileId,
// 			printfulUrl,
// 		});

// 		const selectedOptions = generateOptions();
// 		const finalRetailPrice = calculateTotalPrice(selectedOptions);
// 		const variantName = `${
// 			pokemonName || "Custom Pokemon"
// 		} Hat with Embroidery`;

// 		const stripeProduct = await stripe.products.create({
// 			name: variantName,
// 			description: "Custom embroidered Pokemon-inspired hat",
// 			images: [printfulUrl],
// 		});

// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100),
// 			currency: "usd",
// 		});

// 		const variantData = {
// 			id: uuidv4(),
// 			printfulFileId,
// 			name: variantName,
// 			color: getSelectedColorNames(selectedOptions),
// 			size: "M",
// 			image: printfulUrl,
// 			retailPrice: finalRetailPrice,
// 			currency: "USD",
// 			stripePriceId: stripePrice.id,
// 			selectedOptions,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		};

// 		console.log("Created variant data", {
// 			requestId,
// 			variantId: variantData.id,
// 			variantName: variantData.name,
// 			options: variantData.selectedOptions,
// 		});

// 		return NextResponse.json({ variant: variantData }, { status: 200 });
// 	} catch (error) {
// 		console.error(`Request ${requestId} failed:`, error);

// 		if (axios.isAxiosError(error)) {
// 			return NextResponse.json(
// 				{
// 					error: "Failed to generate hat variant.",
// 					details: error.response?.data,
// 				},
// 				{ status: error.response?.status || 500 }
// 			);
// 		} else {
// 			return NextResponse.json(
// 				{
// 					error: "Internal Server Error.",
// 					details:
// 						error instanceof Error ? error.message : String(error),
// 				},
// 				{ status: 500 }
// 			);
// 		}
// 	}
// }

// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// // import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";
// import sharp from "sharp";
// // import { getPrintfulClient } from "@/lib/printful/printful-auth";

// // interface PrintfulFile {
// // 	id: number;
// // 	url: string;
// // 	hash: string | null;
// // 	filename: string;
// // 	mime_type: string | null;
// // 	size: number;
// // 	width: number | null;
// // 	height: number | null;
// // 	dpi: number | null;
// // 	status: "waiting" | "processing" | "accepted" | "rejected" | "failed";
// // 	created: string;
// // 	thumbnail_url: string | null;
// // 	preview_url: string | null;
// // 	visible: boolean;
// // 	is_temporary: boolean;
// // 	_links: {
// // 		self: { href: string };
// // 	};
// // }

// // const prisma = new PrismaClient();
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
// const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

// if (!STRIPE_SECRET_KEY) {
// 	throw new Error("STRIPE_SECRET_KEY is not defined");
// }

// if (!PRINTFUL_API_KEY) {
// 	throw new Error("PRINTFUL_API_KEY is not defined");
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-09-30.acacia",
// });

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay: axiosRetry.exponentialDelay,
// 	retryCondition: (error) => {
// 		return (
// 			axiosRetry.isNetworkError(error) ||
// 			axiosRetry.isRetryableError(error)
// 		);
// 	},
// });

// // Constants for randomization
// const THREAD_COLORS = {
// 	"#FFFFFF": "1801 White",
// 	"#000000": "1800 Black",
// 	"#96A1A8": "1718 Grey",
// 	"#A67843": "1672 Old Gold",
// 	"#FFCC00": "1951 Gold",
// 	"#E25C27": "1987 Orange",
// 	"#CC3366": "1910 Flamingo",
// 	"#CC3333": "1839 Red",
// 	"#660000": "1784 Maroon",
// 	"#333366": "1966 Navy",
// 	"#005397": "1842 Royal",
// 	"#3399FF": "1695 Aqua/Teal",
// 	"#6B5294": "1832 Purple",
// 	"#01784E": "1751 Kelly Green",
// 	"#7BA35A": "1848 Kiwi Green",
// };

// const EMBROIDERY_POSITIONS = {
// 	front: { id: "embroidery_front", price: 2.95 },
// 	front_large: { id: "embroidery_front_large", price: 2.95 },
// 	back: { id: "embroidery_back", price: 2.95 },
// 	right: { id: "embroidery_right", price: 2.95 },
// 	left: { id: "embroidery_left", price: 2.95 },
// };

// const EMBROIDERY_TYPES = {
// 	flat: { title: "Flat Embroidery", price: 0.0 },
// 	"3d": { title: "3D Puff", price: 1.5 },
// 	both: { title: "Partial 3D Puff", price: 1.5 },
// };

// // Utility to resize, check DPI, and convert to sRGB color profile
// async function processImage(pngBase64: string): Promise<Buffer> {
// 	const imageBuffer = Buffer.from(pngBase64, "base64");

// 	// Convert the image, ensuring sRGB, setting DPI, and verifying metadata thoroughly
// 	const processedImage = await sharp(imageBuffer)
// 		.resize(1024, 1024, {
// 			fit: "inside",
// 			withoutEnlargement: true,
// 		})
// 		.withMetadata({
// 			density: 300, // Ensure DPI is set correctly
// 		})
// 		.png({ force: true }) // Make sure it is a PNG format
// 		.toColourspace("srgb")
// 		.toBuffer();

// 	// Validate Metadata
// 	const metadata = await sharp(processedImage).metadata();
// 	console.log("Processed Image Metadata:", {
// 		width: metadata.width,
// 		height: metadata.height,
// 		dpi: metadata.density || 150,
// 		format: metadata.format,
// 		colorSpace: metadata.space,
// 		hasAlpha: metadata.hasAlpha,
// 	});

// 	// Adjust DPI if needed and ensure no alpha channel
// 	if (
// 		!metadata.density ||
// 		metadata.density < 150 ||
// 		metadata.density > 300 ||
// 		metadata.hasAlpha
// 	) {
// 		console.warn("Adjusting DPI and removing alpha channel...");
// 		return sharp(processedImage)
// 			.withMetadata({ density: 300 })
// 			.png({ force: true })
// 			.removeAlpha() // Ensure no transparency is present
// 			.toBuffer();
// 	}

// 	return processedImage;
// }

// function randomizeThreadColors(): string[] {
// 	const colorKeys = Object.keys(THREAD_COLORS);
// 	const numberOfColors = Math.floor(Math.random() * 3) + 1;
// 	const selectedColors = colorKeys
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfColors);

// 	console.log("Generated random thread colors", {
// 		numberOfColors,
// 		selectedColors,
// 		colorNames: selectedColors.map(
// 			(color) => THREAD_COLORS[color as keyof typeof THREAD_COLORS]
// 		),
// 	});

// 	return selectedColors;
// }

// function selectRandomEmbroideryType(): string {
// 	const types = Object.keys(EMBROIDERY_TYPES);
// 	const selectedType = types[Math.floor(Math.random() * types.length)];

// 	console.log("Selected random embroidery type", {
// 		selectedType,
// 		typeDetails:
// 			EMBROIDERY_TYPES[selectedType as keyof typeof EMBROIDERY_TYPES],
// 	});

// 	return selectedType;
// }

// function getRandomEmbroideryPositions(): string[] {
// 	const positions = Object.keys(EMBROIDERY_POSITIONS);
// 	const numberOfPositions =
// 		Math.floor(Math.random() * (positions.length - 1)) + 1;
// 	const selectedPositions = positions
// 		.sort(() => Math.random() - 0.5)
// 		.slice(0, numberOfPositions);

// 	console.log("Generated random embroidery positions", {
// 		numberOfPositions,
// 		selectedPositions,
// 		positionDetails: selectedPositions.map(
// 			(pos) =>
// 				EMBROIDERY_POSITIONS[pos as keyof typeof EMBROIDERY_POSITIONS]
// 		),
// 	});

// 	return selectedPositions;
// }

// function generateOptions(): Record<string, string | string[] | null> {
// 	console.log("Starting options generation");

// 	const selectedOptions: Record<string, string | string[] | null> = {};

// 	const embroideryType = selectRandomEmbroideryType();
// 	selectedOptions["embroidery_type"] = embroideryType;

// 	if (embroideryType === "flat" || embroideryType === "both") {
// 		selectedOptions["thread_colors"] = randomizeThreadColors();
// 	}
// 	if (embroideryType === "3d" || embroideryType === "both") {
// 		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
// 	}

// 	const selectedPositions = getRandomEmbroideryPositions();
// 	selectedPositions.forEach((position) => {
// 		const optionKey =
// 			position === "front_large"
// 				? embroideryType === "3d"
// 					? "thread_colors_3d_front_large"
// 					: "thread_colors_front_large"
// 				: `thread_colors_${position}`;

// 		selectedOptions[optionKey] = randomizeThreadColors();
// 	});

// 	selectedOptions["notes"] = "Custom embroidered design";

// 	console.log("Final generated options", { selectedOptions });
// 	return selectedOptions;
// }

// async function uploadImageToDatabase(
// 	imageBuffer: Buffer,
// 	filename: string
// ): Promise<string> {
// 	console.log("Uploading image to database", { filename });

// 	const uploadResponse = await axios.post(
// 		`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
// 		{ pngBase64: imageBuffer.toString("base64"), filename },
// 		{ headers: { "Content-Type": "application/json" } }
// 	);

// 	console.log("Image uploaded successfully:", uploadResponse.data.url);
// 	return uploadResponse.data.url;
// }

// async function uploadToPrintful(imageUrl: string) {
// 	try {
// 		const payload = {
// 			role: "printfile",
// 			url: imageUrl,
// 			// url: "https://cdn.discordapp.com/attachments/1105210253269794846/1116053118992515184/DripTrace_space_mission_3d_game_demo_in_the_style_of_esoteric_i_e415890a-5454-4692-aac1-a76451f5b023.png?ex=671c7b36&is=671b29b6&hm=224541e534f8c1ea525a876cccf6d30632d64716b8f177a6af64cc868459d979&",
// 			// url: "https://726a-170-103-80-220.ngrok-free.app/api/images/db120a6a-f773-4ae8-804b-f94a6f02d548",
// 			// url: "https://media.discordapp.net/attachments/1105210253269794846/1113317930965405696/DripTrace_DMT_entities_playing_with_sacred_geometrical_symmetry_8d2d2f62-81f3-46ee-8e38-e23abc3c9062.png?ex=671c6b1f&is=671b199f&hm=4168cee46f1a61f8b4e159e99b18b5994ac160e8dff549bd7da36e618f457636&=&format=webp&quality=lossless&width=1302&height=1302",
// 			// url: "https://us-east.storage.cloudconvert.com/tasks/8c87b37c-7e2b-49bc-bb25-0f9572e48df4/DripTrace_DMT_entities_playing_with_sacred_geometrical_symmetry_8d2d2f62-81f3-46ee-8e38-e23abc3c9062.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cloudconvert-production%2F20241025%2Fva%2Fs3%2Faws4_request&X-Amz-Date=20241025T080408Z&X-Amz-Expires=86400&X-Amz-Signature=521f929cbc92b5a618ded96883fae5924b8560b364265cbbcf3421a03fb07bff&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3D%22DripTrace_DMT_entities_playing_with_sacred_geometrical_symmetry_8d2d2f62-81f3-46ee-8e38-e23abc3c9062.png%22&response-content-type=image%2Fpng&x-id=GetObject",
// 			// url: "https://us-east.storage.cloudconvert.com/tasks/192d21f9-0656-4954-88b6-16ec1151193d/hat_variant_2a44d581-1b5e-4114-a6d4-63c7e663ea0b.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cloudconvert-production%2F20241025%2Fva%2Fs3%2Faws4_request&X-Amz-Date=20241025T081715Z&X-Amz-Expires=86400&X-Amz-Signature=ce7ca691205b36e4bbe3d675b92edec76d81f1e5ec4de677e6275ffb28a691ee&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3D%22hat_variant_2a44d581-1b5e-4114-a6d4-63c7e663ea0b.png%22&response-content-type=image%2Fpng&x-id=GetObject",
// 			filename: `hat_variant_${uuidv4()}.png`,
// 			visible: true,
// 		};

// 		const response = await axios.post(
// 			"https://api.printful.com/v2/files",
// 			payload,
// 			{
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// 				},
// 			}
// 		);

// 		const { id, status } = response.data.data;

// 		if (status === "waiting") {
// 			let attempts = 0;
// 			while (attempts < 30) {
// 				const fileResponse = await axios.get(
// 					`https://api.printful.com/v2/files/${id}`,
// 					{
// 						headers: {
// 							Authorization: `Bearer ${PRINTFUL_API_KEY}`,
// 						},
// 					}
// 				);

// 				const fileStatus = fileResponse.data.data.status;
// 				if (fileStatus === "accepted") {
// 					console.log(
// 						"File successfully processed:",
// 						fileResponse.data.data
// 					);
// 					return fileResponse.data.data;
// 				} else if (
// 					fileStatus === "failed" ||
// 					fileStatus === "rejected"
// 				) {
// 					console.error(
// 						"Detailed rejection reason:",
// 						fileResponse.data
// 					);
// 					throw new Error(
// 						`File was rejected or failed to process by Printful. Please ensure the image meets Printful's requirements.`
// 					);
// 				}

// 				await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
// 				attempts++;
// 			}

// 			throw new Error(
// 				"File processing timed out after multiple attempts."
// 			);
// 		} else {
// 			throw new Error(
// 				'Initial file status is not "waiting", something went wrong.'
// 			);
// 		}
// 	} catch (error) {
// 		console.error(
// 			"Printful upload failed:",
// 			error instanceof Error ? error.message : error
// 		);
// 		throw error;
// 	}
// }

// export async function POST(req: NextRequest) {
// 	const requestId = uuidv4();
// 	console.log(`Starting hat variant generation request ${requestId}`);

// 	try {
// 		const { resultId, pngBase64, pokemonName } = await req.json();
// 		console.log("Received request parameters", {
// 			requestId,
// 			resultId,
// 			pokemonName,
// 			pngBase64Length: pngBase64?.length,
// 		});

// 		if (!resultId || !pngBase64) {
// 			return NextResponse.json(
// 				{ error: "Missing required parameters" },
// 				{ status: 400 }
// 			);
// 		}

// 		const processedImage = await processImage(pngBase64);
// 		const filename = `hat_variant_${uuidv4()}.png`;
// 		const imageUrl = await uploadImageToDatabase(processedImage, filename);

// 		const printfulData = await uploadToPrintful(imageUrl);
// 		console.log("Printful upload completed:", printfulData);

// 		const selectedOptions = generateOptions();
// 		const finalRetailPrice = 29.99;

// 		const stripeProduct = await stripe.products.create({
// 			name: `${pokemonName || "Custom Pokemon"} Hat with Embroidery`,
// 			description: "Custom embroidered Pokemon-inspired hat",
// 			images: [printfulData.url],
// 		});

// 		const stripePrice = await stripe.prices.create({
// 			product: stripeProduct.id,
// 			unit_amount: Math.round(finalRetailPrice * 100),
// 			currency: "usd",
// 		});

// 		const variantData = {
// 			id: uuidv4(),
// 			printfulFileId: printfulData.id,
// 			name: `${pokemonName || "Custom Pokemon"} Hat with Embroidery`,
// 			color: "black",
// 			size: "M",
// 			image: printfulData.url,
// 			retailPrice: finalRetailPrice,
// 			currency: "USD",
// 			stripePriceId: stripePrice.id,
// 			selectedOptions,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		};

// 		console.log("Created variant data", {
// 			requestId,
// 			variantId: variantData.id,
// 			variantName: variantData.name,
// 			options: variantData.selectedOptions,
// 		});

// 		return NextResponse.json({ variant: variantData }, { status: 200 });
// 	} catch (error) {
// 		console.error(`Request ${requestId} failed:`, error);
// 		return NextResponse.json(
// 			{
// 				error: "Internal Server Error.",
// 				details: error instanceof Error ? error.message : String(error),
// 			},
// 			{ status: 500 }
// 		);
// 	}
// }
