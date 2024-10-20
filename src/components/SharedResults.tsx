// // // // // src/components/SharedResults.tsx

// // // // "use client";

// // // // import Image from "next/image";
// // // // import { motion } from "framer-motion";
// // // // import { useState, useEffect, useRef } from "react";
// // // // import {
// // // // 	FaPlay,
// // // // 	FaPause,
// // // // 	FaInfoCircle,
// // // // 	// FaCrown,
// // // // 	FaMedal,
// // // // 	FaStar,
// // // // 	FaHandsHelping,
// // // // } from "react-icons/fa";
// // // // // import Tooltip from "@/components/Tooltip"; // Import the updated Tooltip component
// // // // import { typeStyles } from "@/lib/typeStyles"; // Import the type styles utility
// // // // import Tooltip from "./Tooltip";

// // // // // -------------------------
// // // // // Interfaces
// // // // // -------------------------

// // // // interface Pokemon {
// // // // 	name: string;
// // // // 	image: string | null;
// // // // 	description: string;
// // // // 	type: "grass" | "fire" | "water";
// // // // 	traits: string[];
// // // // }

// // // // interface SharedResultsProps {
// // // // 	allPokemon: Pokemon[];
// // // // 	teamSummary: string;
// // // // 	trainerName: string;
// // // // 	resultId: string;
// // // // }

// // // // // -------------------------
// // // // // SharedResults Component
// // // // // -------------------------

// // // // export default function SharedResults({
// // // // 	allPokemon,
// // // // 	teamSummary,
// // // // 	trainerName,
// // // // 	resultId,
// // // // }: SharedResultsProps) {
// // // // 	// Audio States
// // // // 	const [isPlaying, setIsPlaying] = useState(false);
// // // // 	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
// // // // 	const [audioStatus, setAudioStatus] = useState<string>("pending");
// // // // 	const [loadingAudio, setLoadingAudio] = useState<boolean>(true);
// // // // 	const [errorMessage, setErrorMessage] = useState<string | null>(null);

// // // // 	// Unlock States
// // // // 	const [unlockedPokemon, setUnlockedPokemon] = useState<
// // // // 		Record<string, boolean>
// // // // 	>({});

// // // // 	// Tooltip States
// // // // 	const [hoveredPokemon, setHoveredPokemon] = useState<string | null>(null);
// // // // 	const [clickedPokemon, setClickedPokemon] = useState<string | null>(null); // For mobile

// // // // 	// Refs for each Pokémon's info icon
// // // // 	const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});

// // // // 	// Initialize Unlock States
// // // // 	useEffect(() => {
// // // // 		const initialUnlocked: Record<string, boolean> = {};
// // // // 		allPokemon.forEach((pokemon, index) => {
// // // // 			if (index < 3) {
// // // // 				initialUnlocked[pokemon.name] = true; // Top 3 unlocked by default
// // // // 			} else {
// // // // 				initialUnlocked[pokemon.name] = false; // Others locked
// // // // 			}
// // // // 		});
// // // // 		setUnlockedPokemon(initialUnlocked);
// // // // 	}, [allPokemon]);

// // // // 	// Fetch Audio Data
// // // // 	useEffect(() => {
// // // // 		async function fetchAudioData() {
// // // // 			try {
// // // // 				const response = await fetch(`/api/get-audio/${resultId}`);
// // // // 				if (!response.ok) {
// // // // 					throw new Error("Failed to fetch audio data");
// // // // 				}
// // // // 				const data = await response.json();

// // // // 				setAudioStatus(data.audioStatus);

// // // // 				if (data.audioStatus === "completed" && data.audioBase64) {
// // // // 					// Decode Base64 to binary data using browser-compatible methods
// // // // 					const binaryString = atob(data.audioBase64);
// // // // 					const len = binaryString.length;
// // // // 					const bytes = new Uint8Array(len);
// // // // 					for (let i = 0; i < len; i++) {
// // // // 						bytes[i] = binaryString.charCodeAt(i);
// // // // 					}
// // // // 					const audioBlob = new Blob([bytes], { type: "audio/mp3" });
// // // // 					const audioUrl = URL.createObjectURL(audioBlob);
// // // // 					const audioElement = new Audio(audioUrl);
// // // // 					setAudio(audioElement);
// // // // 					setLoadingAudio(false);
// // // // 				} else if (data.audioStatus === "failed") {
// // // // 					setErrorMessage(
// // // // 						"Failed to generate audio. Please try again later."
// // // // 					);
// // // // 					setLoadingAudio(false);
// // // // 				}
// // // // 			} catch (error) {
// // // // 				console.error("Error fetching audio data:", error);
// // // // 				setErrorMessage(
// // // // 					"Failed to load audio. Please try again later."
// // // // 				);
// // // // 				setLoadingAudio(false);
// // // // 			}
// // // // 		}

// // // // 		fetchAudioData();
// // // // 	}, [resultId]);

// // // // 	// Handle Play/Pause
// // // // 	const handlePlay = () => {
// // // // 		if (!audio) return;

// // // // 		if (isPlaying) {
// // // // 			audio.pause();
// // // // 		} else {
// // // // 			audio.play().catch((e) => {
// // // // 				console.error("Error playing audio:", e);
// // // // 				setErrorMessage("Failed to play audio. Please try again.");
// // // // 			});
// // // // 		}

// // // // 		setIsPlaying(!isPlaying);
// // // // 	};

// // // // 	// Assign Ranks to Pokémon
// // // // 	const orderedPokemon = allPokemon.map((pokemon, index) => {
// // // // 		let rank = "Can Relate To";
// // // // 		if (index < 3) rank = "Your Top Match!";
// // // // 		else if (index < 6) rank = "Runner Up";
// // // // 		return { ...pokemon, rank };
// // // // 	});

// // // // 	// Get Card Styles Based on Type
// // // // 	const getCardStyle = (type: "grass" | "fire" | "water"): string => {
// // // // 		return typeStyles[type].background;
// // // // 	};

// // // // 	// Get Font Size Based on Rank
// // // // 	const getFontSize = (rank: string): string => {
// // // // 		switch (rank) {
// // // // 			case "Your Top Match!":
// // // // 				return "text-xl md:text-2xl";
// // // // 			case "Runner Up":
// // // // 				return "text-lg md:text-xl";
// // // // 			case "Can Relate To":
// // // // 				return "text-sm md:text-lg";
// // // // 			default:
// // // // 				return "text-xl md:text-2xl";
// // // // 		}
// // // // 	};

// // // // 	// Define the getImageSize function
// // // // 	const getImageSize = (rank: string): number => {
// // // // 		switch (rank) {
// // // // 			case "Your Top Match!":
// // // // 				return 240;
// // // // 			case "Runner Up":
// // // // 				return 160;
// // // // 			case "Can Relate To":
// // // // 				return 100;
// // // // 			default:
// // // // 				return 240;
// // // // 		}
// // // // 	};

// // // // 	// Handle Unlock
// // // // 	const handleUnlock = (pokemonName: string) => {
// // // // 		setUnlockedPokemon((prev) => ({
// // // // 			...prev,
// // // // 			[pokemonName]: true,
// // // // 		}));
// // // // 	};

