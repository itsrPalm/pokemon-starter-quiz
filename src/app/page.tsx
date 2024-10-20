//OG
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import ReactConfetti from "react-confetti";
// import Image from "next/image";
// import AnimatedTitle from "@/components/AnimatedTitle";
// import GrassAnimation from "@/components/GrassAnimation";
// import FireAnimation from "@/components/FireAnimation";
// import WaterAnimation from "@/components/WaterAnimation";

// interface Pokemon {
// 	name: string;
// 	description: string;
// 	detailedDescription: string[];
// 	image: string | null;
// }

// const grassPokemon: Pokemon[] = [
// 	{
// 		name: "Turtwig",
// 		description:
// 			"🌱 Hardworking and dependable. You prefer steady progress and stay grounded as you work towards your goals.",
// 		detailedDescription: [
// 			"You have a strong work ethic and are known for your reliability",
// 			"You prefer a methodical approach to problem-solving",
// 			"Your patience allows you to excel in long-term projects",
// 			"You have a calming presence that others find comforting",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Chikorita",
// 		description:
// 			"❤️ Kind and gentle. You create peace around you, love helping others, and feel happiest when everyone feels cared for.",
// 		detailedDescription: [
// 			"You have a natural ability to create harmony in any environment",
// 			"Your empathy allows you to understand and support others effectively",
// 			"You find joy in nurturing and helping others grow",
// 			"Your gentle nature makes you approachable and trustworthy",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Chespin",
// 		description:
// 			"🌟 Playful and optimistic. You spread joy easily and have a talent for turning tough situations into positive ones.",
// 		detailedDescription: [
// 			"Your optimism is contagious and uplifts those around you",
// 			"You have a knack for finding silver linings in difficult situations",
// 			"Your playful nature makes you adaptable and resilient",
// 			"You excel at bringing fun and lightheartedness to any task",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Treecko",
// 		description:
// 			"⚔️ Confident and self-assured. You trust your gut, like handling things solo, and aren't afraid of challenges.",
// 		detailedDescription: [
// 			"Your self-confidence allows you to take on challenges head-on",
// 			"You have a strong sense of independence and self-reliance",
// 			"Your intuition guides you well in decision-making",
// 			"You have a calm and collected demeanor, especially under pressure",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Bulbasaur",
// 		description:
// 			"🛡️ Loyal and reliable. You're the backbone of any group, not always in the spotlight, but always there when needed.",
// 		detailedDescription: [
// 			"Your unwavering loyalty makes you a trusted friend and ally",
// 			"You have a strong sense of duty and responsibility",
// 			"You provide stability and support in group dynamics",
// 			"Your reliability makes you an essential part of any team",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Snivy",
// 		description:
// 			"👑 Elegant and composed. You carry yourself proudly, value quality over quantity, and cherish meaningful friendships.",
// 		detailedDescription: [
// 			"You have a refined taste and appreciation for quality",
// 			"Your composure allows you to handle social situations with grace",
// 			"You value depth in relationships over superficial connections",
// 			"Your self-assurance inspires confidence in others",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Grookey",
// 		description:
// 			"🎶 Energetic and playful. You bring life to every moment, love having fun, and inspire others to join in.",
// 		detailedDescription: [
// 			"Your enthusiasm is infectious and motivates others",
// 			"You have a natural talent for bringing joy to any situation",
// 			"Your energetic nature keeps you always ready for new experiences",
// 			"You excel at creating a positive and lively atmosphere",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Rowlet",
// 		description:
// 			"🎯 Calm and thoughtful. You stay focused on your goals and aim to bring balance to every situation.",
// 		detailedDescription: [
// 			"Your calm demeanor helps you make rational decisions",
// 			"You have a talent for seeing the bigger picture in any situation",
// 			"Your thoughtful nature allows you to consider all perspectives",
// 			"You strive to create harmony and balance in your environment",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Sprigatito",
// 		description:
// 			"🎀 Playful and independent. You value your freedom, do things at your own pace, but enjoy connecting with others when it feels right.",
// 		detailedDescription: [
// 			"You cherish your independence and personal space",
// 			"Your playful nature makes you adaptable and fun-loving",
// 			"You have a unique ability to balance solitude and social interaction",
// 			"Your authenticity draws others to you naturally",
// 		],
// 		image: null,
// 	},
// ];

