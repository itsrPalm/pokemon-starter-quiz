// // src/app/api/webhooks/printful/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import crypto from "crypto";

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
// 	try {
// 		const body = await req.text();
// 		const signature = req.headers.get("x-printful-signature");

// 		// Ensure the signature header is present
// 		if (!signature) {
// 			return NextResponse.json(
// 				{ error: "Missing signature header." },
// 				{ status: 400 }
// 			);
// 		}

// 		const secret = process.env.PRINTFUL_WEBHOOK_SECRET;
// 		if (!secret) {
// 			console.error("PRINTFUL_WEBHOOK_SECRET is not set.");
// 			return NextResponse.json(
// 				{ error: "Server configuration error." },
// 				{ status: 500 }
// 			);
// 		}

// 		// Verify the webhook signature
// 		const hash = crypto
// 			.createHmac("sha256", secret)
// 			.update(body)
// 			.digest("hex");

// 		if (hash !== signature) {
// 			return NextResponse.json(
// 				{ error: "Invalid signature." },
// 				{ status: 401 }
// 			);
// 		}

// 		const event = JSON.parse(body);

// 		if (event.type === "file.processed") {
// 			const { id: fileId, status } = event.result;

// 			if (status === "ready") {
// 				// Find the HatVariant associated with this Printful file
// 				const variant = await prisma.hatVariant.findFirst({
// 					where: { printfulFileId: fileId },
// 				});

// 				if (variant) {
// 					// Update the variant's status or perform other actions
// 					// Example: Adding a 'status' field in HatVariant model
// 					await prisma.hatVariant.update({
// 						where: { id: variant.id },
// 						data: {
// 							// status: "ready", // Uncomment and ensure 'status' field exists in the model
// 						},
// 					});

// 					console.log(
// 						`HatVariant ${variant.id} updated based on Printful webhook.`
// 					);
// 				} else {
// 					console.warn(
// 						`No HatVariant found for Printful file ID: ${fileId}`
// 					);
// 				}
// 			} else if (status === "error") {
// 				// Handle error status
// 				console.error(`Printful file ${fileId} processing failed.`);
// 			}
// 		}

// 		// Respond to Printful to acknowledge receipt of the webhook
// 		return NextResponse.json({ received: true }, { status: 200 });
// 	} catch (error) {
// 		console.error("Error in /api/webhooks/printful:", error);
// 		return NextResponse.json(
// 			{ error: "Internal Server Error." },
// 			{ status: 500 }
// 		);
// 	}
// }

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import axiosRetry from "axios-retry";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";

const prisma = new PrismaClient();

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!PRINTFUL_API_KEY) {
	throw new Error("PRINTFUL_API_KEY is not defined in environment variables");
}

if (!STRIPE_SECRET_KEY) {
	throw new Error(
		"STRIPE_SECRET_KEY is not defined in environment variables"
	);
}

if (!NEXT_PUBLIC_BASE_URL) {
	throw new Error(
		"NEXT_PUBLIC_BASE_URL is not defined in environment variables"
	);
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

// Constants for available options
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

// Define the VariantData type
interface VariantData {
	id: string;
	printfulFileId: number;
	name: string;
	color: string;
	size: string;
	image: string;
	retailPrice: number;
	currency: string;
	stripePriceId: string;
	hatProduct: { connect: { id: string } };
	selectedOptions: Record<string, string | string[] | null>;
	createdAt: Date;
	updatedAt: Date;
}

// Helper Functions
function randomizeThreadColors(): string[] {
	const colorKeys = Object.keys(THREAD_COLORS);
	const numberOfColors = Math.floor(Math.random() * 3) + 1; // 1-3 colors
	return colorKeys.sort(() => Math.random() - 0.5).slice(0, numberOfColors);
}

function selectRandomEmbroideryType(): string {
	const types = Object.keys(EMBROIDERY_TYPES);
	return types[Math.floor(Math.random() * types.length)];
}

function getRandomEmbroideryPositions(): string[] {
	const positions = Object.keys(EMBROIDERY_POSITIONS);
	const numberOfPositions =
		Math.floor(Math.random() * (positions.length - 1)) + 1;
	return positions
		.sort(() => Math.random() - 0.5)
		.slice(0, numberOfPositions);
}

function generateOptions(): Record<string, string | string[] | null> {
	const selectedOptions: Record<string, string | string[] | null> = {};

	// Select embroidery type
	const embroideryType = selectRandomEmbroideryType();
	selectedOptions["embroidery_type"] = embroideryType;

	// Select thread colors based on embroidery type
	if (embroideryType === "flat" || embroideryType === "both") {
		selectedOptions["thread_colors"] = randomizeThreadColors();
	}
	if (embroideryType === "3d" || embroideryType === "both") {
		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
	}

	// Randomly select positions and assign colors
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

	// Add notes
	selectedOptions["notes"] = "Custom embroidered design";

	return selectedOptions;
}

function calculateTotalPrice(
	selectedOptions: Record<string, string | string[] | null>
): number {
	let totalPrice = 29.99; // Base price

	// Add embroidery type price
	const embroideryType = selectedOptions["embroidery_type"] as string;
	totalPrice +=
		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;

	// Add position prices
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
				totalPrice +=
					EMBROIDERY_POSITIONS[
						position as keyof typeof EMBROIDERY_POSITIONS
					].price;
			}
		}
	});

	// Double the price for retail
	return totalPrice * 2;
}

