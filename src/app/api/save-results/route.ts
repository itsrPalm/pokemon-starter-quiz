import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { SaveResultsRequestBody, SaveResultsResponse } from "@/types/api";
import { Prisma } from "@prisma/client";
import { Pokemon } from "@/types/Pokemon";

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body: SaveResultsRequestBody = await request.json();

		const {
			trainerName,
			grassPokemon,
			firePokemon,
			waterPokemon,
			teamSummary,
			rankings,
		} = body;

		console.log("Received request body:", JSON.stringify(body, null, 2));

		if (!trainerName || typeof trainerName !== "string") {
			const response: SaveResultsResponse = {
				error: "Trainer name is required and must be a string.",
			};
			return NextResponse.json(response, { status: 400 });
		}

		const validatePokemonArray = (
			pokemonArray: Pokemon[],
			type: "grass" | "fire" | "water"
		): Pokemon[] => {
			console.log(
				`Validating ${type}Pokemon:`,
				JSON.stringify(pokemonArray, null, 2)
			);
			if (!Array.isArray(pokemonArray) || pokemonArray.length !== 3) {
				throw new Error(
					`${type}Pokemon is not an array of 3 elements.`
				);
			}
			return pokemonArray.map((pokemon) => {
				const validatedPokemon = {
					...pokemon,
					type,
				};
				console.log(
					`Validating ${type} Pokémon:`,
					JSON.stringify(validatedPokemon, null, 2)
				);
				if (
					typeof validatedPokemon.name !== "string" ||
					typeof validatedPokemon.description !== "string" ||
					!Array.isArray(validatedPokemon.traits) ||
					!validatedPokemon.traits.every(
						(trait: string) => typeof trait === "string"
					) ||
					(typeof validatedPokemon.image !== "string" &&
						validatedPokemon.image !== null) ||
					validatedPokemon.type !== type
				) {
					throw new Error(
						`Invalid Pokémon object in ${type}Pokemon: ${JSON.stringify(
							validatedPokemon,
							null,
							2
						)}`
					);
				}
				return validatedPokemon;
			});
		};

		try {
			const validatedGrassPokemon = validatePokemonArray(
				grassPokemon,
				"grass"
			);
			const validatedFirePokemon = validatePokemonArray(
				firePokemon,
				"fire"
			);
			const validatedWaterPokemon = validatePokemonArray(
				waterPokemon,
				"water"
			);

			const result = await prisma.quizResult.create({
				data: {
					trainerName,
					grassPokemon:
						validatedGrassPokemon as unknown as Prisma.InputJsonValue,
					firePokemon:
						validatedFirePokemon as unknown as Prisma.InputJsonValue,
					waterPokemon:
						validatedWaterPokemon as unknown as Prisma.InputJsonValue,
					teamSummary,
					audioStatus: "pending",
					rankings: rankings as Prisma.InputJsonValue,
				},
			});

			const fullText = `${trainerName}'s Pokémon Starter Team.\n\n${teamSummary}`;

			const baseUrl = `${process.env.BASE_URL}`;
			fetch(`${baseUrl}/api/process-pending-audios`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.AUDIO_PROCESSING_SECRET}`,
				},
				body: JSON.stringify({ resultId: result.id, fullText }),
			}).catch((error) =>
				console.error("Error triggering audio processing:", error)
			);

			const response: SaveResultsResponse = { id: result.id };
			return NextResponse.json(response);
		} catch (validationError: unknown) {
			if (validationError instanceof Error) {
				console.error("Validation error:", validationError.message);
			} else {
				console.error("Validation error:", validationError);
			}
			const response: SaveResultsResponse = {
				error: (validationError as Error).message, // Type assertion to Error
			};
			return NextResponse.json(response, { status: 400 });
		}
	} catch (error: unknown) {
		console.error("Error saving results:", error);
		const response: SaveResultsResponse = {
			error: "An error occurred while saving the results.",
		};
		return NextResponse.json(response, { status: 500 });
	}
}