// // // // 	// Toggle Tooltip Visibility on Click (for Mobile)
// // // // 	const toggleTooltip = (pokemonName: string) => {
// // // // 		setClickedPokemon((prev) =>
// // // // 			prev === pokemonName ? null : pokemonName
// // // // 		);
// // // // 	};

// // // // 	// Close Tooltip when clicking outside (for Mobile)
// // // // 	useEffect(() => {
// // // // 		const handleClickOutside = (event: MouseEvent) => {
// // // // 			Object.keys(iconRefs.current).forEach((pokemonName) => {
// // // // 				const iconElement = iconRefs.current[pokemonName];
// // // // 				if (
// // // // 					iconElement &&
// // // // 					!iconElement.contains(event.target as Node)
// // // // 				) {
// // // // 					setClickedPokemon(null);
// // // // 				}
// // // // 			});
// // // // 		};

// // // // 		if (clickedPokemon) {
// // // // 			document.addEventListener("mousedown", handleClickOutside);
// // // // 		}

// // // // 		return () => {
// // // // 			document.removeEventListener("mousedown", handleClickOutside);
// // // // 		};
// // // // 	}, [clickedPokemon]);

// // // // 	return (
// // // // 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// // // // 			<div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
// // // // 				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800 capitalize">
// // // // 					{trainerName}&apos;s Pokémon Starters
// // // // 				</h1>

// // // // 				{/* Audio Controls */}
// // // // 				{loadingAudio ? (
// // // // 					<p className="text-center">Loading audio...</p>
// // // // 				) : audioStatus === "completed" && audio ? (
// // // // 					<div className="flex flex-col items-center mb-6">
// // // // 						<motion.button
// // // // 							onClick={handlePlay}
// // // // 							className="focus:outline-none bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
// // // // 							whileTap={{ scale: 0.95 }}
// // // // 							aria-label={
// // // // 								isPlaying ? "Pause Audio" : "Play Audio"
// // // // 							}
// // // // 						>
// // // // 							{isPlaying ? <FaPause /> : <FaPlay />}
// // // // 							<span className="ml-2">
// // // // 								{isPlaying ? "Pause" : "Play"} Audio Summary
// // // // 							</span>
// // // // 						</motion.button>
// // // // 					</div>
// // // // 				) : (
// // // // 					<p className="text-center">Audio is not available.</p>
// // // // 				)}

// // // // 				{/* Error Message */}
// // // // 				{errorMessage && (
// // // // 					<p className="text-red-500 text-center my-4">
// // // // 						{errorMessage}
// // // // 					</p>
// // // // 				)}

// // // // 				{/* Team Summary */}
// // // // 				<motion.div
// // // // 					initial={{ opacity: 0, y: 50 }}
// // // // 					animate={{ opacity: 1, y: 0 }}
// // // // 					transition={{ duration: 0.5 }}
// // // // 					className="bg-white p-6 rounded-lg shadow-md mb-6"
// // // // 				>
// // // // 					<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// // // // 						Team Summary
// // // // 					</h2>
// // // // 					<p className="text-gray-800 text-justify">{teamSummary}</p>
// // // // 				</motion.div>

// // // // 				{/* Pokémon Cards */}
// // // // 				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
// // // // 					{orderedPokemon.map((pokemon, index) => (
// // // // 						<div
// // // // 							key={index}
// // // // 							className={`${getCardStyle(pokemon.type)} mb-8`}
// // // // 						>
// // // // 							<motion.div
// // // // 								initial={{ opacity: 0, y: 50 }}
// // // // 								animate={{ opacity: 1, y: 0 }}
// // // // 								exit={{ opacity: 0, y: -50 }}
// // // // 								transition={{
// // // // 									duration: 0.5,
// // // // 									delay: index * 0.1,
// // // // 								}}
// // // // 								className={`border shadow-md rounded-lg p-4 flex flex-col items-center h-full relative`}
// // // // 							>
// // // // 								{/* Info Icon with Tooltip - Only if Unlocked */}
// // // // 								{unlockedPokemon[pokemon.name] && (
// // // // 									<div
// // // // 										className="absolute top-2 right-2 cursor-pointer"
// // // // 										ref={(el) => {
// // // // 											iconRefs.current[pokemon.name] = el;
// // // // 										}}
// // // // 										onClick={() =>
// // // // 											toggleTooltip(pokemon.name)
// // // // 										} // Handle click for mobile
// // // // 										onMouseEnter={() =>
// // // // 											setHoveredPokemon(pokemon.name)
// // // // 										} // Handle hover for desktop
// // // // 										onMouseLeave={() =>
// // // // 											setHoveredPokemon(null)
// // // // 										} // Handle hover out for desktop
// // // // 									>
// // // // 										<FaInfoCircle
// // // // 											className="text-gray-700 text-lg"
// // // // 											aria-label="View Traits"
// // // // 										/>
// // // // 										{/* Tooltip */}
// // // // 										<Tooltip
// // // // 											content={pokemon.traits}
// // // // 											anchorRef={
// // // // 												iconRefs.current[pokemon.name]
// // // // 													? {
// // // // 															current:
// // // // 																iconRefs
// // // // 																	.current[
// // // // 																	pokemon.name
// // // // 																],
// // // // 													  }
// // // // 													: { current: null }
// // // // 											}
// // // // 											isVisible={
// // // // 												hoveredPokemon ===
// // // // 													pokemon.name ||
// // // // 												clickedPokemon === pokemon.name
// // // // 											} // Show on hover or click
// // // // 											toggleVisibility={() =>
// // // // 												toggleTooltip(pokemon.name)
// // // // 											} // Pass the toggle function
// // // // 										/>
// // // // 									</div>
// // // // 								)}

// // // // 								{/* Pokémon Image */}
// // // // 								<Image
// // // // 									src={
// // // // 										pokemon.image ||
// // // // 										"/placeholder-pokemon.png"
// // // // 									}
// // // // 									alt={pokemon.name || "Pokemon"}
// // // // 									className={`rounded-md ${
// // // // 										!unlockedPokemon[pokemon.name]
// // // // 											? "blur-sm"
// // // // 											: ""
// // // // 									}`}
// // // // 									width={getImageSize(pokemon.rank)}
// // // // 									height={getImageSize(pokemon.rank)}
// // // // 								/>

// // // // 								{/* Pokémon Name */}
// // // // 								<h2
// // // // 									className={`${getFontSize(
// // // // 										pokemon.rank
// // // // 									)} font-semibold mt-2 text-center text-gray-900`}
// // // // 								>
// // // // 									{pokemon.name}
// // // // 								</h2>

// // // // 								{/* Pokémon Description or Unlock Button */}
// // // // 								<div className="text-center mt-2">
// // // // 									{unlockedPokemon[pokemon.name] ? (
// // // // 										<p
// // // // 											className={`${
// // // // 												pokemon.rank === "Can Relate To"
// // // // 													? "text-xs"
// // // // 													: "text-sm"
// // // // 											} text-gray-700`}
// // // // 										>
// // // // 											{pokemon.description}
// // // // 										</p>
// // // // 									) : (
// // // // 										<motion.button
// // // // 											onClick={() =>
// // // // 												handleUnlock(pokemon.name)
// // // // 											}
// // // // 											className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
// // // // 											whileTap={{ scale: 0.95 }}
// // // // 											aria-label={`Unlock ${pokemon.name}`}
// // // // 										>
// // // // 											Unlock
// // // // 										</motion.button>
// // // // 									)}
// // // // 								</div>

