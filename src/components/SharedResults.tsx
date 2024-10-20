// incorrect ordering correct card sizing
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

// 	useEffect(() => {
// 		const initialUnlocked: Record<string, boolean> = {};
// 		allPokemon.forEach((pokemon, index) => {
// 			initialUnlocked[pokemon.name] = index < 3;
// 		});
// 		setUnlockedPokemon(initialUnlocked);
// 	}, [allPokemon]);

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
// 					const binaryString = atob(data.audioBase64);
// 					const len = binaryString.length;
// 					const bytes = new Uint8Array(len);
// 					for (let i = 0; i < len; i++) {
// 						bytes[i] = binaryString.charCodeAt(i);
// 					}
// 					const audioBlob = new Blob([bytes], { type: "audio/mp3" });
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

// 	const orderedPokemon = allPokemon.map((pokemon, index) => {
// 		let rank = "Can Relate To";
// 		if (index < 3) rank = "Your Top Match!";
// 		else if (index < 6) rank = "Runner Up";
// 		return { ...pokemon, rank };
// 	});

// 	const getCardStyle = (type: "grass" | "fire" | "water"): string => {
// 		return typeStyles[type].background;
// 	};

// 	const getFontSize = (rank: string): string => {
// 		switch (rank) {
// 			case "Your Top Match!":
// 				return "text-xl md:text-2xl";
// 			case "Runner Up":
// 				return "text-lg md:text-xl";
// 			case "Can Relate To":
// 				return "text-sm md:text-lg";
// 			default:
// 				return "text-xl md:text-2xl";
// 		}
// 	};

// 	const getImageSize = (rank: string): number => {
// 		switch (rank) {
// 			case "Your Top Match!":
// 				return 240;
// 			case "Runner Up":
// 				return 160;
// 			case "Can Relate To":
// 				return 100;
// 			default:
// 				return 240;
// 		}
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

// 	useEffect(() => {
// 		const handleClickOutside = (event: MouseEvent) => {
// 			Object.keys(iconRefs.current).forEach((pokemonName) => {
// 				const iconElement = iconRefs.current[pokemonName];
// 				if (
// 					iconElement &&
// 					!iconElement.contains(event.target as Node)
// 				) {
// 					setClickedPokemon(null);
// 				}
// 			});
// 		};

// 		if (clickedPokemon) {
// 			document.addEventListener("mousedown", handleClickOutside);
// 		}

// 		return () => {
// 			document.removeEventListener("mousedown", handleClickOutside);
// 		};
// 	}, [clickedPokemon]);

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
// 											anchorRef={
// 												iconRefs.current[pokemon.name]
// 													? {
// 															current:
// 																iconRefs
// 																	.current[
// 																	pokemon.name
// 																],
// 													  }
// 													: { current: null }
// 											}
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
// 									width={getImageSize(pokemon.rank)}
// 									height={getImageSize(pokemon.rank)}
// 								/>

// 								<h2
// 									className={`${getFontSize(
// 										pokemon.rank
// 									)} font-semibold mt-2 text-center text-gray-900`}
// 								>
// 									{pokemon.name}
// 								</h2>

// 								<div className="text-center mt-2">
// 									{unlockedPokemon[pokemon.name] ? (
// 										<p
// 											className={`${
// 												pokemon.rank === "Can Relate To"
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
// 										pokemon.rank === "Can Relate To"
// 											? "text-xs"
// 											: "text-sm"
// 									} font-bold mt-auto flex items-center ${
// 										typeStyles[pokemon.type].text
// 									}`}
// 								>
// 									{pokemon.rank === "Your Top Match!" && (
// 										<FaStar
// 											className="mr-1"
// 											aria-label="Top Match Icon"
// 										/>
// 									)}
// 									{pokemon.rank === "Runner Up" && (
// 										<FaMedal
// 											className="mr-1"
// 											aria-label="Runner Up Icon"
// 										/>
// 									)}
// 									{pokemon.rank === "Can Relate To" && (
// 										<FaHandsHelping
// 											className="mr-1"
// 											aria-label="Can Relate To Icon"
// 										/>
// 									)}
// 									{pokemon.rank}
// 								</span>
// 							</motion.div>
// 						</div>
// 					))}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// latest correct ordering wrong sizing of cards
// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";
// import { useState, useEffect, useRef, useMemo } from "react";
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
// 	resultId: string;
// 	trainerName: string;
// 	teamSummary: string;
// 	allPokemon: (Pokemon & { type: "grass" | "fire" | "water" })[];
// 	rankings?: {
// 		grass?: { top: string; runnerUp: string; canRelate: string };
// 		fire?: { top: string; runnerUp: string; canRelate: string };
// 		water?: { top: string; runnerUp: string; canRelate: string };
// 	};
// }

