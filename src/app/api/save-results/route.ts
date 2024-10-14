// // import { NextRequest, NextResponse } from "next/server";
// // import { prisma } from "../../../lib/prisma";

// // export async function POST(request: NextRequest) {
// // 	try {
// // 		const {
// // 			trainerName,
// // 			grassPokemon,
// // 			firePokemon,
// // 			waterPokemon,
// // 			teamSummary,
// // 		} = await request.json();

// // 		if (!trainerName || typeof trainerName !== "string") {
// // 			return NextResponse.json(
// // 				{ error: "Trainer name is required and must be a string." },
// // 				{ status: 400 }
// // 			);
// // 		}

// // 		const result = await prisma.quizResult.create({
// // 			data: {
// // 				trainerName,
// // 				grassPokemon,
// // 				firePokemon,
// // 				waterPokemon,
// // 				teamSummary,
// // 			},
// // 		});

// // 		return NextResponse.json({ id: result.id });
// // 	} catch (error) {
// // 		console.error("Error saving results:", error);
// // 		return NextResponse.json(
// // 			{ error: "An error occurred while saving the results." },
// // 			{ status: 500 }
// // 		);
// // 	}
// // }

// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '../../../lib/prisma';
// import { generateAudio } from '../../../actions/generateAudio';

// export async function POST(request: NextRequest) {
//   try {
//     const { trainerName, grassPokemon, firePokemon, waterPokemon, teamSummary } = await request.json();

//     if (!trainerName || typeof trainerName !== 'string') {
//       return NextResponse.json(
//         { error: 'Trainer name is required and must be a string.' },
//         { status: 400 }
//       );
//     }

//     // Prepare the full text for audio generation
//     const fullText = `${trainerName}'s Pokémon Starter Team.\n\n${teamSummary}`;

//     // Generate the audio
//     const audioBuffer = await generateAudio(fullText);

//     // Convert audio buffer to base64 string
//     const audioBase64 = audioBuffer.toString('base64');

//     // Save the result to the database, including the audio data
//     const result = await prisma.quizResult.create({
//       data: {
//         trainerName,
//         grassPokemon,
//         firePokemon,
//         waterPokemon,
//         teamSummary,
//         audioData: audioBuffer,
//       },
//     });

//     return NextResponse.json({ id: result.id });
//   } catch (error) {
//     console.error('Error saving results:', error);
//     return NextResponse.json(
//       { error: 'An error occurred while saving the results.' },
//       { status: 500 }
//     );
//   }
// }

// /src/app/api/save-results/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { generateAudio } from "../../../actions/generateAudio";

export async function POST(request: NextRequest) {
	try {
		const {
			trainerName,
			grassPokemon,
			firePokemon,
			waterPokemon,
			teamSummary,
		} = await request.json();

		if (!trainerName || typeof trainerName !== "string") {
			return NextResponse.json(
				{ error: "Trainer name is required and must be a string." },
				{ status: 400 }
			);
		}

		// Prepare the full text for audio generation
		const fullText = `${trainerName}'s Pokémon Starter Team.\n\n${teamSummary}`;

		// Generate the audio
		const audioBuffer = await generateAudio(fullText);

		// Save the result to the database, including the audio data
		const result = await prisma.quizResult.create({
			data: {
				trainerName,
				grassPokemon,
				firePokemon,
				waterPokemon,
				teamSummary,
				audioData: audioBuffer,
			},
		});

		return NextResponse.json({ id: result.id });
	} catch (error) {
		console.error("Error saving results:", error);
		return NextResponse.json(
			{ error: "An error occurred while saving the results." },
			{ status: 500 }
		);
	}
}
