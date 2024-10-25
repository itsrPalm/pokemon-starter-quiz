"use server";

import { prisma } from "@/lib/prisma";

interface PokemonResultPngs {
	[key: string]: string; // This indicates that the object will have string keys and string values
}

export async function getPokemonPng(resultId: string, pokemonName: string) {
	try {
		const result = await prisma.quizResult.findUnique({
			where: { id: resultId },
			select: { pokemonResultPngs: true },
		});

		if (!result?.pokemonResultPngs) {
			return null;
		}

		// Cast to the specific type to avoid TypeScript errors
		const pngMap = result.pokemonResultPngs as unknown as PokemonResultPngs;

		return pngMap[pokemonName] || null;
	} catch (error) {
		console.error("Error fetching PNG:", error);
		return null;
	}
}
