// // // // // "use client";

// // // // // import Image from "next/image";
// // // // // import { motion } from "framer-motion";
// // // // // // import { Pokemon } from '../types/Pokemon';
// // // // // import { useState, useEffect } from "react";
// // // // // import { FaPlay } from "react-icons/fa";
// // // // // import { Pokemon } from "@/types/pokemon";

// // // // // interface SharedResultsProps {
// // // // // 	allPokemon: Pokemon[];
// // // // // 	teamSummary: string;
// // // // // 	trainerName: string;
// // // // // 	resultId: string;
// // // // // }

// // // // // export default function SharedResults({
// // // // // 	allPokemon,
// // // // // 	teamSummary,
// // // // // 	trainerName,
// // // // // 	resultId,
// // // // // }: SharedResultsProps) {
// // // // // 	const [isPlaying, setIsPlaying] = useState(false);
// // // // // 	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
// // // // // 	const [audioStatus, setAudioStatus] = useState<string>("pending");
// // // // // 	const [loadingAudio, setLoadingAudio] = useState<boolean>(true);

// // // // // 	useEffect(() => {
// // // // // 		let intervalId: NodeJS.Timeout | null = null;

// // // // // 		async function fetchAudioData() {
// // // // // 			try {
// // // // // 				const response = await fetch(`/api/get-audio/${resultId}`);
// // // // // 				const data = await response.json();

// // // // // 				setAudioStatus(data.audioStatus);

// // // // // 				if (data.audioBase64 && data.audioStatus === "completed") {
// // // // // 					// Decode base64 to binary data
// // // // // 					const audioData = Uint8Array.from(
// // // // // 						atob(data.audioBase64),
// // // // // 						(c) => c.charCodeAt(0)
// // // // // 					);
// // // // // 					const blob = new Blob([audioData], { type: "audio/mpeg" });
// // // // // 					const url = URL.createObjectURL(blob);
// // // // // 					const audioElement = new Audio(url);
// // // // // 					setAudio(audioElement);

// // // // // 					// Clean up the URL object when the component unmounts
// // // // // 					return () => {
// // // // // 						URL.revokeObjectURL(url);
// // // // // 					};
// // // // // 				}
// // // // // 			} catch (error) {
// // // // // 				console.error("Error fetching audio data:", error);
// // // // // 			} finally {
// // // // // 				setLoadingAudio(false);
// // // // // 			}
// // // // // 		}

// // // // // 		fetchAudioData();

// // // // // 		// Set up polling to check for audio availability
// // // // // 		if (audioStatus !== "completed" && audioStatus !== "failed") {
// // // // // 			intervalId = setInterval(fetchAudioData, 5000); // Check every 5 seconds
// // // // // 		}

// // // // // 		return () => {
// // // // // 			if (intervalId) clearInterval(intervalId);
// // // // // 		};
// // // // // 	}, [resultId, audioStatus]);

// // // // // 	const handlePlay = () => {
// // // // // 		if (!audio) return;

// // // // // 		if (isPlaying) {
// // // // // 			audio.pause();
// // // // // 		} else {
// // // // // 			audio.play();
// // // // // 		}

// // // // // 		setIsPlaying(!isPlaying);
// // // // // 	};

// // // // // 	// Handle audio end event
// // // // // 	useEffect(() => {
// // // // // 		if (audio) {
// // // // // 			const handleEnded = () => setIsPlaying(false);
// // // // // 			audio.addEventListener("ended", handleEnded);
// // // // // 			return () => {
// // // // // 				audio.removeEventListener("ended", handleEnded);
// // // // // 			};
// // // // // 		}
// // // // // 	}, [audio]);

// // // // // 	return (
// // // // // 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// // // // // 			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
// // // // // 				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800">
// // // // // 					{trainerName}&apos;s Pokémon Starter Team
// // // // // 				</h1>

// // // // // 				{loadingAudio ? (
// // // // // 					<p className="text-center">Loading audio...</p>
// // // // // 				) : audioStatus === "completed" ? (
// // // // // 					<div className="flex justify-center mb-6">
// // // // // 						<button
// // // // // 							onClick={handlePlay}
// // // // // 							className="focus:outline-none"
// // // // // 						>
// // // // // 							<motion.div
// // // // // 								animate={{ scale: isPlaying ? 1.2 : 1 }}
// // // // // 								transition={{ duration: 0.3, yoyo: Infinity }}
// // // // // 							>
// // // // // 								<FaPlay className="text-purple-700 text-6xl" />
// // // // // 							</motion.div>
// // // // // 						</button>
// // // // // 					</div>
// // // // // 				) : audioStatus === "processing" ? (
// // // // // 					<p className="text-center">
// // // // // 						Audio is being processed. Please wait...
// // // // // 					</p>
// // // // // 				) : audioStatus === "failed" ? (
// // // // // 					<p className="text-center">Failed to generate audio.</p>
// // // // // 				) : (
// // // // // 					<p className="text-center">Audio is pending.</p>
// // // // // 				)}