// const firePokemon: Pokemon[] = [
// 	{
// 		name: "Charmander",
// 		description:
// 			"🔥 Competitive and determined. You love proving yourself, thrive on challenges, and never give up, even when things get tough.",
// 		detailedDescription: [
// 			"Your competitive spirit drives you to constantly improve",
// 			"You have an unwavering determination that sees you through challenges",
// 			"Your resilience allows you to bounce back from setbacks",
// 			"You inspire others with your passion and drive",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Cyndaquil",
// 		description:
// 			"🧘‍♂️ Quiet and reserved. You prefer your own company but prove reliable in critical moments, especially during crises.",
// 		detailedDescription: [
// 			"Your quiet nature allows you to observe and understand situations deeply",
// 			"You have a hidden strength that emerges when it's most needed",
// 			"Your reliability in crucial moments makes you a valuable ally",
// 			"You have a calming presence that helps in high-stress situations",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Tepig",
// 		description:
// 			"🎉 Playful and lighthearted. You enjoy being with friends and making them laugh, but know when to be serious.",
// 		detailedDescription: [
// 			"Your playful nature brings joy and laughter to those around you",
// 			"You have a good balance between fun and responsibility",
// 			"Your ability to lighten the mood is appreciated in tense situations",
// 			"You know how to motivate others through positivity and humor",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Torchic",
// 		description:
// 			"💥 Optimistic and energetic. Your enthusiasm and positivity attract others and brighten up any room you're in.",
// 		detailedDescription: [
// 			"Your optimism helps you and others overcome obstacles",
// 			"You have a contagious energy that motivates those around you",
// 			"Your positive outlook makes you resilient in face of challenges",
// 			"You excel at bringing out the best in others",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Chimchar",
// 		description:
// 			"🎩 Mischievous and ambitious. You love trying new things and can bounce back from setbacks with a smile.",
// 		detailedDescription: [
// 			"Your mischievous nature keeps life exciting and unpredictable",
// 			"You have a strong drive to achieve your goals",
// 			"Your adaptability allows you to thrive in various situations",
// 			"You approach challenges with a positive and playful attitude",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Fennekin",
// 		description:
// 			"❔ Imaginative and curious. You have a creative streak and may seem delicate, but your determination surprises everyone.",
// 		detailedDescription: [
// 			"Your imagination allows you to come up with unique solutions",
// 			"You have a deep curiosity that drives you to explore and learn",
// 			"Your determination often exceeds others' expectations of you",
// 			"You have a gentle exterior that hides a strong, resilient core",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Scorbunny",
// 		description:
// 			"🏃 Competitive and full of excitement. Always on the move, you inspire others with your energy and can-do spirit.",
// 		detailedDescription: [
// 			"Your high energy levels keep you always ready for action",
// 			"You have a competitive drive that pushes you to excel",
// 			"Your enthusiasm is infectious and motivates those around you",
// 			"You approach every task with excitement and positivity",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Litten",
// 		description:
// 			"🎭 Independent and cool-headed. You prefer doing things your way and may seem distant, but close friends know your true abilities.",
// 		detailedDescription: [
// 			"Your independence allows you to forge your own path",
// 			"You have a calm demeanor that helps in crisis situations",
// 			"Your self-reliance makes you highly capable and resourceful",
// 			"You form deep, meaningful connections with those you trust",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Fuecoco",
// 		description:
// 			"🎈 Laid-back and carefree. You enjoy life at your own pace, but when something excites you, you dive in with all your heart.",
// 		detailedDescription: [
// 			"Your relaxed nature helps others feel at ease around you",
// 			"You have the ability to fully commit when truly passionate",
// 			"Your easy-going attitude helps you adapt to various situations",
// 			"You know how to balance work and leisure effectively",
// 		],
// 		image: null,
// 	},
// ];

