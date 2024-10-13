// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";

// interface Pokemon {
// 	name: string;
// 	description: string;
// 	image: string | null;
// }

// const grassPokemon: Pokemon[] = [
// 	{
// 		name: "Turtwig",
// 		description:
// 			"Hardworking and dependable. You stay grounded and prefer slow but steady progress toward your goals.",
// 		image: null,
// 	},
// 	{
// 		name: "Chikorita",
// 		description:
// 			"Kind and gentle. You bring peace, enjoy helping others, and are happiest when everyone around you feels cared for.",
// 		image: null,
// 	},
// 	{
// 		name: "Chespin",
// 		description:
// 			"Playful and optimistic. You enjoy spreading joy and are always ready to turn a bad situation around.",
// 		image: null,
// 	},
// 	{
// 		name: "Treecko",
// 		description:
// 			"Confident and self-assured. Trusting your instincts, you prefer to handle things on your own and don’t shy away from challenges.",
// 		image: null,
// 	},
// 	{
// 		name: "Bulbasaur",
// 		description:
// 			"Loyal and reliable. The backbone of any group. May not always take center stage, but others know they can always count on you.",
// 		image: null,
// 	},
// 	{
// 		name: "Snivy",
// 		description:
// 			"Elegant and composed. You carry yourself with pride. You prefer quality over quantity and value thoughtful friendships.",
// 		image: null,
// 	},
// 	{
// 		name: "Grookey",
// 		description:
// 			"Energetic and playful. Bringing life to every situation, you enjoy having fun and encourage others to do the same.",
// 		image: null,
// 	},
// 	{
// 		name: "Rowlet",
// 		description:
// 			"Calm and thoughtful. You enjoy observing the world around you and people appreciate your quiet wisdom and sense of balance.",
// 		image: null,
// 	},
// 	{
// 		name: "Sprigatito",
// 		description:
// 			"Playful and independent. You value freedom and do things at your own pace but love connecting with others when the time feels right.",
// 		image: null,
// 	},
// ];

// const firePokemon: Pokemon[] = [
// 	{
// 		name: "Charmander",
// 		description:
// 			"Competitive and determined. With a desire to prove yourself, you thrive in challenges and never back down, even when things get tough.",
// 		image: null,
// 	},
// 	{
// 		name: "Cyndaquil",
// 		description:
// 			"Quiet and reserved. You prefer to keep to yourself but are reliable when needed, especially in moments of crisis.",
// 		image: null,
// 	},
// 	{
// 		name: "Tepig",
// 		description:
// 			"Playful and lighthearted. You love being around friends and making them laugh but will take things seriously when needed.",
// 		image: null,
// 	},
// 	{
// 		name: "Torchic",
// 		description:
// 			"Optimistic and energetic. People gravitate toward your enthusiasm and positivity, which lights up every room.",
// 		image: null,
// 	},
// 	{
// 		name: "Chimchar",
// 		description:
// 			"Mischievous and ambitious. You love trying new things and have a knack for bouncing back from failure with a smile.",
// 		image: null,
// 	},
// 	{
// 		name: "Fennekin",
// 		description:
// 			"Imaginative and curious. You enjoy creativity and may seem delicate, but your determination surprises everyone.",
// 		image: null,
// 	},
// 	{
// 		name: "Scorbunny",
// 		description:
// 			"Competitive and full of excitement. Always moving, you inspire others with your energy and can-do attitude.",
// 		image: null,
// 	},
// 	{
// 		name: "Litten",
// 		description:
// 			"Independent and cool-headed. Preferring to do things your way, you may seem distant, but those close to you know about your abilities.",
// 		image: null,
// 	},
// 	{
// 		name: "Fuecoco",
// 		description:
// 			"Laid-back and carefree. Enjoying life at your own pace, when something excites you, you jump in wholeheartedly.",
// 		image: null,
// 	},
// ];