// // // // // 				<div className="bg-white p-6 rounded-lg shadow-md mb-6">
// // // // // 					<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// // // // // 						Pokémon Starter Team Summary
// // // // // 					</h2>
// // // // // 					<p className="text-gray-800 text-justify">{teamSummary}</p>
// // // // // 				</div>

// // // // // 				<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
// // // // // 					Pokémon Starters:
// // // // // 				</h2>
// // // // // 				<div className="flex flex-wrap justify-center gap-4 mt-6">
// // // // // 					{allPokemon.map((pokemon: Pokemon, index: number) => (
// // // // // 						<motion.div
// // // // // 							key={index}
// // // // // 							initial={{ opacity: 0, y: 50 }}
// // // // // 							animate={{ opacity: 1, y: 0 }}
// // // // // 							transition={{ duration: 0.5, delay: index * 0.1 }}
// // // // // 							className="flex flex-col items-center bg-gray-200 border border-gray-500 shadow-md rounded-lg p-4 w-full md:w-64"
// // // // // 						>
// // // // // 							{pokemon.image && (
// // // // // 								<Image
// // // // // 									src={pokemon.image}
// // // // // 									alt={pokemon.name || "Pokemon"}
// // // // // 									className="rounded-md"
// // // // // 									width={200}
// // // // // 									height={200}
// // // // // 								/>
// // // // // 							)}

// // // // // 							<h2 className="text-lg md:text-xl font-semibold mt-2 text-gray-900">
// // // // // 								{pokemon.name}
// // // // // 							</h2>
// // // // // 							<p className="text-xs md:text-sm text-gray-900 mt-2">
// // // // // 								{pokemon.description}
// // // // // 							</p>
// // // // // 						</motion.div>
// // // // // 					))}
// // // // // 				</div>
// // // // // 			</div>
// // // // // 		</div>
// // // // // 	);
// // // // // }

// // // // "use client";

// // // // import Image from "next/image";
// // // // import { motion } from "framer-motion";
// // // // import { useState, useEffect } from "react";
// // // // import { FaPlay } from "react-icons/fa";
// // // // import { Pokemon } from "@/types/pokemon";
// // // // // import { Pokemon } from "@/types/Pokemon";

// // // // interface SharedResultsProps {
// // // // 	allPokemon: Pokemon[];
// // // // 	teamSummary: string;
// // // // 	trainerName: string;
// // // // 	resultId: string;
// // // // }

// // // // export default function SharedResults({
// // // // 	allPokemon,
// // // // 	teamSummary,
// // // // 	trainerName,
// // // // 	resultId,
// // // // }: SharedResultsProps) {
// // // // 	const [isPlaying, setIsPlaying] = useState(false);
// // // // 	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
// // // // 	const [audioStatus, setAudioStatus] = useState<string>("pending");
// // // // 	const [loadingAudio, setLoadingAudio] = useState<boolean>(true);

// // // // 	useEffect(() => {
// // // // 		let intervalId: NodeJS.Timeout | null = null;
// // // // 		let audioUrl: string | null = null;

// // // // 		async function fetchAudioData() {
// // // // 			try {
// // // // 				const response = await fetch(`/api/get-audio/${resultId}`);
// // // // 				const data = await response.json();

// // // // 				setAudioStatus(data.audioStatus);

// // // // 				if (data.audioBase64 && data.audioStatus === "completed") {
// // // // 					// Decode base64 to binary data
// // // // 					const audioData = Uint8Array.from(
// // // // 						atob(data.audioBase64),
// // // // 						(c) => c.charCodeAt(0)
// // // // 					);
// // // // 					const blob = new Blob([audioData], { type: "audio/mpeg" });
// // // // 					const url = URL.createObjectURL(blob);
// // // // 					audioUrl = url;
// // // // 					const audioElement = new Audio(url);
// // // // 					setAudio(audioElement);
// // // // 				}
// // // // 			} catch (error) {
// // // // 				console.error("Error fetching audio data:", error);
// // // // 			} finally {
// // // // 				setLoadingAudio(false);
// // // // 			}
// // // // 		}

// // // // 		fetchAudioData();

// // // // 		if (audioStatus !== "completed" && audioStatus !== "failed") {
// // // // 			intervalId = setInterval(fetchAudioData, 5000);
// // // // 		}

// // // // 		return () => {
// // // // 			if (intervalId) clearInterval(intervalId);
// // // // 			if (audioUrl) URL.revokeObjectURL(audioUrl);
// // // // 		};
// // // // 	}, [resultId]);

// // // // 	const handlePlay = () => {
// // // // 		if (!audio) return;

// // // // 		if (isPlaying) {
// // // // 			audio.pause();
// // // // 		} else {
// // // // 			audio.play();
// // // // 		}

// // // // 		setIsPlaying(!isPlaying);
// // // // 	};