// const waterPokemon: Pokemon[] = [
// 	{
// 		name: "Totodile",
// 		description:
// 			"💦 Energetic and enthusiastic. You love having fun, making others smile, and eagerly jump into new challenges.",
// 		detailedDescription: [
// 			"Your boundless energy keeps you always ready for new adventures",
// 			"You have a natural talent for cheering up others",
// 			"Your enthusiasm makes even mundane tasks exciting",
// 			"You approach challenges with a positive, can-do attitude",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Mudkip",
// 		description:
// 			"☺︎ Gentle and supportive. You're great at helping others through tough times and always know when to lend a hand.",
// 		detailedDescription: [
// 			"Your empathy allows you to understand and support others effectively",
// 			"You have a calming presence that soothes those around you",
// 			"Your supportive nature makes you a valued friend and team member",
// 			"You have an intuitive understanding of others' needs",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Piplup",
// 		description:
// 			"🎯 Proud and independent. You like doing things your way, enjoy your own company, but are deeply loyal to close friends.",
// 		detailedDescription: [
// 			"Your self-confidence allows you to stand up for your beliefs",
// 			"You have a strong sense of self and personal boundaries",
// 			"Your loyalty to close friends is unwavering and deep",
// 			"You have high standards for yourself and others",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Oshawott",
// 		description:
// 			"📈 Determined and cheerful. You bounce back quickly from setbacks and enjoy achieving goals one small step at a time.",
// 		detailedDescription: [
// 			"Your resilience helps you overcome obstacles with a positive attitude",
// 			"You have a talent for breaking down big goals into manageable steps",
// 			"Your cheerful nature keeps you motivated through challenges",
// 			"You inspire others with your persistent, upbeat approach",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Popplio",
// 		description:
// 			"🎤 Playful and expressive. You love performing and bringing joy to others, even when situations get difficult.",
// 		detailedDescription: [
// 			"Your expressive nature allows you to communicate effectively",
// 			"You have a talent for lightening the mood in tense situations",
// 			"Your love for performing brings out your confidence and creativity",
// 			"You find joy in making others happy and entertained",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Froakie",
// 		description:
// 			"🔍 Calm and observant. You keep your cool under pressure and notice details others miss, making you a great problem-solver.",
// 		detailedDescription: [
// 			"Your calm demeanor helps you think clearly in stressful situations",
// 			"You have a keen eye for detail that others often overlook",
// 			"Your observant nature gives you unique insights into problems",
// 			"You excel at finding creative solutions to complex issues",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Quaxly",
// 		description:
// 			"📏 Stylish and disciplined. You take pride in doing things properly, value self-improvement, and strive to be better every day.",
// 		detailedDescription: [
// 			"Your attention to detail shows in your appearance and work",
// 			"You have a strong drive for self-improvement and growth",
// 			"Your disciplined approach helps you achieve your goals efficiently",
// 			"You inspire others with your dedication and polish",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Squirtle",
// 		description:
// 			"🏄‍♂️ Laid-back and easygoing. You enjoy hanging out with friends and are always there to support them when they need you.",
// 		detailedDescription: [
// 			"Your relaxed nature helps others feel comfortable around you",
// 			"You have a talent for maintaining a balanced, stress-free life",
// 			"Your loyalty makes you a reliable friend in times of need",
// 			"You adapt easily to different social situations and groups",
// 		],
// 		image: null,
// 	},
// 	{
// 		name: "Sobble",
// 		description:
// 			"🎨 Sensitive and introspective. You feel things deeply and may seem shy, but you possess surprising emotional strength.",
// 		detailedDescription: [
// 			"Your sensitivity allows you to understand complex emotions",
// 			"You have a rich inner world that fuels your creativity",
// 			"Your introspective nature gives you deep insights into yourself and others",
// 			"You have hidden reserves of strength that surprise others",
// 		],
// 		image: null,
// 	},
// ];

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
// 		<span className="ml-2 text-sm text-purple-700">
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

