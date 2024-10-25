// src/app/api/upload-file/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

async function processAndUploadImage(pngBase64: string): Promise<string> {
	try {
		const uploadResponse = await axios.post(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/upload`,
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

		return uploadResponse.data.url;
	} catch (error) {
		throw new Error(`Failed to process and upload image:\n${error}`);
	}
}

export async function POST(req: NextRequest) {
	try {
		const { pngBase64 } = await req.json();

		if (!pngBase64) {
			return NextResponse.json(
				{ error: "Missing required parameters" },
				{ status: 400 }
			);
		}

		const imageUrl = await processAndUploadImage(pngBase64);

		return NextResponse.json({ imageUrl }, { status: 200 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error during file upload:", error.message);
			return NextResponse.json(
				{ error: "Failed to upload file." },
				{ status: 500 }
			);
		}
	}
}