// // // // 	useEffect(() => {
// // // // 		if (audio) {
// // // // 			const handleEnded = () => setIsPlaying(false);
// // // // 			audio.addEventListener("ended", handleEnded);
// // // // 			return () => {
// // // // 				audio.removeEventListener("ended", handleEnded);
// // // // 			};
// // // // 		}
// // // // 	}, [audio]);

// // // // 	return (
// // // // 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// // // // 			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
// // // // 				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800">
// // // // 					{trainerName}&apos;s Pokémon Starter Team
// // // // 				</h1>

// // // // 				{loadingAudio ? (
// // // // 					<p className="text-center">Loading audio...</p>
// // // // 				) : audioStatus === "completed" ? (
// // // // 					<div className="flex justify-center mb-6">
// // // // 						<button
// // // // 							onClick={handlePlay}
// // // // 							className="focus:outline-none"
// // // // 						>
// // // // 							<motion.div
// // // // 								animate={{ scale: isPlaying ? 1.2 : 1 }}
// // // // 								transition={{ duration: 0.3, yoyo: Infinity }}
// // // // 							>
// // // // 								<FaPlay className="text-purple-700 text-6xl" />
// // // // 							</motion.div>
// // // // 						</button>
// // // // 					</div>
// // // // 				) : audioStatus === "processing" ? (
// // // // 					<p className="text-center">
// // // // 						Audio is being processed. Please wait...
// // // // 					</p>
// // // // 				) : audioStatus === "failed" ? (
// // // // 					<p className="text-center">Failed to generate audio.</p>
// // // // 				) : (
// // // // 					<p className="text-center">Audio is pending.</p>
// // // // 				)}

// // // // 				<div className="bg-white p-6 rounded-lg shadow-md mb-6">
// // // // 					<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// // // // 						Pokémon Starter Team Summary
// // // // 					</h2>
// // // // 					<p className="text-gray-800 text-justify">{teamSummary}</p>
// // // // 				</div>

// // // // 				<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
// // // // 					Pokémon Starters:
// // // // 				</h2>
// // // // 				<div className="flex flex-wrap justify-center gap-4 mt-6">
// // // // 					{allPokemon.map((pokemon: Pokemon, index: number) => (
// // // // 						<motion.div
// // // // 							key={index}
// // // // 							initial={{ opacity: 0, y: 50 }}
// // // // 							animate={{ opacity: 1, y: 0 }}
// // // // 							transition={{ duration: 0.5, delay: index * 0.1 }}
// // // // 							className="flex flex-col items-center bg-gray-200 border border-gray-500 shadow-md rounded-lg p-4 w-full md:w-64"
// // // // 						>
// // // // 							{pokemon.image && (
// // // // 								<Image
// // // // 									src={pokemon.image}
// // // // 									alt={pokemon.name || "Pokemon"}
// // // // 									className="rounded-md"
// // // // 									width={200}
// // // // 									height={200}
// // // // 								/>
// // // // 							)}

// // // // 							<h2 className="text-lg md:text-xl font-semibold mt-2 text-gray-900">
// // // // 								{pokemon.name}
// // // // 							</h2>
// // // // 							<p className="text-xs md:text-sm text-gray-900 mt-2">
// // // // 								{pokemon.description}
// // // // 							</p>
// // // // 						</motion.div>
// // // // 					))}
// // // // 				</div>
// // // // 			</div>
// // // // 		</div>
// // // // 	);
// // // // }

// // // // /src/components/SharedResults.tsx

// // // "use client";

// // // import Image from "next/image";
// // // import { motion, AnimatePresence } from "framer-motion";
// // // import { useState, useEffect } from "react";
// // // import { FaPlay, FaPause } from "react-icons/fa";
// // // import { Pokemon } from "@/types/Pokemon";

// // // interface SharedResultsProps {
// // // 	allPokemon: Pokemon[];
// // // 	teamSummary: string;
// // // 	trainerName: string;
// // // 	resultId: string;
// // // }

// // // export default function SharedResults({
// // // 	allPokemon,
// // // 	teamSummary,
// // // 	trainerName,
// // // 	resultId,
// // // }: SharedResultsProps) {
// // // 	const [isPlaying, setIsPlaying] = useState(false);
// // // 	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
// // // 	const [audioStatus, setAudioStatus] = useState<string>("pending");
// // // 	const [loadingAudio, setLoadingAudio] = useState<boolean>(true);
// // // 	const [showSummary, setShowSummary] = useState<boolean>(false);

// // // 	useEffect(() => {
// // // 		let intervalId: NodeJS.Timeout | null = null;
// // // 		let audioUrl: string | null = null;

// // // 		async function fetchAudioData() {
// // // 			try {
// // // 				const response = await fetch(`/api/get-audio/${resultId}`);
// // // 				const data = await response.json();

// // // 				setAudioStatus(data.audioStatus);

