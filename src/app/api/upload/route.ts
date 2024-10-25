// // src/app/api/upload/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { IncomingForm, Fields, Files, File } from "formidable";
// import { promises as fs } from "fs";
// import path from "path";
// import { IncomingMessage } from "http";

// // export const config = {
// // 	api: {
// // 		bodyParser: false, // Disallow body parsing to handle multipart/form-data
// // 	},
// // };

// export const runtime = 'edge' // or 'nodejs'
// export const dynamic = 'force-dynamic' // if needed
// export const revalidate = 0 // if needed

// export async function POST(request: NextRequest) {
// 	try {
// 		const form = new IncomingForm();
// 		const uploadDir = path.join(process.cwd(), "public", "uploads");

// 		await fs.mkdir(uploadDir, { recursive: true });

// 		const data = await new Promise<{ fields: Fields; files: Files }>(
// 			(resolve, reject) => {
// 				const req = request as unknown as IncomingMessage; // Cast to unknown first, then to IncomingMessage
// 				form.parse(
// 					req,
// 					(err: Error | null, fields: Fields, files: Files) => {
// 						if (err) reject(err);
// 						else resolve({ fields, files });
// 					}
// 				);
// 			}
// 		);

// 		let file: File;
// 		const filesArray = data.files.file;

// 		if (Array.isArray(filesArray)) {
// 			file = filesArray[0];
// 		} else if (filesArray) {
// 			file = filesArray as File;
// 		} else {
// 			throw new Error("No file uploaded");
// 		}

// 		const tempFilePath = file.filepath;
// 		const fileName = file.originalFilename || "uploaded_image.png";
// 		const newFilePath = path.join(uploadDir, fileName);

// 		await fs.rename(tempFilePath, newFilePath);

// 		const imageUrl = `/uploads/${fileName}`;

// 		return NextResponse.json({ imageUrl });
// 	} catch (error) {
// 		console.error("Error uploading image:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to upload image" },
// 			{ status: 500 }
// 		);
// 	}
// }

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs"; // Need nodejs runtime for Prisma
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json(
				{ error: "No file uploaded" },
				{ status: 400 }
			);
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			return NextResponse.json(
				{ error: "File must be an image" },
				{ status: 400 }
			);
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return NextResponse.json(
				{ error: "File size must be less than 5MB" },
				{ status: 400 }
			);
		}

		// Convert file to Buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Save to database using Prisma
		const savedImage = await prisma.image.create({
			data: {
				data: buffer,
				mimeType: file.type,
				filename: file.name, // Note: using filename instead of fileName
			},
		});

		return NextResponse.json({
			success: true,
			imageId: savedImage.id,
			filename: savedImage.filename, // Note: using filename instead of fileName
		});
	} catch (error) {
		console.error("Error uploading image:", error);
		return NextResponse.json(
			{ error: "Failed to upload image" },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}

export async function GET() {
	try {
		const images = await prisma.image.findMany({
			select: {
				id: true,
				filename: true, // Note: using filename instead of fileName
				data: true,
				mimeType: true,
			},
		});

		return NextResponse.json({ images });
	} catch (error) {
		console.error("Error fetching images:", error);
		return NextResponse.json(
			{ error: "Failed to fetch images" },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
