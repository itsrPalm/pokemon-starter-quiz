// import { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/prisma";

// export default async function handler(
// 	req: NextApiRequest,
// 	res: NextApiResponse
// ) {
// 	if (req.method !== "POST") {
// 		return res.status(405).json({ error: "Method not allowed" });
// 	}

// 	try {
// 		const { pokemonName, pngBase64, resultId } = req.body;

// 		// Update the database to store the PNG base64 image in the dedicated field
// 		const existingData = await prisma.quizResult.findUnique({
// 			where: { id: resultId },
// 			select: { pokemonResultPngs: true },
// 		});

// 		const updatedPngMap = {
// 			...((existingData?.pokemonResultPngs as Record<string, string>) ??
// 				{}),
// 			[pokemonName]: pngBase64,
// 		};

// 		const updatedResult = await prisma.quizResult.update({
// 			where: { id: resultId },
// 			data: {
// 				pokemonResultPngs: updatedPngMap,
// 			},
// 		});

// 		return res.status(200).json({ success: true, updatedResult });
// 	} catch (error) {
// 		console.error("Failed to upload PNG:", error);
// 		return res.status(500).json({ success: false, error: "Upload failed" });
// 	}
// }

// /app/api/upload-pokemon-png/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
	try {
		const { pokemonName, pngBase64, resultId } = await req.json();

		// Update the database to store the PNG base64 image in the dedicated field
		const existingData = await prisma.quizResult.findUnique({
			where: { id: resultId },
			select: { pokemonResultPngs: true },
		});

		const updatedPngMap = {
			...((existingData?.pokemonResultPngs as Record<string, string>) ??
				{}),
			[pokemonName]: pngBase64,
		};

		const updatedResult = await prisma.quizResult.update({
			where: { id: resultId },
			data: {
				pokemonResultPngs: updatedPngMap,
			},
		});

		return NextResponse.json({ success: true, updatedResult });
	} catch (error) {
		console.error("Failed to upload PNG:", error);
		return NextResponse.json(
			{ success: false, error: "Upload failed" },
			{ status: 500 }
		);
	}
}
