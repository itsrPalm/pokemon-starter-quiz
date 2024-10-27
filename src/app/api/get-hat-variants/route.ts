//1024x1024

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
} from "@/utils/printful";

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
