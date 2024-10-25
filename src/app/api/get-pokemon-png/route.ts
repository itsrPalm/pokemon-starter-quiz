// import { prisma } from "@/lib/prisma";

// interface PokemonResultPngs {
// 	[key: string]: string; // This indicates that the object will have string keys and string values
// }

// export async function getPokemonPng(resultId: string, pokemonName: string) {
// 	try {
// 		const result = await prisma.quizResult.findUnique({
// 			where: { id: resultId },
// 			select: { pokemonResultPngs: true },
// 		});

// 		if (!result?.pokemonResultPngs) {
// 			return null;
// 		}

// 		// Cast to the specific type to avoid TypeScript errors
// 		const pngMap = result.pokemonResultPngs as unknown as PokemonResultPngs;

// 		return pngMap[pokemonName] || null;
// 	} catch (error) {
// 		console.error("Error fetching PNG:", error);
// 		return null;
// 	}
// }

// /app/api/get-pokemon-png/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
	try {
		const { resultId, pokemonName } = await req.json();

		const result = await prisma.quizResult.findUnique({
			where: { id: resultId },
			select: { pokemonResultPngs: true },
		});

		if (!result?.pokemonResultPngs) {
			return NextResponse.json({ pngBase64: null });
		}

		const pngMap = result.pokemonResultPngs as Record<string, string>;
		const pngBase64 = pngMap[pokemonName] || null;

		return NextResponse.json({ pngBase64 });
	} catch (error) {
		console.error("Error fetching PNG:", error);
		return NextResponse.json(
			{ error: "Failed to fetch PNG" },
			{ status: 500 }
		);
	}
}