// const Tooltip = ({ content }: { content: string[] }) => (
// 	<div
// 		className="absolute z-[99999] p-2 mb-[-10rem] ml-[-10rem] bg-white rounded shadow-lg text-sm w-64 top-0 left-0 transform -translate-y-full text-gray-800"
// 		style={{ zIndex: 99999, pointerEvents: "none" }}
// 	>
// 		<ul className="list-disc pl-4">
// 			{content.map((item, index) => (
// 				<li key={index}>{item}</li>
// 			))}
// 		</ul>
// 	</div>
// );

// const NavigationButtons = ({
// 	onBack,
// 	onForward,
// 	canGoBack,
// 	canGoForward,
// }: {
// 	onBack: () => void;
// 	onForward: () => void;
// 	canGoBack: boolean;
// 	canGoForward: boolean;
// }) => (
// 	<div className="flex justify-between mt-4">
// 		{canGoBack && (
// 			<button
// 				onClick={onBack}
// 				className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
// 			>
// 				Back
// 			</button>
// 		)}
// 		<button
// 			onClick={onForward}
// 			disabled={!canGoForward}
// 			className={`px-4 py-2 rounded ${
// 				canGoForward ? "bg-green-500 hover:bg-green-600" : "bg-gray-300"
// 			} text-white`}
// 		>
// 			{canGoForward ? "Next" : "Confirm"}
// 		</button>
// 	</div>
// );

// export default function QuizPage() {
// 	// State variables
// 	const [stage, setStage] = useState<
// 		"start" | "grass" | "fire" | "water" | "result"
// 	>("start");
// 	const [remainingGrass, setRemainingGrass] = useState(grassPokemon);
// 	const [remainingFire, setRemainingFire] = useState(firePokemon);
// 	const [remainingWater, setRemainingWater] = useState(waterPokemon);

// 	const [eliminationHistory, setEliminationHistory] = useState<
// 		{ type: string; pokemon: Pokemon }[]
// 	>([]);

// 	const [isAudioPlaying, setIsAudioPlaying] = useState(false);
// 	const [showConfetti, setShowConfetti] = useState(false);
// 	const [openPokeballs, setOpenPokeballs] = useState(false);
// 	const [showTooltip, setShowTooltip] = useState<{
// 		type: string;
// 		index: number;
// 	} | null>(null);

// 	const [teamSummary, setTeamSummary] = useState<string>("");
// 	const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);

// 	const [shareLink, setShareLink] = useState<string | null>(null);
// 	const [isSharing, setIsSharing] = useState<boolean>(false);

// 	const [trainerName, setTrainerName] = useState<string>("");
// 	const [isNamePromptVisible, setIsNamePromptVisible] =
// 		useState<boolean>(false);

// 	const legendAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const grassAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const fireAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const waterAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const eliminateAudioRef = useRef<HTMLAudioElement | null>(null);
// 	const sendingOffAudioRef = useRef<HTMLAudioElement | null>(null);

// 	// Function to handle sharing the results
// 	const handleShareResults = async () => {
// 		if (!trainerName.trim()) {
// 			alert("Please enter your name before sharing your results.");
// 			return;
// 		}

// 		setIsSharing(true);

// 		// Prepare the data to be saved
// 		const grassPokemons = rankOrder("grass");
// 		const firePokemons = rankOrder("fire");
// 		const waterPokemons = rankOrder("water");

// 		try {
// 			const response = await fetch("/api/save-results", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({
// 					trainerName,
// 					grassPokemon: grassPokemons,
// 					firePokemon: firePokemons,
// 					waterPokemon: waterPokemons,
// 					teamSummary,
// 				}),
// 			});

// 			const data = await response.json();

// 			if (response.ok) {
// 				// Generate the shareable link
// 				const link = `${window.location.origin}/share/${data.id}`;
// 				setShareLink(link);
// 				setIsNamePromptVisible(false);
// 			} else {
// 				console.error("Error saving results:", data.error);
// 			}
// 		} catch (error) {
// 			console.error("Error saving results:", error);
// 		} finally {
// 			setIsSharing(false);
// 		}
// 	};