// const Pokeball = ({
// 	isOpen,
// 	children,
// 	imageSize,
// }: {
// 	isOpen: boolean;
// 	children: React.ReactNode;
// 	imageSize: number;
// }) => (
// 	<div
// 		className="relative"
// 		style={{ width: `${imageSize}px`, height: `${imageSize}px` }}
// 	>
// 		<svg viewBox="0 0 100 100" className="w-full h-full">
// 			<circle cx="50" cy="50" r="50" fill="#f2f2f2" />
// 			<path
// 				d="M5,50 a1,1 0 0,1 90,0"
// 				fill="#ff1a1a"
// 				className={`transition-all duration-1000 ${
// 					isOpen ? "translate-y-[-25px] rotate-[-25deg]" : ""
// 				}`}
// 			/>
// 			<circle
// 				cx="50"
// 				cy="50"
// 				r="12"
// 				fill="#2c2c2c"
// 				stroke="#f2f2f2"
// 				strokeWidth="2"
// 			/>
// 			<path
// 				d="M95,50 a1,1 0 0,1 -90,0"
// 				fill="#f2f2f2"
// 				className={`transition-all duration-1000 ${
// 					isOpen ? "translate-y-[25px] rotate-[25deg]" : ""
// 				}`}
// 			/>
// 		</svg>
// 		<div
// 			className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
// 				isOpen ? "opacity-100" : "opacity-0"
// 			}`}
// 		>
// 			{children}
// 		</div>
// 	</div>
// );

// export default function SharedResults({
// 	allPokemon,
// 	teamSummary,
// 	trainerName,
// 	resultId,
// 	rankings,
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

// 	const orderedPokemon = useMemo(() => {
// 		const types = ["grass", "fire", "water"] as const;
// 		const ranks = ["top", "runnerUp", "canRelate"] as const;

// 		if (rankings) {
// 			return ranks
// 				.flatMap((rank) =>
// 					types.map((type) => {
// 						const pokemonName = rankings[type]?.[rank];
// 						return allPokemon.find(
// 							(p) => p.name === pokemonName && p.type === type
// 						);
// 					})
// 				)
// 				.filter((p): p is Pokemon => p !== undefined);
// 		} else {
// 			return types
// 				.flatMap((type) => {
// 					const typePokemon = allPokemon.filter(
// 						(p) => p.type === type
// 					);
// 					return [typePokemon[0], typePokemon[1], typePokemon[2]];
// 				})
// 				.filter(Boolean);
// 		}
// 	}, [allPokemon, rankings]);

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

// 				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 place-items-center">
// 					{orderedPokemon.map((pokemon, index) => (
// 						<div
// 							key={index}
// 							style={{
// 								width: `${getImageSize(index) + 40}px`,
// 							}}
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