// const waterPokemon: Pokemon[] = [
// 	{
// 		name: "Totodile",
// 		description:
// 			"Energetic and enthusiastic. You love having fun, making others smile, and enjoy diving headfirst into challenges.",
// 		image: null,
// 	},
// 	{
// 		name: "Mudkip",
// 		description:
// 			"Gentle and supportive. Great at helping others in tough times, you always seem to know when to offer a helping hand.",
// 		image: null,
// 	},
// 	{
// 		name: "Piplup",
// 		description:
// 			"Proud and independent. Preferring to do things your way, you enjoy your own company but are fiercely loyal to those you care about.",
// 		image: null,
// 	},
// 	{
// 		name: "Oshawott",
// 		description:
// 			"Determined and cheerful. You have a way of bouncing back from failure and enjoy setting small goals to achieve one by one.",
// 		image: null,
// 	},
// 	{
// 		name: "Popplio",
// 		description:
// 			"Playful and expressive. You love performing and entertaining others to bring joy to everyone around you, even in tough situations.",
// 		image: null,
// 	},
// 	{
// 		name: "Froakie",
// 		description:
// 			"Calm and observant. You stay cool under pressure, and often notice things others miss, giving you an edge when problem-solving.",
// 		image: null,
// 	},
// 	{
// 		name: "Quaxly",
// 		description:
// 			"Stylish and disciplined. You take pride in doing things the right way. You value personal growth and strive to improve every day.",
// 		image: null,
// 	},
// 	{
// 		name: "Squirtle",
// 		description:
// 			"Laid-back and easygoing. You enjoy spending time with friends and are always there when they need you.",
// 		image: null,
// 	},
// 	{
// 		name: "Sobble",
// 		description:
// 			"Sensitive and introspective. You feel things deeply. You may seem shy, but you show remarkable emotional strength.",
// 		image: null,
// 	},
// ];

// export default function QuizPage() {
// 	const [stage, setStage] = useState<"grass" | "fire" | "water" | "result">(
// 		"grass"
// 	);
// 	const [remainingGrass, setRemainingGrass] = useState(grassPokemon);
// 	const [remainingFire, setRemainingFire] = useState(firePokemon);
// 	const [remainingWater, setRemainingWater] = useState(waterPokemon);

// 	const [finalGrass, setFinalGrass] = useState<Pokemon | null>(null);
// 	const [finalFire, setFinalFire] = useState<Pokemon | null>(null);
// 	const [finalWater, setFinalWater] = useState<Pokemon | null>(null);

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
// 		if (type === "grass") {
// 			const newGrass = remainingGrass.filter((_, i) => i !== index);
// 			setRemainingGrass(newGrass);
// 			if (newGrass.length === 1) {
// 				setFinalGrass(newGrass[0]);
// 				setStage("fire"); // Move to the fire stage after grass
// 			}
// 		} else if (type === "fire") {
// 			const newFire = remainingFire.filter((_, i) => i !== index);
// 			setRemainingFire(newFire);
// 			if (newFire.length === 1) {
// 				setFinalFire(newFire[0]);
// 				setStage("water"); // Move to the water stage after fire
// 			}
// 		} else if (type === "water") {
// 			const newWater = remainingWater.filter((_, i) => i !== index);
// 			setRemainingWater(newWater);
// 			if (newWater.length === 1) {
// 				setFinalWater(newWater[0]);
// 				setStage("result"); // Move to the result stage after water
// 			}
// 		}
// 	};

// 	const renderOptions = (
// 		type: "grass" | "fire" | "water",
// 		pokemonList: Pokemon[]
// 	) => (
// 		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// 			{pokemonList.map((pokemon, index) => (
// 				<div
// 					key={index}
// 					className="flex flex-col items-center bg-white shadow-md rounded-lg p-4"
// 				>
// 					<p className="text-sm text-gray-600">
// 						{pokemon.description}
// 					</p>
// 					<button
// 						onClick={() => handleEliminate(type, index)}
// 						className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
// 					>
// 						Eliminate
// 					</button>
// 				</div>
// 			))}
// 		</div>
// 	);

// 	if (stage === "result") {
// 		return (
// 			<div className="text-center mt-8">
// 				<h1 className="text-3xl font-bold">
// 					Your Pokémon Starters Are:
// 				</h1>
// 				<div className="flex justify-center gap-8 mt-6">
// 					<div className="flex flex-col items-center">
// 						<Image
// 							src={finalGrass?.image || ""}
// 							alt={finalGrass?.name}
// 							width={150}
// 							height={150}
// 							className="rounded-md"
// 						/>
// 						<h2 className="text-xl font-semibold mt-2">
// 							{finalGrass?.name}
// 						</h2>
// 						<p className="text-sm text-gray-600">
// 							{finalGrass?.description}
// 						</p>
// 					</div>
// 					<div className="flex flex-col items-center">
// 						<Image
// 							src={finalFire?.image || ""}
// 							alt={finalFire?.name}
// 							width={150}
// 							height={150}
// 							className="rounded-md"
// 						/>
// 						<h2 className="text-xl font-semibold mt-2">
// 							{finalFire?.name}
// 						</h2>
// 						<p className="text-sm text-gray-600">
// 							{finalFire?.description}
// 						</p>
// 					</div>
// 					<div className="flex flex-col items-center">
// 						<Image
// 							src={finalWater?.image || ""}
// 							alt={finalWater?.name}
// 							width={150}
// 							height={150}
// 							className="rounded-md"
// 						/>
// 						<h2 className="text-xl font-semibold mt-2">
// 							{finalWater?.name}
// 						</h2>
// 						<p className="text-sm text-gray-600">
// 							{finalWater?.description}
// 						</p>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="max-w-4xl mx-auto p-8">
// 			<h1 className="text-2xl font-bold mb-6">
// 				{stage === "grass" && "Choose Your Grass Pokémon"}
// 				{stage === "fire" && "Choose Your Fire Pokémon"}
// 				{stage === "water" && "Choose Your Water Pokémon"}
// 			</h1>
// 			<div className="space-y-8">
// 				{stage === "grass" && renderOptions("grass", remainingGrass)}
// 				{stage === "fire" && renderOptions("fire", remainingFire)}
// 				{stage === "water" && renderOptions("water", remainingWater)}
// 			</div>
// 		</div>
// 	);
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Pokemon {
	name: string;
	description: string;
	image: string | null;
}

