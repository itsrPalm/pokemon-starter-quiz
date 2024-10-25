// // lib/base64-utils.ts

// /**
//  * Converts an image URL to a Base64 string.
//  * @param imageUrl - The URL of the image to convert.
//  * @returns A Promise that resolves to the Base64 string of the image.
//  */
// export async function convertFileToBase64(imageUrl: string): Promise<string> {
// 	try {
// 		const response = await fetch(imageUrl);

// 		if (!response.ok) {
// 			throw new Error(`Failed to fetch image: ${response.statusText}`);
// 		}

// 		const blob = await response.blob();

// 		return new Promise<string>((resolve, reject) => {
// 			const reader = new FileReader();
// 			reader.onloadend = () => resolve(reader.result as string);
// 			reader.onerror = () =>
// 				reject(new Error("Failed to convert file to Base64"));
// 			reader.readAsDataURL(blob);
// 		});
// 	} catch (error) {
// 		console.error("Error converting image URL to Base64:", error);
// 		throw new Error("Failed to convert image to Base64");
// 	}
// }

// /**
//  * Converts a file (from an <input> element or drag-and-drop) to a Base64 string.
//  * @param file - The File object to convert.
//  * @returns A Promise that resolves to the Base64 string of the file.
//  */
// export async function convertLocalFileToBase64(file: File): Promise<string> {
// 	return new Promise<string>((resolve, reject) => {
// 		const reader = new FileReader();
// 		reader.onloadend = () => resolve(reader.result as string);
// 		reader.onerror = () =>
// 			reject(new Error("Failed to convert file to Base64"));
// 		reader.readAsDataURL(file);
// 	});
// }

// src/lib/base64-utils.ts

// import fetch from "node-fetch"; // Ensure `node-fetch` is installed

// export async function convertFileToBase64(imageUrl: string): Promise<string> {
// 	try {
// 		const response = await fetch(imageUrl);
// 		const buffer = await response.buffer();
// 		const base64 = buffer.toString("base64");
// 		const mimeType = response.headers.get("content-type") || "image/png";
// 		return `data:${mimeType};base64,${base64}`;
// 	} catch (error) {
// 		console.error("Error converting image to Base64:", error);
// 		throw new Error("Failed to convert image to Base64");
// 	}
// }

import fetch from "node-fetch";

export async function convertFileToBase64(imageUrl: string): Promise<string> {
	try {
		const response = await fetch(imageUrl);
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64 = buffer.toString("base64");
		const mimeType = response.headers.get("content-type") || "image/png";
		return `data:${mimeType};base64,${base64}`;
	} catch (error) {
		console.error("Error converting image to Base64:", error);
		throw new Error("Failed to convert image to Base64");
	}
}
