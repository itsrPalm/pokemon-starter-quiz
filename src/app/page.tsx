// // "use client";

// // import React, { useState, useEffect, useRef } from "react";
// // import Image from "next/image";
// // import { motion, AnimatePresence } from "framer-motion";

// // interface Pokemon {
// // 	name: string;
// // 	description: string;
// // 	image: string | null;
// // }

// // const grassPokemon: Pokemon[] = [
// // 	{
// // 		name: "Turtwig",
// // 		description:
// // 			"🏋️‍♂️ Hardworking and dependable. You prefer steady progress and stay grounded as you work towards your goals.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Chikorita",
// // 		description:
// // 			"🤗 Kind and gentle. You create peace around you, love helping others, and feel happiest when everyone feels cared for.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Chespin",
// // 		description:
// // 			"😄 Playful and optimistic. You spread joy easily and have a talent for turning tough situations into positive ones.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Treecko",
// // 		description:
// // 			"😎 Confident and self-assured. You trust your gut, like handling things solo, and aren't afraid of challenges.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Bulbasaur",
// // 		description:
// // 			"🤝 Loyal and reliable. You're the backbone of any group, not always in the spotlight, but always there when needed.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Snivy",
// // 		description:
// // 			"👑 Elegant and composed. You carry yourself proudly, value quality over quantity, and cherish meaningful friendships.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Grookey",
// // 		description:
// // 			"🎵 Energetic and playful. You bring life to every moment, love having fun, and inspire others to join in.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Rowlet",
// // 		description:
// // 			"🦉 Calm and thoughtful. You're a keen observer, and others value your quiet wisdom and balanced perspective.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Sprigatito",
// // 		description:
// // 			"🐱 Playful and independent. You value your freedom, do things at your own pace, but enjoy connecting with others when it feels right.",
// // 		image: null,
// // 	},
// // ];

// // const firePokemon: Pokemon[] = [
// // 	{
// // 		name: "Charmander",
// // 		description:
// // 			"🏆 Competitive and determined. You love proving yourself, thrive on challenges, and never give up, even when things get tough.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Cyndaquil",
// // 		description:
// // 			"🤫 Quiet and reserved. You prefer your own company but prove reliable in critical moments, especially during crises.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Tepig",
// // 		description:
// // 			"😊 Playful and lighthearted. You enjoy being with friends and making them laugh, but know when to be serious.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Torchic",
// // 		description:
// // 			"🌟 Optimistic and energetic. Your enthusiasm and positivity attract others and brighten up any room you're in.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Chimchar",
// // 		description:
// // 			"🐒 Mischievous and ambitious. You love trying new things and can bounce back from setbacks with a smile.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Fennekin",
// // 		description:
// // 			"🔮 Imaginative and curious. You have a creative streak and may seem delicate, but your determination surprises others.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Scorbunny",
// // 		description:
// // 			"🏃‍♂️ Competitive and full of excitement. Always on the move, you inspire others with your energy and can-do spirit.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Litten",
// // 		description:
// // 			"😼 Independent and cool-headed. You prefer doing things your way and may seem distant, but close friends know your true abilities.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Fuecoco",
// // 		description:
// // 			"🦎 Laid-back and carefree. You enjoy life at your own pace, but when something excites you, you dive in with all your heart.",
// // 		image: null,
// // 	},
// // ];

// // const waterPokemon: Pokemon[] = [
// // 	{
// // 		name: "Totodile",
// // 		description:
// // 			"🎉 Energetic and enthusiastic. You love having fun, making others smile, and eagerly jump into new challenges.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Mudkip",
// // 		description:
// // 			"🤲 Gentle and supportive. You're great at helping others through tough times and always know when to lend a hand.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Piplup",
// // 		description:
// // 			"🐧 Proud and independent. You like doing things your way, enjoy your own company, but are deeply loyal to close friends.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Oshawott",
// // 		description:
// // 			"💪 Determined and cheerful. You bounce back quickly from setbacks and enjoy achieving goals one small step at a time.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Popplio",
// // 		description:
// // 			"🎭 Playful and expressive. You love performing and bringing joy to others, even when situations get difficult.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Froakie",
// // 		description:
// // 			"🕵️‍♂️ Calm and observant. You keep your cool under pressure and notice details others miss, making you a great problem-solver.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Quaxly",
// // 		description:
// // 			"💅 Stylish and disciplined. You take pride in doing things properly, value self-improvement, and strive to be better every day.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Squirtle",
// // 		description:
// // 			"🏄‍♂️ Laid-back and easygoing. You enjoy hanging out with friends and are always there to support them when they need you.",
// // 		image: null,
// // 	},
// // 	{
// // 		name: "Sobble",
// // 		description:
// // 			"🎨 Sensitive and introspective. You feel things deeply and may seem shy, but you possess surprising emotional strength.",
// // 		image: null,
// // 	},
// // ];

// // const AnimatedTitle = () => {
// // 	return (
// // 		<motion.div
// // 			initial={{ opacity: 0, y: -50 }}
// // 			animate={{ opacity: 1, y: 0 }}
// // 			transition={{ duration: 0.5 }}
// // 			className="text-center my-4 md:my-8"
// // 		>
// // 			<h1 className="text-3xl md:text-6xl font-bold pokemon-title relative inline-block">
// // 				<span className="relative z-10">
// // 					<span className="text-yellow-400">P</span>
// // 					<span className="text-blue-500">O</span>
// // 					<span className="text-red-500">K</span>
// // 					<span className="text-green-500">E</span>
// // 					<span className="text-yellow-400">M</span>
// // 					<span className="text-blue-500">O</span>
// // 					<span className="text-red-500">N</span>
// // 				</span>
// // 				<span className="block text-xl md:text-4xl mt-2 text-white">
// // 					STARTER QUIZ
// // 				</span>
// // 				<div className="absolute inset-0 bg-black -z-10 skew-y-3 transform scale-110"></div>
// // 			</h1>
// // 			<style jsx>{`
// // 				@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");

// // 				.pokemon-title {
// // 					font-family: "Bungee", cursive;
// // 					text-shadow: -1px -1px 0 #395fa3, 1px -1px 0 #395fa3,
// // 						-1px 1px 0 #395fa3, 1px 1px 0 #395fa3, 0 0 10px #ffd900;
// // 					animation: bounce 0.5s ease infinite alternate;
// // 				}

// // 				@keyframes bounce {
// // 					from {
// // 						transform: translateY(0px);
// // 					}
// // 					to {
// // 						transform: translateY(-5px);
// // 					}
// // 				}

// // 				.pokemon-title span {
// // 					display: inline-block;
// // 					animation: wobble 2s ease infinite;
// // 					animation-delay: calc(0.1s * var(--i));
// // 				}

// // 				@keyframes wobble {
// // 					0%,
// // 					100% {
// // 						transform: translateY(0);
// // 					}
// // 					50% {
// // 						transform: translateY(-5px);
// // 					}
// // 				}
// // 			`}</style>
// // 		</motion.div>
// // 	);
// // };

// // const GrassAnimation = () => (
// // 	<motion.div
// // 		initial={{ opacity: 0 }}
// // 		animate={{ opacity: 1 }}
// // 		exit={{ opacity: 0 }}
// // 		className="fixed inset-0 w-screen h-screen overflow-hidden bg-green-100"
// // 	>
// // 		<svg
// // 			xmlns="http://www.w3.org/2000/svg"
// // 			width="100%"
// // 			height="100%"
// // 			viewBox="0 0 100 100"
// // 			preserveAspectRatio="none"
// // 		>
// // 			<g className="grass-blades">
// // 				{[...Array(50)].map((_, i) => (
// // 					<motion.path
// // 						key={i}
// // 						d={`M${Math.random() * 100} 100 Q${
// // 							Math.random() * 100
// // 						} ${80 + Math.random() * 20} ${
// // 							Math.random() * 100
// // 						} 100`}
// // 						fill="none"
// // 						stroke="#4CAF50"
// // 						strokeWidth="0.2"
// // 						initial={{ pathLength: 0 }}
// // 						animate={{ pathLength: 1 }}
// // 						transition={{
// // 							duration: 2,
// // 							repeat: Infinity,
// // 							repeatType: "reverse",
// // 						}}
// // 					/>
// // 				))}
// // 			</g>
// // 		</svg>
// // 	</motion.div>
// // );