// 								<div
// 									style={{
// 										width: `${getImageSize(index)}px`,
// 										height: `${getImageSize(index)}px`,
// 									}}
// 									className="mb-4 flex items-center justify-center"
// 								>
// 									<Pokeball
// 										isOpen={unlockedPokemon[pokemon.name]}
// 										imageSize={getImageSize(index)}
// 									>
// 										<Image
// 											src={
// 												pokemon.image ||
// 												"/placeholder-pokemon.png"
// 											}
// 											alt={pokemon.name || "Pokemon"}
// 											className="rounded-md"
// 											width={getImageSize(index)}
// 											height={getImageSize(index)}
// 										/>
// 									</Pokeball>
// 								</div>

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
// 											className="mr-1 flex items-center justify-center"
// 											aria-label="Top Match Icon"
// 										/>
// 									)}
// 									{index >= 3 && index < 6 && (
// 										<FaMedal
// 											className="mr-1 flex items-center justify-center"
// 											aria-label="Runner Up Icon"
// 										/>
// 									)}
// 									{index >= 6 && (
// 										<FaHandsHelping
// 											className="mr-1 flex items-center justify-center"
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

// BROKEN CANVAS
// "use client";

// import { useRef, useMemo } from "react";
// import Image from "next/image";
// import { FaStar, FaMedal, FaHandsHelping, FaDownload } from "react-icons/fa";
// import { typeStyles } from "@/lib/typeStyles";
// import html2canvas from "html2canvas";

// interface Pokemon {
//     name: string;
//     image: string | null;
//     description: string;
//     type: "grass" | "fire" | "water";
//     traits: string[];
// }

// interface SharedResultsProps {
//     trainerName: string;
//     teamSummary: string;
//     allPokemon: (Pokemon & { type: "grass" | "fire" | "water" })[];
//     rankings?: {
//         grass?: { top: string; runnerUp: string; canRelate: string };
//         fire?: { top: string; runnerUp: string; canRelate: string };
//         water?: { top: string; runnerUp: string; canRelate: string };
//     };
// }

// const downloadAsImage = async (element: HTMLElement, fileName: string) => {
//     // Scroll element into view to ensure full visibility
//     element.scrollIntoView({ behavior: "smooth", block: "center" });

//     // Delay to allow the scroll to complete
//     await new Promise(resolve => setTimeout(resolve, 300));

//     // Temporarily override styles to ensure proper rendering for html2canvas
//     const originalStyles = element.style.cssText;
//     element.style.overflow = "visible";
//     element.style.position = "static";
//     element.style.transform = "none";
//     element.style.width = "200px"; // Set fixed width for consistent capture
//     element.style.height = "auto"; // Ensure full height is captured

//     const canvas = await html2canvas(element, {
//         scale: 3, // Higher resolution
//         useCORS: true,
//         logging: true,
//         allowTaint: true,
//         windowWidth: element.scrollWidth,
//         windowHeight: element.scrollHeight,
//     });

//     // Reset styles after capture
//     element.style.cssText = originalStyles;

//     const data = canvas.toDataURL("image/png");
//     const link = document.createElement("a");
//     link.href = data;
//     link.download = fileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// };

// const SharedResults = ({
//     allPokemon,
//     trainerName,
//     teamSummary,
//     rankings,
// }: SharedResultsProps) => {
//     const pokemonRefs = useRef<Record<string, HTMLDivElement | null>>({});
//     const allCardsRef = useRef<HTMLDivElement>(null);

//     const orderedPokemon = useMemo(() => {
//         const types = ["grass", "fire", "water"] as const;
//         const ranks = ["top", "runnerUp", "canRelate"] as const;

//         if (rankings) {
//             return ranks
//                 .flatMap((rank) =>
//                     types.map((type) => {
//                         const pokemonName = rankings[type]?.[rank];
//                         return allPokemon.find(
//                             (p) => p.name === pokemonName && p.type === type
//                         );
//                     })
//                 )
//                 .filter((p): p is Pokemon => p !== undefined);
//         } else {
//             return types
//                 .flatMap((type) => {
//                     const typePokemon = allPokemon.filter(
//                         (p) => p.type === type
//                     );
//                     return [typePokemon[0], typePokemon[1], typePokemon[2]];
//                 })
//                 .filter(Boolean);
//         }
//     }, [allPokemon, rankings]);

//     const handleDownloadCard = (pokemonName: string) => {
//         const element = pokemonRefs.current[pokemonName];
//         if (element) {
//             downloadAsImage(element, `${pokemonName}.png`);
//         }
//     };