// // // 				if (data.audioBase64 && data.audioStatus === "completed") {
// // // 					// Decode base64 to binary data
// // // 					const audioData = Uint8Array.from(
// // // 						atob(data.audioBase64),
// // // 						(c) => c.charCodeAt(0)
// // // 					);
// // // 					const blob = new Blob([audioData], { type: "audio/mpeg" });
// // // 					audioUrl = URL.createObjectURL(blob);
// // // 					const audioElement = new Audio(audioUrl);
// // // 					setAudio(audioElement);
// // // 				}
// // // 			} catch (error) {
// // // 				console.error("Error fetching audio data:", error);
// // // 			} finally {
// // // 				setLoadingAudio(false);
// // // 			}
// // // 		}

// // // 		fetchAudioData();

// // // 		// Set up polling to check for audio availability
// // // 		if (audioStatus !== "completed" && audioStatus !== "failed") {
// // // 			intervalId = setInterval(fetchAudioData, 5000); // Check every 5 seconds
// // // 		}

// // // 		return () => {
// // // 			if (intervalId) clearInterval(intervalId);
// // // 			if (audioUrl) URL.revokeObjectURL(audioUrl);
// // // 		};
// // // 	}, [resultId]);

// // // 	const handlePlay = () => {
// // // 		if (!audio) return;

// // // 		if (isPlaying) {
// // // 			audio.pause();
// // // 			setShowSummary(false);
// // // 		} else {
// // // 			audio.play();
// // // 			setShowSummary(true); // Show the summary when audio starts playing
// // // 		}

// // // 		setIsPlaying(!isPlaying);
// // // 	};

// // // 	// Handle audio end event
// // // 	useEffect(() => {
// // // 		if (audio) {
// // // 			const handleEnded = () => {
// // // 				setIsPlaying(false);
// // // 				setShowSummary(false);
// // // 			};
// // // 			audio.addEventListener("ended", handleEnded);
// // // 			return () => {
// // // 				audio.removeEventListener("ended", handleEnded);
// // // 			};
// // // 		}
// // // 	}, [audio]);

// // // 	return (
// // // 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// // // 			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
// // // 				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800">
// // // 					{trainerName}&apos;s Pokémon Starter Team
// // // 				</h1>

// // // 				{loadingAudio ? (
// // // 					<p className="text-center">Loading audio...</p>
// // // 				) : audioStatus === "completed" ? (
// // // 					<div className="flex flex-col items-center mb-6">
// // // 						<motion.button
// // // 							onClick={handlePlay}
// // // 							className="focus:outline-none"
// // // 							whileTap={{ scale: 0.95 }}
// // // 							aria-label={
// // // 								isPlaying ? "Pause Audio" : "Play Audio"
// // // 							}
// // // 						>
// // // 							<motion.div
// // // 								animate={
// // // 									isPlaying ? { rotate: 360 } : { rotate: 0 }
// // // 								}
// // // 								transition={
// // // 									isPlaying
// // // 										? {
// // // 												repeat: Infinity,
// // // 												duration: 2,
// // // 												ease: "linear",
// // // 										  }
// // // 										: { duration: 0.5 }
// // // 								}
// // // 							>
// // // 								{isPlaying ? (
// // // 									<FaPause className="text-purple-700 text-8xl" />
// // // 								) : (
// // // 									<FaPlay className="text-purple-700 text-8xl" />
// // // 								)}
// // // 							</motion.div>
// // // 						</motion.button>

// // // 						{!isPlaying && (
// // // 							<p className="mt-4 text-center text-gray-700">
// // // 								Tap the play button to reveal the team summary
// // // 							</p>
// // // 						)}
// // // 					</div>
// // // 				) : audioStatus === "processing" ? (
// // // 					<p className="text-center">
// // // 						Audio is being processed. Please wait...
// // // 					</p>
// // // 				) : audioStatus === "failed" ? (
// // // 					<p className="text-center">Failed to generate audio.</p>
// // // 				) : (
// // // 					<p className="text-center">Audio is pending.</p>
// // // 				)}

// // // 				<AnimatePresence>
// // // 					{showSummary && (
// // // 						<motion.div
// // // 							initial={{ opacity: 0, y: 50 }}
// // // 							animate={{ opacity: 1, y: 0 }}
// // // 							exit={{ opacity: 0, y: -50 }}
// // // 							transition={{ duration: 0.5 }}
// // // 							className="bg-white p-6 rounded-lg shadow-md mb-6"
// // // 						>
// // // 							<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// // // 								Pokémon Starter Team Summary
// // // 							</h2>
// // // 							<p className="text-gray-800 text-justify">
// // // 								{teamSummary}
// // // 							</p>
// // // 						</motion.div>
// // // 					)}
// // // 				</AnimatePresence>

// // // 				<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
// // // 					Pokémon Starters:
// // // 				</h2>
// // // 				<div className="flex flex-wrap justify-center gap-4 mt-6">
// // // 					{allPokemon.map((pokemon: Pokemon, index: number) => (
// // // 						<motion.div
// // // 							key={index}
// // // 							initial={{ opacity: 0, y: 50 }}
// // // 							animate={
// // // 								showSummary
// // // 									? { opacity: 1, y: 0 }
// // // 									: { opacity: 0, y: 50 }
// // // 							}
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

