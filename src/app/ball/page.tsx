"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "@/styles/pokeball.css";
import Image from "next/image";

const PokemonReveal: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const pokeballRef = useRef<HTMLDivElement>(null);
	const summonRef = useRef<SVGSVGElement>(null);
	const pokemonImageRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const spawnTimeline = gsap.timeline({
			paused: true,
			onStart: () => {
				if (summonRef.current)
					summonRef.current.classList.remove("hidden");
				if (summonRef.current)
					summonRef.current.style.filter = "url(#spawn-line)";
				if (pokemonImageRef.current)
					pokemonImageRef.current.style.filter =
						"url(#spawn-pokemon)";
			},
			onComplete: () => {
				if (summonRef.current)
					summonRef.current.classList.add("hidden");
				if (summonRef.current) summonRef.current.style.filter = "none";
				if (pokemonImageRef.current)
					pokemonImageRef.current.style.filter = "none";
			},
		});

		spawnTimeline
			.set(".path", { attr: { "stroke-dashoffset": "100%" } })
			.to(".path", {
				delay: 0.2,
				duration: 0.2,
				attr: { "stroke-dashoffset": "0%" },
			})
			.to(".path", {
				duration: 0.2,
				attr: { "stroke-dashoffset": "-100%" },
			})
			.from(".pokemon img", { duration: 0.2, scale: 0 }, 0.4)
			.to(
				"#pokemon-displacement",
				{ duration: 0.8, attr: { scale: 0 }, ease: "none" },
				0.2
			)
			.to(
				"#pokemon-turbulence",
				{ duration: 0.8, attr: { baseFrequency: 0.03 }, ease: "none" },
				0.2
			)
			.from(".tags", { opacity: 0 }, 0.4);

		const retrieveTimeline = gsap.timeline({
			paused: true,
			onStart: () => {
				if (summonRef.current)
					summonRef.current.classList.remove("hidden");
				if (summonRef.current)
					summonRef.current.style.filter = "url(#retrieve-line)";
				if (pokemonImageRef.current)
					pokemonImageRef.current.style.filter =
						"url(#retrieve-pokemon)";
			},
			onComplete: () => {
				if (summonRef.current)
					summonRef.current.classList.add("hidden");
				if (summonRef.current) summonRef.current.style.filter = "none";
				if (pokemonImageRef.current)
					pokemonImageRef.current.style.filter = "none";
			},
		});

		retrieveTimeline
			.set(".path", { attr: { "stroke-dashoffset": "-100%" } })
			.to(".tags", { opacity: 0 })
			.from(
				"#retrieve-displacement",
				{ duration: 0.3, attr: { scale: 0 } },
				0
			)
			.from(
				"#retrieve-turbulence",
				{ duration: 0.3, attr: { baseFrequency: 0 } },
				0
			)
			.to(".pokemon img", { scale: 0, duration: 0.2 }, 0.3)
			.to(
				".path",
				{ duration: 0.2, attr: { "stroke-dashoffset": "0%" } },
				0.35
			)
			.to(
				".path",
				{ duration: 0.2, attr: { "stroke-dashoffset": "100%" } },
				0.45
			);

		const togglePokeball = () => {
			if (pokeballRef.current) {
				if (pokeballRef.current.classList.contains("open")) {
					pokeballRef.current.classList.remove("open");
					retrieveTimeline.restart();
				} else {
					pokeballRef.current.classList.add("open");
					spawnTimeline.restart();
				}
			}
			setIsOpen(!isOpen);
		};

		const button = document.getElementById("toggle-button");
		if (button) {
			button.addEventListener("click", togglePokeball);
		}

		return () => {
			if (button) {
				button.removeEventListener("click", togglePokeball);
			}
		};
	}, []);

	return (
		<div className="flex items-center justify-center min-h-screen bg-blue-400">
			<div className="transform scale-80 md:scale-100">
				<div
					id="pokeball-1"
					ref={pokeballRef}
					className={`pokeball relative w-[300px] h-[500px] border border-black rounded-[20px] overflow-hidden flex items-center bg-gray-500 bg-no-repeat bg-[length:350px_350px] bg-[50px_200px] transition-all duration-500 ease-in ${
						isOpen ? "open bg-white" : ""
					}`}
				>
					<button
						id="toggle-button"
						className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] border border-[#615e69] bg-[#f0f0f0] rounded-full z-[999] transition-all duration-1000 ${
							isOpen ? "top-[10%]" : ""
						}`}
					></button>
					<article className="p-5 text-sm leading-relaxed">
						<h1 className="flex justify-between text-xl font-normal text-gray-800 m-0">
							<span>Charizard</span>
							<span className="font-light">#006</span>
						</h1>
						<div className="species">Flame Pokemon</div>
						<p className="my-5">
							Flies around the sky in search of powerful
							opponents. It breathes fire of such great heat that
							it melts anything. However, it never turns its fiery
							breath on any opponent weaker than itself.
						</p>
						<ul className="list-none m-0 p-0 grid grid-cols-2 gap-x-[22px]">
							{[
								{
									label: "HP",
									value: 330,
									min: 266,
									low: 293,
									high: 333,
									max: 360,
								},
								{
									label: "Speed",
									value: 280,
									min: 184,
									low: 236,
									high: 276,
									max: 328,
								},
								{
									label: "Attack",
									value: 280,
									min: 155,
									low: 204,
									high: 244,
									max: 293,
								},
								{
									label: "Defense",
									value: 190,
									min: 144,
									low: 192,
									high: 232,
									max: 280,
								},
								{
									label: "Sp. Atk",
									value: 340,
									min: 200,
									low: 254,
									high: 294,
									max: 348,
								},
								{
									label: "Sp. Def:",
									value: 230,
									min: 157,
									low: 206,
									high: 246,
									max: 295,
								},
							].map((stat, index) => (
								<li key={index} className="mb-1">
									<label className="flex justify-between px-[5px]">
										<span>{stat.label}</span>
										<span className="text-black">
											{stat.value}
										</span>
									</label>
									<meter
										className="w-full h-[6px] block border border-black rounded-[10px] relative text-transparent text-[0]"
										min={stat.min}
										low={stat.low}
										high={stat.high}
										max={stat.max}
										value={stat.value}
									>
										{stat.value}/{stat.max}
									</meter>
								</li>
							))}
						</ul>
					</article>
				</div>
				<div className="pokemon relative text-center ml-[60px]">
					<Image
						ref={pokemonImageRef}
						// src="/api/placeholder/400/320"
						src="https://i.imgur.com/E4t72wb.png"
						alt="charizard"
						className="w-[400px] bg-[radial-gradient(#5684b5_60%,transparent_60%)] bg-[length:300px_300px] bg-no-repeat bg-[50%_90%]"
						width={400}
						height={400}
					/>
					<div className="tags">
						<span className="bg-[#fb613e] text-white rounded-[20px] px-4 py-2 font-normal tracking-wider mr-1">
							Fire
						</span>
						<span className="bg-[#5684b5] text-white rounded-[20px] px-4 py-2 font-normal tracking-wider mr-1">
							Flying
						</span>
						<span className="bg-[#f1f1f1] rounded-[20px] px-4 py-2 font-normal tracking-wider mr-1">
							1.7 m
						</span>
						<span className="bg-[#f1f1f1] rounded-[20px] px-4 py-2 font-normal tracking-wider mr-1">
							90.5 kg
						</span>
					</div>
				</div>
				<svg
					ref={summonRef}
					id="summon-1"
					width="600"
					height="500"
					className="summon absolute hidden"
				>
					<path
						className="path"
						d="M100 250 L280 150 L460 215"
						fill="none"
						stroke="black"
						strokeWidth="15"
					/>
				</svg>
				<svg width="500" height="500" className="hidden">
					<defs>
						<filter id="spawn-line">
							<feTurbulence
								id="line-turbulence"
								type="fractalNoise"
								baseFrequency="0.013"
								numOctaves="1"
								result="TURBULENCE_1"
							/>
							<feDisplacementMap
								id="line-displacement"
								in="SourceGraphic"
								in2="TURBULENCE_1"
								scale="200"
								xChannelSelector="R"
								yChannelSelector="G"
								result="DISPLACEMENT_1"
							/>
							<feFlood
								floodColor="#fffdc4"
								floodOpacity="1"
								result="FLOOD_1"
							/>
							<feComposite
								in="FLOOD_1"
								in2="DISPLACEMENT_1"
								operator="in"
								result="COMPOSITE_1"
							/>
						</filter>
						<filter id="spawn-pokemon">
							<feTurbulence
								id="pokemon-turbulence"
								type="fractalNoise"
								baseFrequency="0.015"
								numOctaves="1"
								result="TURBULENCE_1"
							/>
							<feDisplacementMap
								id="pokemon-displacement"
								in="SourceGraphic"
								in2="TURBULENCE_1"
								scale="100"
								xChannelSelector="R"
								yChannelSelector="G"
								result="DISPLACEMENT_1"
							/>
							<feFlood
								floodColor="#fffdc4"
								floodOpacity="1"
								result="FLOOD_1"
							/>
							<feComposite
								in="FLOOD_1"
								in2="DISPLACEMENT_1"
								operator="in"
								result="COMPOSITE_1"
							/>
						</filter>
						<filter id="retrieve-line">
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.015"
								numOctaves="1"
								result="TURBULENCE_1"
							/>
							<feDisplacementMap
								in="SourceGraphic"
								in2="TURBULENCE_1"
								scale="200"
								xChannelSelector="R"
								yChannelSelector="G"
								result="DISPLACEMENT_1"
							/>
							<feFlood
								floodColor="#fec9c9"
								floodOpacity="1"
								result="FLOOD_1"
							/>
							<feComposite
								in="FLOOD_1"
								in2="DISPLACEMENT_1"
								operator="in"
								result="COMPOSITE_1"
							/>
						</filter>
						<filter id="retrieve-pokemon">
							<feTurbulence
								id="retrieve-turbulence"
								type="fractalNoise"
								baseFrequency="0.015"
								numOctaves="1"
								result="TURBULENCE_1"
							/>
							<feDisplacementMap
								id="retrieve-displacement"
								in="SourceGraphic"
								in2="TURBULENCE_1"
								scale="100"
								xChannelSelector="R"
								yChannelSelector="G"
								result="DISPLACEMENT_1"
							/>
							<feFlood
								floodColor="#fec9c9"
								floodOpacity="1"
								result="FLOOD_1"
							/>
							<feComposite
								in="FLOOD_1"
								in2="DISPLACEMENT_1"
								operator="in"
								result="COMPOSITE_1"
							/>
						</filter>
					</defs>
				</svg>
			</div>
		</div>
	);
};

export default PokemonReveal;