const grassPokemon: Pokemon[] = [
	{
		name: "Turtwig",
		description:
			"Patient and reliable, you're the steady rock others lean on. You tackle challenges methodically, preferring slow but sure progress.",
		image: null,
	},
	{
		name: "Chikorita",
		description:
			"Your nurturing spirit creates harmony wherever you go. You find joy in supporting others and your presence is a calming influence.",
		image: null,
	},
	{
		name: "Chespin",
		description:
			"Optimistic and resilient, you're a natural mood-lifter. You excel at finding silver linings and turning setbacks into opportunities.",
		image: null,
	},
	{
		name: "Treecko",
		description:
			"Cool and confident, you let your actions speak louder than words. Your sharp mind and quick reflexes make you invaluable in crunch time.",
		image: null,
	},
	{
		name: "Bulbasaur",
		description:
			"A perfect blend of strength and compassion, you're the go-to friend in times of need. Your loyalty makes you an irreplaceable team member.",
		image: null,
	},
	{
		name: "Snivy",
		description:
			"Graceful and composed, you set high standards that inspire others. Beneath your cool exterior lies a deeply loyal and caring friend.",
		image: null,
	},
	{
		name: "Grookey",
		description:
			"Bursting with energy and creativity, you bring rhythm to life. Your talent for lifting spirits turns even dull moments into celebrations.",
		image: null,
	},
	{
		name: "Rowlet",
		description:
			"Wise and observant, you see the big picture. Your calm demeanor in chaos makes you the one friends turn to for thoughtful advice.",
		image: null,
	},
	{
		name: "Sprigatito",
		description:
			"Independent yet caring, you march to your own beat. You have a gift for making others feel special, even as you value your personal space.",
		image: null,
	},
];

const firePokemon: Pokemon[] = [
	{
		name: "Charmander",
		description:
			"Your fierce determination makes you a natural leader. You thrive on challenges and inspire others with your courage and warm heart.",
		image: null,
	},
	{
		name: "Cyndaquil",
		description:
			"Quiet strength defines you. In crises, your inner fire flares up, revealing a dependable ally who shines brightest when needed most.",
		image: null,
	},
	{
		name: "Tepig",
		description:
			"Your sunny disposition makes you the life of any gathering. You bring out the best in others with your warmth and know when to get serious.",
		image: null,
	},
	{
		name: "Torchic",
		description:
			"Radiating warmth and optimism, you're a beacon of positivity. Your enthusiasm is contagious, inspiring others to exceed their limits.",
		image: null,
	},
	{
		name: "Chimchar",
		description:
			"Curiosity drives your adventurous spirit. Quick-witted and resilient, you find creative solutions where others see dead ends.",
		image: null,
	},
	{
		name: "Fennekin",
		description:
			"Your vivid imagination makes you captivating. Seemingly delicate, your inner fire fuels a surprising determination to overcome obstacles.",
		image: null,
	},
	{
		name: "Scorbunny",
		description:
			"Boundless energy and enthusiasm define you. Your go-getter attitude turns every task into an exciting challenge to be conquered.",
		image: null,
	},
	{
		name: "Litten",
		description:
			"Cool exterior, fierce interior. You prefer independence but fiercely protect your loved ones. Your calm mind excels under pressure.",
		image: null,
	},
	{
		name: "Fuecoco",
		description:
			"Easygoing yet passionate, you're a joy to be around. When something sparks your interest, your dedication becomes unmatched.",
		image: null,
	},
];

