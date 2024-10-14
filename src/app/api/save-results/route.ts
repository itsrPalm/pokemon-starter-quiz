// // // // import { NextRequest, NextResponse } from "next/server";
// // // // import { prisma } from "../../../lib/prisma";

// // // // export async function POST(request: NextRequest) {
// // // // 	try {
// // // // 		const {
// // // // 			trainerName,
// // // // 			grassPokemon,
// // // // 			firePokemon,
// // // // 			waterPokemon,
// // // // 			teamSummary,
// // // // 		} = await request.json();

// // // // 		if (!trainerName || typeof trainerName !== "string") {
// // // // 			return NextResponse.json(
// // // // 				{ error: "Trainer name is required and must be a string." },
// // // // 				{ status: 400 }
// // // // 			);
// // // // 		}

// // // // 		const result = await prisma.quizResult.create({
// // // // 			data: {
// // // // 				trainerName,
// // // // 				grassPokemon,
// // // // 				firePokemon,
// // // // 				waterPokemon,
// // // // 				teamSummary,
// // // // 			},
// // // // 		});

// // // // 		return NextResponse.json({ id: result.id });
// // // // 	} catch (error) {
// // // // 		console.error("Error saving results:", error);
// // // // 		return NextResponse.json(
// // // // 			{ error: "An error occurred while saving the results." },
// // // // 			{ status: 500 }
// // // // 		);
// // // // 	}
// // // // }

// // // import { NextRequest, NextResponse } from 'next/server';
// // // import { prisma } from '../../../lib/prisma';
// // // import { generateAudio } from '../../../actions/generateAudio';

// // // export async function POST(request: NextRequest) {
// // //   try {
// // //     const { trainerName, grassPokemon, firePokemon, waterPokemon, teamSummary } = await request.json();

// // //     if (!trainerName || typeof trainerName !== 'string') {
// // //       return NextResponse.json(
// // //         { error: 'Trainer name is required and must be a string.' },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Prepare the full text for audio generation
// // //     const fullText = `${trainerName}'s Pokémon Starter Team.\n\n${teamSummary}`;

// // //     // Generate the audio
// // //     const audioBuffer = await generateAudio(fullText);

// // //     // Convert audio buffer to base64 string
// // //     const audioBase64 = audioBuffer.toString('base64');

// // //     // Save the result to the database, including the audio data
// // //     const result = await prisma.quizResult.create({
// // //       data: {
// // //         trainerName,
// // //         grassPokemon,
// // //         firePokemon,
// // //         waterPokemon,
// // //         teamSummary,
// // //         audioData: audioBuffer,
// // //       },
// // //     });

// // //     return NextResponse.json({ id: result.id });
// // //   } catch (error) {
// // //     console.error('Error saving results:', error);
// // //     return NextResponse.json(
// // //       { error: 'An error occurred while saving the results.' },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // /src/app/api/save-results/route.ts

// // import { NextRequest, NextResponse } from "next/server";
// // import { prisma } from "../../../lib/prisma";
// // import { generateAudio } from "../../../actions/generateAudio";

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

// // 		// Prepare the full text for audio generation
// // 		const fullText = `${trainerName}'s Pokémon Starter Team.\n\n${teamSummary}`;

// // 		// Generate the audio
// // 		const audioBuffer = await generateAudio(fullText);

// // 		// Save the result to the database, including the audio data
// // 		const result = await prisma.quizResult.create({
// // 			data: {
// // 				trainerName,
// // 				grassPokemon,
// // 				firePokemon,
// // 				waterPokemon,
// // 				teamSummary,
// // 				audioData: audioBuffer,
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

// // /src/app/api/save-results/route.ts

// import { prisma } from "@/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";
// // import { prisma } from '../../../../lib/prisma';

// export async function POST(request: NextRequest) {
// 	try {
// 		console.log("Received request at /api/save-results");

// 		const {
// 			trainerName,
// 			grassPokemon,
// 			firePokemon,
// 			waterPokemon,
// 			teamSummary,
// 		} = await request.json();

// 		if (!trainerName || typeof trainerName !== "string") {
// 			console.log("Invalid trainerName");
// 			return NextResponse.json(
// 				{ error: "Trainer name is required and must be a string." },
// 				{ status: 400 }
// 			);
// 		}

