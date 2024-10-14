// // // /src/app/api/save-results/route.ts

// // import { prisma } from "@/lib/prisma";
// // import { NextRequest, NextResponse } from "next/server";
// // // import { prisma } from '@/lib/prisma';

// // export async function POST(request: NextRequest) {
// // 	try {
// // 		const { grassPokemon, firePokemon, waterPokemon, teamSummary } =
// // 			await request.json();

// // 		// Serialize the Pokémon data to JSON strings
// // 		const grassPokemonString = JSON.stringify(grassPokemon);
// // 		const firePokemonString = JSON.stringify(firePokemon);
// // 		const waterPokemonString = JSON.stringify(waterPokemon);

// // 		const result = await prisma.quizResult.create({
// // 			data: {
// // 				grassPokemon: grassPokemonString,
// // 				firePokemon: firePokemonString,
// // 				waterPokemon: waterPokemonString,
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

// // /src/app/api/save-results/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "../../../lib/prisma";

// export async function POST(request: NextRequest) {
// 	try {
// 		const {
// 			trainerName,
// 			grassPokemon,
// 			firePokemon,
// 			waterPokemon,
// 			teamSummary,
// 		} = await request.json();

// 		if (!trainerName || typeof trainerName !== "string") {
// 			return NextResponse.json(
// 				{ error: "Trainer name is required and must be a string." },
// 				{ status: 400 }
// 			);
// 		}

// 		// Serialize the Pokémon data to JSON strings
// 		const grassPokemonString = JSON.stringify(grassPokemon);
// 		const firePokemonString = JSON.stringify(firePokemon);
// 		const waterPokemonString = JSON.stringify(waterPokemon);

// 		const result = await prisma.quizResult.create({
// 			data: {
// 				trainerName,
// 				grassPokemon: grassPokemonString,
// 				firePokemon: firePokemonString,
// 				waterPokemon: waterPokemonString,
// 				teamSummary,
// 			},
// 		});

// 		return NextResponse.json({ id: result.id });
// 	} catch (error) {
// 		console.error("Error saving results:", error);
// 		return NextResponse.json(
// 			{ error: "An error occurred while saving the results." },
// 			{ status: 500 }
// 		);
// 	}
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

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

		const result = await prisma.quizResult.create({
			data: {
				trainerName,
				grassPokemon,
				firePokemon,
				waterPokemon,
				teamSummary,
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