// // const FireAnimation = () => (
// // 	<motion.div
// // 		initial={{ opacity: 0 }}
// // 		animate={{ opacity: 1 }}
// // 		exit={{ opacity: 0 }}
// // 		className="fixed inset-0 w-screen h-screen overflow-hidden bg-orange-100"
// // 	>
// // 		<svg
// // 			xmlns="http://www.w3.org/2000/svg"
// // 			width="100%"
// // 			height="100%"
// // 			viewBox="0 0 100 100"
// // 			preserveAspectRatio="none"
// // 		>
// // 			<g className="flames">
// // 				{[...Array(30)].map((_, i) => (
// // 					<motion.path
// // 						key={i}
// // 						d={`M${50 + Math.random() * 40 - 20} 100 Q${
// // 							50 + Math.random() * 40 - 20
// // 						} ${80 + Math.random() * 20} ${
// // 							50 + Math.random() * 40 - 20
// // 						} ${60 + Math.random() * 40}`}
// // 						fill="none"
// // 						stroke="#FF9800"
// // 						strokeWidth="0.3"
// // 						initial={{ pathLength: 0 }}
// // 						animate={{ pathLength: 1 }}
// // 						transition={{
// // 							duration: 1 + Math.random(),
// // 							repeat: Infinity,
// // 							repeatType: "reverse",
// // 						}}
// // 					/>
// // 				))}
// // 			</g>
// // 		</svg>
// // 	</motion.div>
// // );

// // const WaterAnimation = () => (
// // 	<motion.div
// // 		initial={{ opacity: 0 }}
// // 		animate={{ opacity: 1 }}
// // 		exit={{ opacity: 0 }}
// // 		className="fixed inset-0 w-screen h-screen overflow-hidden bg-blue-100"
// // 	>
// // 		<svg
// // 			xmlns="http://www.w3.org/2000/svg"
// // 			width="100%"
// // 			height="100%"
// // 			viewBox="0 0 100 100"
// // 			preserveAspectRatio="none"
// // 		>
// // 			<g className="waves">
// // 				{[...Array(5)].map((_, i) => (
// // 					<motion.path
// // 						key={i}
// // 						d={`M0 ${80 + i * 5} Q25 ${75 + i * 5} 50 ${
// // 							80 + i * 5
// // 						} T100 ${80 + i * 5}`}
// // 						fill="none"
// // 						stroke="#2196F3"
// // 						strokeWidth="2"
// // 						opacity="0.3"
// // 						initial={{ pathLength: 0 }}
// // 						animate={{ pathLength: 1 }}
// // 						transition={{
// // 							duration: 3 + i,
// // 							repeat: Infinity,
// // 							repeatType: "reverse",
// // 						}}
// // 					/>
// // 				))}
// // 			</g>
// // 		</svg>
// // 	</motion.div>
// // );

// // const AudioControl = ({
// // 	isPlaying,
// // 	onToggle,
// // }: {
// // 	isPlaying: boolean;
// // 	onToggle: () => void;
// // }) => (
// // 	<motion.button
// // 		className="fixed bottom-4 left-4 z-50 bg-white p-2 rounded-full shadow-md flex items-center"
// // 		onClick={onToggle}
// // 		whileHover={{ scale: 1.1 }}
// // 		whileTap={{ scale: 0.9 }}
// // 	>
// // 		{isPlaying ? "🔊" : "🔇"}
// // 		<span className="ml-2 text-sm">
// // 			{isPlaying ? "Mute" : "Play"} Music
// // 		</span>
// // 	</motion.button>
// // );

// // export default function QuizPage() {
// // 	const [stage, setStage] = useState<
// // 		"start" | "grass" | "fire" | "water" | "result"
// // 	>("start");
// // 	const [remainingGrass, setRemainingGrass] = useState(grassPokemon);
// // 	const [remainingFire, setRemainingFire] = useState(firePokemon);
// // 	const [remainingWater, setRemainingWater] = useState(waterPokemon);

// // 	const [finalGrass, setFinalGrass] = useState<Pokemon | null>(null);
// // 	const [finalFire, setFinalFire] = useState<Pokemon | null>(null);
// // 	const [finalWater, setFinalWater] = useState<Pokemon | null>(null);

// // 	const [isAudioPlaying, setIsAudioPlaying] = useState(false);

// // 	const legendAudioRef = useRef<HTMLAudioElement | null>(null);
// // 	const grassAudioRef = useRef<HTMLAudioElement | null>(null);
// // 	const fireAudioRef = useRef<HTMLAudioElement | null>(null);
// // 	const waterAudioRef = useRef<HTMLAudioElement | null>(null);
// // 	const eliminateAudioRef = useRef<HTMLAudioElement | null>(null);

// // 	useEffect(() => {
// // 		legendAudioRef.current = new Audio("/legend.mp3");
// // 		grassAudioRef.current = new Audio("/grass.mp3");
// // 		fireAudioRef.current = new Audio("/fire.mp3");
// // 		waterAudioRef.current = new Audio("/water.mp3");
// // 		eliminateAudioRef.current = new Audio("/eliminate.mp3");

// // 		legendAudioRef.current.loop = true;

// // 		return () => {
// // 			[
// // 				legendAudioRef,
// // 				grassAudioRef,
// // 				fireAudioRef,
// // 				waterAudioRef,
// // 				eliminateAudioRef,
// // 			].forEach((ref) => {
// // 				if (ref.current) {
// // 					ref.current.pause();
// // 					ref.current.src = "";
// // 				}
// // 			});
// // 		};
// // 	}, []);

// // 	const toggleAudio = () => {
// // 		if (legendAudioRef.current) {
// // 			if (isAudioPlaying) {
// // 				legendAudioRef.current.pause();
// // 			} else {
// // 				legendAudioRef.current
// // 					.play()
// // 					.catch((error) =>
// // 						console.error("Audio playback failed:", error)
// // 					);
// // 			}
// // 			setIsAudioPlaying(!isAudioPlaying);
// // 		}
// // 	};

// // 	const playStageAudio = (stage: "grass" | "fire" | "water") => {
// // 		const audioRef = {
// // 			grass: grassAudioRef,
// // 			fire: fireAudioRef,
// // 			water: waterAudioRef,
// // 		}[stage];

// // 		if (audioRef.current) {
// // 			audioRef.current
// // 				.play()
// // 				.catch((error) =>
// // 					console.error(`${stage} audio playback failed:`, error)
// // 				);
// // 		}
// // 	};

// // 	const startQuiz = () => {
// // 		setStage("grass");
// // 		if (legendAudioRef.current) {
// // 			legendAudioRef.current
// // 				.play()
// // 				.catch((error) =>
// // 					console.error("Audio playback failed:", error)
// // 				);
// // 			setIsAudioPlaying(true);
// // 		}
// // 		playStageAudio("grass");
// // 	};

// // 	const fetchPokemonImages = async (pokemonList: Pokemon[]) => {
// // 		const updatedPokemon = await Promise.all(
// // 			pokemonList.map(async (pokemon) => {
// // 				try {
// // 					const res = await fetch(`/api/pokemon/${pokemon.name}`);
// // 					const data = await res.json();
// // 					return { ...pokemon, image: data.imageUrl || null };
// // 				} catch (error) {
// // 					console.error(
// // 						`Failed to fetch image for ${pokemon.name}`,
// // 						error
// // 					);
// // 					return pokemon;
// // 				}
// // 			})
// // 		);
// // 		return updatedPokemon;
// // 	};

// // 	useEffect(() => {
// // 		const loadPokemonImages = async () => {
// // 			setRemainingGrass(await fetchPokemonImages(grassPokemon));
// // 			setRemainingFire(await fetchPokemonImages(firePokemon));
// // 			setRemainingWater(await fetchPokemonImages(waterPokemon));
// // 		};

// // 		loadPokemonImages();
// // 	}, []);

// // 	const handleEliminate = (
// // 		type: "grass" | "fire" | "water",
// // 		index: number
// // 	) => {
// // 		if (eliminateAudioRef.current) {
// // 			eliminateAudioRef.current
// // 				.play()
// // 				.catch((error) =>
// // 					console.error("Eliminate audio playback failed:", error)
// // 				);
// // 		}

