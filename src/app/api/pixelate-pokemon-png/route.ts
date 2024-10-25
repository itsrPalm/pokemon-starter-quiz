// // /pages/api/pixelate-pokemon-png.ts

// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/prisma";

// /**
//  * Converts a Base64 string to an HTMLImageElement.
//  */
// const base64ToImage = (base64: string): Promise<HTMLImageElement> =>
// 	new Promise((resolve, reject) => {
// 		const img = new Image();
// 		img.crossOrigin = "anonymous";
// 		img.onload = () => resolve(img);
// 		img.onerror = () => reject(new Error("Failed to load image"));
// 		img.src = `data:image/png;base64,${base64}`;
// 	});

// /**
//  * Applies pixelation to an image using canvas.
//  */
// const applyPixelation = async (
// 	image: HTMLImageElement,
// 	pixelSize: number = 16
// ): Promise<string> => {
// 	const canvas = document.createElement("canvas");
// 	canvas.width = image.width;
// 	canvas.height = image.height;
// 	const ctx = canvas.getContext("2d");
// 	if (!ctx) throw new Error("Failed to get canvas context");

// 	// Draw the original image
// 	ctx.drawImage(image, 0, 0);

// 	// Apply pixelation
// 	ctx.imageSmoothingEnabled = false;
// 	const scaledWidth = Math.ceil(canvas.width / pixelSize);
// 	const scaledHeight = Math.ceil(canvas.height / pixelSize);

// 	// Scale down
// 	ctx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight);

// 	// Scale back up
// 	ctx.drawImage(
// 		canvas,
// 		0,
// 		0,
// 		scaledWidth,
// 		scaledHeight,
// 		0,
// 		0,
// 		canvas.width,
// 		canvas.height
// 	);

// 	// Return the pixelated image as Base64
// 	return canvas.toDataURL("image/png").split(",")[1];
// };

// export default async function handler(
// 	req: NextApiRequest,
// 	res: NextApiResponse
// ) {
// 	if (req.method !== "POST") {
// 		return res.status(405).json({ error: "Method not allowed" });
// 	}

// 	try {
// 		const { resultId, pokemonName, pngBase64 } = req.body;

// 		if (!resultId || !pokemonName || !pngBase64) {
// 			return res.status(400).json({ error: "Missing required fields" });
// 		}

// 		// Convert Base64 to Image
// 		const image = await base64ToImage(pngBase64);

// 		// Apply pixelation
// 		const pixelatedBase64 = await applyPixelation(image, 16); // Adjust pixelSize as needed

// 		// Fetch existing QuizResult
// 		const existingResult = await prisma.quizResult.findUnique({
// 			where: { id: resultId },
// 			select: { pokemonResultPngs: true },
// 		});

// 		if (!existingResult) {
// 			return res.status(404).json({ error: "QuizResult not found" });
// 		}

// 		// Update the QuizResult with the pixelated PNG
// 		const updatedPngMap = {
// 			...((existingResult.pokemonResultPngs as Record<string, string>) ||
// 				{}),
// 			[pokemonName]: pixelatedBase64,
// 		};

// 		await prisma.quizResult.update({
// 			where: { id: resultId },
// 			data: {
// 				pokemonResultPngs: updatedPngMap,
// 			},
// 		});

// 		return res.status(200).json({ pixelatedPngBase64: pixelatedBase64 });
// 	} catch (error) {
// 		console.error("Error in /api/pixelate-pokemon-png:", error);
// 		return res.status(500).json({ error: "Internal Server Error" });
// 	}
// }

export {};