// // "use client";

// // import Image from "next/image";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { useState, useEffect } from "react";
// // import { FaPlay, FaPause } from "react-icons/fa";
// // import { Pokemon } from "@/types/Pokemon";

// // interface SharedResultsProps {
// // 	allPokemon: Pokemon[];
// // 	teamSummary: string;
// // 	trainerName: string;
// // 	resultId: string;
// // }

// // export default function SharedResults({
// // 	allPokemon,
// // 	teamSummary,
// // 	trainerName,
// // 	resultId,
// // }: SharedResultsProps) {
// // 	const [isPlaying, setIsPlaying] = useState(false);
// // 	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
// // 	const [audioStatus, setAudioStatus] = useState<string>("pending");
// // 	const [loadingAudio, setLoadingAudio] = useState<boolean>(true);
// // 	const [showSummary, setShowSummary] = useState<boolean>(false);
// // 	const [error, setError] = useState<string | null>(null);

// // 	useEffect(() => {
// // 		console.log("All Pokemon:", allPokemon);
// // 		console.log("Team Summary:", teamSummary);
// // 	}, [allPokemon, teamSummary]);

// // 	useEffect(() => {
// // 		let intervalId: NodeJS.Timeout | null = null;
// // 		let audioUrl: string | null = null;

// // 		async function fetchAudioData() {
// // 			try {
// // 				const response = await fetch(`/api/get-audio/${resultId}`);
// // 				const data = await response.json();

// // 				setAudioStatus(data.audioStatus);

// // 				if (data.audioBase64 && data.audioStatus === "completed") {
// // 					const audioData = Uint8Array.from(
// // 						atob(data.audioBase64),
// // 						(c) => c.charCodeAt(0)
// // 					);
// // 					//   const blob = new Blob([audioData], { type: "audio/mpeg" });
// // 					const blob = new Blob([audioData], { type: "audio/mp3" });
// // 					audioUrl = URL.createObjectURL(blob);
// // 					const audioElement = new Audio(audioUrl);
// // 					setAudio(audioElement);
// // 				}
// // 			} catch (error) {
// // 				console.error("Error fetching audio data:", error);
// // 				setError("Failed to load audio. Please try again later.");
// // 			} finally {
// // 				setLoadingAudio(false);
// // 			}
// // 		}

// // 		fetchAudioData();

// // 		if (audioStatus !== "completed" && audioStatus !== "failed") {
// // 			intervalId = setInterval(fetchAudioData, 5000);
// // 		}

// // 		return () => {
// // 			if (intervalId) clearInterval(intervalId);
// // 			if (audioUrl) URL.revokeObjectURL(audioUrl);
// // 		};
// // 	}, [resultId, audioStatus]);

// // 	const handlePlay = () => {
// // 		if (!audio) return;

// // 		if (isPlaying) {
// // 			audio.pause();
// // 		} else {
// // 			audio.play().catch((e) => {
// // 				console.error("Error playing audio:", e);
// // 				setError("Failed to play audio. Please try again.");
// // 			});
// // 		}

// // 		setIsPlaying(!isPlaying);
// // 		setShowSummary(!isPlaying);
// // 	};

// // 	useEffect(() => {
// // 		if (audio) {
// // 			const handleEnded = () => {
// // 				setIsPlaying(false);
// // 				setShowSummary(false);
// // 			};
// // 			audio.addEventListener("ended", handleEnded);
// // 			return () => {
// // 				audio.removeEventListener("ended", handleEnded);
// // 			};
// // 		}
// // 	}, [audio]);

// // 	if (error) {
// // 		return (
// // 			<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center">
// // 				<div className="bg-white p-6 rounded-lg shadow-md">
// // 					<h1 className="text-2xl font-bold text-red-600 mb-4">
// // 						Error
// // 					</h1>
// // 					<p>{error}</p>
// // 				</div>
// // 			</div>
// // 		);
// // 	}

// // 	return (
// // 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// // 			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
// // 				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800">
// // 					{trainerName}&apos;s Pokémon Starter Team
// // 				</h1>

// // 				{loadingAudio ? (
// // 					<p className="text-center">Loading audio...</p>
// // 				) : audioStatus === "completed" ? (
// // 					<div className="flex flex-col items-center mb-6">
// // 						<motion.button
// // 							onClick={handlePlay}
// // 							className="focus:outline-none"
// // 							whileTap={{ scale: 0.95 }}
// // 							aria-label={
// // 								isPlaying ? "Pause Audio" : "Play Audio"
// // 							}
// // 						>
// // 							<motion.div
// // 								animate={
// // 									isPlaying ? { rotate: 360 } : { rotate: 0 }
// // 								}
// // 								transition={
// // 									isPlaying
// // 										? {
// // 												repeat: Infinity,
// // 												duration: 2,
// // 												ease: "linear",
// // 										  }
// // 										: { duration: 0.5 }
// // 								}
// // 							>
// // 								{isPlaying ? (
// // 									<FaPause className="text-purple-700 text-8xl" />
// // 								) : (
// // 									<FaPlay className="text-purple-700 text-8xl" />
// // 								)}
// // 							</motion.div>
// // 						</motion.button>