// // // // 								{/* Pokémon Rank with Icon */}
// // // // 								<span
// // // // 									className={`${
// // // // 										pokemon.rank === "Can Relate To"
// // // // 											? "text-xs"
// // // // 											: "text-sm"
// // // // 									} font-bold mt-auto flex items-center ${
// // // // 										typeStyles[pokemon.type].text
// // // // 									}`}
// // // // 								>
// // // // 									{/* Insert corresponding icon based on rank */}
// // // // 									{pokemon.rank === "Your Top Match!" && (
// // // // 										<FaStar
// // // // 											className="mr-1"
// // // // 											aria-label="Top Match Icon"
// // // // 										/>
// // // // 									)}
// // // // 									{pokemon.rank === "Runner Up" && (
// // // // 										<FaMedal
// // // // 											className="mr-1"
// // // // 											aria-label="Runner Up Icon"
// // // // 										/>
// // // // 									)}
// // // // 									{pokemon.rank === "Can Relate To" && (
// // // // 										<FaHandsHelping
// // // // 											className="mr-1"
// // // // 											aria-label="Can Relate To Icon"
// // // // 										/>
// // // // 									)}
// // // // 									{pokemon.rank}
// // // // 								</span>
// // // // 							</motion.div>
// // // // 						</div>
// // // // 					))}
// // // // 				</div>
// // // // 			</div>
// // // // 		</div>
// // // // 	);
// // // // }

// // // "use client";

// // // import Image from "next/image";
// // // import { motion } from "framer-motion";
// // // import { useState, useEffect, useRef } from "react";
// // // import {
// // // 	FaPlay,
// // // 	FaPause,
// // // 	FaInfoCircle,
// // // 	FaStar,
// // // 	FaMedal,
// // // 	FaHandsHelping,
// // // } from "react-icons/fa";
// // // import Tooltip from "./Tooltip";
// // // import { typeStyles } from "@/lib/typeStyles";

// // // interface Pokemon {
// // // 	name: string;
// // // 	image: string | null;
// // // 	description: string;
// // // 	type: "grass" | "fire" | "water";
// // // 	traits: string[];
// // // }

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
// // // 	const [errorMessage, setErrorMessage] = useState<string | null>(null);
// // // 	const [unlockedPokemon, setUnlockedPokemon] = useState<
// // // 		Record<string, boolean>
// // // 	>({});
// // // 	const [hoveredPokemon, setHoveredPokemon] = useState<string | null>(null);
// // // 	const [clickedPokemon, setClickedPokemon] = useState<string | null>(null);
// // // 	const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});

// // // 	useEffect(() => {
// // // 		const initialUnlocked: Record<string, boolean> = {};
// // // 		allPokemon.forEach((pokemon, index) => {
// // // 			initialUnlocked[pokemon.name] = index < 3;
// // // 		});
// // // 		setUnlockedPokemon(initialUnlocked);
// // // 	}, [allPokemon]);

// // // 	useEffect(() => {
// // // 		async function fetchAudioData() {
// // // 			try {
// // // 				const response = await fetch(`/api/get-audio/${resultId}`);
// // // 				if (!response.ok) {
// // // 					throw new Error("Failed to fetch audio data");
// // // 				}
// // // 				const data = await response.json();

// // // 				setAudioStatus(data.audioStatus);

// // // 				if (data.audioStatus === "completed" && data.audioBase64) {
// // // 					const binaryString = atob(data.audioBase64);
// // // 					const len = binaryString.length;
// // // 					const bytes = new Uint8Array(len);
// // // 					for (let i = 0; i < len; i++) {
// // // 						bytes[i] = binaryString.charCodeAt(i);
// // // 					}
// // // 					const audioBlob = new Blob([bytes], { type: "audio/mp3" });
// // // 					const audioUrl = URL.createObjectURL(audioBlob);
// // // 					const audioElement = new Audio(audioUrl);
// // // 					setAudio(audioElement);
// // // 					setLoadingAudio(false);
// // // 				} else if (data.audioStatus === "failed") {
// // // 					setErrorMessage(
// // // 						"Failed to generate audio. Please try again later."
// // // 					);
// // // 					setLoadingAudio(false);
// // // 				}
// // // 			} catch (error) {
// // // 				console.error("Error fetching audio data:", error);
// // // 				setErrorMessage(
// // // 					"Failed to load audio. Please try again later."
// // // 				);
// // // 				setLoadingAudio(false);
// // // 			}
// // // 		}

// // // 		fetchAudioData();
// // // 	}, [resultId]);

// // // 	const handlePlay = () => {
// // // 		if (!audio) return;
// // // 		if (isPlaying) {
// // // 			audio.pause();
// // // 		} else {
// // // 			audio.play().catch((e) => {
// // // 				console.error("Error playing audio:", e);
// // // 				setErrorMessage("Failed to play audio. Please try again.");
// // // 			});
// // // 		}
// // // 		setIsPlaying(!isPlaying);
// // // 	};

// // // 	const orderedPokemon = allPokemon.map((pokemon, index) => {
// // // 		let rank = "Can Relate To";
// // // 		if (index < 3) rank = "Your Top Match!";
// // // 		else if (index < 6) rank = "Runner Up";
// // // 		return { ...pokemon, rank };
// // // 	});

// // // 	const getCardStyle = (type: "grass" | "fire" | "water"): string => {
// // // 		return typeStyles[type].background;
// // // 	};

// // // 	const getFontSize = (rank: string): string => {
// // // 		switch (rank) {
// // // 			case "Your Top Match!":
// // // 				return "text-xl md:text-2xl";
// // // 			case "Runner Up":
// // // 				return "text-lg md:text-xl";
// // // 			case "Can Relate To":
// // // 				return "text-sm md:text-lg";
// // // 			default:
// // // 				return "text-xl md:text-2xl";
// // // 		}
// // // 	};

// // // 	const getImageSize = (rank: string): number => {
// // // 		switch (rank) {
// // // 			case "Your Top Match!":
// // // 				return 240;
// // // 			case "Runner Up":
// // // 				return 160;
// // // 			case "Can Relate To":
// // // 				return 100;
// // // 			default:
// // // 				return 240;
// // // 		}
// // // 	};

// // // 	const handleUnlock = (pokemonName: string) => {
// // // 		setUnlockedPokemon((prev) => ({
// // // 			...prev,
// // // 			[pokemonName]: true,
// // // 		}));
// // // 	};

// // // 	const toggleTooltip = (pokemonName: string) => {
// // // 		setClickedPokemon((prev) =>
// // // 			prev === pokemonName ? null : pokemonName
// // // 		);
// // // 	};