// // 		if (type === "grass") {
// // 			const newGrass = remainingGrass.filter((_, i) => i !== index);
// // 			setRemainingGrass(newGrass);
// // 			if (newGrass.length === 1) {
// // 				setFinalGrass(newGrass[0]);
// // 				setStage("fire");
// // 				playStageAudio("fire");
// // 			}
// // 		} else if (type === "fire") {
// // 			const newFire = remainingFire.filter((_, i) => i !== index);
// // 			setRemainingFire(newFire);
// // 			if (newFire.length === 1) {
// // 				setFinalFire(newFire[0]);
// // 				setStage("water");
// // 				playStageAudio("water");
// // 			}
// // 		} else if (type === "water") {
// // 			const newWater = remainingWater.filter((_, i) => i !== index);
// // 			setRemainingWater(newWater);
// // 			if (newWater.length === 1) {
// // 				setFinalWater(newWater[0]);
// // 				setStage("result");
// // 				if (legendAudioRef.current) {
// // 					legendAudioRef.current.pause();
// // 				}
// // 			}
// // 		}
// // 	};

// // 	const getTypeStyles = (type: "grass" | "fire" | "water" | "result") => {
// // 		switch (type) {
// // 			case "grass":
// // 				return {
// // 					background: "bg-green-200",
// // 					border: "border-green-500",
// // 					button: "bg-green-500 hover:bg-green-600",
// // 					text: "text-green-900",
// // 					emoji: "🌿",
// // 				};
// // 			case "fire":
// // 				return {
// // 					background: "bg-orange-200",
// // 					border: "border-orange-500",
// // 					button: "bg-orange-500 hover:bg-orange-600",
// // 					text: "text-orange-900",
// // 					emoji: "🔥",
// // 				};
// // 			case "water":
// // 				return {
// // 					background: "bg-blue-200",
// // 					border: "border-blue-500",
// // 					button: "bg-blue-500 hover:bg-blue-600",
// // 					text: "text-blue-900",
// // 					emoji: "💧",
// // 				};
// // 			default:
// // 				return {
// // 					background: "bg-gray-200",
// // 					border: "border-gray-500",
// // 					button: "bg-gray-500 hover:bg-gray-600",
// // 					text: "text-gray-900",
// // 					emoji: "❓",
// // 				};
// // 		}
// // 	};

// // 	const renderOptions = (
// // 		type: "grass" | "fire" | "water",
// // 		pokemonList: Pokemon[]
// // 	) => {
// // 		const styles = getTypeStyles(type);
// // 		return (
// // 			<motion.div
// // 				initial={{ opacity: 0 }}
// // 				animate={{ opacity: 1 }}
// // 				exit={{ opacity: 0 }}
// // 				className="grid grid-cols-1 md:grid-cols-3 gap-4"
// // 			>
// // 				{pokemonList.map((pokemon, index) => (
// // 					<motion.div
// // 						key={index}
// // 						initial={{ opacity: 0, y: 50 }}
// // 						animate={{ opacity: 1, y: 0 }}
// // 						exit={{ opacity: 0, y: -50 }}
// // 						transition={{ duration: 0.5, delay: index * 0.1 }}
// // 						className={`flex flex-col items-center ${styles.background} ${styles.border} border shadow-md rounded-lg p-4`}
// // 						whileHover={{
// // 							scale: 1.05,
// // 							boxShadow: "0px 0px 8px rgb(0,0,0,0.2)",
// // 						}}
// // 					>
// // 						<p className={`text-sm ${styles.text}`}>
// // 							{pokemon.description}
// // 						</p>
// // 						<motion.button
// // 							onClick={() => handleEliminate(type, index)}
// // 							className={`mt-4 px-4 py-2 ${styles.button} text-white rounded-lg transition`}
// // 							whileHover={{ scale: 1.1 }}
// // 							whileTap={{ scale: 0.9 }}
// // 						>
// // 							Eliminate
// // 						</motion.button>
// // 					</motion.div>
// // 				))}
// // 			</motion.div>
// // 		);
// // 	};

// // 	return (
// // 		<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-purple-100">
// // 			<AnimatePresence>
// // 				{stage === "grass" && <GrassAnimation />}
// // 				{stage === "fire" && <FireAnimation />}
// // 				{stage === "water" && <WaterAnimation />}
// // 			</AnimatePresence>

// // 			<div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
// // 				<AudioControl
// // 					isPlaying={isAudioPlaying}
// // 					onToggle={toggleAudio}
// // 				/>

// // 				<AnimatedTitle />

// // 				<AnimatePresence mode="wait">
// // 					{stage === "start" && (
// // 						<motion.div
// // 							key="start"
// // 							initial={{ opacity: 0, y: 20 }}
// // 							animate={{ opacity: 1, y: 0 }}
// // 							exit={{ opacity: 0, y: -20 }}
// // 							className="text-center"
// // 						>
// // 							<motion.p
// // 								initial={{ opacity: 0 }}
// // 								animate={{ opacity: 1 }}
// // 								transition={{ delay: 0.5 }}
// // 								className="text-lg md:text-xl text-gray-700 mb-8"
// // 							>
// // 								Discover your perfect Pokémon starter! This quiz
// // 								will match you with the Grass, Fire, and
// // 								Water-type Pokémon that best reflect your
// // 								personality. Ready to find your ideal companions
// // 								for your Pokémon journey?
// // 							</motion.p>
// // 							<motion.div
// // 								initial={{ opacity: 0 }}
// // 								animate={{ opacity: 1 }}
// // 								transition={{ delay: 0.7 }}
// // 								className="bg-yellow-100 border-yellow-300 border p-4 rounded-lg mb-8 text-left text-black"
// // 							>
// // 								<h3 className="font-bold text-lg mb-2">
// // 									Instructions:
// // 								</h3>
// // 								<p>
// // 									1. Read each personality description
// // 									carefully.
// // 								</p>
// // 								<p>
// // 									2. Click the &quot;Eliminate&quot; button
// // 									beneath the description that feels least
// // 									like you.
// // 								</p>
// // 								<p>
// // 									3. Continue eliminating until you&apos;ve
// // 									found your perfect match for each type!
// // 								</p>
// // 							</motion.div>
// // 							<motion.button
// // 								onClick={startQuiz}
// // 								className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full text-xl mt-4"
// // 								whileHover={{
// // 									scale: 1.05,
// // 									boxShadow: "0px 0px 8px rgb(255,204,0)",
// // 								}}
// // 								whileTap={{ scale: 0.95 }}
// // 							>
// // 								START QUIZ
// // 							</motion.button>
// // 						</motion.div>
// // 					)}
// // 					{stage === "result" ? (
// // 						<motion.div
// // 							key="result"
// // 							initial={{ opacity: 0 }}
// // 							animate={{ opacity: 1 }}
// // 							exit={{ opacity: 0 }}
// // 						>
// // 							<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
// // 								Your Pokémon Starters Are:
// // 							</h2>
// // 							<div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mt-6">
// // 								{[
// // 									{ pokemon: finalGrass, type: "grass" },
// // 									{ pokemon: finalFire, type: "fire" },
// // 									{ pokemon: finalWater, type: "water" },
// // 								].map(({ pokemon, type }, index) => {
// // 									const styles = getTypeStyles(
// // 										type as "grass" | "fire" | "water"
// // 									);
// // 									return (
// // 										<motion.div
// // 											key={index}
// // 											initial={{ opacity: 0, y: 50 }}
// // 											animate={{ opacity: 1, y: 0 }}
// // 											transition={{
// // 												duration: 0.5,
// // 												delay: index * 0.2,
// // 											}}
// // 											className={`flex flex-col items-center ${styles.background} ${styles.border} border shadow-md rounded-lg p-4 w-full md:w-64`}
// // 										>
// // 											{pokemon?.image && (
// // 												<Image
// // 													src={pokemon.image}
// // 													alt={
// // 														pokemon.name ||
// // 														"Pokemon"
// // 													}
// // 													width={150}
// // 													height={150}
// // 													className="rounded-md"
// // 												/>
// // 											)}
// // 											<h2
// // 												className={`text-lg md:text-xl font-semibold mt-2 ${styles.text}`}
// // 											>
// // 												{styles.emoji} {pokemon?.name}
// // 											</h2>
// // 											<p
// // 												className={`text-xs md:text-sm ${styles.text} mt-2`}
// // 											>
// // 												{pokemon?.description}
// // 											</p>
// // 										</motion.div>
// // 									);
// // 								})}
// // 							</div>
// // 						</motion.div>
// // 					) : (
// // 						<motion.div
// // 							key="quiz"
// // 							initial={{ opacity: 0 }}
// // 							animate={{ opacity: 1 }}
// // 							exit={{ opacity: 0 }}
// // 							className="space-y-4 md:space-y-8"
// // 						>
// // 							{stage === "grass" &&
// // 								renderOptions("grass", remainingGrass)}
// // 							{stage === "fire" &&
// // 								renderOptions("fire", remainingFire)}
// // 							{stage === "water" &&
// // 								renderOptions("water", remainingWater)}
// // 						</motion.div>
// // 					)}
// // 				</AnimatePresence>
// // 			</div>
// // 		</div>
// // 	);
// // }

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";
// import ReactConfetti from "react-confetti";

