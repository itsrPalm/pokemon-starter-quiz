// // import { prisma } from "@/lib/prisma";
// // import { notFound } from "next/navigation";
// // import SharedResults from "@/components/SharedResults";
// // import { Pokemon } from "@/types/Pokemon";

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

// // 	// Add the 'type' property to each Pokémon
// // 	const grassPokemons: (Pokemon & { type: "grass" })[] = (
// // 		grassPokemon as unknown as Pokemon[]
// // 	).map((pokemon) => ({
// // 		...pokemon,
// // 		type: "grass",
// // 	}));
// // 	const firePokemons: (Pokemon & { type: "fire" })[] = (
// // 		firePokemon as unknown as Pokemon[]
// // 	).map((pokemon) => ({
// // 		...pokemon,
// // 		type: "fire",
// // 	}));
// // 	const waterPokemons: (Pokemon & { type: "water" })[] = (
// // 		waterPokemon as unknown as Pokemon[]
// // 	).map((pokemon) => ({
// // 		...pokemon,
// // 		type: "water",
// // 	}));

// // 	// Ensure interleaved order: grass, fire, water
// // 	const maxLength = Math.max(
// // 		grassPokemons.length,
// // 		firePokemons.length,
// // 		waterPokemons.length
// // 	);
// // 	const allPokemon: (Pokemon & {
// // 		type: "grass" | "fire" | "water";
// // 		rank: string;
// // 	})[] = [];

// // 	for (let i = 0; i < maxLength; i++) {
// // 		if (i < grassPokemons.length)
// // 			allPokemon.push({
// // 				...grassPokemons[i],
// // 				rank:
// // 					i === 0
// // 						? "Your Top Match!"
// // 						: i === 1
// // 						? "Runner Up"
// // 						: "Can Relate To",
// // 			});
// // 		if (i < firePokemons.length)
// // 			allPokemon.push({
// // 				...firePokemons[i],
// // 				rank:
// // 					i === 0
// // 						? "Your Top Match!"
// // 						: i === 1
// // 						? "Runner Up"
// // 						: "Can Relate To",
// // 			});
// // 		if (i < waterPokemons.length)
// // 			allPokemon.push({
// // 				...waterPokemons[i],
// // 				rank:
// // 					i === 0
// // 						? "Your Top Match!"
// // 						: i === 1
// // 						? "Runner Up"
// // 						: "Can Relate To",
// // 			});
// // 	}

// // 	return (
// // 		<SharedResults
// // 			resultId={params.id}
// // 			trainerName={trainerName || "Unknown Trainer"}
// // 			teamSummary={teamSummary}
// // 			allPokemon={allPokemon}
// // 		/>
// // 	);
// // }

// // // import { prisma } from "@/lib/prisma";
// // // import { notFound } from "next/navigation";
// // // import SharedResults from "@/components/SharedResults";
// // // import { Pokemon } from "@/types/Pokemon";

// // // export default async function SharedResultPage({
// // // 	params,
// // // }: {
// // // 	params: { id: string };
// // // }) {
// // // 	const result = await prisma.quizResult.findUnique({
// // // 		where: { id: params.id },
// // // 	});

// // // 	if (!result) {
// // // 		notFound();
// // // 	}

// // // 	const {
// // // 		trainerName,
// // // 		grassPokemon,
// // // 		firePokemon,
// // // 		waterPokemon,
// // // 		teamSummary,
// // // 	} = result;

// // // 	// Add the 'type' property to each Pokémon
// // // 	const grassPokemons: (Pokemon & { type: "grass" })[] = (
// // // 		grassPokemon as unknown as Pokemon[]
// // // 	).map((pokemon) => ({
// // // 		...pokemon,
// // // 		type: "grass",
// // // 	}));
// // // 	const firePokemons: (Pokemon & { type: "fire" })[] = (
// // // 		firePokemon as unknown as Pokemon[]
// // // 	).map((pokemon) => ({
// // // 		...pokemon,
// // // 		type: "fire",
// // // 	}));
// // // 	const waterPokemons: (Pokemon & { type: "water" })[] = (
// // // 		waterPokemon as unknown as Pokemon[]
// // // 	).map((pokemon) => ({
// // // 		...pokemon,
// // // 		type: "water",
// // // 	}));

// // // 	// Ensure strict ordering: grass, fire, water
// // // 	const maxLength = Math.max(
// // // 		grassPokemons.length,
// // // 		firePokemons.length,
// // // 		waterPokemons.length
// // // 	);
// // // 	const allPokemon: (Pokemon & { type: "grass" | "fire" | "water" })[] = [];

// // // 	for (let i = 0; i < maxLength; i++) {
// // // 		if (i < grassPokemons.length) allPokemon.push(grassPokemons[i]);
// // // 		if (i < firePokemons.length) allPokemon.push(firePokemons[i]);
// // // 		if (i < waterPokemons.length) allPokemon.push(waterPokemons[i]);
// // // 	}

// // // 	return (
// // // 		<SharedResults
// // // 			resultId={params.id}
// // // 			trainerName={trainerName || "Unknown Trainer"}
// // // 			teamSummary={teamSummary}
// // // 			allPokemon={allPokemon}
// // // 		/>
// // // 	);
// // // }

// import { prisma } from "@/lib/prisma";
// import { notFound } from "next/navigation";
// import SharedResults from "@/components/SharedResults";
// import { Pokemon } from "@/types/Pokemon";

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

