// // // /src/app/share/[id]/page.tsx

// // import { prisma } from "../../../lib/prisma";
// // import { notFound } from "next/navigation";
// // import SharedResults from "../../../components/SharedResults";

// // interface Pokemon {
// // 	name: string;
// // 	description: string;
// // 	detailedDescription: string[];
// // 	image: string | null;
// // }

// // export default async function SharedResultPage({
// // 	params,
// // }: {
// // 	params: { id: string };
// // }) {
// // 	const result = await prisma.quizResult.findUnique({
// // 		where: { id: params.id },
// // 	});

// // 	if (!result) {
// // 		notFound();
// // 	}

// // 	const { grassPokemon, firePokemon, waterPokemon, teamSummary } = result;

// // 	// Parse the serialized strings back to JSON
// // 	const grassPokemons: Pokemon[] = JSON.parse(grassPokemon);
// // 	const firePokemons: Pokemon[] = JSON.parse(firePokemon);
// // 	const waterPokemons: Pokemon[] = JSON.parse(waterPokemon);

// // 	const allPokemon: Pokemon[] = [
// // 		...grassPokemons,
// // 		...firePokemons,
// // 		...waterPokemons,
// // 	];

// // 	// Pass data to the Client Component
// // 	return <SharedResults allPokemon={allPokemon} teamSummary={teamSummary} />;
// // }

// // /src/app/share/[id]/page.tsx

// import { prisma } from "../../../lib/prisma";
// import { notFound } from "next/navigation";
// import SharedResults from "../../../components/SharedResults";
// import type { Pokemon } from "@/types/pokemon";

// // import { Pokemon } from '../../../types/Pokemon'; // Assuming you have a shared type

// export default async function SharedResultPage({
// 	params,
// }: {
// 	params: { id: string };
// }) {
// 	const result = await prisma.quizResult.findUnique({
// 		where: { id: params.id },
// 	});

// 	if (!result) {
// 		notFound();
// 	}

// 	const {
// 		trainerName,
// 		grassPokemon,
// 		firePokemon,
// 		waterPokemon,
// 		teamSummary,
// 	} = result;

// 	// Parse the serialized strings back to JSON
// 	const grassPokemons: Pokemon[] = JSON.parse(grassPokemon);
// 	const firePokemons: Pokemon[] = JSON.parse(firePokemon);
// 	const waterPokemons: Pokemon[] = JSON.parse(waterPokemon);

// 	const allPokemon: Pokemon[] = [
// 		...grassPokemons,
// 		...firePokemons,
// 		...waterPokemons,
// 	];

// 	// Pass data to the Client Component
// 	return (
// 		<SharedResults
// 			allPokemon={allPokemon}
// 			teamSummary={teamSummary}
// 			trainerName={trainerName}
// 		/>
// 	);
// }

import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import SharedResults from "../../../components/SharedResults";
import { Pokemon } from "@/types/pokemon";
// import { Pokemon } from '../../../types/Pokemon';

export default async function SharedResultPage({
	params,
}: {
	params: { id: string };
}) {
	const result = await prisma.quizResult.findUnique({
		where: { id: params.id },
	});

	if (!result) {
		notFound();
	}

	const {
		trainerName,
		grassPokemon,
		firePokemon,
		waterPokemon,
		teamSummary,
	} = result;

	const grassPokemons: Pokemon[] = grassPokemon as unknown as Pokemon[];
	const firePokemons: Pokemon[] = firePokemon as unknown as Pokemon[];
	const waterPokemons: Pokemon[] = waterPokemon as unknown as Pokemon[];

	const allPokemon: Pokemon[] = [
		...grassPokemons,
		...firePokemons,
		...waterPokemons,
	];

	return (
		<SharedResults
			allPokemon={allPokemon}
			teamSummary={teamSummary}
			trainerName={trainerName || "Unknown Trainer"}
		/>
	);
}