// // 						{!isPlaying && (
// // 							<p className="mt-4 text-center text-gray-700">
// // 								Tap the play button to reveal the team summary
// // 							</p>
// // 						)}
// // 					</div>
// // 				) : audioStatus === "processing" ? (
// // 					<p className="text-center">
// // 						Audio is being processed. Please wait...
// // 					</p>
// // 				) : audioStatus === "failed" ? (
// // 					<p className="text-center">Failed to generate audio.</p>
// // 				) : (
// // 					<p className="text-center">Audio is pending.</p>
// // 				)}

// // 				<AnimatePresence>
// // 					{showSummary && (
// // 						<motion.div
// // 							initial={{ opacity: 0, y: 50 }}
// // 							animate={{ opacity: 1, y: 0 }}
// // 							exit={{ opacity: 0, y: -50 }}
// // 							transition={{ duration: 0.5 }}
// // 							className="bg-white p-6 rounded-lg shadow-md mb-6"
// // 						>
// // 							<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// // 								Pokémon Starter Team Summary
// // 							</h2>
// // 							<p className="text-gray-800 text-justify">
// // 								{teamSummary}
// // 							</p>
// // 						</motion.div>
// // 					)}
// // 				</AnimatePresence>

// // 				<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
// // 					Pokémon Starters:
// // 				</h2>
// // 				<div className="flex flex-wrap justify-center gap-4 mt-6">
// // 					{allPokemon.map((pokemon: Pokemon, index: number) => (
// // 						<motion.div
// // 							key={index}
// // 							initial={{ opacity: 0, y: 50 }}
// // 							animate={{ opacity: 1, y: 0 }}
// // 							transition={{ duration: 0.5, delay: index * 0.1 }}
// // 							className="flex flex-col items-center bg-gray-200 border border-gray-500 shadow-md rounded-lg p-4 w-full md:w-64"
// // 						>
// // 							{pokemon.image ? (
// // 								<Image
// // 									src={pokemon.image}
// // 									alt={pokemon.name || "Pokemon"}
// // 									className="rounded-md"
// // 									width={200}
// // 									height={200}
// // 									onError={(e) => {
// // 										console.error(
// // 											`Error loading image for ${pokemon.name}`
// // 										);
// // 										e.currentTarget.src =
// // 											"/placeholder-pokemon.png";
// // 									}}
// // 								/>
// // 							) : (
// // 								<div className="w-[200px] h-[200px] bg-gray-300 rounded-md flex items-center justify-center">
// // 									<span className="text-gray-500">
// // 										No Image
// // 									</span>
// // 								</div>
// // 							)}

// // 							<h2 className="text-lg md:text-xl font-semibold mt-2 text-gray-900">
// // 								{pokemon.name || "Unknown Pokemon"}
// // 							</h2>
// // 							<p className="text-xs md:text-sm text-gray-900 mt-2">
// // 								{pokemon.description ||
// // 									"No description available"}
// // 							</p>
// // 						</motion.div>
// // 					))}
// // 				</div>
// // 			</div>
// // 		</div>
// // 	);
// // }

// "use client";

// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useEffect } from "react";
// import { FaPlay, FaPause } from "react-icons/fa";
// import { Pokemon } from "@/types/Pokemon";

// interface SharedResultsProps {
// 	allPokemon: Pokemon[];
// 	teamSummary: string;
// 	trainerName: string;
// 	resultId: string;
// }

// export default function SharedResults({
// 	allPokemon,
// 	teamSummary,
// 	trainerName,
// 	resultId,
// }: SharedResultsProps) {
// 	const [isPlaying, setIsPlaying] = useState(false);
// 	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
// 	const [audioStatus, setAudioStatus] = useState<string>("pending");
// 	const [loadingAudio, setLoadingAudio] = useState<boolean>(true);
// 	const [error, setError] = useState<string | null>(null);

// 	useEffect(() => {
// 		console.log("All Pokemon:", allPokemon);
// 		console.log("Team Summary:", teamSummary);
// 	}, [allPokemon, teamSummary]);

// 	useEffect(() => {
// 		let intervalId: NodeJS.Timeout | null = null;
// 		let audioUrl: string | null = null;

// 		async function fetchAudioData() {
// 			try {
// 				const response = await fetch(`/api/get-audio/${resultId}`);
// 				const data = await response.json();

// 				setAudioStatus(data.audioStatus);

