// /src/app/api/process-pending-audios/route.ts

import { generateAudio } from "@/actions/generateAudio";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// import { prisma } from '../../../../lib/prisma';
// import { generateAudio } from '../../../../actions/generateAudio';

export async function GET(_request: NextRequest) {
	try {
		console.log("Starting audio generation for pending results");
		console.log(_request); // Using _request to avoid unused variable warning

		// Fetch all quiz results with audioStatus 'pending'
		const pendingResults = await prisma.quizResult.findMany({
			where: { audioStatus: "pending" },
		});

		for (const result of pendingResults) {
			try {
				console.log(`Generating audio for result ID: ${result.id}`);

				// Update status to 'processing'
				await prisma.quizResult.update({
					where: { id: result.id },
					data: { audioStatus: "processing" },
				});

				// Prepare the full text for audio generation
				const fullText = `${result.trainerName}'s Pokémon Starter Team.\n\n${result.teamSummary}`;

				// Generate the audio
				const audioBuffer = await generateAudio(fullText);

				// Save the audio data and update status to 'completed'
				await prisma.quizResult.update({
					where: { id: result.id },
					data: {
						audioData: audioBuffer,
						audioStatus: "completed",
					},
				});

				console.log(
					`Audio generation completed for result ID: ${result.id}`
				);
			} catch (error) {
				console.error(
					`Error generating audio for result ID: ${result.id}`,
					error
				);

				// Update status to 'failed'
				await prisma.quizResult.update({
					where: { id: result.id },
					data: { audioStatus: "failed" },
				});
			}
		}

		return NextResponse.json({ message: "Audio processing completed" });
	} catch (error) {
		console.error("Error processing pending audios:", error);
		return NextResponse.json(
			{ error: "An error occurred while processing pending audios." },
			{ status: 500 }
		);
	}
}