// interface Pokemon {
// 	name: string;
// 	description: string;
// 	image: string | null;
// }

// const grassPokemon: Pokemon[] = [
// 	{
// 		name: "Turtwig",
// 		description:
// 			"🏋️‍♂️ Hardworking and dependable. You prefer steady progress and stay grounded as you work towards your goals.",
// 		image: null,
// 	},
// 	{
// 		name: "Chikorita",
// 		description:
// 			"🤗 Kind and gentle. You create peace around you, love helping others, and feel happiest when everyone feels cared for.",
// 		image: null,
// 	},
// 	{
// 		name: "Chespin",
// 		description:
// 			"😄 Playful and optimistic. You spread joy easily and have a talent for turning tough situations into positive ones.",
// 		image: null,
// 	},
// 	{
// 		name: "Treecko",
// 		description:
// 			"😎 Confident and self-assured. You trust your gut, like handling things solo, and aren't afraid of challenges.",
// 		image: null,
// 	},
// 	{
// 		name: "Bulbasaur",
// 		description:
// 			"🤝 Loyal and reliable. You're the backbone of any group, not always in the spotlight, but always there when needed.",
// 		image: null,
// 	},
// 	{
// 		name: "Snivy",
// 		description:
// 			"👑 Elegant and composed. You carry yourself proudly, value quality over quantity, and cherish meaningful friendships.",
// 		image: null,
// 	},
// 	{
// 		name: "Grookey",
// 		description:
// 			"🎵 Energetic and playful. You bring life to every moment, love having fun, and inspire others to join in.",
// 		image: null,
// 	},
// 	{
// 		name: "Rowlet",
// 		description:
// 			"🦉 Calm and thoughtful. You're a keen observer, and others value your quiet wisdom and balanced perspective.",
// 		image: null,
// 	},
// 	{
// 		name: "Sprigatito",
// 		description:
// 			"🐱 Playful and independent. You value your freedom, do things at your own pace, but enjoy connecting with others when it feels right.",
// 		image: null,
// 	},
// ];

// const firePokemon: Pokemon[] = [
// 	{
// 		name: "Charmander",
// 		description:
// 			"🏆 Competitive and determined. You love proving yourself, thrive on challenges, and never give up, even when things get tough.",
// 		image: null,
// 	},
// 	{
// 		name: "Cyndaquil",
// 		description:
// 			"🤫 Quiet and reserved. You prefer your own company but prove reliable in critical moments, especially during crises.",
// 		image: null,
// 	},
// 	{
// 		name: "Tepig",
// 		description:
// 			"😊 Playful and lighthearted. You enjoy being with friends and making them laugh, but know when to be serious.",
// 		image: null,
// 	},
// 	{
// 		name: "Torchic",
// 		description:
// 			"🌟 Optimistic and energetic. Your enthusiasm and positivity attract others and brighten up any room you're in.",
// 		image: null,
// 	},
// 	{
// 		name: "Chimchar",
// 		description:
// 			"🐒 Mischievous and ambitious. You love trying new things and can bounce back from setbacks with a smile.",
// 		image: null,
// 	},
// 	{
// 		name: "Fennekin",
// 		description:
// 			"🔮 Imaginative and curious. You have a creative streak and may seem delicate, but your determination surprises others.",
// 		image: null,
// 	},
// 	{
// 		name: "Scorbunny",
// 		description:
// 			"🏃‍♂️ Competitive and full of excitement. Always on the move, you inspire others with your energy and can-do spirit.",
// 		image: null,
// 	},
// 	{
// 		name: "Litten",
// 		description:
// 			"😼 Independent and cool-headed. You prefer doing things your way and may seem distant, but close friends know your true abilities.",
// 		image: null,
// 	},
// 	{
// 		name: "Fuecoco",
// 		description:
// 			"🦎 Laid-back and carefree. You enjoy life at your own pace, but when something excites you, you dive in with all your heart.",
// 		image: null,
// 	},
// ];

// const waterPokemon: Pokemon[] = [
// 	{
// 		name: "Totodile",
// 		description:
// 			"🎉 Energetic and enthusiastic. You love having fun, making others smile, and eagerly jump into new challenges.",
// 		image: null,
// 	},
// 	{
// 		name: "Mudkip",
// 		description:
// 			"🤲 Gentle and supportive. You're great at helping others through tough times and always know when to lend a hand.",
// 		image: null,
// 	},
// 	{
// 		name: "Piplup",
// 		description:
// 			"🐧 Proud and independent. You like doing things your way, enjoy your own company, but are deeply loyal to close friends.",
// 		image: null,
// 	},
// 	{
// 		name: "Oshawott",
// 		description:
// 			"💪 Determined and cheerful. You bounce back quickly from setbacks and enjoy achieving goals one small step at a time.",
// 		image: null,
// 	},
// 	{
// 		name: "Popplio",
// 		description:
// 			"🎭 Playful and expressive. You love performing and bringing joy to others, even when situations get difficult.",
// 		image: null,
// 	},
// 	{
// 		name: "Froakie",
// 		description:
// 			"🕵️‍♂️ Calm and observant. You keep your cool under pressure and notice details others miss, making you a great problem-solver.",
// 		image: null,
// 	},
// 	{
// 		name: "Quaxly",
// 		description:
// 			"💅 Stylish and disciplined. You take pride in doing things properly, value self-improvement, and strive to be better every day.",
// 		image: null,
// 	},
// 	{
// 		name: "Squirtle",
// 		description:
// 			"🏄‍♂️ Laid-back and easygoing. You enjoy hanging out with friends and are always there to support them when they need you.",
// 		image: null,
// 	},
// 	{
// 		name: "Sobble",
// 		description:
// 			"🎨 Sensitive and introspective. You feel things deeply and may seem shy, but you possess surprising emotional strength.",
// 		image: null,
// 	},
// ];

// const AnimatedTitle = () => {
// 	return (
// 		<motion.div
// 			initial={{ opacity: 0, y: -50 }}
// 			animate={{ opacity: 1, y: 0 }}
// 			transition={{ duration: 0.5 }}
// 			className="text-center my-4 md:my-8"
// 		>
// 			<h1 className="text-3xl md:text-6xl font-bold pokemon-title relative inline-block">
// 				<span className="relative z-10">
// 					<span className="text-yellow-400">P</span>
// 					<span className="text-blue-500">O</span>
// 					<span className="text-red-500">K</span>
// 					<span className="text-green-500">E</span>
// 					<span className="text-yellow-400">M</span>
// 					<span className="text-blue-500">O</span>
// 					<span className="text-red-500">N</span>
// 				</span>
// 				<span className="block text-xl md:text-4xl mt-2 text-white">
// 					STARTER QUIZ
// 				</span>
// 				<div className="absolute inset-0 bg-black -z-10 skew-y-3 transform scale-110"></div>
// 			</h1>
// 			<style jsx>{`
// 				@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");

// 				.pokemon-title {
// 					font-family: "Bungee", cursive;
// 					text-shadow: -1px -1px 0 #395fa3, 1px -1px 0 #395fa3,
// 						-1px 1px 0 #395fa3, 1px 1px 0 #395fa3, 0 0 10px #ffd900;
// 					animation: bounce 0.5s ease infinite alternate;
// 				}

// 				@keyframes bounce {
// 					from {
// 						transform: translateY(0px);
// 					}
// 					to {
// 						transform: translateY(-5px);
// 					}
// 				}

// 				.pokemon-title span {
// 					display: inline-block;
// 					animation: wobble 2s ease infinite;
// 					animation-delay: calc(0.1s * var(--i));
// 				}

