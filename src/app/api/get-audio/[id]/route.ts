// // /src/app/api/get-audio/[id]/route.ts

// import { prisma } from "@/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";
// // import { prisma } from '../../../../../lib/prisma';

// export async function GET(
// 	request: NextRequest,
// 	{ params }: { params: { id: string } }
// ) {
// 	try {
// 		const { id } = params;

// 		if (!id) {
// 			return NextResponse.json(
// 				{ error: "Result ID is required" },
// 				{ status: 400 }
// 			);
// 		}

// 		const result = await prisma.quizResult.findUnique({
// 			where: { id },
// 		});

// 		if (!result) {
// 			return NextResponse.json(
// 				{ error: "Result not found" },
// 				{ status: 404 }
// 			);
// 		}

// 		const { audioStatus, audioData } = result;

// 		let audioBase64 = null;
// 		if (audioData) {
// 			audioBase64 = Buffer.from(audioData).toString("base64");
// 		}

// 		return NextResponse.json({
// 			audioStatus,
// 			audioBase64,
// 		});
// 	} catch (error) {
// 		console.error("Error fetching audio data:", error);
// 		return NextResponse.json(
// 			{ error: "An error occurred while fetching audio data." },
// 			{ status: 500 }
// 		);
// 	}
// }

// /src/app/api/get-audio/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetAudioResponse } from "@/types/api";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
): Promise<NextResponse> {
	try {
		const { id } = params;

		if (!id) {
			const response: GetAudioResponse = {
				audioStatus: "error",
				audioBase64: null,
				error: "Result ID is required",
			};
			return NextResponse.json(response, { status: 400 });
		}

		const result = await prisma.quizResult.findUnique({
			where: { id },
		});

		if (!result) {
			const response: GetAudioResponse = {
				audioStatus: "error",
				audioBase64: null,
				error: "Result not found",
			};
			return NextResponse.json(response, { status: 404 });
		}

		const { audioStatus, audioData } = result;

		let audioBase64: string | null = null;
		if (audioData) {
			audioBase64 = Buffer.from(audioData).toString("base64");
		}

		const response: GetAudioResponse = {
			audioStatus,
			audioBase64,
		};

		return NextResponse.json(response);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error fetching audio data:", error.message);
		} else {
			console.error("Error fetching audio data:", error);
		}
		const response: GetAudioResponse = {
			audioStatus: "error",
			audioBase64: null,
			error: "An error occurred while fetching audio data.",
		};
		return NextResponse.json(response, { status: 500 });
	}
}