// // // 	useEffect(() => {
// // // 		const handleClickOutside = (event: MouseEvent) => {
// // // 			Object.keys(iconRefs.current).forEach((pokemonName) => {
// // // 				const iconElement = iconRefs.current[pokemonName];
// // // 				if (
// // // 					iconElement &&
// // // 					!iconElement.contains(event.target as Node)
// // // 				) {
// // // 					setClickedPokemon(null);
// // // 				}
// // // 			});
// // // 		};

// // // 		if (clickedPokemon) {
// // // 			document.addEventListener("mousedown", handleClickOutside);
// // // 		}

// // // 		return () => {
// // // 			document.removeEventListener("mousedown", handleClickOutside);
// // // 		};
// // // 	}, [clickedPokemon]);

// // // 	return (
// // // 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// // // 			<div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
// // // 				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800 capitalize">
// // // 					{trainerName}&apos;s Pokémon Starters
// // // 				</h1>

// // // 				{loadingAudio ? (
// // // 					<p className="text-center">Loading audio...</p>
// // // 				) : audioStatus === "completed" && audio ? (
// // // 					<div className="flex flex-col items-center mb-6">
// // // 						<motion.button
// // // 							onClick={handlePlay}
// // // 							className="focus:outline-none bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
// // // 							whileTap={{ scale: 0.95 }}
// // // 							aria-label={
// // // 								isPlaying ? "Pause Audio" : "Play Audio"
// // // 							}
// // // 						>
// // // 							{isPlaying ? <FaPause /> : <FaPlay />}
// // // 							<span className="ml-2">
// // // 								{isPlaying ? "Pause" : "Play"} Audio Summary
// // // 							</span>
// // // 						</motion.button>
// // // 					</div>
// // // 				) : (
// // // 					<p className="text-center">Audio is not available.</p>
// // // 				)}

// // // 				{errorMessage && (
// // // 					<p className="text-red-500 text-center my-4">
// // // 						{errorMessage}
// // // 					</p>
// // // 				)}

// // // 				<motion.div
// // // 					initial={{ opacity: 0, y: 50 }}
// // // 					animate={{ opacity: 1, y: 0 }}
// // // 					transition={{ duration: 0.5 }}
// // // 					className="bg-white p-6 rounded-lg shadow-md mb-6"
// // // 				>
// // // 					<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// // // 						Team Summary
// // // 					</h2>
// // // 					<p className="text-gray-800 text-justify">{teamSummary}</p>
// // // 				</motion.div>

// // // 				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
// // // 					{orderedPokemon.map((pokemon, index) => (
// // // 						<div
// // // 							key={index}
// // // 							className={`${getCardStyle(pokemon.type)} mb-8`}
// // // 						>
// // // 							<motion.div
// // // 								initial={{ opacity: 0, y: 50 }}
// // // 								animate={{ opacity: 1, y: 0 }}
// // // 								exit={{ opacity: 0, y: -50 }}
// // // 								transition={{
// // // 									duration: 0.5,
// // // 									delay: index * 0.1,
// // // 								}}
// // // 								className={`border shadow-md rounded-lg p-4 flex flex-col items-center h-full relative`}
// // // 							>
// // // 								{unlockedPokemon[pokemon.name] && (
// // // 									<div
// // // 										className="absolute top-2 right-2 cursor-pointer"
// // // 										ref={(el) => {
// // // 											iconRefs.current[pokemon.name] = el;
// // // 										}}
// // // 										onClick={() =>
// // // 											toggleTooltip(pokemon.name)
// // // 										}
// // // 										onMouseEnter={() =>
// // // 											setHoveredPokemon(pokemon.name)
// // // 										}
// // // 										onMouseLeave={() =>
// // // 											setHoveredPokemon(null)
// // // 										}
// // // 									>
// // // 										<FaInfoCircle
// // // 											className="text-gray-700 text-lg"
// // // 											aria-label="View Traits"
// // // 										/>
// // // 										<Tooltip
// // // 											content={pokemon.traits}
// // // 											anchorRef={
// // // 												iconRefs.current[pokemon.name]
// // // 													? {
// // // 															current:
// // // 																iconRefs
// // // 																	.current[
// // // 																	pokemon.name
// // // 																],
// // // 													  }
// // // 													: { current: null }
// // // 											}
// // // 											isVisible={
// // // 												hoveredPokemon ===
// // // 													pokemon.name ||
// // // 												clickedPokemon === pokemon.name
// // // 											}
// // // 											toggleVisibility={() =>
// // // 												toggleTooltip(pokemon.name)
// // // 											}
// // // 										/>
// // // 									</div>
// // // 								)}

// // // 								<Image
// // // 									src={
// // // 										pokemon.image ||
// // // 										"/placeholder-pokemon.png"
// // // 									}
// // // 									alt={pokemon.name || "Pokemon"}
// // // 									className={`rounded-md ${
// // // 										!unlockedPokemon[pokemon.name]
// // // 											? "blur-sm"
// // // 											: ""
// // // 									}`}
// // // 									width={getImageSize(pokemon.rank)}
// // // 									height={getImageSize(pokemon.rank)}
// // // 								/>

// // // 								<h2
// // // 									className={`${getFontSize(
// // // 										pokemon.rank
// // // 									)} font-semibold mt-2 text-center text-gray-900`}
// // // 								>
// // // 									{pokemon.name}
// // // 								</h2>

// // // 								<div className="text-center mt-2">
// // // 									{unlockedPokemon[pokemon.name] ? (
// // // 										<p
// // // 											className={`${
// // // 												pokemon.rank === "Can Relate To"
// // // 													? "text-xs"
// // // 													: "text-sm"
// // // 											} text-gray-700`}
// // // 										>
// // // 											{pokemon.description}
// // // 										</p>
// // // 									) : (
// // // 										<motion.button
// // // 											onClick={() =>
// // // 												handleUnlock(pokemon.name)
// // // 											}
// // // 											className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
// // // 											whileTap={{ scale: 0.95 }}
// // // 											aria-label={`Unlock ${pokemon.name}`}
// // // 										>
// // // 											Unlock
// // // 										</motion.button>
// // // 									)}
// // // 								</div>

// // // 								<span
// // // 									className={`${
// // // 										pokemon.rank === "Can Relate To"
// // // 											? "text-xs"
// // // 											: "text-sm"
// // // 									} font-bold mt-auto flex items-center ${
// // // 										typeStyles[pokemon.type].text
// // // 									}`}
// // // 								>
// // // 									{pokemon.rank === "Your Top Match!" && (
// // // 										<FaStar
// // // 											className="mr-1"
// // // 											aria-label="Top Match Icon"
// // // 										/>
// // // 									)}
// // // 									{pokemon.rank === "Runner Up" && (
// // // 										<FaMedal
// // // 											className="mr-1"
// // // 											aria-label="Runner Up Icon"
// // // 										/>
// // // 									)}
// // // 									{pokemon.rank === "Can Relate To" && (
// // // 										<FaHandsHelping
// // // 											className="mr-1"
// // // 											aria-label="Can Relate To Icon"
// // // 										/>
// // // 									)}
// // // 									{pokemon.rank}
// // // 								</span>
// // // 							</motion.div>
// // // 						</div>
// // // 					))}
// // // 				</div>
// // // 			</div>
// // // 		</div>
// // // 	);
// // // }