// 				@keyframes wobble {
// 					0%,
// 					100% {
// 						transform: translateY(0);
// 					}
// 					50% {
// 						transform: translateY(-5px);
// 					}
// 				}
// 			`}</style>
// 		</motion.div>
// 	);
// };

// const GrassAnimation = () => (
// 	<motion.div
// 		initial={{ opacity: 0 }}
// 		animate={{ opacity: 1 }}
// 		exit={{ opacity: 0 }}
// 		className="fixed inset-0 w-screen h-screen overflow-hidden bg-green-100"
// 	>
// 		<svg
// 			xmlns="http://www.w3.org/2000/svg"
// 			width="100%"
// 			height="100%"
// 			viewBox="0 0 100 100"
// 			preserveAspectRatio="none"
// 		>
// 			<g className="grass-blades">
// 				{[...Array(50)].map((_, i) => (
// 					<motion.path
// 						key={i}
// 						d={`M${Math.random() * 100} 100 Q${
// 							Math.random() * 100
// 						} ${80 + Math.random() * 20} ${
// 							Math.random() * 100
// 						} 100`}
// 						fill="none"
// 						stroke="#4CAF50"
// 						strokeWidth="0.2"
// 						initial={{ pathLength: 0 }}
// 						animate={{ pathLength: 1 }}
// 						transition={{
// 							duration: 2,
// 							repeat: Infinity,
// 							repeatType: "reverse",
// 						}}
// 					/>
// 				))}
// 			</g>
// 		</svg>
// 	</motion.div>
// );

// const FireAnimation = () => (
// 	<motion.div
// 		initial={{ opacity: 0 }}
// 		animate={{ opacity: 1 }}
// 		exit={{ opacity: 0 }}
// 		className="fixed inset-0 w-screen h-screen overflow-hidden bg-orange-100"
// 	>
// 		<svg
// 			xmlns="http://www.w3.org/2000/svg"
// 			width="100%"
// 			height="100%"
// 			viewBox="0 0 100 100"
// 			preserveAspectRatio="none"
// 		>
// 			<g className="flames">
// 				{[...Array(30)].map((_, i) => (
// 					<motion.path
// 						key={i}
// 						d={`M${50 + Math.random() * 40 - 20} 100 Q${
// 							50 + Math.random() * 40 - 20
// 						} ${80 + Math.random() * 20} ${
// 							50 + Math.random() * 40 - 20
// 						} ${60 + Math.random() * 40}`}
// 						fill="none"
// 						stroke="#FF9800"
// 						strokeWidth="0.3"
// 						initial={{ pathLength: 0 }}
// 						animate={{ pathLength: 1 }}
// 						transition={{
// 							duration: 1 + Math.random(),
// 							repeat: Infinity,
// 							repeatType: "reverse",
// 						}}
// 					/>
// 				))}
// 			</g>
// 		</svg>
// 	</motion.div>
// );

// const WaterAnimation = () => (
// 	<motion.div
// 		initial={{ opacity: 0 }}
// 		animate={{ opacity: 1 }}
// 		exit={{ opacity: 0 }}
// 		className="fixed inset-0 w-screen h-screen overflow-hidden bg-blue-100"
// 	>
// 		<svg
// 			xmlns="http://www.w3.org/2000/svg"
// 			width="100%"
// 			height="100%"
// 			viewBox="0 0 100 100"
// 			preserveAspectRatio="none"
// 		>
// 			<g className="waves">
// 				{[...Array(5)].map((_, i) => (
// 					<motion.path
// 						key={i}
// 						d={`M0 ${80 + i * 5} Q25 ${75 + i * 5} 50 ${
// 							80 + i * 5
// 						} T100 ${80 + i * 5}`}
// 						fill="none"
// 						stroke="#2196F3"
// 						strokeWidth="2"
// 						opacity="0.3"
// 						initial={{ pathLength: 0 }}
// 						animate={{ pathLength: 1 }}
// 						transition={{
// 							duration: 3 + i,
// 							repeat: Infinity,
// 							repeatType: "reverse",
// 						}}
// 					/>
// 				))}
// 			</g>
// 		</svg>
// 	</motion.div>
// );

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
// 	>
// 		{isPlaying ? "🔊" : "🔇"}
// 		<span className="ml-2 text-sm">
// 			{isPlaying ? "Mute" : "Play"} Music
// 		</span>
// 	</motion.button>
// );

// const Pokeball = ({
// 	isOpen,
// 	children,
// }: {
// 	isOpen: boolean;
// 	children: React.ReactNode;
// }) => (
// 	<div className="relative w-64 h-64">
// 		<svg viewBox="0 0 100 100" className="w-full h-full">
// 			<circle cx="50" cy="50" r="50" fill="#f2f2f2" />
// 			<path
// 				d="M5,50 a1,1 0 0,0 90,0"
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

// export default function QuizPage() {
// 	const [stage, setStage] = useState<
// 		"start" | "grass" | "fire" | "water" | "result"
// 	>("start");
// 	const [remainingGrass, setRemainingGrass] = useState(grassPokemon);
// 	const [remainingFire, setRemainingFire] = useState(firePokemon);
// 	const [remainingWater, setRemainingWater] = useState(waterPokemon);

// 	const [finalGrass, setFinalGrass] = useState<Pokemon | null>(null);
// 	const [finalFire, setFinalFire] = useState<Pokemon | null>(null);
// 	const [finalWater, setFinalWater] = useState<Pokemon | null>(null);

// 	const [isAudioPlaying, setIsAudioPlaying] = useState(false);
// 	const [showConfetti, setShowConfetti] = useState(false);
// 	const [openPokeballs, setOpenPokeballs] = useState(false);

// 	const legendAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const grassAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const fireAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const waterAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const eliminateAudioRef = useRef<HTMLAudioElement | null>(null);

// 	useEffect(() => {
// 		legendAudioRef.current = new Audio("/legend.mp3");
// 		grassAudioRef.current = new Audio("/grass.mp3");
// 		fireAudioRef.current = new Audio("/fire.mp3");
// 		waterAudioRef.current = new Audio("/water.mp3");
// 		eliminateAudioRef.current = new Audio("/eliminate.mp3");

// 		legendAudioRef.current.loop = true;

// 		return () => {
// 			[
// 				legendAudioRef,
// 				grassAudioRef,
// 				fireAudioRef,
// 				waterAudioRef,
// 				eliminateAudioRef,
// 			].forEach((ref) => {
// 				if (ref.current) {
// 					ref.current.pause();
// 					ref.current.src = "";
// 				}
// 			});
// 		};
// 	}, []);

// 	useEffect(() => {
// 		if (stage === "result") {
// 			setShowConfetti(true);
// 			setTimeout(() => {
// 				setOpenPokeballs(true);
// 			}, 1000);
// 			setTimeout(() => setShowConfetti(false), 5000);
// 		}
// 	}, [stage]);

// 	const toggleAudio = () => {
// 		if (legendAudioRef.current) {
// 			if (isAudioPlaying) {
// 				legendAudioRef.current.pause();
// 			} else {
// 				legendAudioRef.current
// 					.play()
// 					.catch((error) =>
// 						console.error("Audio playback failed:", error)
// 					);
// 			}
// 			setIsAudioPlaying(!isAudioPlaying);
// 		}
// 	};

// 	const playStageAudio = (stage: "grass" | "fire" | "water") => {
// 		const audioRef = {
// 			grass: grassAudioRef,
// 			fire: fireAudioRef,
// 			water: waterAudioRef,
// 		}[stage];

// 		if (audioRef.current) {
// 			audioRef.current
// 				.play()
// 				.catch((error) =>
// 					console.error(`${stage} audio playback failed:`, error)
// 				);
// 		}
// 	};

// 	const startQuiz = () => {
// 		setStage("grass");
// 		if (legendAudioRef.current) {
// 			legendAudioRef.current
// 				.play()
// 				.catch((error) =>
// 					console.error("Audio playback failed:", error)
// 				);
// 			setIsAudioPlaying(true);
// 		}
// 		playStageAudio("grass");
// 	};