//     const handleDownloadAllCards = () => {
//         if (allCardsRef.current) {
//             downloadAsImage(allCardsRef.current, "all_pokemon_cards.png");
//         }
//     };

//     return (
//         <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
//             <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
//                 <h1 className="text-3xl md:text-6xl font-bold text-center my-4 text-purple-800 capitalize">
//                     {trainerName}&apos;s Pokémon Starters
//                 </h1>

//                 {/* Display the team summary */}
//                 <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//                     <h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
//                         Team Summary
//                     </h2>
//                     <p className="text-gray-800 text-justify">{teamSummary}</p>
//                 </div>

//                 <div className="mb-4">
//                     <button
//                         onClick={handleDownloadAllCards}
//                         className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
//                     >
//                         <FaDownload className="mr-2" />
//                         Download All Cards
//                     </button>
//                 </div>

//                 <div ref={allCardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
//                     {orderedPokemon.map((pokemon, index) => (
//                         <div
//                             key={index}
//                             className={`${typeStyles[pokemon.type].background} mb-8`}
//                             ref={(el) => {
//                                 pokemonRefs.current[pokemon.name] = el;
//                             }}
//                         >
//                             <div className="border shadow-md rounded-lg p-4 flex flex-col items-center h-full relative pokemon-image-container overflow-visible static">
//                                 <div className="w-full mb-4 flex items-center justify-center overflow-visible">
//                                     <Image
//                                         src={pokemon.image || "/placeholder-pokemon.png"}
//                                         alt={pokemon.name || "Pokemon"}
//                                         className="rounded-md object-contain w-40 h-auto"
//                                         width={160}
//                                         height={160}
//                                     />
//                                 </div>

//                                 <h2 className="text-lg md:text-xl font-semibold mt-2 text-center text-gray-900">
//                                     {pokemon.name}
//                                 </h2>

//                                 <div className="text-center mt-2">
//                                     <p className="text-sm text-gray-700">
//                                         {pokemon.description}
//                                     </p>
//                                 </div>

//                                 <span className="text-sm font-bold mt-auto flex items-center text-gray-800">
//                                     {index < 3 && (
//                                         <FaStar className="mr-1" aria-label="Top Match Icon" />
//                                     )}
//                                     {index >= 3 && index < 6 && (
//                                         <FaMedal className="mr-1" aria-label="Runner Up Icon" />
//                                     )}
//                                     {index >= 6 && (
//                                         <FaHandsHelping className="mr-1" aria-label="Can Relate To Icon" />
//                                     )}
//                                     {index < 3 ? "Your Top Match!" : index < 6 ? "Runner Up" : "Can Relate To"}
//                                 </span>

//                                 <div className="mt-2">
//                                     <button
//                                         onClick={() => handleDownloadCard(pokemon.name)}
//                                         className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded"
//                                     >
//                                         <FaDownload className="inline mr-1" />
//                                         Download Card
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SharedResults;

// modifying sizing
// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";
// import { useState, useEffect, useRef, useMemo } from "react";
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
// 	resultId: string;
// 	trainerName: string;
// 	teamSummary: string;
// 	allPokemon: (Pokemon & { type: "grass" | "fire" | "water" })[];
// 	rankings?: {
// 		grass?: { top: string; runnerUp: string; canRelate: string };
// 		fire?: { top: string; runnerUp: string; canRelate: string };
// 		water?: { top: string; runnerUp: string; canRelate: string };
// 	};
// }