function generateVariantName(
	baseTitle: string,
	selectedOptions: Record<string, string | string[] | null>
): string {
	let name = baseTitle;

	// Add embroidery type
	const embroideryType = selectedOptions[
		"embroidery_type"
	] as keyof typeof EMBROIDERY_TYPES;
	name += ` - ${EMBROIDERY_TYPES[embroideryType].title}`;

	// Add positions if any
	const positions: string[] = [];
	if (selectedOptions["thread_colors_back"]) positions.push("Back");
	if (selectedOptions["thread_colors_right"]) positions.push("Right");
	if (selectedOptions["thread_colors_left"]) positions.push("Left");
	if (
		selectedOptions["thread_colors_front_large"] ||
		selectedOptions["thread_colors_3d_front_large"]
	) {
		positions.push("Large Front");
	}

	if (positions.length > 0) {
		name += ` with ${positions.join(", ")} Embroidery`;
	}

	// Add notes if present
	const notes = selectedOptions["notes"];
	if (notes && typeof notes === "string") {
		name += ` (${notes})`;
	}

	return name;
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

	return Array.from(colorSet).join(", ") || "Default Colors";
}

async function checkFileStatus(fileId: number) {
	const statusUrl = `https://api.printful.com/v2/files/${fileId}`;
	let attempts = 0;
	const maxRetries = 30;
	const delayBetweenRetries = 10000;

	while (attempts < maxRetries) {
		try {
			const response = await axios.get(statusUrl, {
				headers: {
					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
				},
			});

			const status = response.data.status; // Corrected to match the actual response structure

			if (status === "ok") {
				console.log("File processing completed successfully.");
				return response.data; // Corrected to return data correctly
			} else if (status === "waiting") {
				console.log(
					`File is still processing. Waiting... Attempt ${
						attempts + 1
					}`
				);
				await new Promise((resolve) =>
					setTimeout(resolve, delayBetweenRetries)
				);
				attempts++;
			} else {
				throw new Error(
					`File processing failed with status: ${status}`
				);
			}
		} catch (error) {
			console.error("Error checking file status:", error);
			throw error;
		}
	}

	throw new Error(
		"File processing did not complete within the expected time."
	);
}

async function uploadToImage(pngBase64: string): Promise<string> {
	try {
		console.log("Initiating image upload...");
		const uploadResponse = await axios.post(
			`${NEXT_PUBLIC_BASE_URL}/api/images/upload`,
			{
				pngBase64,
				filename: `hat_variant_${uuidv4()}.png`,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		console.log("Image uploaded successfully:", uploadResponse.data.url);
		return uploadResponse.data.url;
	} catch (error) {
		console.error("Error uploading image:", error);
		throw new Error("Failed to upload image.");
	}
}

async function uploadToPrintful(
	imageUrl: string
): Promise<{ id: number; url: string }> {
	try {
		console.log("Initiating upload to Printful...");
		const printfulPayload = {
			role: "printfile",
			url: imageUrl,
			filename: `hat_variant_${uuidv4()}.png`,
			visible: true,
		};

		const printfulResponse = await axios.post(
			"https://api.printful.com/v2/files",
			printfulPayload,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${PRINTFUL_API_KEY}`,
				},
			}
		);

		let fileResult;

		const { id } = printfulResponse.data; // Corrected path to extract file ID

		if (id) {
			console.log("Printful response received. Checking file status...");
			fileResult = await checkFileStatus(id);

			return {
				id: fileResult.id,
				url: fileResult.url,
			};
		} else {
			// console.error(
			// 	"Invalid response from Printful:",
			// 	printfulResponse.data
			// );
			// throw new Error("Invalid response from Printful API");
			fileResult = await checkFileStatus(id);
			return {
				id: fileResult.id,
				url: fileResult.url,
			};
		}
	} catch (error) {
		console.error("Error uploading to Printful:", error);
		throw new Error("Failed to upload to Printful.");
	}
}

export async function POST(req: NextRequest) {
	try {
		const { resultId, pngBase64 } = await req.json();
		if (!resultId || !pngBase64) {
			return NextResponse.json(
				{ error: "Missing required parameters" },
				{ status: 400 }
			);
		}

		const imageUrl = await uploadToImage(pngBase64);
		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
			imageUrl
		);

		const hatProductRaw = await prisma.hatProduct.findUnique({
			where: { id: resultId },
			include: {
				options: true,
				techniques: true,
				files: { include: { options: true } },
			},
		});

		if (!hatProductRaw) {
			return NextResponse.json(
				{ error: "HatProduct not found" },
				{ status: 404 }
			);
		}

		const selectedOptions = generateOptions();
		const finalRetailPrice = calculateTotalPrice(selectedOptions);
		const variantName = generateVariantName(
			hatProductRaw.title,
			selectedOptions
		);

		const stripeProduct = await stripe.products.create({
			name: variantName,
			description: hatProductRaw.description || undefined,
			images: [printfulUrl],
		});

		const stripePrice = await stripe.prices.create({
			product: stripeProduct.id,
			unit_amount: Math.round(finalRetailPrice * 100),
			currency: hatProductRaw.currency.toLowerCase(),
		});

		const variantData: VariantData = {
			id: uuidv4(),
			printfulFileId,
			name: variantName,
			color: getSelectedColorNames(selectedOptions),
			size: "M",
			image: printfulUrl,
			retailPrice: finalRetailPrice,
			currency: hatProductRaw.currency,
			stripePriceId: stripePrice.id,
			hatProduct: { connect: { id: hatProductRaw.id } },
			selectedOptions,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const variant = await prisma.hatVariant.create({ data: variantData });
		return NextResponse.json({ variant }, { status: 200 });
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json(
			{ error: "Failed to generate hat variant." },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
