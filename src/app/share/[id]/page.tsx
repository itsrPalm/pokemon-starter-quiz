// // import { prisma } from "../../../lib/prisma";
// // import { notFound } from "next/navigation";
// // import SharedResults from "../../../components/SharedResults";
// // import { Pokemon } from "@/types/pokemon";
// // // import { Pokemon } from '../../../types/Pokemon';

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

// // 	const {
// // 		trainerName,
// // 		grassPokemon,
// // 		firePokemon,
// // 		waterPokemon,
// // 		teamSummary,
// // 	} = result;

// // 	const grassPokemons: Pokemon[] = grassPokemon as unknown as Pokemon[];
// // 	const firePokemons: Pokemon[] = firePokemon as unknown as Pokemon[];
// // 	const waterPokemons: Pokemon[] = waterPokemon as unknown as Pokemon[];

// // 	const allPokemon: Pokemon[] = [
// // 		...grassPokemons,
// // 		...firePokemons,
// // 		...waterPokemons,
// // 	];

// // 	return (
// // 		<SharedResults
// // 			allPokemon={allPokemon}
// // 			teamSummary={teamSummary}
// // 			trainerName={trainerName || "Unknown Trainer"}
// // 		/>
// // 	);
// // }

// // /src/app/share/[id]/page.tsx

// // import { prisma } from '../../../../lib/prisma';
// import { notFound } from "next/navigation";
// import SharedResults from "../../../components/SharedResults";
// import { prisma } from "@/lib/prisma";
// import { Pokemon } from "@/types/pokemon";
// // import { Pokemon } from '../../../types/Pokemon';

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

// 	const grassPokemons: Pokemon[] = grassPokemon as unknown as Pokemon[];
// 	const firePokemons: Pokemon[] = firePokemon as unknown as Pokemon[];
// 	const waterPokemons: Pokemon[] = waterPokemon as unknown as Pokemon[];

// 	const allPokemon: Pokemon[] = [
// 		...grassPokemons,
// 		...firePokemons,
// 		...waterPokemons,
// 	];

// 	return (
// 		<SharedResults
// 			resultId={params.id}
// 			allPokemon={allPokemon}
// 			teamSummary={teamSummary}
// 			trainerName={trainerName || "Unknown Trainer"}
// 		/>
// 	);
// }

// /src/app/share/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SharedResults from "@/components/SharedResults";
import { Pokemon } from "@/types/Pokemon";

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
			resultId={params.id}
			trainerName={trainerName || "Unknown Trainer"}
			teamSummary={teamSummary}
			allPokemon={allPokemon}
		/>
	);
}