// const Pokeball = ({
// 	isOpen,
// 	children,
// 	imageSize,
// }: {
// 	isOpen: boolean;
// 	children: React.ReactNode;
// 	imageSize: number;
// }) => (
// 	<div
// 		className="relative flex items-center justify-center"
// 		style={{
// 			width: `${imageSize}px`,
// 			height: `${imageSize}px`,
// 			overflow: "hidden",
// 		}}
// 	>
// 		<svg viewBox="0 0 100 100" className="w-full h-full">
// 			<circle cx="50" cy="50" r="50" fill="#f2f2f2" />
// 			<path
// 				d="M5,50 a1,1 0 0,1 90,0"
// 				fill="#ff1a1a"
// 				className={`transition-all duration-1000 ${
// 					isOpen ? "translate-y-[-25px] rotate-[-25deg]" : ""
// 				}`}
// 			/>
// 			<circle
// 				cx="50"
// 				cy="50"
// 				r="12"
// 				fill="#2c2c2c"
// 				stroke="#f2f2f2"
// 				strokeWidth="2"
// 			/>
// 			<path
// 				d="M95,50 a1,1 0 0,1 -90,0"
// 				fill="#f2f2f2"
// 				className={`transition-all duration-1000 ${
// 					isOpen ? "translate-y-[25px] rotate-[25deg]" : ""
// 				}`}
// 			/>
// 		</svg>
// 		<div
// 			className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
// 				isOpen ? "opacity-100" : "opacity-0"
// 			}`}
// 		>
// 			{children}
// 		</div>
// 	</div>
// );

// export default function SharedResults({
// 	allPokemon,
// 	teamSummary,
// 	trainerName,
// 	resultId,
// 	rankings,
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

// 	const orderedPokemon = useMemo(() => {
// 		const types = ["grass", "fire", "water"] as const;
// 		const ranks = ["top", "runnerUp", "canRelate"] as const;

// 		if (rankings) {
// 			return ranks
// 				.flatMap((rank) =>
// 					types.map((type) => {
// 						const pokemonName = rankings[type]?.[rank];
// 						return allPokemon.find(
// 							(p) => p.name === pokemonName && p.type === type
// 						);
// 					})
// 				)
// 				.filter((p): p is Pokemon => p !== undefined);
// 		} else {
// 			return types
// 				.flatMap((type) => {
// 					const typePokemon = allPokemon.filter(
// 						(p) => p.type === type
// 					);
// 					return [typePokemon[0], typePokemon[1], typePokemon[2]];
// 				})
// 				.filter(Boolean);
// 		}
// 	}, [allPokemon, rankings]);

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
// 		if (index < 3) return 240; // Top rank - consistent size
// 		if (index < 6) return 220; // Runner-up - smaller
// 		return 200; // Can relate - smaller
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

// 				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 place-items-center">
// 					{orderedPokemon.map((pokemon, index) => (
// 						<div
// 							key={index}
// 							style={{
// 								width: `${getImageSize(index) + 40}px`,
// 							}}
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
// 								className={`border shadow-md rounded-lg p-4 flex flex-col items-center h-full relative overflow-hidden`}
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

// 								<div
// 									style={{
// 										width: "100%",
// 										height: `${getImageSize(index)}px`,
// 										position: "relative",
// 									}}
// 									className="mb-4 flex items-center justify-center"
// 								>
// 									<Pokeball
// 										isOpen={unlockedPokemon[pokemon.name]}
// 										imageSize={getImageSize(index)}
// 									>
// 										<Image
// 											src={
// 												pokemon.image ||
// 												"/placeholder-pokemon.png"
// 											}
// 											alt={pokemon.name || "Pokemon"}
// 											layout="intrinsic"
// 											width={getImageSize(index)}
// 											height={getImageSize(index)}
// 											objectFit="contain"
// 											className="rounded-md"
// 										/>
// 									</Pokeball>
// 								</div>

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
// 											className="mr-1 flex items-center justify-center"
// 											aria-label="Top Match Icon"
// 										/>
// 									)}
// 									{index >= 3 && index < 6 && (
// 										<FaMedal
// 											className="mr-1 flex items-center justify-center"
// 											aria-label="Runner Up Icon"
// 										/>
// 									)}
// 									{index >= 6 && (
// 										<FaHandsHelping
// 											className="mr-1 flex items-center justify-center"
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
	resultId: string;
	trainerName: string;
	teamSummary: string;
	allPokemon: (Pokemon & { type: "grass" | "fire" | "water" })[];
	rankings?: {
		grass?: { top: string; runnerUp: string; canRelate: string };
		fire?: { top: string; runnerUp: string; canRelate: string };
		water?: { top: string; runnerUp: string; canRelate: string };
	};
}