// 	const fetchPokemonImages = async (pokemonList: Pokemon[]) => {
// 		const updatedPokemon = await Promise.all(
// 			pokemonList.map(async (pokemon) => {
// 				try {
// 					const res = await fetch(`/api/pokemon/${pokemon.name}`);
// 					const data = await res.json();
// 					return { ...pokemon, image: data.imageUrl || null };
// 				} catch (error) {
// 					console.error(
// 						`Failed to fetch image for ${pokemon.name}`,
// 						error
// 					);
// 					return pokemon;
// 				}
// 			})
// 		);
// 		return updatedPokemon;
// 	};

// 	useEffect(() => {
// 		const loadPokemonImages = async () => {
// 			setRemainingGrass(await fetchPokemonImages(grassPokemon));
// 			setRemainingFire(await fetchPokemonImages(firePokemon));
// 			setRemainingWater(await fetchPokemonImages(waterPokemon));
// 		};

// 		loadPokemonImages();
// 	}, []);

// 	const handleEliminate = (
// 		type: "grass" | "fire" | "water",
// 		index: number
// 	) => {
// 		if (eliminateAudioRef.current) {
// 			eliminateAudioRef.current
// 				.play()
// 				.catch((error) =>
// 					console.error("Eliminate audio playback failed:", error)
// 				);
// 		}

// 		if (type === "grass") {
// 			const newGrass = remainingGrass.filter((_, i) => i !== index);
// 			setRemainingGrass(newGrass);
// 			if (newGrass.length === 1) {
// 				setFinalGrass(newGrass[0]);
// 				setStage("fire");
// 				playStageAudio("fire");
// 			}
// 		} else if (type === "fire") {
// 			const newFire = remainingFire.filter((_, i) => i !== index);
// 			setRemainingFire(newFire);
// 			if (newFire.length === 1) {
// 				setFinalFire(newFire[0]);
// 				setStage("water");
// 				playStageAudio("water");
// 			}
// 		} else if (type === "water") {
// 			const newWater = remainingWater.filter((_, i) => i !== index);
// 			setRemainingWater(newWater);
// 			if (newWater.length === 1) {
// 				setFinalWater(newWater[0]);
// 				setStage("result");
// 				if (legendAudioRef.current) {
// 					legendAudioRef.current.pause();
// 				}
// 			}
// 		}
// 	};

// 	const getTypeStyles = (type: "grass" | "fire" | "water" | "result") => {
// 		switch (type) {
// 			case "grass":
// 				return {
// 					background: "bg-green-200",
// 					border: "border-green-500",
// 					button: "bg-green-500 hover:bg-green-600",
// 					text: "text-green-900",
// 					emoji: "🌿",
// 				};
// 			case "fire":
// 				return {
// 					background: "bg-orange-200",
// 					border: "border-orange-500",
// 					button: "bg-orange-500 hover:bg-orange-600",
// 					text: "text-orange-900",
// 					emoji: "🔥",
// 				};
// 			case "water":
// 				return {
// 					background: "bg-blue-200",
// 					border: "border-blue-500",
// 					button: "bg-blue-500 hover:bg-blue-600",
// 					text: "text-blue-900",
// 					emoji: "💧",
// 				};
// 			default:
// 				return {
// 					background: "bg-gray-200",
// 					border: "border-gray-500",
// 					button: "bg-gray-500 hover:bg-gray-600",
// 					text: "text-gray-900",
// 					emoji: "❓",
// 				};
// 		}
// 	};

// 	const renderOptions = (
// 		type: "grass" | "fire" | "water",
// 		pokemonList: Pokemon[]
// 	) => {
// 		const styles = getTypeStyles(type);
// 		return (
// 			<motion.div
// 				initial={{ opacity: 0 }}
// 				animate={{ opacity: 1 }}
// 				exit={{ opacity: 0 }}
// 				className="grid grid-cols-1 md:grid-cols-3 gap-4"
// 			>
// 				{pokemonList.map((pokemon, index) => (
// 					<motion.div
// 						key={index}
// 						initial={{ opacity: 0, y: 50 }}
// 						animate={{ opacity: 1, y: 0 }}
// 						exit={{ opacity: 0, y: -50 }}
// 						transition={{ duration: 0.5, delay: index * 0.1 }}
// 						className={`flex flex-col items-center ${styles.background} ${styles.border} border shadow-md rounded-lg p-4`}
// 						whileHover={{
// 							scale: 1.05,
// 							boxShadow: "0px 0px 8px rgb(0,0,0,0.2)",
// 						}}
// 					>
// 						<p className={`text-sm ${styles.text}`}>
// 							{pokemon.description}
// 						</p>
// 						<motion.button
// 							onClick={() => handleEliminate(type, index)}
// 							className={`mt-4 px-4 py-2 ${styles.button} text-white rounded-lg transition`}
// 							whileHover={{ scale: 1.1 }}
// 							whileTap={{ scale: 0.9 }}
// 						>
// 							Eliminate
// 						</motion.button>
// 					</motion.div>
// 				))}
// 			</motion.div>
// 		);
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
// 					{stage === "start" && (
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
// 								className="text-lg md:text-xl text-gray-700 mb-8"
// 							>
// 								Discover your perfect Pokémon starter! This quiz
// 								will match you with the Grass, Fire, and
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
// 									Instructions:
// 								</h3>
// 								<p>
// 									1. Read each personality description
// 									carefully.
// 								</p>
// 								<p>
// 									2. Click the &quot;Eliminate&quot; button
// 									beneath the description that feels least
// 									like you.
// 								</p>
// 								<p>
// 									3. Continue eliminating until you&apos;ve
// 									found your perfect match for each type!
// 								</p>
// 							</motion.div>
// 							<motion.button
// 								onClick={startQuiz}
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
// 					)}
// 					{stage === "result" ? (
// 						<motion.div
// 							key="result"
// 							initial={{ opacity: 0 }}
// 							animate={{ opacity: 1 }}
// 							exit={{ opacity: 0 }}
// 						>
// 							<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
// 								Your Pokémon Starters Are:
// 							</h2>
// 							<div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mt-6">
// 								{[
// 									{ pokemon: finalGrass, type: "grass" },
// 									{ pokemon: finalFire, type: "fire" },
// 									{ pokemon: finalWater, type: "water" },
// 								].map(({ pokemon, type }, index) => {
// 									const styles = getTypeStyles(
// 										type as "grass" | "fire" | "water"
// 									);
// 									return (
// 										<motion.div
// 											key={index}
// 											initial={{ opacity: 0, y: 50 }}
// 											animate={{ opacity: 1, y: 0 }}
// 											transition={{
// 												duration: 0.5,
// 												delay: index * 0.2,
// 											}}
// 											className={`flex flex-col items-center ${styles.background} ${styles.border} border shadow-md rounded-lg p-4 w-full md:w-64`}
// 										>
// 											<Pokeball isOpen={openPokeballs}>
// 												{pokemon?.image && (
// 													<Image
// 														src={pokemon.image}
// 														alt={
// 															pokemon.name ||
// 															"Pokemon"
// 														}
// 														width={150}
// 														height={150}
// 														className="rounded-md"
// 													/>
// 												)}
// 											</Pokeball>
// 											<h2
// 												className={`text-lg md:text-xl font-semibold mt-2 ${styles.text}`}
// 											>
// 												{styles.emoji} {pokemon?.name}
// 											</h2>
// 											<p
// 												className={`text-xs md:text-sm ${styles.text} mt-2`}
// 											>
// 												{pokemon?.description}
// 											</p>
// 										</motion.div>
// 									);
// 								})}
// 							</div>
// 						</motion.div>
// 					) : (
// 						<motion.div
// 							key="quiz"
// 							initial={{ opacity: 0 }}
// 							animate={{ opacity: 1 }}
// 							exit={{ opacity: 0 }}
// 							className="space-y-4 md:space-y-8"
// 						>
// 							{stage === "grass" &&
// 								renderOptions("grass", remainingGrass)}
// 							{stage === "fire" &&
// 								renderOptions("fire", remainingFire)}
// 							{stage === "water" &&
// 								renderOptions("water", remainingWater)}
// 						</motion.div>
// 					)}
// 				</AnimatePresence>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";

interface Pokemon {
	name: string;
	description: string;
	image: string | null;
}