// 	useEffect(() => {
// 		// Initialize audio references
// 		legendAudioRef.current = new Audio("/legend.mp3");
// 		grassAudioRef.current = new Audio("/grass.mp3");
// 		fireAudioRef.current = new Audio("/fire.mp3");
// 		waterAudioRef.current = new Audio("/water.mp3");
// 		eliminateAudioRef.current = new Audio("/eliminate.mp3");
// 		sendingOffAudioRef.current = new Audio("/sending-off.mp3");

// 		legendAudioRef.current.loop = true;

// 		return () => {
// 			// Clean up audio on unmount
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

// 	useEffect(() => {
// 		if (stage === "result") {
// 			setShowConfetti(true);
// 			setTimeout(() => {
// 				setOpenPokeballs(true);
// 			}, 1000);
// 			setTimeout(() => setShowConfetti(false), 5000);

// 			if (sendingOffAudioRef.current) {
// 				sendingOffAudioRef.current
// 					.play()
// 					.catch((error) =>
// 						console.error(
// 							"Sending-off audio playback failed:",
// 							error
// 						)
// 					);
// 			}

// 			// Generate team summary
// 			handleGenerateSummary();
// 		}
// 	}, [stage]);

// 	const toggleAudio = () => {
// 		if (legendAudioRef.current) {
// 			if (isAudioPlaying) {
// 				legendAudioRef.current.pause();
// 				grassAudioRef.current?.pause();
// 				fireAudioRef.current?.pause();
// 				waterAudioRef.current?.pause();
// 			} else {
// 				legendAudioRef.current
// 					.play()
// 					.catch((error) =>
// 						console.error("Audio playback failed:", error)
// 					);
// 				grassAudioRef.current
// 					?.play()
// 					.catch((error) =>
// 						console.error("Grass audio playback failed:", error)
// 					);
// 				fireAudioRef.current
// 					?.play()
// 					.catch((error) =>
// 						console.error("Fire audio playback failed:", error)
// 					);
// 				waterAudioRef.current
// 					?.play()
// 					.catch((error) =>
// 						console.error("Water audio playback failed:", error)
// 					);
// 			}
// 			setIsAudioPlaying(!isAudioPlaying);
// 		}
// 	};

// 	const playStageAudio = (stageType: "grass" | "fire" | "water") => {
// 		const audioRef = {
// 			grass: grassAudioRef,
// 			fire: fireAudioRef,
// 			water: waterAudioRef,
// 		}[stageType];

// 		if (audioRef.current) {
// 			audioRef.current
// 				.play()
// 				.catch((error) =>
// 					console.error(`${stageType} audio playback failed:`, error)
// 				);
// 		}
// 	};

// 	const startQuiz = () => {
// 		setStage("grass");
// 		if (legendAudioRef.current && grassAudioRef.current) {
// 			legendAudioRef.current
// 				.play()
// 				.catch((error) =>
// 					console.error("Audio playback failed:", error)
// 				);
// 			grassAudioRef.current
// 				.play()
// 				.catch((error) =>
// 					console.error("Grass audio playback failed:", error)
// 				);
// 			setIsAudioPlaying(true);
// 		}
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

// 		let newRemaining: Pokemon[];
// 		let setRemaining: React.Dispatch<React.SetStateAction<Pokemon[]>>;
// 		let currentPokemon: Pokemon | undefined;

// 		if (type === "grass") {
// 			currentPokemon = remainingGrass[index];
// 			newRemaining = remainingGrass.filter((_, i) => i !== index);
// 			setRemaining = setRemainingGrass;
// 		} else if (type === "fire") {
// 			currentPokemon = remainingFire[index];
// 			newRemaining = remainingFire.filter((_, i) => i !== index);
// 			setRemaining = setRemainingFire;
// 		} else {
// 			currentPokemon = remainingWater[index];
// 			newRemaining = remainingWater.filter((_, i) => i !== index);
// 			setRemaining = setRemainingWater;
// 		}

// 		if (currentPokemon) {
// 			setRemaining(newRemaining);
// 			setEliminationHistory([
// 				...eliminationHistory,
// 				{ type, pokemon: currentPokemon },
// 			]);