// // "use client";

// // import Image from "next/image";
// // import { motion } from "framer-motion";
// // import { useState, useEffect, useRef } from "react";
// // import {
// // 	FaPlay,
// // 	FaPause,
// // 	FaInfoCircle,
// // 	FaStar,
// // 	FaMedal,
// // 	FaHandsHelping,
// // } from "react-icons/fa";
// // import Tooltip from "./Tooltip";
// // import { typeStyles } from "@/lib/typeStyles";

// // interface Pokemon {
// // 	name: string;
// // 	image: string | null;
// // 	description: string;
// // 	type: "grass" | "fire" | "water";
// // 	traits: string[];
// // }

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
// // 	const [errorMessage, setErrorMessage] = useState<string | null>(null);
// // 	const [unlockedPokemon, setUnlockedPokemon] = useState<
// // 		Record<string, boolean>
// // 	>({});
// // 	const [hoveredPokemon, setHoveredPokemon] = useState<string | null>(null);
// // 	const [clickedPokemon, setClickedPokemon] = useState<string | null>(null);
// // 	const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});

// // 	const orderedPokemon = (() => {
// // 		const grassPokemon = allPokemon.filter((p) => p.type === "grass");
// // 		const firePokemon = allPokemon.filter((p) => p.type === "fire");
// // 		const waterPokemon = allPokemon.filter((p) => p.type === "water");

// // 		if (firePokemon.length >= 3) {
// // 			const temp = firePokemon[0];
// // 			firePokemon[0] = firePokemon[2];
// // 			firePokemon[2] = temp;
// // 		}

// // 		return [0, 1, 2]
// // 			.flatMap((i) => [grassPokemon[i], firePokemon[i], waterPokemon[i]])
// // 			.filter(Boolean);
// // 	})();

// // 	useEffect(() => {
// // 		const initialUnlocked: Record<string, boolean> = {};
// // 		orderedPokemon.forEach((pokemon, index) => {
// // 			initialUnlocked[pokemon.name] = index < 3;
// // 		});
// // 		setUnlockedPokemon(initialUnlocked);
// // 	}, []);

// // 	useEffect(() => {
// // 		async function fetchAudioData() {
// // 			try {
// // 				const response = await fetch(`/api/get-audio/${resultId}`);
// // 				if (!response.ok) {
// // 					throw new Error("Failed to fetch audio data");
// // 				}
// // 				const data = await response.json();

// // 				setAudioStatus(data.audioStatus);

// // 				if (data.audioStatus === "completed" && data.audioBase64) {
// // 					const audioBlob = new Blob(
// // 						[Buffer.from(data.audioBase64, "base64")],
// // 						{ type: "audio/mp3" }
// // 					);
// // 					const audioUrl = URL.createObjectURL(audioBlob);
// // 					const audioElement = new Audio(audioUrl);
// // 					setAudio(audioElement);
// // 					setLoadingAudio(false);
// // 				} else if (data.audioStatus === "failed") {
// // 					setErrorMessage(
// // 						"Failed to generate audio. Please try again later."
// // 					);
// // 					setLoadingAudio(false);
// // 				}
// // 			} catch (error) {
// // 				console.error("Error fetching audio data:", error);
// // 				setErrorMessage(
// // 					"Failed to load audio. Please try again later."
// // 				);
// // 				setLoadingAudio(false);
// // 			}
// // 		}

// // 		fetchAudioData();
// // 	}, [resultId]);

// // 	const handlePlay = () => {
// // 		if (!audio) return;
// // 		if (isPlaying) {
// // 			audio.pause();
// // 		} else {
// // 			audio.play().catch((e) => {
// // 				console.error("Error playing audio:", e);
// // 				setErrorMessage("Failed to play audio. Please try again.");
// // 			});
// // 		}
// // 		setIsPlaying(!isPlaying);
// // 	};

// // 	const handleUnlock = (pokemonName: string) => {
// // 		setUnlockedPokemon((prev) => ({
// // 			...prev,
// // 			[pokemonName]: true,
// // 		}));
// // 	};

// // 	const toggleTooltip = (pokemonName: string) => {
// // 		setClickedPokemon((prev) =>
// // 			prev === pokemonName ? null : pokemonName
// // 		);
// // 	};

// // 	const getCardStyle = (type: "grass" | "fire" | "water"): string => {
// // 		return typeStyles[type].background;
// // 	};

// // 	const getFontSize = (index: number): string => {
// // 		if (index < 3) return "text-xl md:text-2xl";
// // 		if (index < 6) return "text-lg md:text-xl";
// // 		return "text-sm md:text-lg";
// // 	};

// // 	const getImageSize = (index: number): number => {
// // 		if (index < 3) return 240;
// // 		if (index < 6) return 200;
// // 		return 160;
// // 	};

// // 	const getRank = (index: number): string => {
// // 		if (index < 3) return "Your Top Match!";
// // 		if (index < 6) return "Runner Up";
// // 		return "Can Relate To";
// // 	};

// // 	return (
// // 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// // 			<div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
// // 				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800 capitalize">
// // 					{trainerName}&apos;s Pokémon Starters
// // 				</h1>

// // 				{loadingAudio ? (
// // 					<p className="text-center">Loading audio...</p>
// // 				) : audioStatus === "completed" && audio ? (
// // 					<div className="flex flex-col items-center mb-6">
// // 						<motion.button
// // 							onClick={handlePlay}
// // 							className="focus:outline-none bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
// // 							whileTap={{ scale: 0.95 }}
// // 							aria-label={
// // 								isPlaying ? "Pause Audio" : "Play Audio"
// // 							}
// // 						>
// // 							{isPlaying ? <FaPause /> : <FaPlay />}
// // 							<span className="ml-2">
// // 								{isPlaying ? "Pause" : "Play"} Audio Summary
// // 							</span>
// // 						</motion.button>
// // 					</div>
// // 				) : (
// // 					<p className="text-center">Audio is not available.</p>
// // 				)}

// // 				{errorMessage && (
// // 					<p className="text-red-500 text-center my-4">
// // 						{errorMessage}
// // 					</p>
// // 				)}

// // 				<motion.div
// // 					initial={{ opacity: 0, y: 50 }}
// // 					animate={{ opacity: 1, y: 0 }}
// // 					transition={{ duration: 0.5 }}
// // 					className="bg-white p-6 rounded-lg shadow-md mb-6"
// // 				>
// // 					<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// // 						Team Summary
// // 					</h2>
// // 					<p className="text-gray-800 text-justify">{teamSummary}</p>
// // 				</motion.div>

