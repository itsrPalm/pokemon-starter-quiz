"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { getTypeStyles } from "@/lib/getTypeStyles";

interface Pokemon {
	name: string;
	image: string | null;
	description: string;
	type: "grass" | "fire" | "water";
}

interface SharedResultsProps {
	allPokemon: (Pokemon & { type: "grass" | "fire" | "water" })[];
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
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
	}, [resultId, audioStatus]);

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

	const orderedPokemon = allPokemon.map((pokemon, index) => {
		let rank = "Can Relate To";
		if (index < 3) rank = "Your Top Match!";
		else if (index < 6) rank = "Runner Up";
		return { ...pokemon, rank };
	});

	const getCardStyle = (rank: string): string => {
		switch (rank) {
			case "Your Top Match!":
				return "w-full";
			case "Runner Up":
				return "w-9/12 mx-auto";
			case "Can Relate To":
				return "w-6/12 mx-auto";
			default:
				return "w-full";
		}
	};

	const getImageSize = (rank: string): number => {
		switch (rank) {
			case "Your Top Match!":
				return 240;
			case "Runner Up":
				return 160;
			case "Can Relate To":
				return 100;
			default:
				return 240;
		}
	};

	const getFontSize = (rank: string): string => {
		switch (rank) {
			case "Your Top Match!":
				return "text-2xl";
			case "Runner Up":
				return "text-lg";
			case "Can Relate To":
				return "text-sm";
			default:
				return "text-2xl";
		}
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
							className={`${getCardStyle(pokemon.rank)} mb-8`}
						>
							<motion.div
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -50 }}
								transition={{
									duration: 0.5,
									delay: index * 0.1,
								}}
								className={`${
									getTypeStyles(pokemon.type).background
								} ${
									getTypeStyles(pokemon.type).border
								} border shadow-md rounded-lg p-4 flex flex-col items-center h-full`}
							>
								<Image
									src={
										pokemon.image ||
										"/placeholder-pokemon.png"
									}
									alt={pokemon.name || "Pokemon"}
									className="rounded-md"
									width={getImageSize(pokemon.rank)}
									height={getImageSize(pokemon.rank)}
								/>
								<h2
									className={`${getFontSize(
										pokemon.rank
									)} font-semibold mt-2 text-center text-gray-900`}
								>
									{pokemon.name}
								</h2>
								<p
									className={`${
										pokemon.rank === "Can Relate To"
											? "text-xs"
											: "text-sm"
									} text-center text-gray-700 mt-2`}
								>
									{pokemon.description}
								</p>
								<span
									className={`${
										pokemon.rank === "Can Relate To"
											? "text-xs"
											: "text-sm"
									} font-bold text-purple-600 mt-auto`}
								>
									{pokemon.rank}
								</span>
							</motion.div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
