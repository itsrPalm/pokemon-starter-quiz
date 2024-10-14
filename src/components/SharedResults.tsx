// // // "use client";

// // // import Image from "next/image";
// // // import { motion } from "framer-motion";

// // // interface Pokemon {
// // // 	name: string;
// // // 	description: string;
// // // 	detailedDescription: string[];
// // // 	image: string | null;
// // // }

// // // interface SharedResultsProps {
// // // 	allPokemon: Pokemon[];
// // // 	teamSummary: string;
// // // 	trainerName: string;
// // // }

// // // export default function SharedResults({
// // // 	allPokemon,
// // // 	teamSummary,
// // // 	trainerName,
// // // }: SharedResultsProps) {
// // // 	return (
// // // 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// // // 			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
// // // 				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800">
// // // 					{trainerName}&apos;s Pokémon Starter Team
// // // 				</h1>

// // // 				<div className="bg-white p-6 rounded-lg shadow-md mb-6">
// // // 					<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// // // 						Pokémon Starter Team Summary
// // // 					</h2>
// // // 					<p className="text-gray-800 text-justify">{teamSummary}</p>
// // // 				</div>

// // // 				<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
// // // 					Pokémon Starters:
// // // 				</h2>
// // // 				<div className="flex flex-wrap justify-center gap-4 mt-6">
// // // 					{allPokemon.map((pokemon: Pokemon, index: number) => (
// // // 						<motion.div
// // // 							key={index}
// // // 							initial={{ opacity: 0, y: 50 }}
// // // 							animate={{ opacity: 1, y: 0 }}
// // // 							transition={{ duration: 0.5, delay: index * 0.1 }}
// // // 							className="flex flex-col items-center bg-gray-200 border border-gray-500 shadow-md rounded-lg p-4 w-full md:w-64"
// // // 						>
// // // 							{pokemon.image && (
// // // 								<Image
// // // 									src={pokemon.image}
// // // 									alt={pokemon.name || "Pokemon"}
// // // 									className="rounded-md"
// // // 									width={200}
// // // 									height={200}
// // // 								/>
// // // 							)}

// // // 							<h2 className="text-lg md:text-xl font-semibold mt-2 text-gray-900">
// // // 								{pokemon.name}
// // // 							</h2>
// // // 							<p className="text-xs md:text-sm text-gray-900 mt-2">
// // // 								{pokemon.description}
// // // 							</p>
// // // 						</motion.div>
// // // 					))}
// // // 				</div>
// // // 			</div>
// // // 		</div>
// // // 	);
// // // }

// // 'use client';

// // import Image from 'next/image';
// // import { motion } from 'framer-motion';
// // import { Pokemon } from '../types/Pokemon';
// // import { useState } from 'react';
// // import { FaPlay } from 'react-icons/fa';

// // interface SharedResultsProps {
// //   allPokemon: Pokemon[];
// //   teamSummary: string;
// //   trainerName: string;
// //   audioUrl?: string;
// // }

// // export default function SharedResults({ allPokemon, teamSummary, trainerName, audioUrl }: SharedResultsProps) {
// //   const [isPlaying, setIsPlaying] = useState(false);
// //   const [audio] = useState(typeof Audio !== 'undefined' ? new Audio(audioUrl) : null);

// //   const handlePlay = () => {
// //     if (!audio) return;

// //     if (isPlaying) {
// //       audio.pause();
// //     } else {
// //       audio.play();
// //     }

// //     setIsPlaying(!isPlaying);
// //   };

// //   // Handle audio end event
// //   if (audio) {
// //     audio.onended = () => {
// //       setIsPlaying(false);
// //     };
// //   }

// //   return (
// //     <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// //       <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
// //         <h1 className="text-3xl md:text-6xl font-bold text-center my-4">
// //           {trainerName}&apos;s Pokémon Starter Team
// //         </h1>

// //         {audioUrl && (
// //           <div className="flex justify-center mb-6">
// //             <button
// //               onClick={handlePlay}
// //               className="focus:outline-none"
// //             >
// //               <motion.div
// //                 animate={{ scale: isPlaying ? 1.2 : 1 }}
// //                 transition={{ duration: 0.3, yoyo: Infinity }}
// //               >
// //                 <FaPlay className="text-purple-700 text-6xl" />
// //               </motion.div>
// //             </button>
// //           </div>
// //         )}

// //         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
// //           <h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// //             Pokémon Starter Team Summary
// //           </h2>
// //           <p className="text-gray-800 text-justify">{teamSummary}</p>
// //         </div>

// //         <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
// //           Pokémon Starters:
// //         </h2>
// //         <div className="flex flex-wrap justify-center gap-4 mt-6">
// //           {allPokemon.map((pokemon: Pokemon, index: number) => (
// //             <motion.div
// //               key={index}
// //               initial={{ opacity: 0, y: 50 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.5, delay: index * 0.1 }}
// //               className="flex flex-col items-center bg-gray-200 border border-gray-500 shadow-md rounded-lg p-4 w-full md:w-64"
// //             >
// //               {pokemon.image && (
// //                 <Image
// //                   src={pokemon.image}
// //                   alt={pokemon.name || 'Pokemon'}
// //                   className="rounded-md"
// //                   width={200}
// //                   height={200}
// //                 />
// //               )}

// //               <h2 className="text-lg md:text-xl font-semibold mt-2 text-gray-900">
// //                 {pokemon.name}
// //               </h2>
// //               <p className="text-xs md:text-sm text-gray-900 mt-2">
// //                 {pokemon.description}
// //               </p>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /src/components/SharedResults.tsx

// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";
// // import { Pokemon } from '../types/Pokemon';
// import { useState, useEffect } from "react";
// import { FaPlay } from "react-icons/fa";
// import { Pokemon } from "@/types/pokemon";

// interface SharedResultsProps {
// 	allPokemon: Pokemon[];
// 	teamSummary: string;
// 	trainerName: string;
// 	audioBase64?: string | null;
// }

// export default function SharedResults({
// 	allPokemon,
// 	teamSummary,
// 	trainerName,
// 	audioBase64,
// }: SharedResultsProps) {
// 	const [isPlaying, setIsPlaying] = useState(false);
// 	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

// 	useEffect(() => {
// 		if (audioBase64) {
// 			// Decode base64 to binary data
// 			const audioData = Uint8Array.from(atob(audioBase64), (c) =>
// 				c.charCodeAt(0)
// 			);
// 			const blob = new Blob([audioData], { type: "audio/mpeg" });
// 			const url = URL.createObjectURL(blob);
// 			const audioElement = new Audio(url);
// 			setAudio(audioElement);

// 			// Clean up the URL object when the component unmounts
// 			return () => {
// 				URL.revokeObjectURL(url);
// 			};
// 		}
// 	}, [audioBase64]);

// 	const handlePlay = () => {
// 		if (!audio) return;

// 		if (isPlaying) {
// 			audio.pause();
// 		} else {
// 			audio.play();
// 		}

// 		setIsPlaying(!isPlaying);
// 	};

// 	// Handle audio end event
// 	useEffect(() => {
// 		if (audio) {
// 			const handleEnded = () => setIsPlaying(false);
// 			audio.addEventListener("ended", handleEnded);
// 			return () => {
// 				audio.removeEventListener("ended", handleEnded);
// 			};
// 		}
// 	}, [audio]);

// 	return (
// 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// 			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
// 				<h1 className="text-3xl md:text-6xl font-bold text-center my-4">
// 					{trainerName}&apos;s Pokémon Starter Team
// 				</h1>

// 				{audioBase64 && (
// 					<div className="flex justify-center mb-6">
// 						<button
// 							onClick={handlePlay}
// 							className="focus:outline-none"
// 						>
// 							<motion.div
// 								animate={{ scale: isPlaying ? 1.2 : 1 }}
// 								transition={{ duration: 0.3, yoyo: Infinity }}
// 							>
// 								<FaPlay className="text-purple-700 text-6xl" />
// 							</motion.div>
// 						</button>
// 					</div>
// 				)}

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
// import { Pokemon } from '../types/Pokemon';
import { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { Pokemon } from "@/types/pokemon";

interface SharedResultsProps {
	allPokemon: Pokemon[];
	teamSummary: string;
	trainerName: string;
	resultId: string;
}

export default function SharedResults({
	allPokemon,
	teamSummary,
	trainerName,
	resultId,
}: SharedResultsProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
	const [audioStatus, setAudioStatus] = useState<string>("pending");
	const [loadingAudio, setLoadingAudio] = useState<boolean>(true);

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;

		async function fetchAudioData() {
			try {
				const response = await fetch(`/api/get-audio/${resultId}`);
				const data = await response.json();

				setAudioStatus(data.audioStatus);

				if (data.audioBase64 && data.audioStatus === "completed") {
					// Decode base64 to binary data
					const audioData = Uint8Array.from(
						atob(data.audioBase64),
						(c) => c.charCodeAt(0)
					);
					const blob = new Blob([audioData], { type: "audio/mpeg" });
					const url = URL.createObjectURL(blob);
					const audioElement = new Audio(url);
					setAudio(audioElement);

					// Clean up the URL object when the component unmounts
					return () => {
						URL.revokeObjectURL(url);
					};
				}
			} catch (error) {
				console.error("Error fetching audio data:", error);
			} finally {
				setLoadingAudio(false);
			}
		}

		fetchAudioData();

		// Set up polling to check for audio availability
		if (audioStatus !== "completed" && audioStatus !== "failed") {
			intervalId = setInterval(fetchAudioData, 5000); // Check every 5 seconds
		}

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [resultId, audioStatus]);

	const handlePlay = () => {
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}

		setIsPlaying(!isPlaying);
	};

	// Handle audio end event
	useEffect(() => {
		if (audio) {
			const handleEnded = () => setIsPlaying(false);
			audio.addEventListener("ended", handleEnded);
			return () => {
				audio.removeEventListener("ended", handleEnded);
			};
		}
	}, [audio]);

	return (
		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800">
					{trainerName}&apos;s Pokémon Starter Team
				</h1>

				{loadingAudio ? (
					<p className="text-center">Loading audio...</p>
				) : audioStatus === "completed" ? (
					<div className="flex justify-center mb-6">
						<button
							onClick={handlePlay}
							className="focus:outline-none"
						>
							<motion.div
								animate={{ scale: isPlaying ? 1.2 : 1 }}
								transition={{ duration: 0.3, yoyo: Infinity }}
							>
								<FaPlay className="text-purple-700 text-6xl" />
							</motion.div>
						</button>
					</div>
				) : audioStatus === "processing" ? (
					<p className="text-center">
						Audio is being processed. Please wait...
					</p>
				) : audioStatus === "failed" ? (
					<p className="text-center">Failed to generate audio.</p>
				) : (
					<p className="text-center">Audio is pending.</p>
				)}

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