// // 				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
// // 					{orderedPokemon.map((pokemon, index) => (
// // 						<div
// // 							key={index}
// // 							className={`${getCardStyle(pokemon.type)} mb-8`}
// // 						>
// // 							<motion.div
// // 								initial={{ opacity: 0, y: 50 }}
// // 								animate={{ opacity: 1, y: 0 }}
// // 								exit={{ opacity: 0, y: -50 }}
// // 								transition={{
// // 									duration: 0.5,
// // 									delay: index * 0.1,
// // 								}}
// // 								className={`border shadow-md rounded-lg p-4 flex flex-col items-center h-full relative`}
// // 							>
// // 								{unlockedPokemon[pokemon.name] && (
// // 									<div
// // 										className="absolute top-2 right-2 cursor-pointer"
// // 										ref={(el) => {
// // 											iconRefs.current[pokemon.name] = el;
// // 										}}
// // 										onClick={() =>
// // 											toggleTooltip(pokemon.name)
// // 										}
// // 										onMouseEnter={() =>
// // 											setHoveredPokemon(pokemon.name)
// // 										}
// // 										onMouseLeave={() =>
// // 											setHoveredPokemon(null)
// // 										}
// // 									>
// // 										<FaInfoCircle
// // 											className="text-gray-700 text-lg"
// // 											aria-label="View Traits"
// // 										/>
// // 										<Tooltip
// // 											content={pokemon.traits}
// // 											anchorRef={{
// // 												current:
// // 													iconRefs.current[
// // 														pokemon.name
// // 													],
// // 											}}
// // 											isVisible={
// // 												hoveredPokemon ===
// // 													pokemon.name ||
// // 												clickedPokemon === pokemon.name
// // 											}
// // 											toggleVisibility={() =>
// // 												toggleTooltip(pokemon.name)
// // 											}
// // 										/>
// // 									</div>
// // 								)}

// // 								<Image
// // 									src={
// // 										pokemon.image ||
// // 										"/placeholder-pokemon.png"
// // 									}
// // 									alt={pokemon.name || "Pokemon"}
// // 									className={`rounded-md ${
// // 										!unlockedPokemon[pokemon.name]
// // 											? "blur-sm"
// // 											: ""
// // 									}`}
// // 									width={getImageSize(index)}
// // 									height={getImageSize(index)}
// // 								/>

// // 								<h2
// // 									className={`${getFontSize(
// // 										index
// // 									)} font-semibold mt-2 text-center text-gray-900`}
// // 								>
// // 									{pokemon.name}
// // 								</h2>

// // 								<div className="text-center mt-2">
// // 									{unlockedPokemon[pokemon.name] ? (
// // 										<p
// // 											className={`${
// // 												index >= 6
// // 													? "text-xs"
// // 													: "text-sm"
// // 											} text-gray-700`}
// // 										>
// // 											{pokemon.description}
// // 										</p>
// // 									) : (
// // 										<motion.button
// // 											onClick={() =>
// // 												handleUnlock(pokemon.name)
// // 											}
// // 											className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
// // 											whileTap={{ scale: 0.95 }}
// // 											aria-label={`Unlock ${pokemon.name}`}
// // 										>
// // 											Unlock
// // 										</motion.button>
// // 									)}
// // 								</div>

// // 								<span
// // 									className={`${
// // 										index >= 6 ? "text-xs" : "text-sm"
// // 									} font-bold mt-auto flex items-center ${
// // 										typeStyles[pokemon.type].text
// // 									}`}
// // 								>
// // 									{index < 3 && (
// // 										<FaStar
// // 											className="mr-1"
// // 											aria-label="Top Match Icon"
// // 										/>
// // 									)}
// // 									{index >= 3 && index < 6 && (
// // 										<FaMedal
// // 											className="mr-1"
// // 											aria-label="Runner Up Icon"
// // 										/>
// // 									)}
// // 									{index >= 6 && (
// // 										<FaHandsHelping
// // 											className="mr-1"
// // 											aria-label="Can Relate To Icon"
// // 										/>
// // 									)}
// // 									{getRank(index)}
// // 								</span>
// // 							</motion.div>
// // 						</div>
// // 					))}
// // 				</div>
// // 			</div>
// // 		</div>
// // 	);
// // }

// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";
// import { useState, useEffect, useRef } from "react";
// import {
// 	FaPlay,
// 	FaPause,
// 	FaInfoCircle,
// 	FaStar,
// 	FaMedal,
// 	FaHandsHelping,
// } from "react-icons/fa";
// import Tooltip from "./Tooltip";
// import { typeStyles } from "@/lib/typeStyles";

// interface Pokemon {
// 	name: string;
// 	image: string | null;
// 	description: string;
// 	type: "grass" | "fire" | "water";
// 	traits: string[];
// }

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
// 	const [errorMessage, setErrorMessage] = useState<string | null>(null);
// 	const [unlockedPokemon, setUnlockedPokemon] = useState<
// 		Record<string, boolean>
// 	>({});
// 	const [hoveredPokemon, setHoveredPokemon] = useState<string | null>(null);
// 	const [clickedPokemon, setClickedPokemon] = useState<string | null>(null);
// 	const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});

// 	const orderedPokemon = (() => {
// 		const grassPokemon = allPokemon.filter((p) => p.type === "grass");
// 		const firePokemon = allPokemon.filter((p) => p.type === "fire");
// 		const waterPokemon = allPokemon.filter((p) => p.type === "water");

// 		return [
// 			grassPokemon[0],
// 			firePokemon[0],
// 			waterPokemon[0],
// 			grassPokemon[1],
// 			firePokemon[1],
// 			waterPokemon[1],
// 			grassPokemon[2],
// 			firePokemon[2],
// 			waterPokemon[2],
// 		].filter(Boolean);
// 	})();

// 	useEffect(() => {
// 		const initialUnlocked: Record<string, boolean> = {};
// 		orderedPokemon.forEach((pokemon, index) => {
// 			initialUnlocked[pokemon.name] = index < 3;
// 		});
// 		setUnlockedPokemon(initialUnlocked);
// 	}, [orderedPokemon]);

// 	useEffect(() => {
// 		async function fetchAudioData() {
// 			try {
// 				const response = await fetch(`/api/get-audio/${resultId}`);
// 				if (!response.ok) {
// 					throw new Error("Failed to fetch audio data");
// 				}
// 				const data = await response.json();

// 				setAudioStatus(data.audioStatus);

// 				if (data.audioStatus === "completed" && data.audioBase64) {
// 					const audioBlob = new Blob(
// 						[Buffer.from(data.audioBase64, "base64")],
// 						{ type: "audio/mp3" }
// 					);
// 					const audioUrl = URL.createObjectURL(audioBlob);
// 					const audioElement = new Audio(audioUrl);
// 					setAudio(audioElement);
// 					setLoadingAudio(false);
// 				} else if (data.audioStatus === "failed") {
// 					setErrorMessage(
// 						"Failed to generate audio. Please try again later."
// 					);
// 					setLoadingAudio(false);
// 				}
// 			} catch (error) {
// 				console.error("Error fetching audio data:", error);
// 				setErrorMessage(
// 					"Failed to load audio. Please try again later."
// 				);
// 				setLoadingAudio(false);
// 			}
// 		}

// 		fetchAudioData();
// 	}, [resultId]);

// 	const handlePlay = () => {
// 		if (!audio) return;
// 		if (isPlaying) {
// 			audio.pause();
// 		} else {
// 			audio.play().catch((e) => {
// 				console.error("Error playing audio:", e);
// 				setErrorMessage("Failed to play audio. Please try again.");
// 			});
// 		}
// 		setIsPlaying(!isPlaying);
// 	};