const waterPokemon: Pokemon[] = [
	{
		name: "Totodile",
		description:
			"Your zest for life is contagious. With endless energy and a mischievous spirit, you turn every day into a joyful adventure.",
		image: null,
	},
	{
		name: "Mudkip",
		description:
			"Intuitive and compassionate, you're a pillar of support. Your calming presence and helping nature nurture growth in others.",
		image: null,
	},
	{
		name: "Piplup",
		description:
			"Pride and loyalty are your core traits. Your determination to excel inspires others, revealing a deep capacity for love and devotion.",
		image: null,
	},
	{
		name: "Oshawott",
		description:
			"Cheerful and resilient, you approach challenges with a smile. Your ability to celebrate small wins inspires positivity in others.",
		image: null,
	},
	{
		name: "Popplio",
		description:
			"Born entertainer with a flair for the dramatic. Beyond your showmanship lies a deep empathy that forges profound connections.",
		image: null,
	},
	{
		name: "Froakie",
		description:
			"Quiet observer with a sharp, analytical mind. Your calm under pressure and innovative thinking make you an invaluable problem-solver.",
		image: null,
	},
	{
		name: "Quaxly",
		description:
			"Meticulous and refined, you appreciate order and beauty. Your commitment to personal growth inspires others to strive for excellence.",
		image: null,
	},
	{
		name: "Squirtle",
		description:
			"Easygoing and adaptable, you're a friend to all. In tough times, your hidden strength emerges, helping others weather any storm.",
		image: null,
	},
	{
		name: "Sobble",
		description:
			"Sensitive soul with deep emotional intelligence. Your unique perspective and empathy make you a natural at understanding complex feelings.",
		image: null,
	},
];

export default function QuizPage() {
	const [stage, setStage] = useState<"grass" | "fire" | "water" | "result">(
		"grass"
	);
	const [remainingGrass, setRemainingGrass] = useState(grassPokemon);
	const [remainingFire, setRemainingFire] = useState(firePokemon);
	const [remainingWater, setRemainingWater] = useState(waterPokemon);

	const [finalGrass, setFinalGrass] = useState<Pokemon | null>(null);
	const [finalFire, setFinalFire] = useState<Pokemon | null>(null);
	const [finalWater, setFinalWater] = useState<Pokemon | null>(null);

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
		if (type === "grass") {
			const newGrass = remainingGrass.filter((_, i) => i !== index);
			setRemainingGrass(newGrass);
			if (newGrass.length === 1) {
				setFinalGrass(newGrass[0]);
				setStage("fire");
			}
		} else if (type === "fire") {
			const newFire = remainingFire.filter((_, i) => i !== index);
			setRemainingFire(newFire);
			if (newFire.length === 1) {
				setFinalFire(newFire[0]);
				setStage("water");
			}
		} else if (type === "water") {
			const newWater = remainingWater.filter((_, i) => i !== index);
			setRemainingWater(newWater);
			if (newWater.length === 1) {
				setFinalWater(newWater[0]);
				setStage("result");
			}
		}
	};

	const renderOptions = (
		type: "grass" | "fire" | "water",
		pokemonList: Pokemon[]
	) => (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			{pokemonList.map((pokemon, index) => (
				<div
					key={index}
					className="flex flex-col items-center bg-white shadow-md rounded-lg p-4"
				>
					<p className="text-sm text-gray-600">
						{pokemon.description}
					</p>
					<button
						onClick={() => handleEliminate(type, index)}
						className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
					>
						Eliminate
					</button>
				</div>
			))}
		</div>
	);

	if (stage === "result") {
		return (
			<div className="text-center mt-8">
				<h1 className="text-3xl font-bold">
					Your Pokémon Starters Are:
				</h1>
				<div className="flex justify-center gap-8 mt-6">
					{[finalGrass, finalFire, finalWater].map(
						(pokemon, index) => (
							<div
								key={index}
								className="flex flex-col items-center"
							>
								{pokemon?.image && (
									<Image
										src={pokemon.image}
										alt={pokemon.name || "Pokemon"}
										width={150}
										height={150}
										className="rounded-md"
									/>
								)}
								<h2 className="text-xl font-semibold mt-2">
									{pokemon?.name}
								</h2>
								<p className="text-sm text-gray-600">
									{pokemon?.description}
								</p>
							</div>
						)
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-8">
			<h1 className="text-2xl font-bold mb-6">
				{stage === "grass" && "Choose Your Grass Pokémon"}
				{stage === "fire" && "Choose Your Fire Pokémon"}
				{stage === "water" && "Choose Your Water Pokémon"}
			</h1>
			<div className="space-y-8">
				{stage === "grass" && renderOptions("grass", remainingGrass)}
				{stage === "fire" && renderOptions("fire", remainingFire)}
				{stage === "water" && renderOptions("water", remainingWater)}
			</div>
		</div>
	);
}
