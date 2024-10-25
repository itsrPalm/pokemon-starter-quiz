// src/app/api/images/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

		if (!id) {
			return NextResponse.json(
				{ error: "Image ID is required." },
				{ status: 400 }
			);
		}

		const image = await prisma.image.findUnique({
			where: { id },
		});

		if (!image) {
			return NextResponse.json(
				{ error: "Image not found." },
				{ status: 404 }
			);
		}

		return new NextResponse(image.data, {
			headers: {
				"Content-Type": image.mimeType,
				"Content-Disposition": `inline; filename="${image.filename}"`,
			},
		});
	} catch (error) {
		console.error("Retrieve Image Error:", error);
		return NextResponse.json(
			{ error: "Failed to retrieve image." },
			{ status: 500 }
		);
	}
}