// 	const handleUnlock = (pokemonName: string) => {
// 		setUnlockedPokemon((prev) => ({
// 			...prev,
// 			[pokemonName]: true,
// 		}));
// 	};

// 	const toggleTooltip = (pokemonName: string) => {
// 		setClickedPokemon((prev) =>
// 			prev === pokemonName ? null : pokemonName
// 		);
// 	};

// 	const getCardStyle = (type: "grass" | "fire" | "water"): string => {
// 		return typeStyles[type].background;
// 	};

// 	const getFontSize = (index: number): string => {
// 		if (index < 3) return "text-xl md:text-2xl";
// 		if (index < 6) return "text-lg md:text-xl";
// 		return "text-sm md:text-lg";
// 	};

// 	const getImageSize = (index: number): number => {
// 		if (index < 3) return 240;
// 		if (index < 6) return 200;
// 		return 160;
// 	};

// 	const getRank = (index: number): string => {
// 		if (index < 3) return "Your Top Match!";
// 		if (index < 6) return "Runner Up";
// 		return "Can Relate To";
// 	};

// 	return (
// 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// 			<div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
// 				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800 capitalize">
// 					{trainerName}&apos;s Pokémon Starters
// 				</h1>

// 				{loadingAudio ? (
// 					<p className="text-center">Loading audio...</p>
// 				) : audioStatus === "completed" && audio ? (
// 					<div className="flex flex-col items-center mb-6">
// 						<motion.button
// 							onClick={handlePlay}
// 							className="focus:outline-none bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
// 							whileTap={{ scale: 0.95 }}
// 							aria-label={
// 								isPlaying ? "Pause Audio" : "Play Audio"
// 							}
// 						>
// 							{isPlaying ? <FaPause /> : <FaPlay />}
// 							<span className="ml-2">
// 								{isPlaying ? "Pause" : "Play"} Audio Summary
// 							</span>
// 						</motion.button>
// 					</div>
// 				) : (
// 					<p className="text-center">Audio is not available.</p>
// 				)}

// 				{errorMessage && (
// 					<p className="text-red-500 text-center my-4">
// 						{errorMessage}
// 					</p>
// 				)}

// 				<motion.div
// 					initial={{ opacity: 0, y: 50 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ duration: 0.5 }}
// 					className="bg-white p-6 rounded-lg shadow-md mb-6"
// 				>
// 					<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// 						Team Summary
// 					</h2>
// 					<p className="text-gray-800 text-justify">{teamSummary}</p>
// 				</motion.div>

// 				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
// 					{orderedPokemon.map((pokemon, index) => (
// 						<div
// 							key={index}
// 							className={`${getCardStyle(pokemon.type)} mb-8`}
// 						>
// 							<motion.div
// 								initial={{ opacity: 0, y: 50 }}
// 								animate={{ opacity: 1, y: 0 }}
// 								exit={{ opacity: 0, y: -50 }}
// 								transition={{
// 									duration: 0.5,
// 									delay: index * 0.1,
// 								}}
// 								className={`border shadow-md rounded-lg p-4 flex flex-col items-center h-full relative`}
// 							>
// 								{unlockedPokemon[pokemon.name] && (
// 									<div
// 										className="absolute top-2 right-2 cursor-pointer"
// 										ref={(el) => {
// 											iconRefs.current[pokemon.name] = el;
// 										}}
// 										onClick={() =>
// 											toggleTooltip(pokemon.name)
// 										}
// 										onMouseEnter={() =>
// 											setHoveredPokemon(pokemon.name)
// 										}
// 										onMouseLeave={() =>
// 											setHoveredPokemon(null)
// 										}
// 									>
// 										<FaInfoCircle
// 											className="text-gray-700 text-lg"
// 											aria-label="View Traits"
// 										/>
// 										<Tooltip
// 											content={pokemon.traits}
// 											anchorRef={{
// 												current:
// 													iconRefs.current[
// 														pokemon.name
// 													],
// 											}}
// 											isVisible={
// 												hoveredPokemon ===
// 													pokemon.name ||
// 												clickedPokemon === pokemon.name
// 											}
// 											toggleVisibility={() =>
// 												toggleTooltip(pokemon.name)
// 											}
// 										/>
// 									</div>
// 								)}

// 								<Image
// 									src={
// 										pokemon.image ||
// 										"/placeholder-pokemon.png"
// 									}
// 									alt={pokemon.name || "Pokemon"}
// 									className={`rounded-md ${
// 										!unlockedPokemon[pokemon.name]
// 											? "blur-sm"
// 											: ""
// 									}`}
// 									width={getImageSize(index)}
// 									height={getImageSize(index)}
// 								/>

// 								<h2
// 									className={`${getFontSize(
// 										index
// 									)} font-semibold mt-2 text-center text-gray-900`}
// 								>
// 									{pokemon.name}
// 								</h2>

// 								<div className="text-center mt-2">
// 									{unlockedPokemon[pokemon.name] ? (
// 										<p
// 											className={`${
// 												index >= 6
// 													? "text-xs"
// 													: "text-sm"
// 											} text-gray-700`}
// 										>
// 											{pokemon.description}
// 										</p>
// 									) : (
// 										<motion.button
// 											onClick={() =>
// 												handleUnlock(pokemon.name)
// 											}
// 											className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
// 											whileTap={{ scale: 0.95 }}
// 											aria-label={`Unlock ${pokemon.name}`}
// 										>
// 											Unlock
// 										</motion.button>
// 									)}
// 								</div>

// 								<span
// 									className={`${
// 										index >= 6 ? "text-xs" : "text-sm"
// 									} font-bold mt-auto flex items-center ${
// 										typeStyles[pokemon.type].text
// 									}`}
// 								>
// 									{index < 3 && (
// 										<FaStar
// 											className="mr-1"
// 											aria-label="Top Match Icon"
// 										/>
// 									)}
// 									{index >= 3 && index < 6 && (
// 										<FaMedal
// 											className="mr-1"
// 											aria-label="Runner Up Icon"
// 										/>
// 									)}
// 									{index >= 6 && (
// 										<FaHandsHelping
// 											className="mr-1"
// 											aria-label="Can Relate To Icon"
// 										/>
// 									)}
// 									{getRank(index)}
// 								</span>
// 							</motion.div>
// 						</div>
// 					))}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import {
	FaPlay,
	FaPause,
	FaInfoCircle,
	FaStar,
	FaMedal,
	FaHandsHelping,
} from "react-icons/fa";
import Tooltip from "./Tooltip";
import { typeStyles } from "@/lib/typeStyles";

interface Pokemon {
	name: string;
	image: string | null;
	description: string;
	type: "grass" | "fire" | "water";
	traits: string[];
}

interface SharedResultsProps {
	allPokemon: Pokemon[];
	teamSummary: string;
	trainerName: string;
	resultId: string;
	rankings?: {
		[key in "grass" | "fire" | "water"]?: {
			top: string;
			runnerUp: string;
			canRelate: string;
		};
	};
}