// 				if (data.audioBase64 && data.audioStatus === "completed") {
// 					const audioData = Uint8Array.from(
// 						atob(data.audioBase64),
// 						(c) => c.charCodeAt(0)
// 					);
// 					const blob = new Blob([audioData], { type: "audio/mp3" });
// 					audioUrl = URL.createObjectURL(blob);
// 					const audioElement = new Audio(audioUrl);
// 					setAudio(audioElement);
// 				}
// 			} catch (error) {
// 				console.error("Error fetching audio data:", error);
// 				setError("Failed to load audio. Please try again later.");
// 			} finally {
// 				setLoadingAudio(false);
// 			}
// 		}

// 		fetchAudioData();

// 		if (audioStatus !== "completed" && audioStatus !== "failed") {
// 			intervalId = setInterval(fetchAudioData, 5000);
// 		}

// 		return () => {
// 			if (intervalId) clearInterval(intervalId);
// 			if (audioUrl) URL.revokeObjectURL(audioUrl);
// 		};
// 	}, [resultId, audioStatus]);

// 	const handlePlay = () => {
// 		if (!audio) return;

// 		if (isPlaying) {
// 			audio.pause();
// 		} else {
// 			audio.play().catch((e) => {
// 				console.error("Error playing audio:", e);
// 				setError("Failed to play audio. Please try again.");
// 			});
// 		}

// 		setIsPlaying(!isPlaying);
// 	};

// 	useEffect(() => {
// 		if (audio) {
// 			const handleEnded = () => {
// 				setIsPlaying(false);
// 			};
// 			audio.addEventListener("ended", handleEnded);
// 			return () => {
// 				audio.removeEventListener("ended", handleEnded);
// 			};
// 		}
// 	}, [audio]);

// 	if (error) {
// 		return (
// 			<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center">
// 				<div className="bg-white p-6 rounded-lg shadow-md">
// 					<h1 className="text-2xl font-bold text-red-600 mb-4">
// 						Error
// 					</h1>
// 					<p>{error}</p>
// 				</div>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// 			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
// 				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800">
// 					{trainerName}&apos;s Pokémon Starter Team
// 				</h1>

// 				{loadingAudio ? (
// 					<p className="text-center">Loading audio...</p>
// 				) : audioStatus === "completed" ? (
// 					<div className="flex flex-col items-center mb-6">
// 						<motion.button
// 							onClick={handlePlay}
// 							className="focus:outline-none"
// 							whileTap={{ scale: 0.95 }}
// 							aria-label={
// 								isPlaying ? "Pause Audio" : "Play Audio"
// 							}
// 						>
// 							<motion.div
// 								animate={
// 									isPlaying ? { rotate: 360 } : { rotate: 0 }
// 								}
// 								transition={
// 									isPlaying
// 										? {
// 												repeat: Infinity,
// 												duration: 2,
// 												ease: "linear",
// 										  }
// 										: { duration: 0.5 }
// 								}
// 							>
// 								{isPlaying ? (
// 									<FaPause className="text-purple-700 text-8xl" />
// 								) : (
// 									<FaPlay className="text-purple-700 text-8xl" />
// 								)}
// 							</motion.div>
// 						</motion.button>

// 						<p className="mt-4 text-center text-gray-700">
// 							{isPlaying
// 								? "Tap to pause"
// 								: "Tap to play audio summary"}
// 						</p>
// 					</div>
// 				) : audioStatus === "processing" ? (
// 					<p className="text-center">
// 						Audio is being processed. Please wait...
// 					</p>
// 				) : audioStatus === "failed" ? (
// 					<p className="text-center">Failed to generate audio.</p>
// 				) : (
// 					<p className="text-center">Audio is pending.</p>
// 				)}

// 				<motion.div
// 					initial={{ opacity: 0, y: 50 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ duration: 0.5 }}
// 					className="bg-white p-6 rounded-lg shadow-md mb-6"
// 				>
// 					<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// 						Pokémon Starter Team Summary
// 					</h2>
// 					<p className="text-gray-800 text-justify">{teamSummary}</p>
// 				</motion.div>

// 				<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
// 					Pokémon Starters:
// 				</h2>
// 				<AnimatePresence>
// 					<div className="flex flex-wrap justify-center gap-4 mt-6">
// 						{allPokemon.map((pokemon: Pokemon, index: number) => (
// 							<motion.div
// 								key={index}
// 								initial={{ opacity: 0, y: 50 }}
// 								animate={{ opacity: 1, y: 0 }}
// 								exit={{ opacity: 0, y: -50 }}
// 								transition={{
// 									duration: 0.5,
// 									delay: index * 0.1,
// 								}}
// 								className="flex flex-col items-center bg-gray-200 border border-gray-500 shadow-md rounded-lg p-4 w-full md:w-64"
// 							>
// 								{pokemon.image ? (
// 									<Image
// 										src={pokemon.image}
// 										alt={pokemon.name || "Pokemon"}
// 										className="rounded-md"
// 										width={200}
// 										height={200}
// 										onError={(e) => {
// 											console.error(
// 												`Error loading image for ${pokemon.name}`
// 											);
// 											e.currentTarget.src =
// 												"/placeholder-pokemon.png";
// 										}}
// 									/>
// 								) : (
// 									<div className="w-[200px] h-[200px] bg-gray-300 rounded-md flex items-center justify-center">
// 										<span className="text-gray-500">
// 											No Image
// 										</span>
// 									</div>
// 								)}