// 			if (newRemaining.length === 0) {
// 				// Proceed to next stage
// 				if (type === "grass") {
// 					setStage("fire");
// 					playStageAudio("fire");
// 				} else if (type === "fire") {
// 					setStage("water");
// 					playStageAudio("water");
// 				} else {
// 					setStage("result");
// 					if (legendAudioRef.current) {
// 						legendAudioRef.current.pause();
// 					}
// 					if (sendingOffAudioRef.current) {
// 						sendingOffAudioRef.current
// 							.play()
// 							.catch((error) =>
// 								console.error(
// 									"Sending off audio playback failed:",
// 									error
// 								)
// 							);
// 					}
// 				}
// 			}
// 		}
// 	};

// 	const handleUndo = () => {
// 		if (eliminationHistory.length === 0) return;

// 		const lastElimination =
// 			eliminationHistory[eliminationHistory.length - 1];
// 		setEliminationHistory(eliminationHistory.slice(0, -1));

// 		const { type, pokemon } = lastElimination;

// 		if (type === "grass") {
// 			const newRemainingGrass = [...remainingGrass, pokemon];
// 			setRemainingGrass(newRemainingGrass);

// 			if (stage !== "grass" && newRemainingGrass.length > 0) {
// 				setStage("grass");
// 			}
// 		} else if (type === "fire") {
// 			const newRemainingFire = [...remainingFire, pokemon];
// 			setRemainingFire(newRemainingFire);

// 			if (stage !== "fire" && newRemainingFire.length > 0) {
// 				setStage("fire");
// 			}
// 		} else {
// 			const newRemainingWater = [...remainingWater, pokemon];
// 			setRemainingWater(newRemainingWater);

// 			if (stage !== "water" && newRemainingWater.length > 0) {
// 				setStage("water");
// 			}
// 		}
// 	};

// 	const handleBack = () => {
// 		if (stage === "fire") {
// 			setStage("grass");
// 			playStageAudio("grass");
// 		} else if (stage === "water") {
// 			setStage("fire");
// 			playStageAudio("fire");
// 		}
// 	};

// 	const handleForward = () => {
// 		if (stage === "grass" && remainingGrass.length === 0) {
// 			setStage("fire");
// 			playStageAudio("fire");
// 		} else if (stage === "fire" && remainingFire.length === 0) {
// 			setStage("water");
// 			playStageAudio("water");
// 		} else if (stage === "water" && remainingWater.length === 0) {
// 			setStage("result");
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
// 		const canEliminate = pokemonList.length > 0;

// 		return (
// 			<motion.div
// 				initial={{ opacity: 0 }}
// 				animate={{ opacity: 1 }}
// 				exit={{ opacity: 0 }}
// 				className="grid grid-cols-1 md:grid-cols-3 gap-4 relative overflow-visible"
// 			>
// 				{pokemonList.map((pokemon, index) => (
// 					<motion.div
// 						key={index}
// 						initial={{ opacity: 0, y: 50 }}
// 						animate={{ opacity: 1, y: 0 }}
// 						exit={{ opacity: 0, y: -50 }}
// 						transition={{ duration: 0.5, delay: index * 0.1 }}
// 						className={`relative flex flex-col items-center ${styles.background} ${styles.border} border shadow-md rounded-lg p-4`}
// 						style={{
// 							zIndex: 0,
// 							position: "relative",
// 							overflow: "visible",
// 						}}
// 					>
// 						<p className={`text-sm ${styles.text}`}>
// 							{pokemon.description}
// 						</p>
// 						<div
// 							className="relative mt-2 z-[9999]"
// 							style={{
// 								position: "relative",
// 								overflow: "visible",
// 							}}
// 						>
// 							<button
// 								onMouseEnter={() =>
// 									setShowTooltip({ type, index })
// 								}
// 								onMouseLeave={() => setShowTooltip(null)}
// 								className="text-blue-500 hover:text-blue-600"
// 								style={{ zIndex: 10000, position: "relative" }}
// 							>
// 								ℹ️
// 							</button>
// 							{showTooltip?.type === type &&
// 								showTooltip?.index === index && (
// 									<div className="relative z-[99999]">
// 										<Tooltip
// 											content={
// 												pokemon.detailedDescription
// 											}
// 										/>
// 									</div>
// 								)}
// 						</div>
// 						{canEliminate && (
// 							<motion.button
// 								onClick={() => handleEliminate(type, index)}
// 								className={`mt-4 px-4 py-2 ${styles.button} text-white rounded-lg transition`}
// 								whileHover={{ scale: 1.1 }}
// 								whileTap={{ scale: 0.9 }}
// 							>
// 								Eliminate
// 							</motion.button>
// 						)}
// 					</motion.div>
// 				))}
// 			</motion.div>
// 		);
// 	};