export default function SharedResults({
	allPokemon,
	teamSummary,
	trainerName,
	resultId,
	rankings,
}: SharedResultsProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
	const [audioStatus, setAudioStatus] = useState<string>("pending");
	const [loadingAudio, setLoadingAudio] = useState<boolean>(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [unlockedPokemon, setUnlockedPokemon] = useState<
		Record<string, boolean>
	>({});
	const [hoveredPokemon, setHoveredPokemon] = useState<string | null>(null);
	const [clickedPokemon, setClickedPokemon] = useState<string | null>(null);
	const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});

	const orderedPokemon = useMemo(() => {
		if (rankings) {
			return ["grass", "fire", "water"]
				.flatMap((type) => {
					const typeRankings =
						rankings[type as keyof typeof rankings];
					if (!typeRankings) return [];
					return [
						typeRankings.top,
						typeRankings.runnerUp,
						typeRankings.canRelate,
					].map((name) =>
						allPokemon.find(
							(p) => p.name === name && p.type === type
						)
					);
				})
				.filter((p): p is Pokemon => p !== undefined);
		} else {
			const grassPokemon = allPokemon.filter((p) => p.type === "grass");
			const firePokemon = allPokemon.filter((p) => p.type === "fire");
			const waterPokemon = allPokemon.filter((p) => p.type === "water");
			return [
				grassPokemon[0],
				firePokemon[0],
				waterPokemon[0],
				grassPokemon[1],
				firePokemon[1],
				waterPokemon[1],
				grassPokemon[2],
				firePokemon[2],
				waterPokemon[2],
			].filter(Boolean);
		}
	}, [allPokemon, rankings]);

	useEffect(() => {
		const initialUnlocked: Record<string, boolean> = {};
		orderedPokemon.forEach((pokemon, index) => {
			initialUnlocked[pokemon.name] = index < 3;
		});
		setUnlockedPokemon(initialUnlocked);
	}, [orderedPokemon]);

	useEffect(() => {
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
						{ type: "audio/mp3" }
					);
					const audioUrl = URL.createObjectURL(audioBlob);
					const audioElement = new Audio(audioUrl);
					setAudio(audioElement);
					setLoadingAudio(false);
				} else if (data.audioStatus === "failed") {
					setErrorMessage(
						"Failed to generate audio. Please try again later."
					);
					setLoadingAudio(false);
				}
			} catch (error) {
				console.error("Error fetching audio data:", error);
				setErrorMessage(
					"Failed to load audio. Please try again later."
				);
				setLoadingAudio(false);
			}
		}

		fetchAudioData();
	}, [resultId]);

	const handlePlay = () => {
		if (!audio) return;
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play().catch((e) => {
				console.error("Error playing audio:", e);
				setErrorMessage("Failed to play audio. Please try again.");
			});
		}
		setIsPlaying(!isPlaying);
	};

	const handleUnlock = (pokemonName: string) => {
		setUnlockedPokemon((prev) => ({
			...prev,
			[pokemonName]: true,
		}));
	};

	const toggleTooltip = (pokemonName: string) => {
		setClickedPokemon((prev) =>
			prev === pokemonName ? null : pokemonName
		);
	};

	const getCardStyle = (type: "grass" | "fire" | "water"): string => {
		return typeStyles[type].background;
	};

	const getFontSize = (index: number): string => {
		if (index < 3) return "text-xl md:text-2xl";
		if (index < 6) return "text-lg md:text-xl";
		return "text-sm md:text-lg";
	};

	const getImageSize = (index: number): number => {
		if (index < 3) return 240;
		if (index < 6) return 200;
		return 160;
	};

	const getRank = (index: number): string => {
		if (index < 3) return "Your Top Match!";
		if (index < 6) return "Runner Up";
		return "Can Relate To";
	};

	return (
		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
			<div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
				<h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800 capitalize">
					{trainerName}&apos;s Pokémon Starters
				</h1>

				{loadingAudio ? (
					<p className="text-center">Loading audio...</p>
				) : audioStatus === "completed" && audio ? (
					<div className="flex flex-col items-center mb-6">
						<motion.button
							onClick={handlePlay}
							className="focus:outline-none bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
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

				{errorMessage && (
					<p className="text-red-500 text-center my-4">
						{errorMessage}
					</p>
				)}

				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-white p-6 rounded-lg shadow-md mb-6"
				>
					<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
						Team Summary
					</h2>
					<p className="text-gray-800 text-justify">{teamSummary}</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
					{orderedPokemon.map((pokemon, index) => (
						<div
							key={index}
							className={`${getCardStyle(pokemon.type)} mb-8`}
						>
							<motion.div
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -50 }}
								transition={{
									duration: 0.5,
									delay: index * 0.1,
								}}
								className={`border shadow-md rounded-lg p-4 flex flex-col items-center h-full relative`}
							>
								{unlockedPokemon[pokemon.name] && (
									<div
										className="absolute top-2 right-2 cursor-pointer"
										ref={(el) => {
											iconRefs.current[pokemon.name] = el;
										}}
										onClick={() =>
											toggleTooltip(pokemon.name)
										}
										onMouseEnter={() =>
											setHoveredPokemon(pokemon.name)
										}
										onMouseLeave={() =>
											setHoveredPokemon(null)
										}
									>
										<FaInfoCircle
											className="text-gray-700 text-lg"
											aria-label="View Traits"
										/>
										<Tooltip
											content={pokemon.traits}
											anchorRef={{
												current:
													iconRefs.current[
														pokemon.name
													],
											}}
											isVisible={
												hoveredPokemon ===
													pokemon.name ||
												clickedPokemon === pokemon.name
											}
											toggleVisibility={() =>
												toggleTooltip(pokemon.name)
											}
										/>
									</div>
								)}

								<Image
									src={
										pokemon.image ||
										"/placeholder-pokemon.png"
									}
									alt={pokemon.name || "Pokemon"}
									className={`rounded-md ${
										!unlockedPokemon[pokemon.name]
											? "blur-sm"
											: ""
									}`}
									width={getImageSize(index)}
									height={getImageSize(index)}
								/>

								<h2
									className={`${getFontSize(
										index
									)} font-semibold mt-2 text-center text-gray-900`}
								>
									{pokemon.name}
								</h2>

								<div className="text-center mt-2">
									{unlockedPokemon[pokemon.name] ? (
										<p
											className={`${
												index >= 6
													? "text-xs"
													: "text-sm"
											} text-gray-700`}
										>
											{pokemon.description}
										</p>
									) : (
										<motion.button
											onClick={() =>
												handleUnlock(pokemon.name)
											}
											className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
											whileTap={{ scale: 0.95 }}
											aria-label={`Unlock ${pokemon.name}`}
										>
											Unlock
										</motion.button>
									)}
								</div>

								<span
									className={`${
										index >= 6 ? "text-xs" : "text-sm"
									} font-bold mt-auto flex items-center ${
										typeStyles[pokemon.type].text
									}`}
								>
									{index < 3 && (
										<FaStar
											className="mr-1"
											aria-label="Top Match Icon"
										/>
									)}
									{index >= 3 && index < 6 && (
										<FaMedal
											className="mr-1"
											aria-label="Runner Up Icon"
										/>
									)}
									{index >= 6 && (
										<FaHandsHelping
											className="mr-1"
											aria-label="Can Relate To Icon"
										/>
									)}
									{getRank(index)}
								</span>
							</motion.div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
