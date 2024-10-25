// src/app/api/upload-to-printful/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getPrintfulClient } from "@/lib/printful/printful-auth";

async function uploadToPrintful(
	imageUrl: string
): Promise<{ id: number; url: string }> {
	try {
		const printfulClient = await getPrintfulClient();
		const printfulPayload = {
			role: "printfile",
			url: imageUrl,
			filename: `hat_variant_${uuidv4()}.png`,
			visible: true,
		};

		const printfulResponse = (await printfulClient.post(
			"v2/files",
			printfulPayload
		)) as { data: { id: number; url: string } };
		const fileId = printfulResponse.data.id;

		if (!fileId) {
			throw new Error("Invalid response from Printful API");
		}

		return { id: fileId, url: imageUrl };
	} catch (error) {
		console.error("Failed to upload to Printful:", error);
		throw new Error("Failed to upload to Printful.");
	}
}

export async function POST(req: NextRequest) {
	try {
		const { imageUrl } = await req.json();

		if (!imageUrl) {
			return NextResponse.json(
				{ error: "Missing required parameter: imageUrl" },
				{ status: 400 }
			);
		}

		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
			imageUrl
		);

		return NextResponse.json(
			{ printfulFileId, printfulUrl },
			{ status: 200 }
		);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: "Failed to upload to Printful." },
				{ status: 500 }
			);
		}
	}
}
