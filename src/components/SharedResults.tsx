// // /src/components/SharedResults.tsx

// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";

// interface Pokemon {
// 	name: string;
// 	description: string;
// 	detailedDescription: string[];
// 	image: string | null;
// }

// interface SharedResultsProps {
// 	allPokemon: Pokemon[];
// 	teamSummary: string;
// }

// export default function SharedResults({
// 	allPokemon,
// 	teamSummary,
// }: SharedResultsProps) {
// 	return (
// 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// 			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
// 				<h1 className="text-3xl md:text-6xl font-bold text-center my-4">
// 					Shared Pokémon Starter Results
// 				</h1>

// 				<div className="bg-white p-6 rounded-lg shadow-md mb-6">
// 					<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// 						Pokémon Starter Team Summary
// 					</h2>
// 					<p className="text-gray-800 text-justify">{teamSummary}</p>
// 				</div>

// 				<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
// 					Pokémon Starters:
// 				</h2>
// 				<div className="flex flex-wrap justify-center gap-4 mt-6">
// 					{allPokemon.map((pokemon: Pokemon, index: number) => (
// 						<motion.div
// 							key={index}
// 							initial={{ opacity: 0, y: 50 }}
// 							animate={{ opacity: 1, y: 0 }}
// 							transition={{ duration: 0.5, delay: index * 0.1 }}
// 							className="flex flex-col items-center bg-gray-200 border border-gray-500 shadow-md rounded-lg p-4 w-full md:w-64"
// 						>
// 							{pokemon.image && (
// 								<Image
// 									src={pokemon.image}
// 									alt={pokemon.name || "Pokemon"}
// 									className="rounded-md"
// 									width={200}
// 									height={200}
// 								/>
// 							)}

// 							<h2 className="text-lg md:text-xl font-semibold mt-2 text-gray-900">
// 								{pokemon.name}
// 							</h2>
// 							<p className="text-xs md:text-sm text-gray-900 mt-2">
// 								{pokemon.description}
// 							</p>
// 						</motion.div>
// 					))}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// /src/components/SharedResults.tsx

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Pokemon {
	name: string;
	description: string;
	detailedDescription: string[];
	image: string | null;
}

interface SharedResultsProps {
	allPokemon: Pokemon[];
	teamSummary: string;
	trainerName: string;
}

export default function SharedResults({
	allPokemon,
	teamSummary,
	trainerName,
}: SharedResultsProps) {
	return (
		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
				<h1 className="text-3xl md:text-6xl font-bold text-center my-4">
					{trainerName}&apos;s Pokémon Starter Team
				</h1>

				<div className="bg-white p-6 rounded-lg shadow-md mb-6">
					<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
						Pokémon Starter Team Summary
					</h2>
					<p className="text-gray-800 text-justify">{teamSummary}</p>
				</div>

				<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
					Pokémon Starters:
				</h2>
				<div className="flex flex-wrap justify-center gap-4 mt-6">
					{allPokemon.map((pokemon: Pokemon, index: number) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="flex flex-col items-center bg-gray-200 border border-gray-500 shadow-md rounded-lg p-4 w-full md:w-64"
						>
							{pokemon.image && (
								<Image
									src={pokemon.image}
									alt={pokemon.name || "Pokemon"}
									className="rounded-md"
									width={200}
									height={200}
								/>
							)}

							<h2 className="text-lg md:text-xl font-semibold mt-2 text-gray-900">
								{pokemon.name}
							</h2>
							<p className="text-xs md:text-sm text-gray-900 mt-2">
								{pokemon.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}
