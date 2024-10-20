"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";
import Image from "next/image";
import AnimatedTitle from "@/components/AnimatedTitle";
import GrassAnimation from "@/components/GrassAnimation";
import FireAnimation from "@/components/FireAnimation";
import WaterAnimation from "@/components/WaterAnimation";
import { FaStar, FaMedal, FaHandsHelping } from "react-icons/fa";
import type { Pokemon, PokemonGroup, Stage, SubStage } from "@/lib/constants"; // Type-only imports
import {
	firePokemonGroups,
	waterPokemonGroups,
	grassPokemonGroups,
} from "@/lib/constants"; // Regular imports

// -------------------------
// TypeStyles Interface
// -------------------------

interface TypeStyles {
	background: string;
	border: string;
	button: string;
	buttonSelected: string;
	buttonDefault: string;
	submitButton: string;
	text: string;
	emoji: string;
}

// -------------------------
// getTypeStyles Function
// -------------------------

const getTypeStyles = (type: "grass" | "fire" | "water"): TypeStyles => {
	switch (type) {
		case "grass":
			return {
				background: "bg-green-100",
				border: "border-green-300",
				button: "bg-green-500 hover:bg-green-600",
				buttonSelected: "bg-green-700 text-white",
				buttonDefault: "bg-green-300 hover:bg-green-400",
				submitButton: "bg-green-600 hover:bg-green-700",
				text: "text-green-800",
				emoji: "🌿",
			};
		case "fire":
			return {
				background: "bg-red-100",
				border: "border-red-300",
				button: "bg-red-500 hover:bg-red-600",
				buttonSelected: "bg-red-700 text-white",
				buttonDefault: "bg-red-300 hover:bg-red-400",
				submitButton: "bg-red-600 hover:bg-red-700",
				text: "text-red-800",
				emoji: "🔥",
			};
		case "water":
			return {
				background: "bg-blue-100",
				border: "border-blue-300",
				button: "bg-blue-500 hover:bg-blue-600",
				buttonSelected: "bg-blue-700 text-white",
				buttonDefault: "bg-blue-300 hover:bg-blue-400",
				submitButton: "bg-blue-600 hover:bg-blue-700",
				text: "text-blue-800",
				emoji: "💧",
			};
		default:
			return {
				background: "bg-gray-100",
				border: "border-gray-300",
				button: "bg-gray-500 hover:bg-gray-600",
				buttonSelected: "bg-gray-700 text-white",
				buttonDefault: "bg-gray-300 hover:bg-gray-400",
				submitButton: "bg-gray-600 hover:bg-gray-700",
				text: "text-gray-800",
				emoji: "❓",
			};
	}
};

// -------------------------
// Tooltip Component
// -------------------------

const Tooltip = ({ content }: { content: string[] }) => (
	<div className="absolute z-50 p-2 bg-white rounded shadow-lg text-sm w-64 top-0 left-0 transform -translate-y-full text-gray-800">
		<ul className="list-disc pl-4">
			{content.map((item, index) => (
				<li key={index}>{item}</li>
			))}
		</ul>
	</div>
);

// -------------------------
// Audio Control Component
// -------------------------

const AudioControl = ({
	isPlaying,
	onToggle,
}: {
	isPlaying: boolean;
	onToggle: () => void;
}) => (
	<motion.button
		className="fixed bottom-4 left-4 z-50 bg-white p-2 rounded-full shadow-md flex items-center"
		onClick={onToggle}
		whileHover={{ scale: 1.1 }}
		whileTap={{ scale: 0.9 }}
		aria-label={isPlaying ? "Mute Music" : "Play Music"}
	>
		{isPlaying ? "🔊" : "🔇"}
		<span className="ml-2 text-sm text-purple-700">
			{isPlaying ? "Mute" : "Play"} Music
		</span>
	</motion.button>
);

// -------------------------
// Pokeball Component
// -------------------------