// 	// Add the 'type' property to each Pokémon
// 	const grassPokemons: (Pokemon & { type: "grass" })[] = (
// 		grassPokemon as unknown as Pokemon[]
// 	).map((pokemon) => ({
// 		...pokemon,
// 		type: "grass",
// 	}));
// 	const firePokemons: (Pokemon & { type: "fire" })[] = (
// 		firePokemon as unknown as Pokemon[]
// 	).map((pokemon) => ({
// 		...pokemon,
// 		type: "fire",
// 	}));
// 	const waterPokemons: (Pokemon & { type: "water" })[] = (
// 		waterPokemon as unknown as Pokemon[]
// 	).map((pokemon) => ({
// 		...pokemon,
// 		type: "water",
// 	}));

// 	// Ensure strict ordering: grass, fire, water
// 	const maxLength = Math.max(
// 		grassPokemons.length,
// 		firePokemons.length,
// 		waterPokemons.length
// 	);
// 	const allPokemon: (Pokemon & { type: "grass" | "fire" | "water" })[] = [];

// 	for (let i = 0; i < maxLength; i++) {
// 		if (i < grassPokemons.length) allPokemon.push(grassPokemons[i]);
// 		if (i < firePokemons.length) allPokemon.push(firePokemons[i]);
// 		if (i < waterPokemons.length) allPokemon.push(waterPokemons[i]);
// 	}

// 	return (
// 		<SharedResults
// 			resultId={params.id}
// 			trainerName={trainerName || "Unknown Trainer"}
// 			teamSummary={teamSummary}
// 			allPokemon={allPokemon}
// 		/>
// 	);
// }

// // import { prisma } from "@/lib/prisma";
// // import { notFound } from "next/navigation";
// // import SharedResults from "@/components/SharedResults";
// // import { Pokemon } from "@/types/Pokemon";

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
// // 		rankings,
// // 	} = result;

// // 	const grassPokemons: (Pokemon & { type: "grass" })[] = (
// // 		grassPokemon as unknown as Pokemon[]
// // 	).map((pokemon) => ({
// // 		...pokemon,
// // 		type: "grass",
// // 	}));
// // 	const firePokemons: (Pokemon & { type: "fire" })[] = (
// // 		firePokemon as unknown as Pokemon[]
// // 	).map((pokemon) => ({
// // 		...pokemon,
// // 		type: "fire",
// // 	}));
// // 	const waterPokemons: (Pokemon & { type: "water" })[] = (
// // 		waterPokemon as unknown as Pokemon[]
// // 	).map((pokemon) => ({
// // 		...pokemon,
// // 		type: "water",
// // 	}));

// // 	return (
// // 		<SharedResults
// // 			resultId={params.id}
// // 			trainerName={trainerName || "Unknown Trainer"}
// // 			teamSummary={teamSummary}
// // 			grassPokemon={grassPokemons}
// // 			firePokemon={firePokemons}
// // 			waterPokemon={waterPokemons}
// // 			rankings={
// // 				rankings as
// // 					| {
// // 							[key in "grass" | "fire" | "water"]?: {
// // 								top: string;
// // 								runnerUp: string;
// // 								canRelate: string;
// // 							};
// // 					  }
// // 					| undefined
// // 			}
// // 		/>
// // 	);
// // }

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SharedResults from "@/components/SharedResults";
import { Pokemon } from "@/types/Pokemon";

interface Rankings {
	grass?: {
		top: string;
		runnerUp: string;
		canRelate: string;
	};
	fire?: {
		top: string;
		runnerUp: string;
		canRelate: string;
	};
	water?: {
		top: string;
		runnerUp: string;
		canRelate: string;
	};
}

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
		rankings,
	} = result;

	// Add the 'type' property to each Pokémon
	const grassPokemons: (Pokemon & { type: "grass" })[] = (
		grassPokemon as unknown as Pokemon[]
	).map((pokemon) => ({
		...pokemon,
		type: "grass",
	}));
	const firePokemons: (Pokemon & { type: "fire" })[] = (
		firePokemon as unknown as Pokemon[]
	).map((pokemon) => ({
		...pokemon,
		type: "fire",
	}));
	const waterPokemons: (Pokemon & { type: "water" })[] = (
		waterPokemon as unknown as Pokemon[]
	).map((pokemon) => ({
		...pokemon,
		type: "water",
	}));

	const allPokemon = [...grassPokemons, ...firePokemons, ...waterPokemons];

	// Use rankings directly, no parsing needed
	const typedRankings = rankings as Rankings | null;

	// Order Pokémon based on rankings if available
	const orderedPokemon = typedRankings
		? (["grass", "fire", "water"] as const)
				.flatMap((type) => {
					const typeRankings = typedRankings[type];
					if (!typeRankings) return [];
					return ["top", "runnerUp", "canRelate"].map((rank) =>
						allPokemon.find(
							(p) =>
								p.name ===
									typeRankings[
										rank as keyof typeof typeRankings
									] && p.type === type
						)
					);
				})
				.filter(
					(p): p is Pokemon & { type: "grass" | "fire" | "water" } =>
						p !== undefined
				)
		: allPokemon;

	return (
		<SharedResults
			resultId={params.id}
			trainerName={trainerName || "Unknown Trainer"}
			teamSummary={teamSummary}
			allPokemon={orderedPokemon}
			rankings={typedRankings || undefined}
		/>
	);
}