const Pokeball = ({
	isOpen,
	children,
	imageSize,
}: {
	isOpen: boolean;
	children: React.ReactNode;
	imageSize: number;
}) => (
	<div
		className="relative flex items-center justify-center"
		style={{
			width: `${imageSize}px`,
			height: `${imageSize}px`,
			overflow: "hidden",
		}}
	>
		<svg viewBox="0 0 100 100" className="w-full h-full">
			<circle cx="50" cy="50" r="50" fill="#f2f2f2" />
			<path
				d="M5,50 a1,1 0 0,1 90,0"
				fill="#ff1a1a"
				className={`transition-all duration-1000 ${
					isOpen ? "translate-y-[-25px] rotate-[-25deg]" : ""
				}`}
			/>
			<circle
				cx="50"
				cy="50"
				r="12"
				fill="#2c2c2c"
				stroke="#f2f2f2"
				strokeWidth="2"
			/>
			<path
				d="M95,50 a1,1 0 0,1 -90,0"
				fill="#f2f2f2"
				className={`transition-all duration-1000 ${
					isOpen ? "translate-y-[25px] rotate-[25deg]" : ""
				}`}
			/>
		</svg>
		<div
			className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
				isOpen ? "opacity-100" : "opacity-0"
			}`}
		>
			{children}
		</div>
	</div>
);

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
		const types = ["grass", "fire", "water"] as const;
		const ranks = ["top", "runnerUp", "canRelate"] as const;

		if (rankings) {
			return ranks
				.flatMap((rank) =>
					types.map((type) => {
						const pokemonName = rankings[type]?.[rank];
						return allPokemon.find(
							(p) => p.name === pokemonName && p.type === type
						);
					})
				)
				.filter((p): p is Pokemon => p !== undefined);
		} else {
			return types
				.flatMap((type) => {
					const typePokemon = allPokemon.filter(
						(p) => p.type === type
					);
					return [typePokemon[0], typePokemon[1], typePokemon[2]];
				})
				.filter(Boolean);
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
		if (index < 3) return 240; // Top rank - consistent size
		if (index < 6) return 220; // Runner-up - smaller
		return 200; // Can relate - smaller
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

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 place-items-center">
					{orderedPokemon.map((pokemon, index) => (
						<div
							key={index}
							style={{
								width: `${getImageSize(index) + 40}px`,
							}}
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
								className={`border shadow-md rounded-lg p-4 flex flex-col items-center h-full relative overflow-hidden`}
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

								{/* Name of the Pokémon - Render above the image */}
								{unlockedPokemon[pokemon.name] && (
									<h2
										className={`${getFontSize(
											index
										)} font-semibold mb-2 text-center text-gray-900`}
									>
										{pokemon.name}
									</h2>
								)}

								<div
									style={{
										width: "100%",
										height: `${getImageSize(index)}px`,
										position: "relative",
									}}
									className="mb-4 flex items-center justify-center"
								>
									<Pokeball
										isOpen={unlockedPokemon[pokemon.name]}
										imageSize={getImageSize(index)}
									>
										<Image
											src={
												pokemon.image ||
												"/placeholder-pokemon.png"
											}
											alt={pokemon.name || "Pokemon"}
											layout="intrinsic"
											width={getImageSize(index)}
											height={getImageSize(index)}
											objectFit="contain"
											className="rounded-md"
										/>
									</Pokeball>
								</div>

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
											className="mr-1 flex items-center justify-center"
											aria-label="Top Match Icon"
										/>
									)}
									{index >= 3 && index < 6 && (
										<FaMedal
											className="mr-1 flex items-center justify-center"
											aria-label="Runner Up Icon"
										/>
									)}
									{index >= 6 && (
										<FaHandsHelping
											className="mr-1 flex items-center justify-center"
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
