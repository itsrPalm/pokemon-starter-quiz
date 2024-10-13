import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { name: string } }
) {
	const { name } = params;

	try {
		const response = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
		);
		if (!response.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch Pokémon data" },
				{ status: 404 }
			);
		}

		const data = await response.json();
		const imageUrl = data.sprites.other["official-artwork"].front_default;

		return NextResponse.json({ imageUrl });
	} catch {
		return NextResponse.json(
			{ error: "Failed to fetch Pokémon data" },
			{ status: 500 }
		);
	}
}