const grassPokemon: Pokemon[] = [
	{
		name: "Turtwig",
		description:
			"🏋️‍♂️ Hardworking and dependable. You prefer steady progress and stay grounded as you work towards your goals.",
		image: null,
	},
	{
		name: "Chikorita",
		description:
			"🤗 Kind and gentle. You create peace around you, love helping others, and feel happiest when everyone feels cared for.",
		image: null,
	},
	{
		name: "Chespin",
		description:
			"😄 Playful and optimistic. You spread joy easily and have a talent for turning tough situations into positive ones.",
		image: null,
	},
	{
		name: "Treecko",
		description:
			"😎 Confident and self-assured. You trust your gut, like handling things solo, and aren't afraid of challenges.",
		image: null,
	},
	{
		name: "Bulbasaur",
		description:
			"🤝 Loyal and reliable. You're the backbone of any group, not always in the spotlight, but always there when needed.",
		image: null,
	},
	{
		name: "Snivy",
		description:
			"👑 Elegant and composed. You carry yourself proudly, value quality over quantity, and cherish meaningful friendships.",
		image: null,
	},
	{
		name: "Grookey",
		description:
			"🎵 Energetic and playful. You bring life to every moment, love having fun, and inspire others to join in.",
		image: null,
	},
	{
		name: "Rowlet",
		description:
			"🦉 Calm and thoughtful. You're a keen observer, and others value your quiet wisdom and balanced perspective.",
		image: null,
	},
	{
		name: "Sprigatito",
		description:
			"🐱 Playful and independent. You value your freedom, do things at your own pace, but enjoy connecting with others when it feels right.",
		image: null,
	},
];

const firePokemon: Pokemon[] = [
	{
		name: "Charmander",
		description:
			"🏆 Competitive and determined. You love proving yourself, thrive on challenges, and never give up, even when things get tough.",
		image: null,
	},
	{
		name: "Cyndaquil",
		description:
			"🤫 Quiet and reserved. You prefer your own company but prove reliable in critical moments, especially during crises.",
		image: null,
	},
	{
		name: "Tepig",
		description:
			"😊 Playful and lighthearted. You enjoy being with friends and making them laugh, but know when to be serious.",
		image: null,
	},
	{
		name: "Torchic",
		description:
			"🌟 Optimistic and energetic. Your enthusiasm and positivity attract others and brighten up any room you're in.",
		image: null,
	},
	{
		name: "Chimchar",
		description:
			"🐒 Mischievous and ambitious. You love trying new things and can bounce back from setbacks with a smile.",
		image: null,
	},
	{
		name: "Fennekin",
		description:
			"🔮 Imaginative and curious. You have a creative streak and may seem delicate, but your determination surprises others.",
		image: null,
	},
	{
		name: "Scorbunny",
		description:
			"🏃‍♂️ Competitive and full of excitement. Always on the move, you inspire others with your energy and can-do spirit.",
		image: null,
	},
	{
		name: "Litten",
		description:
			"😼 Independent and cool-headed. You prefer doing things your way and may seem distant, but close friends know your true abilities.",
		image: null,
	},
	{
		name: "Fuecoco",
		description:
			"🦎 Laid-back and carefree. You enjoy life at your own pace, but when something excites you, you dive in with all your heart.",
		image: null,
	},
];

const waterPokemon: Pokemon[] = [
	{
		name: "Totodile",
		description:
			"🎉 Energetic and enthusiastic. You love having fun, making others smile, and eagerly jump into new challenges.",
		image: null,
	},
	{
		name: "Mudkip",
		description:
			"🤲 Gentle and supportive. You're great at helping others through tough times and always know when to lend a hand.",
		image: null,
	},
	{
		name: "Piplup",
		description:
			"🐧 Proud and independent. You like doing things your way, enjoy your own company, but are deeply loyal to close friends.",
		image: null,
	},
	{
		name: "Oshawott",
		description:
			"💪 Determined and cheerful. You bounce back quickly from setbacks and enjoy achieving goals one small step at a time.",
		image: null,
	},
	{
		name: "Popplio",
		description:
			"🎭 Playful and expressive. You love performing and bringing joy to others, even when situations get difficult.",
		image: null,
	},
	{
		name: "Froakie",
		description:
			"🕵️‍♂️ Calm and observant. You keep your cool under pressure and notice details others miss, making you a great problem-solver.",
		image: null,
	},
	{
		name: "Quaxly",
		description:
			"💅 Stylish and disciplined. You take pride in doing things properly, value self-improvement, and strive to be better every day.",
		image: null,
	},
	{
		name: "Squirtle",
		description:
			"🏄‍♂️ Laid-back and easygoing. You enjoy hanging out with friends and are always there to support them when they need you.",
		image: null,
	},
	{
		name: "Sobble",
		description:
			"🎨 Sensitive and introspective. You feel things deeply and may seem shy, but you possess surprising emotional strength.",
		image: null,
	},
];

const AnimatedTitle = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="text-center my-4 md:my-8"
		>
			<h1 className="text-3xl md:text-6xl font-bold pokemon-title relative inline-block">
				<span className="relative z-10">
					<span className="text-yellow-400">P</span>
					<span className="text-blue-500">O</span>
					<span className="text-red-500">K</span>
					<span className="text-green-500">E</span>
					<span className="text-yellow-400">M</span>
					<span className="text-blue-500">O</span>
					<span className="text-red-500">N</span>
				</span>
				<span className="block text-xl md:text-4xl mt-2 text-white">
					STARTER QUIZ
				</span>
				<div className="absolute inset-0 bg-black -z-10 skew-y-3 transform scale-110"></div>
			</h1>
			<style jsx>{`
				@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");

				.pokemon-title {
					font-family: "Bungee", cursive;
					text-shadow: -1px -1px 0 #395fa3, 1px -1px 0 #395fa3,
						-1px 1px 0 #395fa3, 1px 1px 0 #395fa3, 0 0 10px #ffd900;
					animation: bounce 0.5s ease infinite alternate;
				}

				@keyframes bounce {
					from {
						transform: translateY(0px);
					}
					to {
						transform: translateY(-5px);
					}
				}

				.pokemon-title span {
					display: inline-block;
					animation: wobble 2s ease infinite;
					animation-delay: calc(0.1s * var(--i));
				}

				@keyframes wobble {
					0%,
					100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-5px);
					}
				}
			`}</style>
		</motion.div>
	);
};

const GrassAnimation = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="fixed inset-0 w-screen h-screen overflow-hidden bg-green-100"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
		>
			<g className="grass-blades">
				{[...Array(50)].map((_, i) => (
					<motion.path
						key={i}
						d={`M${Math.random() * 100} 100 Q${
							Math.random() * 100
						} ${80 + Math.random() * 20} ${
							Math.random() * 100
						} 100`}
						fill="none"
						stroke="#4CAF50"
						strokeWidth="0.2"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{
							duration: 2,
							repeat: Infinity,
							repeatType: "reverse",
						}}
					/>
				))}
			</g>
		</svg>
	</motion.div>
);

const FireAnimation = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="fixed inset-0 w-screen h-screen overflow-hidden bg-orange-100"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
		>
			<g className="flames">
				{[...Array(30)].map((_, i) => (
					<motion.path
						key={i}
						d={`M${50 + Math.random() * 40 - 20} 100 Q${
							50 + Math.random() * 40 - 20
						} ${80 + Math.random() * 20} ${
							50 + Math.random() * 40 - 20
						} ${60 + Math.random() * 40}`}
						fill="none"
						stroke="#FF9800"
						strokeWidth="0.3"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{
							duration: 1 + Math.random(),
							repeat: Infinity,
							repeatType: "reverse",
						}}
					/>
				))}
			</g>
		</svg>
	</motion.div>
);

const WaterAnimation = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="fixed inset-0 w-screen h-screen overflow-hidden bg-blue-100"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
		>
			<g className="waves">
				{[...Array(5)].map((_, i) => (
					<motion.path
						key={i}
						d={`M0 ${80 + i * 5} Q25 ${75 + i * 5} 50 ${
							80 + i * 5
						} T100 ${80 + i * 5}`}
						fill="none"
						stroke="#2196F3"
						strokeWidth="2"
						opacity="0.3"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{
							duration: 3 + i,
							repeat: Infinity,
							repeatType: "reverse",
						}}
					/>
				))}
			</g>
		</svg>
	</motion.div>
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
		<span className="ml-2 text-sm">
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
	<div className="relative w-64 h-64">
		<svg viewBox="0 0 100 100" className="w-full h-full">
			<circle cx="50" cy="50" r="50" fill="#f2f2f2" />
			<path
				d="M5,50 a1,1 0 0,0 90,0"
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

