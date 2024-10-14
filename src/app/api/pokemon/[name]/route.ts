// import { NextResponse } from "next/server";

// export async function GET(
// 	req: Request,
// 	{ params }: { params: { name: string } }
// ) {
// 	const { name } = params;

// 	try {
// 		const response = await fetch(
// 			`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
// 		);
// 		if (!response.ok) {
// 			return NextResponse.json(
// 				{ error: "Failed to fetch Pokémon data" },
// 				{ status: 404 }
// 			);
// 		}

// 		const data = await response.json();
// 		const imageUrl = data.sprites.other["official-artwork"].front_default;

// 		return NextResponse.json({ imageUrl });
// 	} catch {
// 		return NextResponse.json(
// 			{ error: "Failed to fetch Pokémon data" },
// 			{ status: 500 }
// 		);
// 	}
// }

// /app/api/pokemon/[name]/route.ts

import { NextResponse } from "next/server";

interface EvolutionChain {
	species: {
		name: string;
	};
	evolves_to: EvolutionChain[];
}

interface FlavorTextEntry {
	flavor_text: string;
	language: {
		name: string;
	};
}

export async function GET(
	req: Request,
	{ params }: { params: { name: string } }
) {
	const { name } = params;

	if (!name || typeof name !== "string") {
		return NextResponse.json(
			{ error: "Invalid Pokémon name" },
			{ status: 400 }
		);
	}

	try {
		// Fetch Pokémon data
		const pokemonResponse = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
		);
		if (!pokemonResponse.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch Pokémon data" },
				{ status: 404 }
			);
		}

		const pokemonData = await pokemonResponse.json();
		const imageUrl =
			pokemonData.sprites.other["official-artwork"].front_default;

		// Fetch species data
		const speciesUrl = pokemonData.species.url;
		const speciesResponse = await fetch(speciesUrl);
		if (!speciesResponse.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch Pokémon species data" },
				{ status: 404 }
			);
		}

		const speciesData = await speciesResponse.json();

		// Get English description
		const flavorEntries: FlavorTextEntry[] =
			speciesData.flavor_text_entries.filter(
				(entry: FlavorTextEntry) => entry.language.name === "en"
			);
		const pokedexDescription =
			flavorEntries.length > 0
				? flavorEntries[0].flavor_text.replace(/\f/g, " ")
				: "No description available.";

		// Fetch evolution chain
		const evolutionChainUrl = speciesData.evolution_chain.url;
		const evolutionResponse = await fetch(evolutionChainUrl);
		if (!evolutionResponse.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch Pokémon evolution chain" },
				{ status: 404 }
			);
		}

		const evolutionData = await evolutionResponse.json();

		// Parse evolutions
		const evolutions: string[] = [];
		const evoChain: EvolutionChain = evolutionData.chain;

		const traverseEvolutions = (chain: EvolutionChain) => {
			evolutions.push(chain.species.name);
			if (chain.evolves_to.length > 0) {
				chain.evolves_to.forEach((evo: EvolutionChain) =>
					traverseEvolutions(evo)
				);
			}
		};

		traverseEvolutions(evoChain);

		// Remove duplicates
		const uniqueEvolutions = Array.from(new Set(evolutions));

		// Cry URL (assuming possible source)
		const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${name.toLowerCase()}.mp3`;

		// Animation URL - using animated sprite
		const animationUrl =
			pokemonData.sprites.versions["generation-v"]["black-white"]
				?.animated.front_default || imageUrl;

		return NextResponse.json({
			imageUrl,
			pokedexDescription,
			evolutions: uniqueEvolutions,
			cryUrl,
			animationUrl,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to fetch Pokémon data" },
			{ status: 500 }
		);
	}
}
