// // // src/app/api/images/upload/route.ts

// // import { NextRequest, NextResponse } from "next/server";
// // import { PrismaClient } from "@prisma/client";

// // const prisma = new PrismaClient();

// // export async function POST(req: NextRequest) {
// // 	try {
// // 		const { pngBase64, filename } = await req.json();

// // 		// Input validation
// // 		if (!pngBase64 || !filename) {
// // 			return NextResponse.json(
// // 				{ error: "Missing pngBase64 or filename in request body." },
// // 				{ status: 400 }
// // 			);
// // 		}

// // 		// Remove data URL prefix if present
// // 		const base64Data = pngBase64.startsWith("data:image/png;base64,")
// // 			? pngBase64.replace(/^data:image\/png;base64,/, "")
// // 			: pngBase64;

// // 		// Verify that base64Data is a valid base64 string
// // 		const isValidBase64 =
// // 			/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
// // 				base64Data
// // 			);
// // 		if (!isValidBase64) {
// // 			return NextResponse.json(
// // 				{ error: "Invalid base64 string provided in pngBase64." },
// // 				{ status: 400 }
// // 			);
// // 		}

// // 		// Convert base64 to buffer
// // 		const buffer = Buffer.from(base64Data, "base64");

// // 		// Create Image record in the database
// // 		const image = await prisma.image.create({
// // 			data: {
// // 				data: buffer,
// // 				mimeType: "image/png",
// // 				filename,
// // 			},
// // 		});

// // 		// Construct the image URL (assuming your app is deployed at example.com)
// // 		// Replace '${process.env.NEXT_PUBLIC_BASE_URL}' with your actual domain in production
// // 		const imageUrl = `${
// // 			process.env.NEXT_PUBLIC_BASE_URL ||
// // 			"${process.env.NEXT_PUBLIC_BASE_URL}"
// // 		}/api/images/${image.id}`;

// // 		return NextResponse.json(
// // 			{ id: image.id, url: imageUrl },
// // 			{ status: 201 }
// // 		);
// // 	} catch (error) {
// // 		console.error("Upload Image Error:", error);
// // 		return NextResponse.json(
// // 			{ error: "Failed to upload image." },
// // 			{ status: 500 }
// // 		);
// // 	}
// // }

// // src/app/api/images/upload/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
// 	try {
// 		const { pngBase64, filename } = await req.json();

// 		// Input validation
// 		if (!pngBase64 || !filename) {
// 			return NextResponse.json(
// 				{ error: "Missing pngBase64 or filename in request body." },
// 				{ status: 400 }
// 			);
// 		}

// 		// Remove data URL prefix if present
// 		const base64Data = pngBase64.startsWith("data:image/png;base64,")
// 			? pngBase64.replace(/^data:image\/png;base64,/, "")
// 			: pngBase64;

// 		// Optional: Limit the maximum size of the base64 string
// 		const MAX_BASE64_LENGTH = 10 * 1024 * 1024; // 10MB
// 		if (base64Data.length > MAX_BASE64_LENGTH) {
// 			return NextResponse.json(
// 				{ error: "Base64 string is too large." },
// 				{ status: 400 }
// 			);
// 		}

// 		// Attempt to decode the base64 string
// 		let buffer: Buffer;
// 		try {
// 			buffer = Buffer.from(base64Data, "base64");

// 			// Validate PNG signature (first 8 bytes should match PNG file signature)
// 			const pngSignature = "89504e470d0a1a0a";
// 			if (buffer.slice(0, 8).toString("hex") !== pngSignature) {
// 				return NextResponse.json(
// 					{ error: "Invalid PNG image data." },
// 					{ status: 400 }
// 				);
// 			}
// 		} catch {
// 			return NextResponse.json({
// 				error: "Invalid base64 string provided in pngBase64.",
// 			});
// 		}

// 		// Create Image record in the database
// 		const image = await prisma.image.create({
// 			data: {
// 				data: buffer,
// 				mimeType: "image/png",
// 				filename,
// 			},
// 		});

// 		// Construct the image URL (assuming your app is deployed at example.com)
// 		// Replace '${process.env.NEXT_PUBLIC_BASE_URL}/' with your actual domain in production
// 		const imageUrl = `${
// 			process.env.NEXT_PUBLIC_BASE_URL ||
// 			"${process.env.NEXT_PUBLIC_BASE_URL}"
// 		}/api/images/${image.id}`;

// 		return NextResponse.json(
// 			{ id: image.id, url: imageUrl },
// 			{ status: 201 }
// 		);
// 	} catch (error) {
// 		console.error("Upload Image Error:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to upload image." },
// 			{ status: 500 }
// 		);
// 	}
// }

// src/app/api/images/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	try {
		const { pngBase64, filename } = await req.json();

		// Input validation
		if (!pngBase64 || !filename) {
			return NextResponse.json(
				{ error: "Missing pngBase64 or filename in request body." },
				{ status: 400 }
			);
		}

		// Remove data URL prefix if present
		const base64Data = pngBase64.startsWith("data:image/png;base64,")
			? pngBase64.replace(/^data:image\/png;base64,/, "")
			: pngBase64;

		// Optional: Limit the maximum size of the base64 string
		const MAX_BASE64_LENGTH = 10 * 1024 * 1024; // 10MB
		if (base64Data.length > MAX_BASE64_LENGTH) {
			return NextResponse.json(
				{ error: "Base64 string is too large." },
				{ status: 400 }
			);
		}

		// Attempt to decode the base64 string
		let buffer: Buffer;
		try {
			buffer = Buffer.from(base64Data, "base64");

			// Validate PNG signature (first 8 bytes should match PNG file signature)
			const pngSignature = "89504e470d0a1a0a";
			if (buffer.slice(0, 8).toString("hex") !== pngSignature) {
				return NextResponse.json(
					{ error: "Invalid PNG image data." },
					{ status: 400 }
				);
			}
		} catch (e) {
			return NextResponse.json(
				{ error: `Invalid base64 string provided in pngBase64: ${e}` },
				{ status: 400 }
			);
		}

		// Create Image record in the database
		const image = await prisma.image.create({
			data: {
				data: buffer,
				mimeType: "image/png",
				filename,
			},
		});

		// Construct the image URL
		const imageUrl = `${
			process.env.NEXT_PUBLIC_BASE_URL ||
			"${process.env.NEXT_PUBLIC_BASE_URL}/"
		}/api/images/${image.id}`;

		return NextResponse.json(
			{ id: image.id, url: imageUrl },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Upload Image Error:", error);
		return NextResponse.json(
			{ error: "Failed to upload image." },
			{ status: 500 }
		);
	}
}