// 	const rankOrder = (type: string) => {
// 		const eliminatedPokemons = eliminationHistory
// 			.filter((entry) => entry.type === type)
// 			.map((entry) => entry.pokemon);
// 		const lastThreeEliminated = eliminatedPokemons.slice(-3).reverse();
// 		return lastThreeEliminated;
// 	};

// 	// Function to generate team summary by calling the API endpoint
// 	const handleGenerateSummary = async () => {
// 		setIsLoadingSummary(true);

// 		const allPokemon = ["grass", "fire", "water"].flatMap((type) => {
// 			const pokemons = rankOrder(type);
// 			return pokemons.map((pokemon) => ({
// 				name: pokemon.name,
// 				detailedDescription: pokemon.detailedDescription,
// 			}));
// 		});

// 		const prompt = `
// You are a Pokémon trainer who has just assembled a team of starter Pokémon based on their personality traits. Summarize the team's characteristics and how they complement each other in a cohesive and inspiring way. The team consists of the following Pokémon:

// ${allPokemon
// 	.map(
// 		(pokemon) =>
// 			`${pokemon.name}: ${pokemon.detailedDescription.join("; ")}`
// 	)
// 	.join("\n\n")}

// Provide an uplifting summary that highlights the strengths and synergy of the team. Make sure to complete your last sentence.
// `;

// 		try {
// 			const response = await fetch("/api/pokemon/generate-team-summary", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
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
// 							{isLoadingSummary ? (
// 								<div className="text-center mb-6">
// 									<p className="text-lg font-semibold text-gray-700">
// 										Generating your team summary...
// 									</p>
// 								</div>
// 							) : (
// 								teamSummary && (
// 									<div className="bg-white p-6 rounded-lg shadow-md mb-6">
// 										<h2 className="text-2xl font-bold mb-4 text-center text-purple-800 text-purple-700">
// 											Your Pokémon Starter Team Summary
// 										</h2>
// 										<p className="text-gray-800 text-justify">
// 											{teamSummary}
// 										</p>
// 									</div>
// 								)
// 							)}

// 							<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
// 								Your Pokémon Starters Are:
// 							</h2>
// 							<div className="flex flex-wrap justify-center gap-4 mt-6">
// 								{["grass", "fire", "water"].map(
// 									(type, typeIndex) => {
// 										const pokemonList = rankOrder(type);
// 										const styles = getTypeStyles(
// 											type as "grass" | "fire" | "water"
// 										);

// 										return pokemonList.map(
// 											(pokemon, index) => {
// 												const rank =
// 													index === 0
// 														? "Most Like"
// 														: index === 1
// 														? "Runner-up"
// 														: "Can Relate To";
// 												return (
// 													<motion.div
// 														key={`${type}-${index}`}
// 														initial={{
// 															opacity: 0,
// 															y: 50,
// 														}}
// 														animate={{
// 															opacity: 1,
// 															y: 0,
// 														}}
// 														transition={{
// 															duration: 0.5,
// 															delay:
// 																(typeIndex * 3 +
// 																	index) *
// 																0.1,
// 														}}
// 														className={`flex flex-col items-center ${styles.background} ${styles.border} border shadow-md rounded-lg p-4 w-full md:w-64`}
// 													>
// 														<Pokeball
// 															isOpen={
// 																openPokeballs
// 															}
// 														>
// 															{pokemon?.image && (
// 																<Image
// 																	src={
// 																		pokemon.image
// 																	}
// 																	alt={
// 																		pokemon.name ||
// 																		"Pokemon"
// 																	}
// 																	className="rounded-md"
// 																	width={200}
// 																	height={200}
// 																/>
// 															)}
// 														</Pokeball>