// 		// Save the result to the database without audioData
// 		console.log("Saving result to database");
// 		const result = await prisma.quizResult.create({
// 			data: {
// 				trainerName,
// 				grassPokemon,
// 				firePokemon,
// 				waterPokemon,
// 				teamSummary,
// 				// audioData is not set here
// 				audioStatus: "pending",
// 			},
// 		});

// 		console.log("Result saved, returning response");

// 		// Optionally, trigger the audio processing endpoint asynchronously
// 		// We'll use a background process or scheduled function for audio generation
// 		// If you want to trigger it immediately, you can send a request to the processing endpoint
// 		// However, this is optional and depends on your infrastructure

// 		// Example of triggering the audio processing endpoint (Optional)
// 		// Note: Be cautious with this approach as it may contribute to execution time
// 		/*
//     fetch(`${process.env.BASE_URL}/api/process-pending-audios`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ id: result.id }),
//     })
//       .then(() => console.log('Audio processing triggered'))
//       .catch((error) => console.error('Error triggering audio processing:', error));
//     */

// 		return NextResponse.json({ id: result.id });
// 	} catch (error) {
// 		console.error("Error saving results:", error);
// 		return NextResponse.json(
// 			{ error: "An error occurred while saving the results." },
// 			{ status: 500 }
// 		);
// 	}
// }

// /src/app/api/save-results/route.ts

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { SaveResultsRequestBody, SaveResultsResponse } from "@/types/api";
import { Prisma } from "@prisma/client";
import { Pokemon } from "@/types/Pokemon";

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		console.log("Received request at /api/save-results");

		const body: SaveResultsRequestBody = await request.json();

		const {
			trainerName,
			grassPokemon,
			firePokemon,
			waterPokemon,
			teamSummary,
		} = body;

		if (!trainerName || typeof trainerName !== "string") {
			console.log("Invalid trainerName");
			const response: SaveResultsResponse = {
				error: "Trainer name is required and must be a string.",
			};
			return NextResponse.json(response, { status: 400 });
		}

		// Validate Pokémon arrays
		const validatePokemonArray = (
			pokemonArray: Pokemon[],
			type: string
		): boolean => {
			if (!Array.isArray(pokemonArray)) {
				console.error(`${type}Pokemon is not an array.`);
				return false;
			}
			for (const pokemon of pokemonArray) {
				if (
					typeof pokemon.name !== "string" ||
					typeof pokemon.description !== "string" ||
					!Array.isArray(pokemon.detailedDescription) ||
					!pokemon.detailedDescription.every(
						(desc) => typeof desc === "string"
					) ||
					(typeof pokemon.image !== "string" &&
						pokemon.image !== null)
				) {
					console.error(`Invalid Pokémon object in ${type}Pokemon.`);
					return false;
				}
			}
			return true;
		};

		if (
			!validatePokemonArray(grassPokemon, "grass") ||
			!validatePokemonArray(firePokemon, "fire") ||
			!validatePokemonArray(waterPokemon, "water")
		) {
			const response: SaveResultsResponse = {
				error: "Invalid Pokémon data provided.",
			};
			return NextResponse.json(response, { status: 400 });
		}

		// Save the result to the database without audioData
		console.log("Saving result to database");
		const result = await prisma.quizResult.create({
			data: {
				trainerName,
				grassPokemon: grassPokemon as unknown as Prisma.InputJsonValue, // Explicit casting
				firePokemon: firePokemon as unknown as Prisma.InputJsonValue,
				waterPokemon: waterPokemon as unknown as Prisma.InputJsonValue,
				teamSummary,
				// audioData is not set here
				audioStatus: "pending",
			},
		});

		console.log("Result saved, enqueuing audio processing job");

		// Prepare the full text for audio generation
		const fullText = `${trainerName}'s Pokémon Starter Team.\n\n${teamSummary}`;

		// Trigger audio processing asynchronously without blocking
		fetch(`${process.env.BASE_URL}/api/process-pending-audios`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.AUDIO_PROCESSING_SECRET}`, // Add the secret token
			},
			body: JSON.stringify({ resultId: result.id, fullText }),
		})
			.then(() => console.log("Audio processing triggered"))
			.catch((error) =>
				console.error("Error triggering audio processing:", error)
			);

		const response: SaveResultsResponse = { id: result.id };
		return NextResponse.json(response);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error saving results:", error.message);
		} else {
			console.error("Error saving results:", error);
		}
		const response: SaveResultsResponse = {
			error: "An error occurred while saving the results.",
		};
		return NextResponse.json(response, { status: 500 });
	}
}