export default function QuizPage() {
	const [stage, setStage] = useState<
		"start" | "grass" | "fire" | "water" | "result"
	>("start");
	const [remainingGrass, setRemainingGrass] = useState(grassPokemon);
	const [remainingFire, setRemainingFire] = useState(firePokemon);
	const [remainingWater, setRemainingWater] = useState(waterPokemon);

	const [finalGrass, setFinalGrass] = useState<Pokemon | null>(null);
	const [finalFire, setFinalFire] = useState<Pokemon | null>(null);
	const [finalWater, setFinalWater] = useState<Pokemon | null>(null);

	const [isAudioPlaying, setIsAudioPlaying] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [openPokeballs, setOpenPokeballs] = useState(false);

	const legendAudioRef = useRef<HTMLAudioElement | null>(null);
	const grassAudioRef = useRef<HTMLAudioElement | null>(null);
	const fireAudioRef = useRef<HTMLAudioElement | null>(null);
	const waterAudioRef = useRef<HTMLAudioElement | null>(null);
	const eliminateAudioRef = useRef<HTMLAudioElement | null>(null);
	const sendingOffAudioRef = useRef<HTMLAudioElement | null>(null);

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
			setTimeout(() => {
				setOpenPokeballs(true);
			}, 1000);
			setTimeout(() => setShowConfetti(false), 5000);

			// Play the "sending-off.mp3" when the result stage is reached
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
	}, [stage]);

	const toggleAudio = () => {
		if (legendAudioRef.current) {
			if (isAudioPlaying) {
				legendAudioRef.current.pause();
			} else {
				legendAudioRef.current
					.play()
					.catch((error) =>
						console.error("Audio playback failed:", error)
					);
			}
			setIsAudioPlaying(!isAudioPlaying);
		}
	};

	const playStageAudio = (stage: "grass" | "fire" | "water") => {
		const audioRef = {
			grass: grassAudioRef,
			fire: fireAudioRef,
			water: waterAudioRef,
		}[stage];

		if (audioRef.current) {
			audioRef.current
				.play()
				.catch((error) =>
					console.error(`${stage} audio playback failed:`, error)
				);
		}
	};

	const startQuiz = () => {
		setStage("grass");
		if (legendAudioRef.current) {
			legendAudioRef.current
				.play()
				.catch((error) =>
					console.error("Audio playback failed:", error)
				);
			setIsAudioPlaying(true);
		}
		playStageAudio("grass");
	};

	const fetchPokemonImages = async (pokemonList: Pokemon[]) => {
		const updatedPokemon = await Promise.all(
			pokemonList.map(async (pokemon) => {
				try {
					const res = await fetch(`/api/pokemon/${pokemon.name}`);
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
		return updatedPokemon;
	};

	useEffect(() => {
		const loadPokemonImages = async () => {
			setRemainingGrass(await fetchPokemonImages(grassPokemon));
			setRemainingFire(await fetchPokemonImages(firePokemon));
			setRemainingWater(await fetchPokemonImages(waterPokemon));
		};

		loadPokemonImages();
	}, []);

	const handleEliminate = (
		type: "grass" | "fire" | "water",
		index: number
	) => {
		if (eliminateAudioRef.current) {
			eliminateAudioRef.current
				.play()
				.catch((error) =>
					console.error("Eliminate audio playback failed:", error)
				);
		}

		if (type === "grass") {
			const newGrass = remainingGrass.filter((_, i) => i !== index);
			setRemainingGrass(newGrass);
			if (newGrass.length === 1) {
				setFinalGrass(newGrass[0]);
				setStage("fire");
				playStageAudio("fire");
			}
		} else if (type === "fire") {
			const newFire = remainingFire.filter((_, i) => i !== index);
			setRemainingFire(newFire);
			if (newFire.length === 1) {
				setFinalFire(newFire[0]);
				setStage("water");
				playStageAudio("water");
			}
		} else if (type === "water") {
			const newWater = remainingWater.filter((_, i) => i !== index);
			setRemainingWater(newWater);
			if (newWater.length === 1) {
				setFinalWater(newWater[0]);
				setStage("result");
				if (legendAudioRef.current) {
					legendAudioRef.current.pause();
				}
			}
		}
	};

	const getTypeStyles = (type: "grass" | "fire" | "water" | "result") => {
		switch (type) {
			case "grass":
				return {
					background: "bg-green-200",
					border: "border-green-500",
					button: "bg-green-500 hover:bg-green-600",
					text: "text-green-900",
					emoji: "🌿",
				};
			case "fire":
				return {
					background: "bg-orange-200",
					border: "border-orange-500",
					button: "bg-orange-500 hover:bg-orange-600",
					text: "text-orange-900",
					emoji: "🔥",
				};
			case "water":
				return {
					background: "bg-blue-200",
					border: "border-blue-500",
					button: "bg-blue-500 hover:bg-blue-600",
					text: "text-blue-900",
					emoji: "💧",
				};
			default:
				return {
					background: "bg-gray-200",
					border: "border-gray-500",
					button: "bg-gray-500 hover:bg-gray-600",
					text: "text-gray-900",
					emoji: "❓",
				};
		}
	};

	const renderOptions = (
		type: "grass" | "fire" | "water",
		pokemonList: Pokemon[]
	) => {
		const styles = getTypeStyles(type);
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="grid grid-cols-1 md:grid-cols-3 gap-4"
			>
				{pokemonList.map((pokemon, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						className={`flex flex-col items-center ${styles.background} ${styles.border} border shadow-md rounded-lg p-4`}
						whileHover={{
							scale: 1.05,
							boxShadow: "0px 0px 8px rgb(0,0,0,0.2)",
						}}
					>
						<p className={`text-sm ${styles.text}`}>
							{pokemon.description}
						</p>
						<motion.button
							onClick={() => handleEliminate(type, index)}
							className={`mt-4 px-4 py-2 ${styles.button} text-white rounded-lg transition`}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
						>
							Eliminate
						</motion.button>
					</motion.div>
				))}
			</motion.div>
		);
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
					{stage === "start" && (
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
								className="text-lg md:text-xl text-gray-700 mb-8"
							>
								Discover your perfect Pokémon starter! This quiz
								will match you with the Grass, Fire, and
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
									Instructions:
								</h3>
								<p>
									1. Read each personality description
									carefully.
								</p>
								<p>
									2. Click the &quot;Eliminate&quot; button
									beneath the description that feels least
									like you.
								</p>
								<p>
									3. Continue eliminating until you&apos;ve
									found your perfect match for each type!
								</p>
							</motion.div>
							<motion.button
								onClick={startQuiz}
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
					)}
					{stage === "result" ? (
						<motion.div
							key="result"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
								Your Pokémon Starters Are:
							</h2>
							<div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mt-6">
								{[
									{ pokemon: finalGrass, type: "grass" },
									{ pokemon: finalFire, type: "fire" },
									{ pokemon: finalWater, type: "water" },
								].map(({ pokemon, type }, index) => {
									const styles = getTypeStyles(
										type as "grass" | "fire" | "water"
									);
									return (
										<motion.div
											key={index}
											initial={{ opacity: 0, y: 50 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.5,
												delay: index * 0.2,
											}}
											className={`flex flex-col items-center ${styles.background} ${styles.border} border shadow-md rounded-lg p-4 w-full md:w-64`}
										>
											<Pokeball isOpen={openPokeballs}>
												{pokemon?.image && (
													<Image
														src={pokemon.image}
														alt={
															pokemon.name ||
															"Pokemon"
														}
														width={150}
														height={150}
														className="rounded-md"
													/>
												)}
											</Pokeball>
											<h2
												className={`text-lg md:text-xl font-semibold mt-2 ${styles.text}`}
											>
												{styles.emoji} {pokemon?.name}
											</h2>
											<p
												className={`text-xs md:text-sm ${styles.text} mt-2`}
											>
												{pokemon?.description}
											</p>
										</motion.div>
									);
								})}
							</div>
						</motion.div>
					) : (
						<motion.div
							key="quiz"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="space-y-4 md:space-y-8"
						>
							{stage === "grass" &&
								renderOptions("grass", remainingGrass)}
							{stage === "fire" &&
								renderOptions("fire", remainingFire)}
							{stage === "water" &&
								renderOptions("water", remainingWater)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