// 														<h2
// 															className={`text-lg md:text-xl font-semibold mt-2 ${styles.text}`}
// 														>
// 															{styles.emoji}{" "}
// 															{pokemon?.name}
// 														</h2>
// 														<p
// 															className={`text-xs md:text-sm ${styles.text} mt-2`}
// 														>
// 															{
// 																pokemon?.description
// 															}
// 														</p>
// 														<span className="mt-2 text-xs font-bold text-purple-600">
// 															{rank} - #
// 															{index + 1}
// 														</span>
// 													</motion.div>
// 												);
// 											}
// 										);
// 									}
// 								)}
// 							</div>

// 							{/* Share Results Button */}
// 							<div className="text-center mt-6">
// 								{stage === "result" && (
// 									<div className="text-center mt-6">
// 										{!shareLink ? (
// 											<>
// 												{isNamePromptVisible ? (
// 													<div className="mt-4">
// 														<input
// 															type="text"
// 															placeholder="Enter your name"
// 															value={trainerName}
// 															onChange={(e) =>
// 																setTrainerName(
// 																	e.target
// 																		.value
// 																)
// 															}
// 															className="px-4 py-2 border rounded-lg mr-2 text-purple-700"
// 														/>
// 														<button
// 															onClick={
// 																handleShareResults
// 															}
// 															className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white"
// 														>
// 															{isSharing
// 																? "Sharing..."
// 																: "Confirm"}
// 														</button>
// 													</div>
// 												) : (
// 													<button
// 														onClick={() =>
// 															setIsNamePromptVisible(
// 																true
// 															)
// 														}
// 														className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white"
// 													>
// 														Share Your Results
// 													</button>
// 												)}
// 											</>
// 										) : (
// 											<div className="mt-4">
// 												<p className="text-green-600 font-semibold">
// 													Share this link to show your
// 													results:
// 												</p>
// 												<a
// 													href={shareLink}
// 													className="text-blue-500 underline"
// 												>
// 													{shareLink}
// 												</a>
// 											</div>
// 										)}
// 									</div>
// 								)}
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

// 							{stage !== "start" && (
// 								<div className="mt-8">
// 									{eliminationHistory.length > 0 && (
// 										<button
// 											onClick={handleUndo}
// 											className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white mr-4"
// 										>
// 											Undo Last Elimination
// 										</button>
// 									)}

// 									<NavigationButtons
// 										onBack={handleBack}
// 										onForward={handleForward}
// 										canGoBack={
// 											stage === "fire" ||
// 											stage === "water"
// 										}
// 										canGoForward={
// 											(stage === "grass" &&
// 												remainingGrass.length === 0) ||
// 											(stage === "fire" &&
// 												remainingFire.length === 0) ||
// 											(stage === "water" &&
// 												remainingWater.length === 0)
// 										}
// 									/>
// 								</div>
// 							)}
// 						</motion.div>
// 					)}
// 				</AnimatePresence>
// 			</div>
// 		</div>
// 	);
// }
//OG

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
				<div
					className="absolute top-2 left-2 cursor-pointer z-20"
					onMouseEnter={() => setShowTooltip(true)}
					onMouseLeave={() => setShowTooltip(false)}
				>
					ℹ️
					{showTooltip && <Tooltip content={pokemon.traits} />}
				</div>
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

// const PokemonResults = ({
// 	getWinners,
// }: {
// 	getWinners: () => {
// 		grass: Pokemon[];
// 		fire: Pokemon[];
// 		water: Pokemon[];
// 	};
// }) => {
// 	const winners = getWinners();
// 	const types = ["grass", "fire", "water"] as const;
// 	const ranks = ["Your Top Match!", "Runner Up", "Can Relate To"] as const;

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
// 		<div className="w-full max-w-6xl mx-auto">
// 			<h2 className="text-3xl font-bold text-center mb-8 text-purple-900">
// 				Your Pokémon Starters Are:
// 			</h2>
// 			<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