const Pokeball = ({
	isOpen,
	children,
}: {
	isOpen: boolean;
	children: React.ReactNode;
}) => (
	<div className="relative w-full h-full">
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

// -------------------------
// PokemonCard Component
// -------------------------

const PokemonCard = ({
	pokemon,
	type,
	rank,
	isLocked,
}: {
	pokemon: Pokemon;
	type: "grass" | "fire" | "water";
	rank: string;
	isLocked: boolean;
}) => {
	const [revealed, setRevealed] = useState<boolean>(!isLocked);
	const [showTooltip, setShowTooltip] = useState<boolean>(false);

	const handleReveal = () => setRevealed(true);

	const getCardStyle = (rank: string): string => {
		switch (rank) {
			case "Your Top Match!":
				return "w-full";
			case "Runner Up":
				return "w-11/12 mx-auto";
			case "Can Relate To":
				return "w-10/12 mx-auto";
			default:
				return "w-full";
		}
	};

	const getImageSize = (rank: string): number => {
		switch (rank) {
			case "Your Top Match!":
				return 200;
			case "Runner Up":
				return 180;
			case "Can Relate To":
				return 160;
			default:
				return 200;
		}
	};

	const getFontSize = (rank: string): string => {
		switch (rank) {
			case "Your Top Match!":
				return "text-xl";
			case "Runner Up":
				return "text-lg";
			case "Can Relate To":
				return "text-base";
			default:
				return "text-xl";
		}
	};

	return (
		<div className={`${getCardStyle(rank)} mb-8 relative`}>
			<div
				className={`flex flex-col ${getTypeStyles(type).background} ${
					getTypeStyles(type).border
				} border shadow-md rounded-lg p-6 h-full overflow-hidden`}
			>
				{/* Conditionally render Tooltip only if the card is unlocked */}
				{!isLocked && (
					<div
						className="absolute top-2 left-2 cursor-pointer z-20"
						onMouseEnter={() => setShowTooltip(true)}
						onMouseLeave={() => setShowTooltip(false)}
					>
						ℹ️
						{showTooltip && <Tooltip content={pokemon.traits} />}
					</div>
				)}
				<div className="w-full mb-4 flex items-center justify-center">
					<Pokeball isOpen={revealed}>
						{pokemon.image ? (
							revealed ? (
								<Image
									src={pokemon.image}
									alt={pokemon.name}
									width={getImageSize(rank)}
									height={getImageSize(rank)}
									objectFit="contain"
								/>
							) : (
								<div className="bg-gray-200 animate-pulse w-full h-full rounded-md" />
							)
						) : (
							<div className="bg-gray-200 animate-pulse w-full h-full rounded-md" />
						)}
					</Pokeball>
				</div>

				<h2
					className={`${getFontSize(
						rank
					)} font-semibold text-center ${
						getTypeStyles(type).text
					} mb-3`}
				>
					{getTypeStyles(type).emoji}{" "}
					{revealed ? pokemon.name : "???"}
				</h2>

				<div className="flex-grow flex flex-col justify-between">
					<div className="text-center">
						{revealed ? (
							<p
								className={`${getFontSize(rank)} ${
									getTypeStyles(type).text
								}`}
							>
								{pokemon.description}
							</p>
						) : (
							<button
								onClick={handleReveal}
								className="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-lg"
							>
								{isLocked ? "Unlock" : "Reveal"}
							</button>
						)}
					</div>
				</div>

				<div className="w-full mt-4">
					<span
						className={`${getFontSize(
							rank
						)} font-bold text-purple-600 block text-center`}
					>
						{rank}
					</span>
				</div>
			</div>
		</div>
	);
};

// -------------------------
// PokemonRankingCard Component
// -------------------------

const PokemonRankingCard = ({ pokemon }: { pokemon: Pokemon }) => (
	<div className="p-4 rounded-lg shadow bg-white">
		<p className="text-sm text-gray-700 mb-2">{pokemon.description}</p>
		<ul className="list-disc list-inside text-sm text-gray-600">
			{pokemon.traits.map((trait: string, idx: number) => (
				<li key={idx}>{trait}</li>
			))}
		</ul>
	</div>
);

// -------------------------
// RankingStage Component
// -------------------------

const RankingStage = ({
	type,
	pokemons,
	onRank,
}: {
	type: "grass" | "fire" | "water";
	pokemons: Pokemon[];
	onRank: (ranking: {
		top: string;
		runnerUp: string;
		canRelate: string;
	}) => void;
}) => {
	const [selected, setSelected] = useState<{
		top: string | null;
		runnerUp: string | null;
		canRelate: string | null;
	}>({
		top: null,
		runnerUp: null,
		canRelate: null,
	});

	const handleSelect = (
		rank: "top" | "runnerUp" | "canRelate",
		name: string
	) => {
		// Prevent selecting the same Pokémon for multiple ranks
		if (
			(rank === "top" &&
				(selected.runnerUp === name || selected.canRelate === name)) ||
			(rank === "runnerUp" &&
				(selected.top === name || selected.canRelate === name)) ||
			(rank === "canRelate" &&
				(selected.top === name || selected.runnerUp === name))
		) {
			alert("You cannot assign the same Pokémon to multiple ranks.");
			return;
		}

		setSelected((prev) => ({
			...prev,
			[rank]: name,
		}));
	};

	const isSubmitDisabled =
		!selected.top || !selected.runnerUp || !selected.canRelate;

	const handleSubmit = () => {
		if (!isSubmitDisabled) {
			onRank(
				selected as { top: string; runnerUp: string; canRelate: string }
			);
		}
	};

	return (
		<div
			className={`w-full max-w-4xl mx-auto p-4 rounded-lg shadow-md ${
				getTypeStyles(type).background
			}`}
		>
			<h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
				Rank Your {type.charAt(0).toUpperCase() + type.slice(1)} Type
				Pokémon
			</h2>
			<p className="text-center mb-6 text-gray-700">
				Please assign the following rankings based on the Pokémon&apos;s
				traits and descriptions:
			</p>
			<div className="space-y-6">
				{pokemons.map((pokemon: Pokemon) => (
					<div
						key={pokemon.name}
						className={`p-4 rounded-lg shadow ${
							selected.top === pokemon.name ||
							selected.runnerUp === pokemon.name ||
							selected.canRelate === pokemon.name
								? "border-2 border-purple-500"
								: "border border-gray-200"
						}`}
					>
						<PokemonRankingCard pokemon={pokemon} />
						<div className="flex flex-wrap justify-center mt-4 space-x-2">
							<button
								onClick={() =>
									handleSelect("top", pokemon.name)
								}
								className={`flex items-center px-3 py-1 rounded ${
									selected.top === pokemon.name
										? getTypeStyles(type).buttonSelected
										: getTypeStyles(type).buttonDefault
								} text-sm mb-2 sm:mb-0`}
							>
								<FaStar className="mr-1" /> Top Match
							</button>
							<button
								onClick={() =>
									handleSelect("runnerUp", pokemon.name)
								}
								className={`flex items-center px-3 py-1 rounded ${
									selected.runnerUp === pokemon.name
										? getTypeStyles(type).buttonSelected
										: getTypeStyles(type).buttonDefault
								} text-sm mb-2 sm:mb-0`}
							>
								<FaMedal className="mr-1" /> Runner Up
							</button>
							<button
								onClick={() =>
									handleSelect("canRelate", pokemon.name)
								}
								className={`flex items-center px-3 py-1 rounded ${
									selected.canRelate === pokemon.name
										? getTypeStyles(type).buttonSelected
										: getTypeStyles(type).buttonDefault
								} text-sm`}
							>
								<FaHandsHelping className="mr-1" /> Can Relate
							</button>
						</div>
					</div>
				))}
			</div>
			<div className="text-center mt-6">
				<motion.button
					onClick={handleSubmit}
					className={`px-6 py-3 rounded-full text-lg font-semibold ${
						isSubmitDisabled
							? "bg-gray-400 text-gray-700 cursor-not-allowed"
							: getTypeStyles(type).submitButton
					}`}
					disabled={isSubmitDisabled}
					whileHover={!isSubmitDisabled ? { scale: 1.05 } : {}}
					whileTap={!isSubmitDisabled ? { scale: 0.95 } : {}}
				>
					Confirm Rankings
				</motion.button>
			</div>
		</div>
	);
};

// -------------------------
// Main QuizPage Component
// -------------------------

export default function QuizPage() {
	const [stage, setStage] = useState<Stage>("start");
	const [subStage, setSubStage] = useState<SubStage>(1);
	const [questionIndex, setQuestionIndex] = useState<number>(0);
	const [scores, setScores] = useState<Record<string, number>>({});
	const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
	const [showConfetti, setShowConfetti] = useState<boolean>(false);
	const [teamSummary, setTeamSummary] = useState<string>("");
	const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
	const [shareLink, setShareLink] = useState<string | null>(null);
	const [isSharing, setIsSharing] = useState<boolean>(false);
	const [trainerName, setTrainerName] = useState<string>("");
	const [isNamePromptVisible, setIsNamePromptVisible] =
		useState<boolean>(false);
	const [grassPokemon, setGrassPokemon] =
		useState<PokemonGroup[]>(grassPokemonGroups);
	const [firePokemon, setFirePokemon] =
		useState<PokemonGroup[]>(firePokemonGroups);
	const [waterPokemon, setWaterPokemon] =
		useState<PokemonGroup[]>(waterPokemonGroups);
	const [rankings, setRankings] = useState<{
		[type in "grass" | "fire" | "water"]?: {
			top: string;
			runnerUp: string;
			canRelate: string;
		};
	}>({});

	// -------------------------
	// Audio References
	// -------------------------

	const legendAudioRef = useRef<HTMLAudioElement | null>(null);
	const grassAudioRef = useRef<HTMLAudioElement | null>(null);
	const fireAudioRef = useRef<HTMLAudioElement | null>(null);
	const waterAudioRef = useRef<HTMLAudioElement | null>(null);
	const eliminateAudioRef = useRef<HTMLAudioElement | null>(null);
	const sendingOffAudioRef = useRef<HTMLAudioElement | null>(null);

	// -------------------------
	// Load Pokémon Images on Mount
	// -------------------------

	useEffect(() => {
		const loadPokemonImages = async () => {
			setGrassPokemon(await fetchPokemonImages(grassPokemonGroups));
			setFirePokemon(await fetchPokemonImages(firePokemonGroups));
			setWaterPokemon(await fetchPokemonImages(waterPokemonGroups));
		};

		loadPokemonImages();
	}, []);

	// -------------------------
	// Fetch Pokémon Images Function
	// -------------------------

	const fetchPokemonImages = async (
		pokemonList: PokemonGroup[]
	): Promise<PokemonGroup[]> => {
		const updatedPokemonGroups = await Promise.all(
			pokemonList.map(async (group) => {
				const updatedPokemons = await Promise.all(
					group.pokemons.map(async (pokemon) => {
						try {
							const res = await fetch(
								`/api/pokemon/${pokemon.name}`
							);
							if (!res.ok) {
								throw new Error(
									`Failed to fetch data for ${pokemon.name}`
								);
							}
							const data = await res.json();
							if (!data.imageUrl) {
								throw new Error(
									`No image URL found for ${pokemon.name}`
								);
							}
							return { ...pokemon, image: data.imageUrl };
						} catch (error) {
							console.error(
								`Failed to fetch image for ${pokemon.name}`,
								error
							);
							return { ...pokemon, image: null }; // Assign null if image fetch fails
						}
					})
				);
				return {
					...group,
					pokemons: updatedPokemons as [Pokemon, Pokemon, Pokemon],
				};
			})
		);
		return updatedPokemonGroups;
	};

	// -------------------------
	// Handle Answer Selection
	// -------------------------

	const handleAnswer = (pokemonIndex: number) => {
		const currentGroup = getCurrentGroup();
		if (!currentGroup || !currentGroup.pokemons[pokemonIndex]) {
			console.error("Current group or Pokémon is undefined.");
			return;
		}

		const pokemonName = currentGroup.pokemons[pokemonIndex].name;
		setScores((prev: Record<string, number>) => ({
			...prev,
			[pokemonName]: (prev[pokemonName] || 0) + 1,
		}));

		if (eliminateAudioRef.current) {
			eliminateAudioRef.current
				.play()
				.catch((error) =>
					console.error("Eliminate audio playback failed:", error)
				);
		}

		if (questionIndex < 4) {
			// 5 questions per SubStage
			setQuestionIndex((prev: number) => prev + 1);
		} else {
			if (subStage < 3) {
				setSubStage((prev: SubStage) => (prev + 1) as SubStage);
				setQuestionIndex(0);
			} else {
				// After completing 15 questions, proceed to Ranking Stage (SubStage 4)
				setSubStage(4 as SubStage);
			}
		}
	};

	// -------------------------
	// Toggle Audio Playback
	// -------------------------

	const toggleAudio = () => {
		if (legendAudioRef.current) {
			if (isAudioPlaying) {
				legendAudioRef.current.pause();
				grassAudioRef.current?.pause();
				fireAudioRef.current?.pause();
				waterAudioRef.current?.pause();
				sendingOffAudioRef.current?.pause();
			} else {
				legendAudioRef.current
					.play()
					.catch((error) =>
						console.error("Audio playback failed:", error)
					);
				if (stage !== "start" && stage !== "result") {
					playStageAudio(stage);
				}
			}
			setIsAudioPlaying(!isAudioPlaying);
		}
	};

	// -------------------------
	// Play Stage-specific Audio
	// -------------------------

	const playStageAudio = (stageType: "grass" | "fire" | "water") => {
		const audioRefMap: Record<
			"grass" | "fire" | "water",
			React.MutableRefObject<HTMLAudioElement | null>
		> = {
			grass: grassAudioRef,
			fire: fireAudioRef,
			water: waterAudioRef,
		};

		const audioRef = audioRefMap[stageType];

		if (audioRef.current && isAudioPlaying) {
			audioRef.current
				.play()
				.catch((error) =>
					console.error(`${stageType} audio playback failed:`, error)
				);
		}
	};

	// -------------------------
	// Start the Quiz
	// -------------------------

	const handleStartQuiz = () => {
		setStage("grass");
		setIsAudioPlaying(true);
		if (legendAudioRef.current && grassAudioRef.current) {
			legendAudioRef.current
				.play()
				.catch((error) =>
					console.error("Legend audio playback failed:", error)
				);
			grassAudioRef.current
				.play()
				.catch((error) =>
					console.error("Grass audio playback failed:", error)
				);
		}
	};

	// -------------------------
	// Get Current Pokémon Group
	// -------------------------

	const getCurrentGroup = useCallback((): PokemonGroup | undefined => {
		switch (stage) {
			case "grass":
				return grassPokemon[subStage - 1];
			case "fire":
				return firePokemon[subStage - 1];
			case "water":
				return waterPokemon[subStage - 1];
			default:
				return undefined;
		}
	}, [stage, subStage, grassPokemon, firePokemon, waterPokemon]);

	// -------------------------
	// Get Top Three Pokémon per Type
	// -------------------------

	const getWinners = useCallback(() => {
		const getTopThree = (pokemonGroups: PokemonGroup[]): Pokemon[] => {
			const allPokemons = pokemonGroups.flatMap(
				(group) => group.pokemons
			);
			return allPokemons
				.filter((p: Pokemon) => p.image !== null) // Ensure only Pokémon with images are considered
				.sort(
					(a: Pokemon, b: Pokemon) =>
						(scores[b.name] || 0) - (scores[a.name] || 0)
				)
				.slice(0, 3);
		};

		return {
			grass: getTopThree(grassPokemon),
			fire: getTopThree(firePokemon),
			water: getTopThree(waterPokemon),
		};
	}, [scores, grassPokemon, firePokemon, waterPokemon]);

	// -------------------------
	// Generate Team Summary using API
	// -------------------------

	const handleGenerateSummary = useCallback(async () => {
		setIsLoadingSummary(true);
		let topPokemon: Record<string, Pokemon | undefined> = {};

		if (Object.keys(rankings).length > 0) {
			// Use rankings
			topPokemon = {
				grass: grassPokemon
					.flatMap((group) => group.pokemons)
					.find((p) => p.name === rankings.grass?.top),
				fire: firePokemon
					.flatMap((group) => group.pokemons)
					.find((p) => p.name === rankings.fire?.top),
				water: waterPokemon
					.flatMap((group) => group.pokemons)
					.find((p) => p.name === rankings.water?.top),
			};
		} else {
			// Use top from scores
			const winners = getWinners();
			topPokemon = {
				grass: winners.grass[0],
				fire: winners.fire[0],
				water: winners.water[0],
			};
		}

		const prompt = `You are a Pokémon trainer who has just assembled a team of starter Pokémon based on their personality traits. Summarize the team's characteristics and how they complement each other in a cohesive and inspiring way. The team consists of the following Pokémon:

${Object.entries(topPokemon)
	.map(
		([type, pokemon]) =>
			`${type.charAt(0).toUpperCase() + type.slice(1)} type: ${
				pokemon?.name || "Unknown"
			}: ${pokemon?.traits.join("; ") || "No traits available"}`
	)
	.join("\n\n")}

Provide an uplifting summary that highlights the strengths and synergy of the team. Make sure to complete your last sentence.`;

		try {
			const response = await fetch("/api/pokemon/generate-team-summary", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt }),
			});

			const data = await response.json();

			if (response.ok) {
				setTeamSummary(data.summary);
			} else {
				console.error("Error generating team summary:", data.error);
				setTeamSummary(
					"An error occurred while generating your team summary. Please try again later."
				);
			}
		} catch (error) {
			console.error("Error generating team summary:", error);
			setTeamSummary(
				"An error occurred while generating your team summary. Please try again later."
			);
		} finally {
			setIsLoadingSummary(false);
		}
	}, [getWinners, rankings, grassPokemon, firePokemon, waterPokemon]);

	// -------------------------
	// Share Results via API
	// -------------------------

	const handleShareResults = async () => {
		if (!trainerName.trim()) {
			alert("Please enter your name before sharing your results.");
			return;
		}

		setIsSharing(true);

		const winners = getWinners();

		const preparePokemons = (
			pokemons: Pokemon[]
		): {
			name: string;
			description: string;
			traits: string[];
			image: string | null;
		}[] =>
			pokemons.map(({ name, description, traits, image }) => ({
				name,
				description,
				traits,
				image,
			}));

		try {
			const response = await fetch("/api/save-results", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					trainerName,
					grassPokemon: preparePokemons(winners.grass),
					firePokemon: preparePokemons(winners.fire),
					waterPokemon: preparePokemons(winners.water),
					teamSummary,
					rankings,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				const link = `${window.location.origin}/share/${data.id}`;
				setShareLink(link);
				setIsNamePromptVisible(false);
			} else {
				console.error("Error saving results:", data.error);
				alert("Failed to save results. Please try again.");
			}
		} catch (error) {
			console.error("Error saving results:", error);
			alert("An error occurred while saving results. Please try again.");
		} finally {
			setIsSharing(false);
		}
	};

	// -------------------------
	// PokemonResults Component
	// -------------------------

	const PokemonResults = () => {
		const isRanked = Object.keys(rankings).length > 0;

		const types = ["grass", "fire", "water"] as const;
		const ranks = [
			"Your Top Match!",
			"Runner Up",
			"Can Relate To",
		] as const;

		type PokemonResultItem = {
			pokemon: Pokemon;
			type: (typeof types)[number];
			rank: (typeof ranks)[number];
		};

		type RankKey = "top" | "runnerUp" | "canRelate";

		const rankKeyMap: Record<(typeof ranks)[number], RankKey> = {
			"Your Top Match!": "top",
			"Runner Up": "runnerUp",
			"Can Relate To": "canRelate",
		};

		const orderedPokemon: PokemonResultItem[] = ranks.flatMap((rank) =>
			types
				.map((type) => {
					let pokemonName: string | undefined;
					if (isRanked) {
						const rankKey = rankKeyMap[rank];
						pokemonName = rankings[type]?.[rankKey];
					} else {
						const winners = getWinners();
						if (rank === "Your Top Match!")
							pokemonName = winners[type][0]?.name;
						else if (rank === "Runner Up")
							pokemonName = winners[type][1]?.name;
						else if (rank === "Can Relate To")
							pokemonName = winners[type][2]?.name;
					}

					if (pokemonName) {
						const pokemon = isRanked
							? [...grassPokemon, ...firePokemon, ...waterPokemon]
									.flatMap((group) => group.pokemons)
									.find((p) => p.name === pokemonName)
							: getWinners()[type].find(
									(p) => p.name === pokemonName
							  );

						return pokemon ? { pokemon, type, rank } : null;
					}

					return null;
				})
				.filter((item): item is PokemonResultItem => item !== null)
		);

		return (
			<div className="w-full max-w-6xl mx-auto">
				<h2 className="text-3xl font-bold text-center mb-8 text-purple-900">
					Your Pokémon Starters Are:
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
					{orderedPokemon.map(({ pokemon, type, rank }, index) => (
						<PokemonCard
							key={`${type}-${rank}-${index}`}
							pokemon={pokemon}
							type={type}
							rank={rank}
							isLocked={rank !== "Your Top Match!"}
						/>
					))}
				</div>
			</div>
		);
	};

	// -------------------------
	// Initialize Audio References
	// -------------------------

	useEffect(() => {
		legendAudioRef.current = new Audio("/legend.mp3");
		grassAudioRef.current = new Audio("/grass.mp3");
		fireAudioRef.current = new Audio("/fire.mp3");
		waterAudioRef.current = new Audio("/water.mp3");
		eliminateAudioRef.current = new Audio("/eliminate.mp3");
		sendingOffAudioRef.current = new Audio("/sending-off.mp3");

		legendAudioRef.current.loop = true;

		return () => {
			[
				legendAudioRef,
				grassAudioRef,
				fireAudioRef,
				waterAudioRef,
				eliminateAudioRef,
				sendingOffAudioRef,
			].forEach((ref) => {
				if (ref.current) {
					ref.current.pause();
					ref.current.src = "";
				}
			});
		};
	}, []);

	// -------------------------
	// Handle Confetti and Summary Generation on Result Stage
	// -------------------------

	useEffect(() => {
		if (stage === "result") {
			setShowConfetti(true);
			setTimeout(() => setShowConfetti(false), 5000);
			handleGenerateSummary();
			// Stop all stage-specific audios including legend audio
			if (legendAudioRef.current) {
				legendAudioRef.current.pause();
			}
			if (sendingOffAudioRef.current) {
				sendingOffAudioRef.current
					.play()
					.catch((error) =>
						console.error(
							"Sending off audio playback failed:",
							error
						)
					);
			}
		}
	}, [stage, handleGenerateSummary]);

	// -------------------------
	// Handle Ranking Submission and Stage Transition
	// -------------------------

	const handleRanking = (
		type: "grass" | "fire" | "water",
		ranking: { top: string; runnerUp: string; canRelate: string }
	) => {
		console.log(`Handling ranking for ${type}:`, ranking);
		setRankings((prev) => ({
			...prev,
			[type]: ranking,
		}));

		// Proceed to next stage
		if (stage === "grass") {
			setStage("fire");
			setSubStage(1 as SubStage);
			setQuestionIndex(0);
			playStageAudio("fire");
		} else if (stage === "fire") {
			setStage("water");
			setSubStage(1 as SubStage);
			setQuestionIndex(0);
			playStageAudio("water");
		} else if (stage === "water") {
			console.log("Proceeding to result stage.");
			setStage("result");
			setSubStage(1 as SubStage);
			// Legend audio is paused in the useEffect for 'result' stage
		}
	};

	return (
		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
			{showConfetti && <ReactConfetti />}
			<AnimatePresence>
				{stage === "grass" && <GrassAnimation />}
				{stage === "fire" && <FireAnimation />}
				{stage === "water" && <WaterAnimation />}
			</AnimatePresence>

			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
				<AudioControl
					isPlaying={isAudioPlaying}
					onToggle={toggleAudio}
				/>

				<AnimatedTitle />

				<AnimatePresence mode="wait">
					{stage === "start" ? (
						<motion.div
							key="start"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="text-center"
						>
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5 }}
								className="text-lg md:text-xl text-gray-800 mb-8"
							>
								Welcome to the #1 Pokémon Personality Quiz! This
								quiz will match you with the Grass, Fire, and
								Water-type Pokémon that best reflect your
								personality. Ready to find your ideal companions
								for your Pokémon journey?
							</motion.p>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.7 }}
								className="bg-yellow-100 border-yellow-300 border p-4 rounded-lg mb-8 text-left text-purple-800"
							>
								<h3 className="font-bold text-lg mb-2">
									How it Works:
								</h3>
								<p>
									1. You will answer 15 questions for each
									Pokémon type.
								</p>
								<p>
									2. Choose the answer that best describes you
									as honestly as you can.
								</p>
								<p>
									3. After completing all questions,
									you&apos;ll receive your perfect Pokémon
									matches!
								</p>
							</motion.div>
							<motion.button
								onClick={handleStartQuiz}
								className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full text-xl mt-4"
								whileHover={{
									scale: 1.05,
									boxShadow: "0px 0px 8px rgb(255,204,0)",
								}}
								whileTap={{ scale: 0.95 }}
							>
								START QUIZ
							</motion.button>
						</motion.div>
					) : stage === "result" ? (
						<motion.div
							key="result"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							{isLoadingSummary ? (
								<div className="text-center mb-6">
									<div className="bg-gray-200 animate-pulse rounded-md p-4 w-full h-24 mb-4"></div>
									<p className="text-lg font-semibold text-gray-800">
										Generating your team summary...
									</p>
								</div>
							) : (
								teamSummary && (
									<div className="bg-white p-6 rounded-lg shadow-md mb-6">
										<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
											Your Pokémon Starter Team Summary
										</h2>
										<p className="text-gray-800 text-justify">
											{teamSummary}
										</p>
									</div>
								)
							)}

							<PokemonResults />

							<div className="text-center mt-6">
								{!shareLink ? (
									<>
										{isNamePromptVisible ? (
											<div className="mt-4 flex flex-col items-center">
												<input
													type="text"
													placeholder="Enter your name"
													value={trainerName}
													onChange={(e) =>
														setTrainerName(
															e.target.value
														)
													}
													className="px-4 py-2 border rounded-lg mr-2 mb-2 text-purple-700 w-full max-w-xs"
												/>
												<button
													onClick={handleShareResults}
													className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white w-full max-w-xs"
												>
													{isSharing
														? "Sharing..."
														: "Confirm"}
												</button>
											</div>
										) : (
											<button
												onClick={() =>
													setIsNamePromptVisible(true)
												}
												className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white"
											>
												Share Your Results
											</button>
										)}
									</>
								) : (
									<div className="mt-4">
										<p className="text-green-600 font-semibold">
											Share this link to show your
											results:
										</p>
										<a
											href={shareLink}
											className="text-blue-500 underline break-all"
										>
											{shareLink}
										</a>
									</div>
								)}
							</div>
						</motion.div>
					) : subStage === 4 ? (
						// Ranking Sub-Stage
						<motion.div
							key={`${stage}-ranking`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="space-y-6"
						>
							<RankingStage
								type={stage}
								pokemons={getWinners()[stage].slice(0, 3)}
								onRank={(ranking) =>
									handleRanking(stage, ranking)
								}
							/>
						</motion.div>
					) : (
						// Quiz Questions
						<motion.div
							key={`${stage}-${subStage}-${questionIndex}`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="space-y-6"
						>
							<h2 className="text-2xl font-bold text-center text-gray-800">
								{stage.charAt(0).toUpperCase() + stage.slice(1)}{" "}
								Type
							</h2>
							<p className="text-xl text-center text-gray-800">
								Question{" "}
								{(subStage - 1) * 5 + questionIndex + 1} of 15
							</p>
							<div
								className={`${
									getTypeStyles(stage).background
								} p-6 rounded-lg shadow-md`}
							>
								<p className="text-lg mb-4 text-gray-800">
									{getCurrentGroup()?.questions[questionIndex]
										?.text || "No question available."}
								</p>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{getCurrentGroup()?.questions[
										questionIndex
									]?.options.map(
										(option: string, index: number) => (
											<motion.button
												key={index}
												onClick={() =>
													handleAnswer(index)
												}
												className={`${
													getTypeStyles(stage).button
												} p-4 rounded-lg transition-colors`}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<p className="text-white">
													{option}
												</p>
											</motion.button>
										)
									) || (
										<p className="text-center text-red-500">
											No options available.
										</p>
									)}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

// "use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import ReactConfetti from "react-confetti";
// import Image from "next/image";
// import AnimatedTitle from "@/components/AnimatedTitle";
// import GrassAnimation from "@/components/GrassAnimation";
// import FireAnimation from "@/components/FireAnimation";
// import WaterAnimation from "@/components/WaterAnimation";
// import { FaStar, FaMedal, FaHandsHelping, FaInfoCircle } from "react-icons/fa";
// import { Pokemon, PokemonGroup, Stage, SubStage } from "@/lib/constants"; // Adjusted path
// import {
// 	firePokemonGroups,
// 	waterPokemonGroups,
// 	grassPokemonGroups,
// } from "@/lib/constants"; // Adjusted path

// // -------------------------
// // TypeStyles Interface
// // -------------------------

// interface TypeStyles {
// 	background: string;
// 	border: string;
// 	button: string;
// 	buttonSelected: string;
// 	buttonDefault: string;
// 	submitButton: string;
// 	text: string;
// 	emoji: string;
// }

// // -------------------------
// // getTypeStyles Function
// // -------------------------

// const getTypeStyles = (type: "grass" | "fire" | "water"): TypeStyles => {
// 	switch (type) {
// 		case "grass":
// 			return {
// 				background: "bg-green-100",
// 				border: "border-green-300",
// 				button: "bg-green-500 hover:bg-green-600",
// 				buttonSelected: "bg-green-700 text-white",
// 				buttonDefault: "bg-green-300 hover:bg-green-400",
// 				submitButton: "bg-green-600 hover:bg-green-700",
// 				text: "text-green-800",
// 				emoji: "🌿",
// 			};
// 		case "fire":
// 			return {
// 				background: "bg-red-100",
// 				border: "border-red-300",
// 				button: "bg-red-500 hover:bg-red-600",
// 				buttonSelected: "bg-red-700 text-white",
// 				buttonDefault: "bg-red-300 hover:bg-red-400",
// 				submitButton: "bg-red-600 hover:bg-red-700",
// 				text: "text-red-800",
// 				emoji: "🔥",
// 			};
// 		case "water":
// 			return {
// 				background: "bg-blue-100",
// 				border: "border-blue-300",
// 				button: "bg-blue-500 hover:bg-blue-600",
// 				buttonSelected: "bg-blue-700 text-white",
// 				buttonDefault: "bg-blue-300 hover:bg-blue-400",
// 				submitButton: "bg-blue-600 hover:bg-blue-700",
// 				text: "text-blue-800",
// 				emoji: "💧",
// 			};
// 		default:
// 			return {
// 				background: "bg-gray-100",
// 				border: "border-gray-300",
// 				button: "bg-gray-500 hover:bg-gray-600",
// 				buttonSelected: "bg-gray-700 text-white",
// 				buttonDefault: "bg-gray-300 hover:bg-gray-400",
// 				submitButton: "bg-gray-600 hover:bg-gray-700",
// 				text: "text-gray-800",
// 				emoji: "❓",
// 			};
// 	}
// };

// // -------------------------
// // Tooltip Component
// // -------------------------

// const Tooltip = ({ content }: { content: string[] }) => (
// 	<div className="absolute z-50 p-2 bg-white rounded shadow-lg text-sm w-64 top-0 left-0 transform -translate-y-full text-gray-800">
// 		<ul className="list-disc pl-4">
// 			{content.map((item, index) => (
// 				<li key={index}>{item}</li>
// 			))}
// 		</ul>
// 	</div>
// );

// // -------------------------
// // Audio Control Component
// // -------------------------

// const AudioControl = ({
// 	isPlaying,
// 	onToggle,
// }: {
// 	isPlaying: boolean;
// 	onToggle: () => void;
// }) => (
// 	<motion.button
// 		className="fixed bottom-4 left-4 z-50 bg-white p-2 rounded-full shadow-md flex items-center"
// 		onClick={onToggle}
// 		whileHover={{ scale: 1.1 }}
// 		whileTap={{ scale: 0.9 }}
// 		aria-label={isPlaying ? "Mute Music" : "Play Music"}
// 	>
// 		{isPlaying ? "🔊" : "🔇"}
// 		<span className="ml-2 text-sm text-purple-700">
// 			{isPlaying ? "Mute" : "Play"} Music
// 		</span>
// 	</motion.button>
// );

// // -------------------------
// // Pokeball Component
// // -------------------------

// const Pokeball = ({
// 	isOpen,
// 	children,
// }: {
// 	isOpen: boolean;
// 	children: React.ReactNode;
// }) => (
// 	<div className="relative w-full h-full">
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

// // -------------------------
// // PokemonCard Component
// // -------------------------

// const PokemonCard = ({
// 	pokemon,
// 	type,
// 	rank,
// 	isLocked,
// }: {
// 	pokemon: Pokemon;
// 	type: "grass" | "fire" | "water";
// 	rank: string;
// 	isLocked: boolean;
// }) => {
// 	const [revealed, setRevealed] = useState<boolean>(!isLocked);
// 	const [showTooltip, setShowTooltip] = useState<boolean>(false);

// 	const handleReveal = () => setRevealed(true);

// 	const getCardStyle = (rank: string): string => {
// 		switch (rank) {
// 			case "Your Top Match!":
// 				return "w-full";
// 			case "Runner Up":
// 				return "w-11/12 mx-auto";
// 			case "Can Relate To":
// 				return "w-10/12 mx-auto";
// 			default:
// 				return "w-full";
// 		}
// 	};

// 	const getImageSize = (rank: string): number => {
// 		switch (rank) {
// 			case "Your Top Match!":
// 				return 200;
// 			case "Runner Up":
// 				return 180;
// 			case "Can Relate To":
// 				return 160;
// 			default:
// 				return 200;
// 		}
// 	};

// 	const getFontSize = (rank: string): string => {
// 		switch (rank) {
// 			case "Your Top Match!":
// 				return "text-xl";
// 			case "Runner Up":
// 				return "text-lg";
// 			case "Can Relate To":
// 				return "text-base";
// 			default:
// 				return "text-xl";
// 		}
// 	};

// 	// Determine which icon to display based on rank
// 	const getRankIcon = () => {
// 		switch (rank) {
// 			case "Your Top Match!":
// 				return (
// 					<FaStar
// 						className="text-yellow-500 mr-1"
// 						aria-label="Top Match Icon"
// 						size={16}
// 					/>
// 				);
// 			case "Runner Up":
// 				return (
// 					<FaMedal
// 						className="text-gray-500 mr-1"
// 						aria-label="Runner Up Icon"
// 						size={16}
// 					/>
// 				);
// 			case "Can Relate To":
// 				return (
// 					<FaHandsHelping
// 						className="text-blue-500 mr-1"
// 						aria-label="Can Relate To Icon"
// 						size={16}
// 					/>
// 				);
// 			default:
// 				return null;
// 		}
// 	};

// 	return (
// 		<div className={`${getCardStyle(rank)} mb-8 relative`}>
// 			<div
// 				className={`${getTypeStyles(type).background} ${
// 					getTypeStyles(type).border
// 				} border shadow-md rounded-lg p-6 h-full overflow-hidden`}
// 			>
// 				{/* Conditionally render Tooltip only if the card is unlocked */}
// 				{!isLocked && (
// 					<div
// 						className="absolute top-2 left-2 cursor-pointer z-20"
// 						onMouseEnter={() => setShowTooltip(true)}
// 						onMouseLeave={() => setShowTooltip(false)}
// 					>
// 						<FaInfoCircle
// 							className="text-gray-700 text-lg"
// 							aria-label={`View traits for ${pokemon.name}`}
// 						/>
// 						{showTooltip && <Tooltip content={pokemon.traits} />}
// 					</div>
// 				)}
// 				<div className="w-full mb-4 flex items-center justify-center">
// 					<Pokeball isOpen={revealed}>
// 						{pokemon.image ? (
// 							revealed ? (
// 								<Image
// 									src={pokemon.image}
// 									alt={pokemon.name}
// 									width={getImageSize(rank)}
// 									height={getImageSize(rank)}
// 									objectFit="contain"
// 								/>
// 							) : (
// 								<div className="bg-gray-200 animate-pulse w-full h-full rounded-md" />
// 							)
// 						) : (
// 							<div className="bg-gray-200 animate-pulse w-full h-full rounded-md" />
// 						)}
// 					</Pokeball>
// 				</div>

// 				<h2
// 					className={`${getFontSize(
// 						rank
// 					)} font-semibold text-center ${
// 						getTypeStyles(type).text
// 					} mb-3`}
// 				>
// 					{getTypeStyles(type).emoji}{" "}
// 					{revealed ? pokemon.name : "???"}
// 				</h2>

// 				<div className="flex-grow flex flex-col justify-between">
// 					<div className="text-center">
// 						{revealed ? (
// 							<p
// 								className={`${getFontSize(rank)} ${
// 									getTypeStyles(type).text
// 								}`}
// 							>
// 								{pokemon.description}
// 							</p>
// 						) : (
// 							<button
// 								onClick={handleReveal}
// 								className="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-lg"
// 							>
// 								{isLocked ? "Unlock" : "Reveal"}
// 							</button>
// 						)}
// 					</div>
// 				</div>

// 				<div className="w-full mt-4">
// 					<span className="font-bold mt-4 flex items-center text-sm text-gray-900">
// 						{getRankIcon()}
// 						{rank}
// 					</span>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// // -------------------------
// // PokemonRankingCard Component
// // -------------------------

// const PokemonRankingCard = ({ pokemon }: { pokemon: Pokemon }) => (
// 	<div className="p-4 rounded-lg shadow bg-white">
// 		<p className="text-sm text-gray-700 mb-2">{pokemon.description}</p>
// 		<ul className="list-disc list-inside text-sm text-gray-600">
// 			{pokemon.traits.map((trait: string, idx: number) => (
// 				<li key={idx}>{trait}</li>
// 			))}
// 		</ul>
// 	</div>
// );

// // -------------------------
// // RankingStage Component
// // -------------------------

// const RankingStage = ({
// 	type,
// 	pokemons,
// 	onRank,
// }: {
// 	type: "grass" | "fire" | "water";
// 	pokemons: Pokemon[];
// 	onRank: (ranking: {
// 		top: string;
// 		runnerUp: string;
// 		canRelate: string;
// 	}) => void;
// }) => {
// 	const [selected, setSelected] = useState<{
// 		top: string | null;
// 		runnerUp: string | null;
// 		canRelate: string | null;
// 	}>({
// 		top: null,
// 		runnerUp: null,
// 		canRelate: null,
// 	});

// 	const handleSelect = (
// 		rank: "top" | "runnerUp" | "canRelate",
// 		name: string
// 	) => {
// 		// Prevent selecting the same Pokémon for multiple ranks
// 		if (
// 			(rank === "top" &&
// 				(selected.runnerUp === name || selected.canRelate === name)) ||
// 			(rank === "runnerUp" &&
// 				(selected.top === name || selected.canRelate === name)) ||
// 			(rank === "canRelate" &&
// 				(selected.top === name || selected.runnerUp === name))
// 		) {
// 			alert("You cannot assign the same Pokémon to multiple ranks.");
// 			return;
// 		}

// 		setSelected((prev) => ({
// 			...prev,
// 			[rank]: name,
// 		}));
// 	};

// 	const isSubmitDisabled =
// 		!selected.top || !selected.runnerUp || !selected.canRelate;

// 	const handleSubmit = () => {
// 		if (!isSubmitDisabled) {
// 			onRank(
// 				selected as { top: string; runnerUp: string; canRelate: string }
// 			);
// 		}
// 	};

// 	return (
// 		<div
// 			className={`w-full max-w-4xl mx-auto p-4 rounded-lg shadow-md ${
// 				getTypeStyles(type).background
// 			}`}
// 		>
// 			<h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
// 				Rank Your {type.charAt(0).toUpperCase() + type.slice(1)} Type
// 				Pokémon
// 			</h2>
// 			<p className="text-center mb-6 text-gray-700">
// 				Please assign the following rankings based on the Pokémon&apos;s
// 				traits and descriptions:
// 			</p>
// 			<div className="space-y-6">
// 				{pokemons.map((pokemon: Pokemon) => (
// 					<div
// 						key={pokemon.name}
// 						className={`p-4 rounded-lg shadow ${
// 							selected.top === pokemon.name ||
// 							selected.runnerUp === pokemon.name ||
// 							selected.canRelate === pokemon.name
// 								? "border-2 border-purple-500"
// 								: "border border-gray-200"
// 						}`}
// 					>
// 						<PokemonRankingCard pokemon={pokemon} />
// 						<div className="flex flex-wrap justify-center mt-4 space-x-2">
// 							<button
// 								onClick={() =>
// 									handleSelect("top", pokemon.name)
// 								}
// 								className={`flex items-center px-3 py-1 rounded ${
// 									selected.top === pokemon.name
// 										? getTypeStyles(type).buttonSelected
// 										: getTypeStyles(type).buttonDefault
// 								} text-sm mb-2 sm:mb-0`}
// 							>
// 								<FaStar className="mr-1" /> Top Match
// 							</button>
// 							<button
// 								onClick={() =>
// 									handleSelect("runnerUp", pokemon.name)
// 								}
// 								className={`flex items-center px-3 py-1 rounded ${
// 									selected.runnerUp === pokemon.name
// 										? getTypeStyles(type).buttonSelected
// 										: getTypeStyles(type).buttonDefault
// 								} text-sm mb-2 sm:mb-0`}
// 							>
// 								<FaMedal className="mr-1" /> Runner Up
// 							</button>
// 							<button
// 								onClick={() =>
// 									handleSelect("canRelate", pokemon.name)
// 								}
// 								className={`flex items-center px-3 py-1 rounded ${
// 									selected.canRelate === pokemon.name
// 										? getTypeStyles(type).buttonSelected
// 										: getTypeStyles(type).buttonDefault
// 								} text-sm`}
// 							>
// 								<FaHandsHelping className="mr-1" /> Can Relate
// 							</button>
// 						</div>
// 					</div>
// 				))}
// 			</div>
// 			<div className="text-center mt-6">
// 				<motion.button
// 					onClick={handleSubmit}
// 					className={`px-6 py-3 rounded-full text-lg font-semibold ${
// 						isSubmitDisabled
// 							? "bg-gray-400 text-gray-700 cursor-not-allowed"
// 							: getTypeStyles(type).submitButton
// 					}`}
// 					disabled={isSubmitDisabled}
// 					whileHover={!isSubmitDisabled ? { scale: 1.05 } : {}}
// 					whileTap={!isSubmitDisabled ? { scale: 0.95 } : {}}
// 				>
// 					Confirm Rankings
// 				</motion.button>
// 			</div>
// 		</div>
// 	);
// };

// // -------------------------
// // Main QuizPage Component
// // -------------------------

// export default function QuizPage() {
// 	const [stage, setStage] = useState<Stage>("start");
// 	const [subStage, setSubStage] = useState<SubStage>(1);
// 	const [questionIndex, setQuestionIndex] = useState<number>(0);
// 	const [scores, setScores] = useState<Record<string, number>>({});
// 	const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
// 	const [showConfetti, setShowConfetti] = useState<boolean>(false);
// 	const [teamSummary, setTeamSummary] = useState<string>("");
// 	const [shareLink, setShareLink] = useState<string | null>(null);
// 	const [isSharing, setIsSharing] = useState<boolean>(false);
// 	const [trainerName, setTrainerName] = useState<string>("");
// 	const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
// 	const [isNamePromptVisible, setIsNamePromptVisible] =
// 		useState<boolean>(false);
// 	const [grassPokemon, setGrassPokemon] =
// 		useState<PokemonGroup[]>(grassPokemonGroups);
// 	const [firePokemon, setFirePokemon] =
// 		useState<PokemonGroup[]>(firePokemonGroups);
// 	const [waterPokemon, setWaterPokemon] =
// 		useState<PokemonGroup[]>(waterPokemonGroups);
// 	const [rankings, setRankings] = useState<{
// 		[type in "grass" | "fire" | "water"]?: {
// 			top: string;
// 			runnerUp: string;
// 			canRelate: string;
// 		};
// 	}>({});

// 	// -------------------------
// 	// Audio References
// 	// -------------------------

// 	const legendAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const grassAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const fireAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const waterAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const eliminateAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const sendingOffAudioRef = useRef<HTMLAudioElement | null>(null);

// 	// -------------------------
// 	// Load Pokémon Images on Mount
// 	// -------------------------

// 	useEffect(() => {
// 		const loadPokemonImages = async () => {
// 			setGrassPokemon(await fetchPokemonImages(grassPokemonGroups));
// 			setFirePokemon(await fetchPokemonImages(firePokemonGroups));
// 			setWaterPokemon(await fetchPokemonImages(waterPokemonGroups));
// 		};

// 		loadPokemonImages();
// 	}, []);

// 	// -------------------------
// 	// Fetch Pokémon Images Function
// 	// -------------------------

// 	const fetchPokemonImages = async (
// 		pokemonList: PokemonGroup[]
// 	): Promise<PokemonGroup[]> => {
// 		const updatedPokemonGroups = await Promise.all(
// 			pokemonList.map(async (group) => {
// 				const updatedPokemons = await Promise.all(
// 					group.pokemons.map(async (pokemon) => {
// 						try {
// 							const res = await fetch(
// 								`/api/pokemon/${pokemon.name}`
// 							);
// 							if (!res.ok) {
// 								throw new Error(
// 									`Failed to fetch data for ${pokemon.name}`
// 								);
// 							}
// 							const data = await res.json();
// 							if (!data.imageUrl) {
// 								throw new Error(
// 									`No image URL found for ${pokemon.name}`
// 								);
// 							}
// 							return { ...pokemon, image: data.imageUrl };
// 						} catch (error) {
// 							console.error(
// 								`Failed to fetch image for ${pokemon.name}`,
// 								error
// 							);
// 							return { ...pokemon, image: null }; // Assign null if image fetch fails
// 						}
// 					})
// 				);
// 				return {
// 					...group,
// 					pokemons: updatedPokemons as [Pokemon, Pokemon, Pokemon],
// 				};
// 			})
// 		);
// 		return updatedPokemonGroups;
// 	};

// 	// -------------------------
// 	// Handle Answer Selection
// 	// -------------------------

// 	const handleAnswer = (pokemonIndex: number) => {
// 		const currentGroup = getCurrentGroup();
// 		if (!currentGroup || !currentGroup.pokemons[pokemonIndex]) {
// 			console.error("Current group or Pokémon is undefined.");
// 			return;
// 		}

// 		const pokemonName = currentGroup.pokemons[pokemonIndex].name;
// 		setScores((prev: Record<string, number>) => ({
// 			...prev,
// 			[pokemonName]: (prev[pokemonName] || 0) + 1,
// 		}));

// 		if (eliminateAudioRef.current) {
// 			eliminateAudioRef.current
// 				.play()
// 				.catch((error) =>
// 					console.error("Eliminate audio playback failed:", error)
// 				);
// 		}

// 		if (questionIndex < 4) {
// 			// 5 questions per SubStage
// 			setQuestionIndex((prev: number) => prev + 1);
// 		} else {
// 			if (subStage < 3) {
// 				setSubStage((prev: SubStage) => (prev + 1) as SubStage);
// 				setQuestionIndex(0);
// 			} else {
// 				// After completing 15 questions, proceed to Ranking Stage (SubStage 4)
// 				setSubStage(4 as SubStage);
// 			}
// 		}
// 	};

// 	// -------------------------
// 	// Toggle Audio Playback
// 	// -------------------------

// 	const toggleAudio = () => {
// 		if (legendAudioRef.current) {
// 			if (isAudioPlaying) {
// 				legendAudioRef.current.pause();
// 				grassAudioRef.current?.pause();
// 				fireAudioRef.current?.pause();
// 				waterAudioRef.current?.pause();
// 				sendingOffAudioRef.current?.pause();
// 			} else {
// 				legendAudioRef.current
// 					.play()
// 					.catch((error) =>
// 						console.error("Audio playback failed:", error)
// 					);
// 				if (stage !== "start" && stage !== "result") {
// 					playStageAudio(stage);
// 				}
// 			}
// 			setIsAudioPlaying(!isAudioPlaying);
// 		}
// 	};

// 	// -------------------------
// 	// Play Stage-specific Audio
// 	// -------------------------

// 	const playStageAudio = (stageType: "grass" | "fire" | "water") => {
// 		const audioRefMap: Record<
// 			"grass" | "fire" | "water",
// 			React.MutableRefObject<HTMLAudioElement | null>
// 		> = {
// 			grass: grassAudioRef,
// 			fire: fireAudioRef,
// 			water: waterAudioRef,
// 		};

// 		const audioRef = audioRefMap[stageType];

// 		if (audioRef.current && isAudioPlaying) {
// 			audioRef.current
// 				.play()
// 				.catch((error) =>
// 					console.error(`${stageType} audio playback failed:`, error)
// 				);
// 		}
// 	};

// 	// -------------------------
// 	// Start the Quiz
// 	// -------------------------

// 	const handleStartQuiz = () => {
// 		setStage("grass");
// 		setIsAudioPlaying(true);
// 		if (legendAudioRef.current && grassAudioRef.current) {
// 			legendAudioRef.current
// 				.play()
// 				.catch((error) =>
// 					console.error("Legend audio playback failed:", error)
// 				);
// 			grassAudioRef.current
// 				.play()
// 				.catch((error) =>
// 					console.error("Grass audio playback failed:", error)
// 				);
// 		}
// 	};

// 	// -------------------------
// 	// Get Current Pokémon Group
// 	// -------------------------

// 	const getCurrentGroup = useCallback((): PokemonGroup | undefined => {
// 		switch (stage) {
// 			case "grass":
// 				return grassPokemon[subStage - 1];
// 			case "fire":
// 				return firePokemon[subStage - 1];
// 			case "water":
// 				return waterPokemon[subStage - 1];
// 			default:
// 				return undefined;
// 		}
// 	}, [stage, subStage, grassPokemon, firePokemon, waterPokemon]);

// 	// -------------------------
// 	// Get Top Three Pokémon per Type
// 	// -------------------------

// 	const getWinners = useCallback(() => {
// 		const getTopThree = (pokemonGroups: PokemonGroup[]): Pokemon[] => {
// 			const allPokemons = pokemonGroups.flatMap(
// 				(group) => group.pokemons
// 			);
// 			return allPokemons
// 				.filter((p: Pokemon) => p.image !== null) // Ensure only Pokémon with images are considered
// 				.sort(
// 					(a: Pokemon, b: Pokemon) =>
// 						(scores[b.name] || 0) - (scores[a.name] || 0)
// 				)
// 				.slice(0, 3);
// 		};

// 		return {
// 			grass: getTopThree(grassPokemon),
// 			fire: getTopThree(firePokemon),
// 			water: getTopThree(waterPokemon),
// 		};
// 	}, [scores, grassPokemon, firePokemon, waterPokemon]);

// 	// -------------------------
// 	// Generate Team Summary using API
// 	// -------------------------

// 	const handleGenerateSummary = useCallback(async () => {
// 		setIsLoadingSummary(true);
// 		let topPokemon: Record<string, Pokemon | undefined> = {};

// 		if (Object.keys(rankings).length > 0) {
// 			// Use rankings
// 			topPokemon = {
// 				grass: grassPokemon
// 					.flatMap((group) => group.pokemons)
// 					.find((p) => p.name === rankings.grass?.top),
// 				fire: firePokemon
// 					.flatMap((group) => group.pokemons)
// 					.find((p) => p.name === rankings.fire?.top),
// 				water: waterPokemon
// 					.flatMap((group) => group.pokemons)
// 					.find((p) => p.name === rankings.water?.top),
// 			};
// 		} else {
// 			// Use top from scores
// 			const winners = getWinners();
// 			topPokemon = {
// 				grass: winners.grass[0],
// 				fire: winners.fire[0],
// 				water: winners.water[0],
// 			};
// 		}

// 		const prompt = `You are a Pokémon trainer who has just assembled a team of starter Pokémon based on their personality traits. Summarize the team's characteristics and how they complement each other in a cohesive and inspiring way. The team consists of the following Pokémon:

// ${Object.entries(topPokemon)
// 	.map(
// 		([type, pokemon]) =>
// 			`${type.charAt(0).toUpperCase() + type.slice(1)} type: ${
// 				pokemon?.name || "Unknown"
// 			}: ${pokemon?.traits.join("; ") || "No traits available"}`
// 	)
// 	.join("\n\n")}

// Provide an uplifting summary that highlights the strengths and synergy of the team. Make sure to complete your last sentence.`;

// 		try {
// 			const response = await fetch("/api/pokemon/generate-team-summary", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ prompt }),
// 			});

// 			const data = await response.json();

// 			if (response.ok) {
// 				setTeamSummary(data.summary);
// 			} else {
// 				console.error("Error generating team summary:", data.error);
// 				setTeamSummary(
// 					"An error occurred while generating your team summary. Please try again later."
// 				);
// 			}
// 		} catch (error) {
// 			console.error("Error generating team summary:", error);
// 			setTeamSummary(
// 				"An error occurred while generating your team summary. Please try again later."
// 			);
// 		} finally {
// 			setIsLoadingSummary(false);
// 		}
// 	}, [getWinners, rankings, grassPokemon, firePokemon, waterPokemon]);

// 	// -------------------------
// 	// Share Results via API
// 	// -------------------------

// 	const handleShareResults = async () => {
// 		if (!trainerName.trim()) {
// 			alert("Please enter your name before sharing your results.");
// 			return;
// 		}

// 		setIsSharing(true);

// 		const winners = getWinners();

// 		const preparePokemons = (
// 			pokemons: Pokemon[]
// 		): {
// 			name: string;
// 			description: string;
// 			traits: string[];
// 			image: string | null;
// 		}[] =>
// 			pokemons.map(({ name, description, traits, image }) => ({
// 				name,
// 				description,
// 				traits,
// 				image,
// 			}));

// 		try {
// 			const response = await fetch("/api/save-results", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({
// 					trainerName,
// 					grassPokemon: preparePokemons(winners.grass),
// 					firePokemon: preparePokemons(winners.fire),
// 					waterPokemon: preparePokemons(winners.water),
// 					teamSummary,
// 					rankings,
// 				}),
// 			});

// 			const data = await response.json();

// 			if (response.ok) {
// 				const link = `${window.location.origin}/share/${data.id}`;
// 				setShareLink(link);
// 				setIsNamePromptVisible(false);
// 			} else {
// 				console.error("Error saving results:", data.error);
// 				alert("Failed to save results. Please try again.");
// 			}
// 		} catch (error) {
// 			console.error("Error saving results:", error);
// 			alert("An error occurred while saving results. Please try again.");
// 		} finally {
// 			setIsSharing(false);
// 		}
// 	};

// 	// -------------------------
// 	// PokemonResults Component
// 	// -------------------------

// 	const PokemonResults = () => {
// 		const isRanked = Object.keys(rankings).length > 0;

// 		const types = ["grass", "fire", "water"] as const;
// 		const ranks = [
// 			"Your Top Match!",
// 			"Runner Up",
// 			"Can Relate To",
// 		] as const;

// 		type PokemonResultItem = {
// 			pokemon: Pokemon;
// 			type: (typeof types)[number];
// 			rank: (typeof ranks)[number];
// 		};

// 		type RankKey = "top" | "runnerUp" | "canRelate";

// 		const rankKeyMap: Record<(typeof ranks)[number], RankKey> = {
// 			"Your Top Match!": "top",
// 			"Runner Up": "runnerUp",
// 			"Can Relate To": "canRelate",
// 		};

// 		const orderedPokemon: PokemonResultItem[] = ranks.flatMap((rank) =>
// 			types
// 				.map((type) => {
// 					let pokemonName: string | undefined;
// 					if (isRanked) {
// 						const rankKey = rankKeyMap[rank];
// 						pokemonName = rankings[type]?.[rankKey];
// 					} else {
// 						const winners = getWinners();
// 						if (rank === "Your Top Match!")
// 							pokemonName = winners[type][0]?.name;
// 						else if (rank === "Runner Up")
// 							pokemonName = winners[type][1]?.name;
// 						else if (rank === "Can Relate To")
// 							pokemonName = winners[type][2]?.name;
// 					}

// 					if (pokemonName) {
// 						const pokemon = isRanked
// 							? [...grassPokemon, ...firePokemon, ...waterPokemon]
// 									.flatMap((group) => group.pokemons)
// 									.find((p) => p.name === pokemonName)
// 							: getWinners()[type].find(
// 									(p) => p.name === pokemonName
// 							  );

// 						return pokemon ? { pokemon, type, rank } : null;
// 					}

// 					return null;
// 				})
// 				.filter((item): item is PokemonResultItem => item !== null)
// 		);

// 		return (
// 			<div className="w-full max-w-6xl mx-auto">
// 				<h2 className="text-3xl font-bold text-center mb-8 text-purple-900">
// 					Your Pokémon Starters Are:
// 				</h2>
// 				<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
// 					{orderedPokemon.map(({ pokemon, type, rank }, index) => (
// 						<PokemonCard
// 							key={`${type}-${rank}-${index}`}
// 							pokemon={pokemon}
// 							type={type}
// 							rank={rank}
// 							isLocked={rank !== "Your Top Match!"}
// 						/>
// 					))}
// 				</div>
// 			</div>
// 		);
// 	};

// 	// -------------------------
// 	// Initialize Audio References
// 	// -------------------------

// 	useEffect(() => {
// 		legendAudioRef.current = new Audio("/legend.mp3");
// 		grassAudioRef.current = new Audio("/grass.mp3");
// 		fireAudioRef.current = new Audio("/fire.mp3");
// 		waterAudioRef.current = new Audio("/water.mp3");
// 		eliminateAudioRef.current = new Audio("/eliminate.mp3");
// 		sendingOffAudioRef.current = new Audio("/sending-off.mp3");

// 		legendAudioRef.current.loop = true;

// 		return () => {
// 			[
// 				legendAudioRef,
// 				grassAudioRef,
// 				fireAudioRef,
// 				waterAudioRef,
// 				eliminateAudioRef,
// 				sendingOffAudioRef,
// 			].forEach((ref) => {
// 				if (ref.current) {
// 					ref.current.pause();
// 					ref.current.src = "";
// 				}
// 			});
// 		};
// 	}, []);

// 	// -------------------------
// 	// Handle Confetti and Summary Generation on Result Stage
// 	// -------------------------

// 	useEffect(() => {
// 		if (stage === "result") {
// 			setShowConfetti(true);
// 			setTimeout(() => setShowConfetti(false), 5000);
// 			handleGenerateSummary();
// 			// Stop all stage-specific audios including legend audio
// 			if (legendAudioRef.current) {
// 				legendAudioRef.current.pause();
// 			}
// 			if (sendingOffAudioRef.current) {
// 				sendingOffAudioRef.current
// 					.play()
// 					.catch((error) =>
// 						console.error(
// 							"Sending off audio playback failed:",
// 							error
// 						)
// 					);
// 			}
// 		}
// 	}, [stage, handleGenerateSummary]);

// 	// -------------------------
// 	// Handle Ranking Submission and Stage Transition
// 	// -------------------------

// 	const handleRanking = (
// 		type: "grass" | "fire" | "water",
// 		ranking: { top: string; runnerUp: string; canRelate: string }
// 	) => {
// 		console.log(`Handling ranking for ${type}:`, ranking);
// 		setRankings((prev) => ({
// 			...prev,
// 			[type]: ranking,
// 		}));

// 		// Proceed to next stage
// 		if (stage === "grass") {
// 			setStage("fire");
// 			setSubStage(1 as SubStage);
// 			setQuestionIndex(0);
// 			playStageAudio("fire");
// 		} else if (stage === "fire") {
// 			setStage("water");
// 			setSubStage(1 as SubStage);
// 			setQuestionIndex(0);
// 			playStageAudio("water");
// 		} else if (stage === "water") {
// 			console.log("Proceeding to result stage.");
// 			setStage("result");
// 			setSubStage(1 as SubStage);
// 			// Legend audio is paused in the useEffect for 'result' stage
// 		}
// 	};

// 	return (
// 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// 			{showConfetti && <ReactConfetti />}
// 			<AnimatePresence>
// 				{stage === "grass" && <GrassAnimation />}
// 				{stage === "fire" && <FireAnimation />}
// 				{stage === "water" && <WaterAnimation />}
// 			</AnimatePresence>

// 			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
// 				<AudioControl
// 					isPlaying={isAudioPlaying}
// 					onToggle={toggleAudio}
// 				/>

// 				<AnimatedTitle />

// 				<AnimatePresence mode="wait">
// 					{stage === "start" ? (
// 						<motion.div
// 							key="start"
// 							initial={{ opacity: 0, y: 20 }}
// 							animate={{ opacity: 1, y: 0 }}
// 							exit={{ opacity: 0, y: -20 }}
// 							className="text-center"
// 						>
// 							<motion.p
// 								initial={{ opacity: 0 }}
// 								animate={{ opacity: 1 }}
// 								transition={{ delay: 0.5 }}
// 								className="text-lg md:text-xl text-gray-800 mb-8"
// 							>
// 								Welcome to the #1 Pokémon Personality Quiz! This
// 								quiz will match you with the Grass, Fire, and
// 								Water-type Pokémon that best reflect your
// 								personality. Ready to find your ideal companions
// 								for your Pokémon journey?
// 							</motion.p>
// 							<motion.div
// 								initial={{ opacity: 0 }}
// 								animate={{ opacity: 1 }}
// 								transition={{ delay: 0.7 }}
// 								className="bg-yellow-100 border-yellow-300 border p-4 rounded-lg mb-8 text-left text-purple-800"
// 							>
// 								<h3 className="font-bold text-lg mb-2">
// 									How it Works:
// 								</h3>
// 								<p>
// 									1. You will answer 15 questions for each
// 									Pokémon type.
// 								</p>
// 								<p>
// 									2. Choose the answer that best describes you
// 									as honestly as you can.
// 								</p>
// 								<p>
// 									3. After completing all questions,
// 									you&apos;ll receive your perfect Pokémon
// 									matches!
// 								</p>
// 							</motion.div>
// 							<motion.button
// 								onClick={handleStartQuiz}
// 								className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full text-xl mt-4"
// 								whileHover={{
// 									scale: 1.05,
// 									boxShadow: "0px 0px 8px rgb(255,204,0)",
// 								}}
// 								whileTap={{ scale: 0.95 }}
// 							>
// 								START QUIZ
// 							</motion.button>
// 						</motion.div>
// 					) : stage === "result" ? (
// 						<motion.div
// 							key="result"
// 							initial={{ opacity: 0 }}
// 							animate={{ opacity: 1 }}
// 							exit={{ opacity: 0 }}
// 						>
// 							{isLoadingSummary ? (
// 								<div className="text-center mb-6">
// 									<div className="bg-gray-200 animate-pulse rounded-md p-4 w-full h-24 mb-4"></div>
// 									<p className="text-lg font-semibold text-gray-800">
// 										Generating your team summary...
// 									</p>
// 								</div>
// 							) : (
// 								teamSummary && (
// 									<div className="bg-white p-6 rounded-lg shadow-md mb-6">
// 										<h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
// 											Your Pokémon Starter Team Summary
// 										</h2>
// 										<p className="text-gray-800 text-justify">
// 											{teamSummary}
// 										</p>
// 									</div>
// 								)
// 							)}

// 							<PokemonResults />

// 							<div className="text-center mt-6">
// 								{!shareLink ? (
// 									<>
// 										{isNamePromptVisible ? (
// 											<div className="mt-4 flex flex-col items-center">
// 												<input
// 													type="text"
// 													placeholder="Enter your name"
// 													value={trainerName}
// 													onChange={(e) =>
// 														setTrainerName(
// 															e.target.value
// 														)
// 													}
// 													className="px-4 py-2 border rounded-lg mr-2 mb-2 text-purple-700 w-full max-w-xs"
// 												/>
// 												<button
// 													onClick={handleShareResults}
// 													className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white w-full max-w-xs"
// 												>
// 													{isSharing
// 														? "Sharing..."
// 														: "Confirm"}
// 												</button>
// 											</div>
// 										) : (
// 											<button
// 												onClick={() =>
// 													setIsNamePromptVisible(true)
// 												}
// 												className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white"
// 											>
// 												Share Your Results
// 											</button>
// 										)}
// 									</>
// 								) : (
// 									<div className="mt-4">
// 										<p className="text-green-600 font-semibold">
// 											Share this link to show your
// 											results:
// 										</p>
// 										<a
// 											href={shareLink}
// 											className="text-blue-500 underline break-all"
// 										>
// 											{shareLink}
// 										</a>
// 									</div>
// 								)}
// 							</div>
// 						</motion.div>
// 					) : subStage === 4 ? (
// 						// Ranking Sub-Stage
// 						<motion.div
// 							key={`${stage}-ranking`}
// 							initial={{ opacity: 0 }}
// 							animate={{ opacity: 1 }}
// 							exit={{ opacity: 0 }}
// 							className="space-y-6"
// 						>
// 							<RankingStage
// 								type={stage}
// 								pokemons={getWinners()[stage].slice(0, 3)}
// 								onRank={(ranking) =>
// 									handleRanking(stage, ranking)
// 								}
// 							/>
// 						</motion.div>
// 					) : (
// 						// Quiz Questions
// 						<motion.div
// 							key={`${stage}-${subStage}-${questionIndex}`}
// 							initial={{ opacity: 0 }}
// 							animate={{ opacity: 1 }}
// 							exit={{ opacity: 0 }}
// 							className="space-y-6"
// 						>
// 							<h2 className="text-2xl font-bold text-center text-gray-800">
// 								{stage.charAt(0).toUpperCase() + stage.slice(1)}{" "}
// 								Type
// 							</h2>
// 							<p className="text-xl text-center text-gray-800">
// 								Question{" "}
// 								{(subStage - 1) * 5 + questionIndex + 1} of 15
// 							</p>
// 							<div
// 								className={`${
// 									getTypeStyles(stage).background
// 								} p-6 rounded-lg shadow-md`}
// 							>
// 								<p className="text-lg mb-4 text-gray-800">
// 									{getCurrentGroup()?.questions[questionIndex]
// 										?.text || "No question available."}
// 								</p>
// 								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// 									{getCurrentGroup()?.questions[
// 										questionIndex
// 									]?.options.map(
// 										(option: string, index: number) => (
// 											<motion.button
// 												key={index}
// 												onClick={() =>
// 													handleAnswer(index)
// 												}
// 												className={`${
// 													getTypeStyles(stage).button
// 												} p-4 rounded-lg transition-colors`}
// 												whileHover={{ scale: 1.05 }}
// 												whileTap={{ scale: 0.95 }}
// 											>
// 												<p className="text-white">
// 													{option}
// 												</p>
// 											</motion.button>
// 										)
// 									) || (
// 										<p className="text-center text-red-500">
// 											No options available.
// 										</p>
// 									)}
// 								</div>
// 							</div>
// 						</motion.div>
// 					)}
// 				</AnimatePresence>
// 			</div>
// 		</div>
// 	);
// }
