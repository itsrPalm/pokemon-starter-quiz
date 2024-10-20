"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";
import Image from "next/image";
import AnimatedTitle from "@/components/AnimatedTitle";
import GrassAnimation from "@/components/GrassAnimation";
import FireAnimation from "@/components/FireAnimation";
import WaterAnimation from "@/components/WaterAnimation";
import {
	firePokemonGroups,
	grassPokemonGroups,
	Pokemon,
	PokemonGroup,
	Stage,
	SubStage,
	waterPokemonGroups,
} from "@/lib/constants";
import { getTypeStyles } from "@/lib/getTypeStyles";

const Tooltip = ({ content }: { content: string[] }) => (
	<div className="absolute z-50 p-2 bg-white rounded shadow-lg text-sm w-64 top-0 left-0 transform -translate-y-full text-gray-800">
		<ul className="list-disc pl-4">
			{content.map((item, index) => (
				<li key={index}>{item}</li>
			))}
		</ul>
	</div>
);

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
	>
		{isPlaying ? "🔊" : "🔇"}
		<span className="ml-2 text-sm text-purple-700">
			{isPlaying ? "Mute" : "Play"} Music
		</span>
	</motion.button>
);

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
	const [revealed, setRevealed] = useState(!isLocked);
	const [showTooltip, setShowTooltip] = useState(false);

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
				{revealed && (
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
						{pokemon.image && revealed ? (
							<Image
								src={pokemon.image}
								alt={pokemon.name}
								width={getImageSize(rank)}
								height={getImageSize(rank)}
								objectFit="contain"
							/>
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

const PokemonResults = ({
	getWinners,
}: {
	getWinners: () => {
		grass: Pokemon[];
		fire: Pokemon[];
		water: Pokemon[];
	};
}) => {
	const winners = getWinners();
	const types = ["grass", "fire", "water"] as const;
	const ranks = ["Your Top Match!", "Runner Up", "Can Relate To"] as const;

	type PokemonResultItem = {
		pokemon: Pokemon;
		type: (typeof types)[number];
		rank: (typeof ranks)[number];
	};

	const orderedPokemon: PokemonResultItem[] = ranks.flatMap((rank) =>
		types
			.map((type) => {
				const pokemonForRank = winners[type].find(
					(_, index) =>
						(rank === "Your Top Match!" && index === 0) ||
						(rank === "Runner Up" && index === 1) ||
						(rank === "Can Relate To" && index === 2)
				);
				return pokemonForRank
					? { pokemon: pokemonForRank, type, rank }
					: null;
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
export default function QuizPage() {
	const [stage, setStage] = useState<Stage>("start");
	const [subStage, setSubStage] = useState<SubStage>(1);
	const [questionIndex, setQuestionIndex] = useState(0);
	const [scores, setScores] = useState<Record<string, number>>({});
	const [isAudioPlaying, setIsAudioPlaying] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [teamSummary, setTeamSummary] = useState<string>("");
	const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
	const [shareLink, setShareLink] = useState<string | null>(null);
	const [isSharing, setIsSharing] = useState<boolean>(false);
	const [trainerName, setTrainerName] = useState<string>("");
	const [isNamePromptVisible, setIsNamePromptVisible] =
		useState<boolean>(false);
	const [grassPokemon, setGrassPokemon] = useState(grassPokemonGroups);
	const [firePokemon, setFirePokemon] = useState(firePokemonGroups);
	const [waterPokemon, setWaterPokemon] = useState(waterPokemonGroups);

	const legendAudioRef = useRef<HTMLAudioElement | null>(null);
	const grassAudioRef = useRef<HTMLAudioElement | null>(null);
	const fireAudioRef = useRef<HTMLAudioElement | null>(null);
	const waterAudioRef = useRef<HTMLAudioElement | null>(null);
	const eliminateAudioRef = useRef<HTMLAudioElement | null>(null);
	const sendingOffAudioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		const loadPokemonImages = async () => {
			setGrassPokemon(await fetchPokemonImages(grassPokemonGroups));
			setFirePokemon(await fetchPokemonImages(firePokemonGroups));
			setWaterPokemon(await fetchPokemonImages(waterPokemonGroups));
		};

		loadPokemonImages();
	}, []);

	const fetchPokemonImages = async (pokemonList: PokemonGroup[]) => {
		await new Promise((r) => setTimeout(r, 1000));
		const updatedPokemonGroups = await Promise.all(
			pokemonList.map(async (group) => {
				const updatedPokemons = await Promise.all(
					group.pokemons.map(async (pokemon) => {
						try {
							const res = await fetch(
								`/api/pokemon/${pokemon.name}`
							);
							const data = await res.json();
							return { ...pokemon, image: data.imageUrl || null };
						} catch (error) {
							console.error(
								`Failed to fetch image for ${pokemon.name}`,
								error
							);
							return pokemon;
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

	const handleAnswer = (pokemonIndex: number) => {
		const currentGroup = getCurrentGroup();
		const pokemonName = currentGroup.pokemons[pokemonIndex].name;
		setScores((prev) => ({
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
			setQuestionIndex((prev) => prev + 1);
		} else {
			if (subStage < 3) {
				setSubStage((prev) => (prev + 1) as SubStage);
				setQuestionIndex(0);
			} else {
				const nextStage =
					stage === "grass"
						? "fire"
						: stage === "fire"
						? "water"
						: "result";
				setStage(nextStage);
				setSubStage(1);
				setQuestionIndex(0);
				if (nextStage !== "result") {
					playStageAudio(nextStage);
				} else {
					if (legendAudioRef.current) {
						legendAudioRef.current.pause();
					}
					if (sendingOffAudioRef.current) {
						sendingOffAudioRef.current
							.play()
							.catch((error) =>
								console.error(
									"Sending-off audio playback failed:",
									error
								)
							);
					}
				}
			}
		}
	};

	const toggleAudio = () => {
		if (legendAudioRef.current) {
			if (isAudioPlaying) {
				legendAudioRef.current.pause();
				grassAudioRef.current?.pause();
				fireAudioRef.current?.pause();
				waterAudioRef.current?.pause();
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

	const playStageAudio = (stageType: "grass" | "fire" | "water") => {
		const audioRef = {
			grass: grassAudioRef,
			fire: fireAudioRef,
			water: waterAudioRef,
		}[stageType];

		if (audioRef?.current && isAudioPlaying) {
			audioRef.current
				.play()
				.catch((error) =>
					console.error(`${stageType} audio playback failed:`, error)
				);
		}
	};

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

	const getCurrentGroup = useCallback((): PokemonGroup => {
		switch (stage) {
			case "grass":
				return grassPokemon[subStage - 1];
			case "fire":
				return firePokemon[subStage - 1];
			case "water":
				return waterPokemon[subStage - 1];
			default:
				throw new Error("Invalid stage");
		}
	}, [stage, subStage, grassPokemon, firePokemon, waterPokemon]);

	const getWinners = useCallback(() => {
		const getTopThree = (pokemonGroups: PokemonGroup[]) => {
			const allPokemons = pokemonGroups.flatMap(
				(group) => group.pokemons
			);
			return allPokemons
				.sort((a, b) => (scores[b.name] || 0) - (scores[a.name] || 0))
				.slice(0, 3);
		};

		return {
			grass: getTopThree(grassPokemon),
			fire: getTopThree(firePokemon),
			water: getTopThree(waterPokemon),
		};
	}, [scores, grassPokemon, firePokemon, waterPokemon]);

	const handleGenerateSummary = useCallback(async () => {
		setIsLoadingSummary(true);
		const winners = getWinners();
		const topPokemon = {
			grass: winners.grass[0],
			fire: winners.fire[0],
			water: winners.water[0],
		};

		const prompt = `
      You are a Pokémon trainer who has just assembled a team of starter Pokémon based on their personality traits. Summarize the team's characteristics and how they complement each other in a cohesive and inspiring way. The team consists of the following Pokémon:

      ${Object.entries(topPokemon)
			.map(
				([type, pokemon]) =>
					`${type.charAt(0).toUpperCase() + type.slice(1)} type: ${
						pokemon.name
					}: ${pokemon.traits.join("; ")}`
			)
			.join("\n\n")}

      Provide an uplifting summary that highlights the strengths and synergy of the team. Make sure to complete your last sentence.
    `;

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
	}, [getWinners]);

	const handleShareResults = async () => {
		if (!trainerName.trim()) {
			alert("Please enter your name before sharing your results.");
			return;
		}

		setIsSharing(true);

		const winners = getWinners();

		const preparePokemons = (pokemons: Pokemon[]) =>
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

	// const PokemonResults = () => {
	// 	const winners = getWinners();
	// 	const types = ["grass", "fire", "water"] as const;
	// 	const ranks = [
	// 		"Your Top Match!",
	// 		"Runner Up",
	// 		"Can Relate To",
	// 	] as const;

	// 	type PokemonResultItem = {
	// 		pokemon: Pokemon;
	// 		type: (typeof types)[number];
	// 		rank: (typeof ranks)[number];
	// 	};

	// 	const orderedPokemon: PokemonResultItem[] = ranks.flatMap((rank) =>
	// 		types
	// 			.map((type) => {
	// 				const pokemonForRank = winners[type].find(
	// 					(_, index) =>
	// 						(rank === "Your Top Match!" && index === 0) ||
	// 						(rank === "Runner Up" && index === 1) ||
	// 						(rank === "Can Relate To" && index === 2)
	// 				);
	// 				return pokemonForRank
	// 					? { pokemon: pokemonForRank, type, rank }
	// 					: null;
	// 			})
	// 			.filter((item): item is PokemonResultItem => item !== null)
	// 	);

	// 	return (
	// 		<div className="w-full max-w-4xl mx-auto">
	// 			<h2 className="text-2xl font-bold text-center mb-6 text-purple-900">
	// 				Your Pokémon Starters Are:
	// 			</h2>
	// 			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
	// 				{orderedPokemon.map(({ pokemon, type, rank }, index) => (
	// 					<PokemonCard
	// 						key={`${type}-${rank}-${index}`}
	// 						pokemon={pokemon}
	// 						type={type}
	// 						rank={rank}
	// 						isLocked={rank !== "Your Top Match!"}
	// 					/>
	// 				))}
	// 			</div>
	// 		</div>
	// 	);
	// };

	const PokemonResults = () => {
		const winners = getWinners();
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

		const orderedPokemon: PokemonResultItem[] = ranks.flatMap((rank) =>
			types
				.map((type) => {
					const pokemonForRank = winners[type].find(
						(_, index) =>
							(rank === "Your Top Match!" && index === 0) ||
							(rank === "Runner Up" && index === 1) ||
							(rank === "Can Relate To" && index === 2)
					);
					return pokemonForRank
						? { pokemon: pokemonForRank, type, rank }
						: null;
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

	useEffect(() => {
		if (stage === "result") {
			setShowConfetti(true);
			setTimeout(() => setShowConfetti(false), 5000);
			handleGenerateSummary();
		}
	}, [stage, handleGenerateSummary]);

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
											<div className="mt-4">
												<input
													type="text"
													placeholder="Enter your name"
													value={trainerName}
													onChange={(e) =>
														setTrainerName(
															e.target.value
														)
													}
													className="px-4 py-2 border rounded-lg mr-2 text-purple-700"
												/>
												<button
													onClick={handleShareResults}
													className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white"
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
											className="text-blue-500 underline"
										>
											{shareLink}
										</a>
									</div>
								)}
							</div>
						</motion.div>
					) : (
						<motion.div
							key={`${stage}-${subStage}-${questionIndex}`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="space-y-4 md:space-y-8"
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
									{
										getCurrentGroup().questions[
											questionIndex
										].text
									}
								</p>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{getCurrentGroup().questions[
										questionIndex
									].options.map((option, index) => (
										<motion.button
											key={index}
											onClick={() => handleAnswer(index)}
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
									))}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
