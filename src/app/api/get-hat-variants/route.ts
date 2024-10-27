// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import axiosRetry from "axios-retry";
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";
// import {
// 	calculateTotalPrice,
// 	generateOptions,
// 	getSelectedColorNames,
// 	processAndUploadImage,
// 	uploadToPrintful,
// } from "@/utils/printful";

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

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import axiosRetry from "axios-retry";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import {
	calculateTotalPrice,
	generateOptions,
	getSelectedColorNames,
	processAndUploadImage,
	uploadToPrintful,
	waitForFile,
} from "@/utils/printful";
import { getPrintfulClient } from "@/lib/printful/printful-auth";

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

		// Step 1: Upload image to your server/storage
		const imageUrl = await processAndUploadImage(pngBase64);
		console.log("Image upload completed", { requestId, imageUrl });

		// Step 2: Upload to Printful and wait for processing
		const printfulClient = await getPrintfulClient();
		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
			imageUrl
		);

		// Step 3: Wait for file processing to complete with more attempts
		console.log("Waiting for Printful file processing...");
		const processedFile = await waitForFile(
			printfulClient,
			printfulFileId,
			10
		); // Increased attempts

		// if (processedFile.status !== "accepted") {
		// 	throw new Error(
		// 		`File processing failed with status: ${processedFile.status}`
		// 	);
		// }

		if (
			(processedFile.status as string) !== "ok" ||
			(processedFile.status as string) !== "accepted"
		) {
			throw new Error(
				`File processing failed with status: ${processedFile.status}`
			);
		}

		const finalPrintfulUrl = processedFile.preview_url || printfulUrl;
		console.log("Printful processing completed", {
			requestId,
			printfulFileId,
			status: processedFile.status,
			finalPrintfulUrl,
		});

		// Step 4: Generate variant options and calculate price
		const selectedOptions = generateOptions();
		const finalRetailPrice = calculateTotalPrice(selectedOptions);
		const variantName = `${
			pokemonName || "Custom Pokemon"
		} Hat with Embroidery`;

		// Step 5: Create Stripe product and price
		console.log("Creating Stripe product...");
		const stripeProduct = await stripe.products.create({
			name: variantName,
			description: "Custom embroidered Pokemon-inspired hat",
			images: [finalPrintfulUrl],
		});

		console.log("Creating Stripe price...");
		const stripePrice = await stripe.prices.create({
			product: stripeProduct.id,
			unit_amount: Math.round(finalRetailPrice * 100),
			currency: "usd",
		});

		// Step 6: Create final variant data
		const variantData = {
			id: uuidv4(),
			printfulFileId,
			name: variantName,
			color: getSelectedColorNames(selectedOptions),
			size: "M",
			image: finalPrintfulUrl,
			retailPrice: finalRetailPrice,
			currency: "USD",
			stripePriceId: stripePrice.id,
			stripeProductId: stripeProduct.id,
			selectedOptions,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		console.log("Created variant data", {
			requestId,
			variantId: variantData.id,
			variantName: variantData.name,
			options: variantData.selectedOptions,
			stripeProductId: variantData.stripeProductId,
			stripePriceId: variantData.stripePriceId,
		});

		return NextResponse.json({ variant: variantData }, { status: 200 });
	} catch (error) {
		console.error(`Request ${requestId} failed:`, error);

		// Enhanced error handling
		let statusCode = 500;
		let errorMessage = "Internal Server Error";
		let errorDetails =
			error instanceof Error ? error.message : String(error);

		if (axios.isAxiosError(error)) {
			statusCode = error.response?.status || 500;
			errorMessage = "Failed to generate hat variant";
			errorDetails = JSON.stringify({
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
			});
		}

		return NextResponse.json(
			{
				error: errorMessage,
				details: errorDetails,
				requestId, // Include requestId for tracking
			},
			{ status: statusCode }
		);
	}
}
