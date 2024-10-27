// // utils/printful.ts
// import axios from "axios";

import {
	EMBROIDERY_POSITIONS,
	EMBROIDERY_TYPES,
	THREAD_COLORS,
	type PrintfulFile,
} from "@/lib/constants";
import { getPrintfulClient } from "@/lib/printful/printful-auth";
import type { PrintfulClient } from "@/lib/printful/printful-client";
import axios from "axios";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export async function waitForFile(
	client: PrintfulClient,
	fileId: number,
	maxAttempts = 10
): Promise<PrintfulFile> {
	console.log(`Waiting for file ${fileId} to process...`);

	for (let i = 0; i < maxAttempts; i++) {
		try {
			const response = await client.get(`v2/files/${fileId}`);
			const fileData = response.data;

			if (!fileData) {
				throw new Error("File data is undefined");
			}

			console.log(`File status check ${i + 1}/${maxAttempts}:`, {
				fileId,
				status: fileData.status,
				preview_url: fileData.preview_url,
				hash: fileData.hash,
			});

			const status = fileData.status as PrintfulFile["status"];

			switch (status) {
				case "ok":
				case "accepted":
					return fileData;
				case "rejected":
				case "failed":
					throw new Error(
						`File was rejected by Printful with status: ${status}`
					);
				case "waiting":
				case "processing":
					// On last attempt, return the file data anyway
					if (i === maxAttempts - 1) {
						console.log(
							`File still ${status} after ${maxAttempts} attempts, proceeding anyway`
						);
						return fileData;
					}
					break;
				default:
					// On last attempt, return what we have
					if (i === maxAttempts - 1) {
						console.log(
							`Unknown status ${status} after ${maxAttempts} attempts, proceeding anyway`
						);
						return fileData;
					}
			}

			// Shorter delays to prevent hanging
			const delay = Math.min(1000 * Math.pow(1.2, i), 3000);
			await new Promise((resolve) => setTimeout(resolve, delay));
		} catch (error) {
			console.error(
				`Error checking file status (attempt ${i + 1}/${maxAttempts}):`,
				error
			);

			// On last attempt with error, return whatever we got from the first successful response
			if (i === maxAttempts - 1) {
				const initialResponse = await client.get(`v2/files/${fileId}`);
				if (!initialResponse.data) {
					throw new Error("Initial response data is undefined");
				}
				return initialResponse.data;
			}

			// Shorter retry delay
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	// If we somehow get here, make one final attempt to get the file
	const finalResponse = await client.get(`v2/files/${fileId}`);
	if (!finalResponse.data) {
		throw new Error("Final response data is undefined");
	}
	return finalResponse.data;
}

export function randomizeThreadColors(): string[] {
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

export function selectRandomEmbroideryType(): string {
	const types = Object.keys(EMBROIDERY_TYPES);
	const selectedType = types[Math.floor(Math.random() * types.length)];

	console.log("Selected random embroidery type", {
		selectedType,
		typeDetails:
			EMBROIDERY_TYPES[selectedType as keyof typeof EMBROIDERY_TYPES],
	});

	return selectedType;
}

export function getRandomEmbroideryPositions(): string[] {
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

export function generateOptions(): Record<string, string | string[] | null> {
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

export function calculateTotalPrice(
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

export function getSelectedColorNames(
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

export async function resizeImage(pngBase64: string): Promise<Buffer> {
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

export async function processAndUploadImage(
	pngBase64: string
): Promise<string> {
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

export async function uploadToPrintful(
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
