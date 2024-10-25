import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Generate an SVG using the Base64 image and cache it.
 */
export async function generateSVGWithBase64(
	pokemonName: string,
	base64: string
) {
	// Fetch existing QuizResult record that has `svgMap` not null
	const existingResults = await prisma.quizResult.findMany({
		where: {
			svgMap: {
				not: Prisma.DbNull,
			},
		},
	});

	// Look for the Pokemon in the retrieved maps
	const svgMap: Record<string, string> = {};
	let foundSVG = "";

	existingResults.forEach((result) => {
		const parsedMap = result.svgMap as Record<string, string>;
		if (parsedMap && parsedMap[pokemonName]) {
			foundSVG = parsedMap[pokemonName];
		}
	});

	if (foundSVG) {
		return foundSVG;
	}

	// Example SVG generation
	const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <image href="${base64}" width="100" height="100" />
    </svg>`;

	svgMap[pokemonName] = svg;

	// Save to the first QuizResult if available, otherwise create a new one
	const resultId = existingResults.length ? existingResults[0].id : undefined;
	if (resultId) {
		const existingSVGMap = existingResults[0]?.svgMap;
		const updatedSVGMap = {
			...(typeof existingSVGMap === "object" && existingSVGMap !== null
				? existingSVGMap
				: {}),
			[pokemonName]: svg,
		};
		await prisma.quizResult.update({
			where: { id: resultId },
			data: {
				svgMap: updatedSVGMap,
			},
		});
	} else {
		await prisma.quizResult.create({
			data: {
				grassPokemon: {},
				firePokemon: {},
				waterPokemon: {},
				teamSummary: "",
				svgMap: { [pokemonName]: svg },
			},
		});
	}

	return svg;
}