// 								<h2 className="text-lg md:text-xl font-semibold mt-2 text-gray-900">
// 									{pokemon.name || "Unknown Pokemon"}
// 								</h2>
// 								<p className="text-xs md:text-sm text-gray-900 mt-2">
// 									{pokemon.description ||
// 										"No description available"}
// 								</p>
// 							</motion.div>
// 						))}
// 					</div>
// 				</AnimatePresence>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { Pokemon } from "@/types/Pokemon";

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
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;
		let audioUrl: string | null = null;

		async function fetchAudioData() {
			try {
				const response = await fetch(`/api/get-audio/${resultId}`);
				if (!response.ok) {
					throw new Error("Failed to fetch audio data");
				}
				const data = await response.json();

				setAudioStatus(data.audioStatus);

				if (data.audioStatus === "completed" && data.audioBase64) {
					const audioBlob = new Blob(
						[Buffer.from(data.audioBase64, "base64")],
						{ type: "audio/mpeg" }
					);
					audioUrl = URL.createObjectURL(audioBlob);
					const audioElement = new Audio(audioUrl);
					setAudio(audioElement);
					setLoadingAudio(false);
				} else if (data.audioStatus === "failed") {
					setError(
						"Failed to generate audio. Please try again later."
					);
					setLoadingAudio(false);
				}
			} catch (error) {
				console.error("Error fetching audio data:", error);
				setError("Failed to load audio. Please try again later.");
				setLoadingAudio(false);
			}
		}

		fetchAudioData();

		if (audioStatus === "pending" || audioStatus === "processing") {
			intervalId = setInterval(fetchAudioData, 5000);
		}

		return () => {
			if (intervalId) clearInterval(intervalId);
			if (audioUrl) URL.revokeObjectURL(audioUrl);
		};
	}, [resultId, audioStatus]);

	const handlePlay = () => {
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
		} else {
			audio.play().catch((e) => {
				console.error("Error playing audio:", e);
				setError("Failed to play audio. Please try again.");
			});
		}

		setIsPlaying(!isPlaying);
	};

	if (error) {
		return (
			<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						Error
					</h1>
					<p>{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800">
					{trainerName}&apos;s Pokémon Starter Team
				</h1>

				{loadingAudio ? (
					<p className="text-center">Loading audio...</p>
				) : audioStatus === "completed" && audio ? (
					<div className="flex flex-col items-center mb-6">
						<motion.button
							onClick={handlePlay}
							className="focus:outline-none bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
							whileTap={{ scale: 0.95 }}
							aria-label={
								isPlaying ? "Pause Audio" : "Play Audio"
							}
						>
							{isPlaying ? <FaPause /> : <FaPlay />}
							<span className="ml-2">
								{isPlaying ? "Pause" : "Play"} Audio Summary
							</span>
						</motion.button>
					</div>
				) : (
					<p className="text-center">Audio is not available.</p>
				)}

				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-white p-6 rounded-lg shadow-md mb-6"
				>
					<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
						Pokémon Starter Team Summary
					</h2>
					<p className="text-gray-800 text-justify">{teamSummary}</p>
				</motion.div>

				<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
					Pokémon Starters:
				</h2>
				<AnimatePresence>
					<div className="flex flex-wrap justify-center gap-4 mt-6">
						{allPokemon.map((pokemon: Pokemon, index: number) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -50 }}
								transition={{
									duration: 0.5,
									delay: index * 0.1,
								}}
								className="flex flex-col items-center bg-gray-200 border border-gray-500 shadow-md rounded-lg p-4 w-full md:w-64"
							>
								{pokemon.image ? (
									<Image
										src={pokemon.image}
										alt={pokemon.name || "Pokemon"}
										className="rounded-md"
										width={200}
										height={200}
										onError={(e) => {
											console.error(
												`Error loading image for ${pokemon.name}`
											);
											e.currentTarget.src =
												"/placeholder-pokemon.png";
										}}
									/>
								) : (
									<div className="w-[200px] h-[200px] bg-gray-300 rounded-md flex items-center justify-center">
										<span className="text-gray-500">
											No Image
										</span>
									</div>
								)}

								<h2 className="text-lg md:text-xl font-semibold mt-2 text-gray-900">
									{pokemon.name || "Unknown Pokemon"}
								</h2>
								<p className="text-xs md:text-sm text-gray-900 mt-2">
									{pokemon.description ||
										"No description available"}
								</p>
							</motion.div>
						))}
					</div>
				</AnimatePresence>
			</div>
		</div>
	);
}
