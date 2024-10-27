// // // // import { NextRequest, NextResponse } from "next/server";
// // // // import { convertFileToBase64 } from "@/lib/base64-utils";

// // // // interface PokemonData {
// // // // 	name: string;
// // // // 	image: string | null;
// // // // 	description: string;
// // // // 	type: "grass" | "fire" | "water";
// // // // 	traits: string[];
// // // // }

// // // // export async function POST(req: NextRequest) {
// // // // 	try {
// // // // 		const {
// // // // 			pokemon,
// // // // 			index,
// // // // 			hexColor,
// // // // 			emoji,
// // // // 			originalImageSize,
// // // // 			originalFontSize,
// // // // 		}: {
// // // // 			pokemon: PokemonData;
// // // // 			index: number;
// // // // 			hexColor: string;
// // // // 			emoji: string;
// // // // 			originalImageSize: number;
// // // // 			originalFontSize: number;
// // // // 		} = await req.json();

// // // // 		console.log(
// // // // 			`Original Image Size: ${originalImageSize}, Original Font Size: ${originalFontSize}`
// // // // 		);

// // // // 		const base64Image = await convertFileToBase64(
// // // // 			pokemon.image || "/placeholder-pokemon.png"
// // // // 		);

// // // // 		// const svgSize = 1024;
// // // // 		const svgSize = 1024;
// // // // 		const imageSize = 512;
// // // // 		const nameSize = 72;
// // // // 		const emojiSize = 60;
// // // // 		const descriptionSize = 24;
// // // // 		const rankSize = 36;
// // // // 		const traitSize = 20;

// // // // 		const getRankText = (index: number): string => {
// // // // 			if (index < 3) return "Your Top Match!";
// // // // 			if (index >= 3 && index < 6) return "Runner Up";
// // // // 			return "Can Relate To";
// // // // 		};

// // // // 		const getRankIconSVG = (index: number): string => {
// // // // 			if (index < 3)
// // // // 				return `<path fill="${hexColor}" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/>`;
// // // // 			if (index >= 3 && index < 6)
// // // // 				return `<path fill="${hexColor}" d="M223.75 130.75L154.62 15.54A31.997 31.997 0 0 0 127.18 0H16.03C3.08 0-4.5 14.57 2.92 25.18l111.27 158.96c29.72-27.77 67.52-46.83 109.56-53.39zM495.97 0H384.82c-11.24 0-21.66 5.9-27.44 15.54l-69.13 115.21c42.04 6.56 79.84 25.62 109.56 53.38L509.08 25.18C516.5 14.57 508.92 0 495.97 0zM256 160c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm92.52 157.26l-37.93 36.96 8.97 52.22c1.6 9.36-8.26 16.51-16.65 12.09L256 393.88l-46.9 24.65c-8.4 4.45-18.25-2.74-16.65-12.09l8.97-52.22-37.93-36.96c-6.82-6.64-3.05-18.23 6.35-19.59l52.43-7.64 23.43-47.52c2.11-4.28 6.19-6.39 10.28-6.39 4.11 0 8.22 2.14 10.33 6.39l23.43 47.52 52.43 7.64c9.4 1.36 13.17 12.95 6.35 19.59z"/>`;
// // // // 			return `<path fill="${hexColor}" d="M488 192H336v56c0 39.7-32.3 72-72 72s-72-32.3-72-72V126.4l-64.9 39C107.8 176.9 96 197.8 96 220.2v47.3l-80 46.2C.7 322.5-4.6 342.1 4.3 357.4l80 138.6c8.8 15.3 28.4 20.5 43.7 11.7L231.4 448H368c35.3 0 64-28.7 64-64h16c17.7 0 32-14.3 32-32v-64h8c13.3 0 24-10.7 24-24v-48c0-13.3-10.7-24-24-24zm147.7-37.4L555.7 16C546.9.7 527.3-4.5 512 4.3L408.6 64H306.4c-12 0-23.7 3.4-33.9 9.7L239 94.6c-9.4 5.8-15 16.1-15 27.1V248c0 22.1 17.9 40 40 40s40-17.9 40-40v-88h184c30.9 0 56 25.1 56 56v28.5l80-46.2c15.3-8.9 20.5-28.4 11.7-43.7z"/>`;
// // // // 		};

// // // // 		const svgContent = `
// // // //       <svg width="${svgSize}" height="${svgSize}" xmlns="http://www.w3.org/2000/svg">
// // // //         <defs>
// // // //           <style>
// // // //             @import url('https://fonts.googleapis.com/css2?family=Bowlby+One+SC&amp;family=Roboto+Slab:wght@400;700&amp;display=swap');
// // // //             .pokemon-name {
// // // //               font-family: 'Bowlby One SC', cursive;
// // // //               font-size: ${nameSize}px;
// // // //               font-weight: bold;
// // // //               letter-spacing: 2px;
// // // //               fill: ${hexColor};
// // // //             }
// // // //             .emoji { font-size: ${emojiSize}px; }
// // // //             .description {
// // // //               font-family: 'Roboto Slab', serif;
// // // //               font-size: ${descriptionSize}px;
// // // //               fill: ${hexColor};
// // // //             }
// // // //             .rank {
// // // //               font-family: 'Bowlby One SC', cursive;
// // // //               font-size: ${rankSize}px;
// // // //               font-weight: bold;
// // // //               fill: ${hexColor};
// // // //             }
// // // //             .trait {
// // // //               font-family: 'Roboto Slab', serif;
// // // //               font-size: ${traitSize}px;
// // // //               font-weight: 700;
// // // //               fill: ${hexColor};
// // // //             }
// // // //           </style>
// // // //         </defs>

// // // //         <path id="nameCurve" d="M100,100 Q512,20 924,100" fill="transparent" />
// // // //         <text>
// // // //           <textPath href="#nameCurve" startOffset="50%" text-anchor="middle">
// // // //             <tspan class="pokemon-name">${pokemon.name.toUpperCase()}</tspan>
// // // //             <tspan class="emoji" dx="10">${emoji}</tspan>
// // // //           </textPath>
// // // //         </text>

// // // //         <image href="${base64Image}" x="${(svgSize - imageSize) / 2}" y="${
// // // // 			(svgSize - imageSize) / 2 - 100
// // // // 		}" width="${imageSize}" height="${imageSize}" />

// // // //         <foreignObject x="62" y="${svgSize / 2 + imageSize / 2 - 50}" width="${
// // // // 			svgSize - 124
// // // // 		}" height="200">
// // // //           <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Roboto Slab', serif; font-size: ${descriptionSize}px; color: ${hexColor}; text-align: center;">
// // // //             ${pokemon.description}
// // // //           </div>
// // // //         </foreignObject>

// // // //         <g transform="translate(${svgSize / 2 - 200}, ${svgSize - 180})">
// // // //           <svg width="40" height="40" viewBox="0 0 576 512">
// // // //             ${getRankIconSVG(index)}
// // // //           </svg>
// // // //           <text x="50" y="28" class="rank">
// // // //             ${getRankText(index)}
// // // //           </text>
// // // //         </g>

// // // //         ${pokemon.traits
// // // // 			.map(
// // // // 				(trait, i) =>
// // // // 					`<text x="${svgSize / 2}" y="${
// // // // 						svgSize - 100 + i * 30
// // // // 					}" text-anchor="middle" class="trait">${trait}</text>`
// // // // 			)
// // // // 			.join("")}
// // // //       </svg>
// // // //     `;

// // // // 		return new NextResponse(svgContent, {
// // // // 			headers: {
// // // // 				"Content-Type": "image/svg+xml",
// // // // 				"Content-Disposition": `attachment; filename="${pokemon.name}.svg"`,
// // // // 			},
// // // // 		});
// // // // 	} catch (error) {
// // // // 		console.error("Error generating SVG:", error);
// // // // 		return NextResponse.json(
// // // // 			{ error: "Failed to generate SVG" },
// // // // 			{ status: 500 }
// // // // 		);
// // // // 	}
// // // // }

// // // // File: src/app/api/generate-pokemon-svg/route.ts

// // // // import { NextRequest, NextResponse } from "next/server";
// // // // import { convertFileToBase64 } from "@/lib/base64-utils";

// // // // interface PokemonData {
// // // // 	name: string;
// // // // 	image: string | null;
// // // // 	description: string;
// // // // 	type: "grass" | "fire" | "water";
// // // // 	traits: string[];
// // // // }

// // // // export async function POST(req: NextRequest) {
// // // // 	try {
// // // // 		const {
// // // // 			pokemon,
// // // // 			index,
// // // // 			hexColor,
// // // // 			emoji,
// // // // 			originalImageSize,
// // // // 			originalFontSize,
// // // // 		}: {
// // // // 			pokemon: PokemonData;
// // // // 			index: number;
// // // // 			hexColor: string;
// // // // 			emoji: string;
// // // // 			originalImageSize: number;
// // // // 			originalFontSize: number;
// // // // 		} = await req.json();

// // // // 		console.log(
// // // // 			`Original Image Size: ${originalImageSize}, Original Font Size: ${originalFontSize}`
// // // // 		);

// // // // 		const base64Image = await convertFileToBase64(
// // // // 			pokemon.image || "/placeholder-pokemon.png"
// // // // 		);

// // // // 		const svgSize = 1024;
// // // // 		const imageSize = 512;
// // // // 		const nameSize = 72;
// // // // 		const emojiSize = 60;
// // // // 		const descriptionSize = 24;
// // // // 		const rankSize = 36;
// // // // 		const traitSize = 20;

// // // // 		const getRankText = (index: number): string => {
// // // // 			if (index < 3) return "Your Top Match!";
// // // // 			if (index >= 3 && index < 6) return "Runner Up";
// // // // 			return "Can Relate To";
// // // // 		};

// // // // 		const getRankIconSVG = (index: number): string => {
// // // // 			if (index < 3)
// // // // 				return `<path fill="${hexColor}" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/>`;
// // // // 			if (index >= 3 && index < 6)
// // // // 				return `<path fill="${hexColor}" d="M223.75 130.75L154.62 15.54A31.997 31.997 0 0 0 127.18 0H16.03C3.08 0-4.5 14.57 2.92 25.18l111.27 158.96c29.72-27.77 67.52-46.83 109.56-53.39zM495.97 0H384.82c-11.24 0-21.66 5.9-27.44 15.54l-69.13 115.21c42.04 6.56 79.84 25.62 109.56 53.38L509.08 25.18C516.5 14.57 508.92 0 495.97 0zM256 160c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm92.52 157.26l-37.93 36.96 8.97 52.22c1.6 9.36-8.26 16.51-16.65 12.09L256 393.88l-46.9 24.65c-8.4 4.45-18.25-2.74-16.65-12.09l8.97-52.22-37.93-36.96c-6.82-6.64-3.05-18.23 6.35-19.59l52.43-7.64 23.43-47.52c2.11-4.28 6.19-6.39 10.28-6.39 4.11 0 8.22 2.14 10.33 6.39l23.43 47.52 52.43 7.64c9.4 1.36 13.17 12.95 6.35 19.59z"/>`;
// // // // 			return `<path fill="${hexColor}" d="M488 192H336v56c0 39.7-32.3 72-72 72s-72-32.3-72-72V126.4l-64.9 39C107.8 176.9 96 197.8 96 220.2v47.3l-80 46.2C.7 322.5-4.6 342.1 4.3 357.4l80 138.6c8.8 15.3 28.4 20.5 43.7 11.7L231.4 448H368c35.3 0 64-28.7 64-64h16c17.7 0 32-14.3 32-32v-64h8c13.3 0 24-10.7 24-24v-48c0-13.3-10.7-24-24-24zm147.7-37.4L555.7 16C546.9.7 527.3-4.5 512 4.3L408.6 64H306.4c-12 0-23.7 3.4-33.9 9.7L239 94.6c-9.4 5.8-15 16.1-15 27.1V248c0 22.1 17.9 40 40 40s40-17.9 40-40v-88h184c30.9 0 56 25.1 56 56v28.5l80-46.2c15.3-8.9 20.5-28.4 11.7-43.7z"/>`;
// // // // 		};

// // // // 		const svgContent = `
// // // //         <svg width="${svgSize}" height="${svgSize}" xmlns="http://www.w3.org/2000/svg">
// // // //             <defs>
// // // //                 <style>
// // // //                     @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&amp;family=Oswald:wght@700&amp;family=Merriweather+Sans:wght@700&amp;display=swap');
// // // //                     .pokemon-name {
// // // //                         font-family: 'Oswald', sans-serif;
// // // //                         font-size: ${nameSize}px;
// // // //                         font-weight: bold;
// // // //                         letter-spacing: 2px;
// // // //                         fill: ${hexColor};
// // // //                     }
// // // //                     .emoji { font-size: ${emojiSize}px; }
// // // //                     .description {
// // // //                         font-family: 'Roboto', sans-serif;
// // // //                         font-size: ${descriptionSize}px;
// // // //                         font-weight: 700;
// // // //                         fill: ${hexColor};
// // // //                     }
// // // //                     .rank, .trait {
// // // //                         font-family: 'Merriweather Sans', sans-serif;
// // // //                         font-weight: bold;
// // // //                         fill: ${hexColor};
// // // //                     }
// // // //                     .rank { font-size: ${rankSize}px; }
// // // //                     .trait { font-size: ${traitSize}px; }
// // // //                 </style>
// // // //             </defs>

// // // //             <text x="${
// // // // 				svgSize / 2
// // // // 			}" y="80" text-anchor="middle" class="pokemon-name">
// // // //                 ${pokemon.name.toUpperCase()} <tspan class="emoji">${emoji}</tspan>
// // // //             </text>

// // // //             <image href="${base64Image}" x="${
// // // // 			(svgSize - imageSize) / 2
// // // // 		}" y="100" width="${imageSize}" height="${imageSize}" />

// // // //             <foreignObject x="62" y="${100 + imageSize + 20}" width="${
// // // // 			svgSize - 124
// // // // 		}" height="200">
// // // //                 <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Roboto', sans-serif; font-size: ${descriptionSize}px; font-weight: 700; color: ${hexColor}; text-align: center;">
// // // //                     ${pokemon.description}
// // // //                 </div>
// // // //             </foreignObject>

// // // //             <g transform="translate(${svgSize / 2 - 150}, ${svgSize - 180})">
// // // //                 <svg width="40" height="40" viewBox="0 0 576 512">
// // // //                     ${getRankIconSVG(index)}
// // // //                 </svg>
// // // //                 <text x="50" y="28" class="rank">
// // // //                     ${getRankText(index)}
// // // //                 </text>
// // // //             </g>

// // // //             ${pokemon.traits
// // // // 				.map(
// // // // 					(trait, i) =>
// // // // 						`<text x="${svgSize / 2}" y="${
// // // // 							svgSize - 100 + i * 30
// // // // 						}" text-anchor="middle" class="trait">${trait}</text>`
// // // // 				)
// // // // 				.join("")}
// // // //         </svg>
// // // //         `;

// // // // 		return new NextResponse(svgContent, {
// // // // 			headers: {
// // // // 				"Content-Type": "image/svg+xml",
// // // // 				"Content-Disposition": `attachment; filename="${pokemon.name}.svg"`,
// // // // 			},
// // // // 		});
// // // // 	} catch (error) {
// // // // 		console.error("Error generating SVG:", error);
// // // // 		return NextResponse.json(
// // // // 			{ error: "Failed to generate SVG" },
// // // // 			{ status: 500 }
// // // // 		);
// // // // 	}
// // // // }

// // // import { NextRequest, NextResponse } from "next/server";
// // // import { convertFileToBase64 } from "@/lib/base64-utils";

// // // interface PokemonData {
// // // 	name: string;
// // // 	image: string | null;
// // // 	description: string;
// // // 	type: "grass" | "fire" | "water";
// // // 	traits: string[];
// // // }

// // // export async function POST(req: NextRequest) {
// // // 	try {
// // // 		const {
// // // 			pokemon,
// // // 			index,
// // // 			hexColor,
// // // 			emoji,
// // // 			originalImageSize,
// // // 			originalFontSize,
// // // 		}: {
// // // 			pokemon: PokemonData;
// // // 			index: number;
// // // 			hexColor: string;
// // // 			emoji: string;
// // // 			originalImageSize: number;
// // // 			originalFontSize: number;
// // // 		} = await req.json();

// // // 		console.log(
// // // 			`Original Image Size: ${originalImageSize}, Original Font Size: ${originalFontSize}`
// // // 		);

// // // 		const base64Image = await convertFileToBase64(
// // // 			pokemon.image || "/placeholder-pokemon.png"
// // // 		);

// // // 		// Adjust sizes for high DPI rendering
// // // 		const dpiScale = 600 / 96; // Standard SVG DPI is 96, scale to 600 DPI
// // // 		const svgSize = 1024 * dpiScale; // Increase base size proportionally
// // // 		const imageSize = 512 * dpiScale;
// // // 		const nameSize = 72 * dpiScale;
// // // 		const emojiSize = 60 * dpiScale;
// // // 		const descriptionSize = 24 * dpiScale;
// // // 		const rankSize = 36 * dpiScale;
// // // 		const traitSize = 20 * dpiScale;

// // // 		const getRankText = (index: number): string => {
// // // 			if (index < 3) return "Your Top Match!";
// // // 			if (index >= 3 && index < 6) return "Runner Up";
// // // 			return "Can Relate To";
// // // 		};

// // // 		const getRankIconSVG = (index: number): string => {
// // // 			if (index < 3)
// // // 				return `<path fill="${hexColor}" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/>`;
// // // 			if (index >= 3 && index < 6)
// // // 				return `<path fill="${hexColor}" d="M223.75 130.75L154.62 15.54A31.997 31.997 0 0 0 127.18 0H16.03C3.08 0-4.5 14.57 2.92 25.18l111.27 158.96c29.72-27.77 67.52-46.83 109.56-53.39zM495.97 0H384.82c-11.24 0-21.66 5.9-27.44 15.54l-69.13 115.21c42.04 6.56 79.84 25.62 109.56 53.38L509.08 25.18C516.5 14.57 508.92 0 495.97 0zM256 160c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm92.52 157.26l-37.93 36.96 8.97 52.22c1.6 9.36-8.26 16.51-16.65 12.09L256 393.88l-46.9 24.65c-8.4 4.45-18.25-2.74-16.65-12.09l8.97-52.22-37.93-36.96c-6.82-6.64-3.05-18.23 6.35-19.59l52.43-7.64 23.43-47.52c2.11-4.28 6.19-6.39 10.28-6.39 4.11 0 8.22 2.14 10.33 6.39l23.43 47.52 52.43 7.64c9.4 1.36 13.17 12.95 6.35 19.59z"/>`;
// // // 			return `<path fill="${hexColor}" d="M488 192H336v56c0 39.7-32.3 72-72 72s-72-32.3-72-72V126.4l-64.9 39C107.8 176.9 96 197.8 96 220.2v47.3l-80 46.2C.7 322.5-4.6 342.1 4.3 357.4l80 138.6c8.8 15.3 28.4 20.5 43.7 11.7L231.4 448H368c35.3 0 64-28.7 64-64h16c17.7 0 32-14.3 32-32v-64h8c13.3 0 24-10.7 24-24v-48c0-13.3-10.7-24-24-24zm147.7-37.4L555.7 16C546.9.7 527.3-4.5 512 4.3L408.6 64H306.4c-12 0-23.7 3.4-33.9 9.7L239 94.6c-9.4 5.8-15 16.1-15 27.1V248c0 22.1 17.9 40 40 40s40-17.9 40-40v-88h184c30.9 0 56 25.1 56 56v28.5l80-46.2c15.3-8.9 20.5-28.4 11.7-43.7z"/>`;
// // // 		};

// // // 		const svgContent = `
// // //         <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" xmlns="http://www.w3.org/2000/svg">
// // //             <defs>
// // //                 <style>
// // //                     @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&amp;family=Oswald:wght@700&amp;family=Merriweather+Sans:wght@700&amp;display=swap');
// // //                     .pokemon-name {
// // //                         font-family: 'Oswald', sans-serif;
// // //                         font-size: ${nameSize}px;
// // //                         font-weight: bold;
// // //                         letter-spacing: 2px;
// // //                         fill: ${hexColor};
// // //                     }
// // //                     .emoji { font-size: ${emojiSize}px; }
// // //                     .description {
// // //                         font-family: 'Roboto', sans-serif;
// // //                         font-size: ${descriptionSize}px;
// // //                         font-weight: 700;
// // //                         fill: ${hexColor};
// // //                     }
// // //                     .rank, .trait {
// // //                         font-family: 'Merriweather Sans', sans-serif;
// // //                         font-weight: bold;
// // //                         fill: ${hexColor};
// // //                     }
// // //                     .rank { font-size: ${rankSize}px; }
// // //                     .trait { font-size: ${traitSize}px; }
// // //                 </style>
// // //             </defs>

// // //             <text x="${svgSize / 2}" y="${
// // // 			80 * dpiScale
// // // 		}" text-anchor="middle" class="pokemon-name">
// // //                 ${pokemon.name.toUpperCase()} <tspan class="emoji">${emoji}</tspan>
// // //             </text>

// // //             <image href="${base64Image}" x="${(svgSize - imageSize) / 2}" y="${
// // // 			100 * dpiScale
// // // 		}" width="${imageSize}" height="${imageSize}" />

// // //             <foreignObject x="${62 * dpiScale}" y="${
// // // 			(100 + imageSize + 20) * dpiScale
// // // 		}" width="${svgSize - 124 * dpiScale}" height="${200 * dpiScale}">
// // //                 <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Roboto', sans-serif; font-size: ${descriptionSize}px; font-weight: 700; color: ${hexColor}; text-align: center;">
// // //                     ${pokemon.description}
// // //                 </div>
// // //             </foreignObject>

// // //             <g transform="translate(${svgSize / 2 - 150 * dpiScale}, ${
// // // 			svgSize - 180 * dpiScale
// // // 		})">
// // //                 <svg width="${40 * dpiScale}" height="${
// // // 			40 * dpiScale
// // // 		}" viewBox="0 0 576 512">
// // //                     ${getRankIconSVG(index)}
// // //                 </svg>
// // //                 <text x="${50 * dpiScale}" y="${28 * dpiScale}" class="rank">
// // //                     ${getRankText(index)}
// // //                 </text>
// // //             </g>

// // //             ${pokemon.traits
// // // 				.map(
// // // 					(trait, i) =>
// // // 						`<text x="${svgSize / 2}" y="${
// // // 							svgSize - 100 * dpiScale + i * 30 * dpiScale
// // // 						}" text-anchor="middle" class="trait">${trait}</text>`
// // // 				)
// // // 				.join("")}
// // //         </svg>
// // //         `;

// // // 		return new NextResponse(svgContent, {
// // // 			headers: {
// // // 				"Content-Type": "image/svg+xml",
// // // 				"Content-Disposition": `attachment; filename="${pokemon.name}.svg"`,
// // // 			},
// // // 		});
// // // 	} catch (error) {
// // // 		console.error("Error generating SVG:", error);
// // // 		return NextResponse.json(
// // // 			{ error: "Failed to generate SVG" },
// // // 			{ status: 500 }
// // // 		);
// // // 	}
// // // }

// // import { NextRequest, NextResponse } from "next/server";
// // import { convertFileToBase64 } from "@/lib/base64-utils";

// // interface PokemonData {
// // 	name: string;
// // 	image: string | null;
// // 	description: string;
// // 	type: "grass" | "fire" | "water";
// // 	traits: string[];
// // }

// // export async function POST(req: NextRequest) {
// // 	try {
// // 		const {
// // 			pokemon,
// // 			index,
// // 			hexColor,
// // 			emoji,
// // 			originalImageSize,
// // 			originalFontSize,
// // 		}: {
// // 			pokemon: PokemonData;
// // 			index: number;
// // 			hexColor: string;
// // 			emoji: string;
// // 			originalImageSize: number;
// // 			originalFontSize: number;
// // 		} = await req.json();

// // 		console.log(
// // 			`Original Image Size: ${originalImageSize}, Original Font Size: ${originalFontSize}`
// // 		);

// // 		const base64Image = await convertFileToBase64(
// // 			pokemon.image || "/placeholder-pokemon.png"
// // 		);

// // 		// Adjust sizes for high DPI rendering
// // 		const dpiScale = 600 / 96; // Standard SVG DPI is 96, scale to 600 DPI
// // 		const svgSize = 1024 * dpiScale; // Increase base size proportionally
// // 		const imageSize = 512 * dpiScale;
// // 		const nameSize = 72 * dpiScale;
// // 		const emojiSize = 60 * dpiScale;
// // 		const descriptionSize = 24 * dpiScale;
// // 		const rankSize = 36 * dpiScale;
// // 		const traitSize = 20 * dpiScale;

// // 		const getRankText = (index: number): string => {
// // 			if (index < 3) return "Your Top Match!";
// // 			if (index >= 3 && index < 6) return "Runner Up";
// // 			return "Can Relate To";
// // 		};

// // 		const getRankIconSVG = (index: number): string => {
// // 			if (index < 3)
// // 				return `<path fill="${hexColor}" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/>`;
// // 			if (index >= 3 && index < 6)
// // 				return `<path fill="${hexColor}" d="M223.75 130.75L154.62 15.54A31.997 31.997 0 0 0 127.18 0H16.03C3.08 0-4.5 14.57 2.92 25.18l111.27 158.96c29.72-27.77 67.52-46.83 109.56-53.39zM495.97 0H384.82c-11.24 0-21.66 5.9-27.44 15.54l-69.13 115.21c42.04 6.56 79.84 25.62 109.56 53.38L509.08 25.18C516.5 14.57 508.92 0 495.97 0zM256 160c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm92.52 157.26l-37.93 36.96 8.97 52.22c1.6 9.36-8.26 16.51-16.65 12.09L256 393.88l-46.9 24.65c-8.4 4.45-18.25-2.74-16.65-12.09l8.97-52.22-37.93-36.96c-6.82-6.64-3.05-18.23 6.35-19.59l52.43-7.64 23.43-47.52c2.11-4.28 6.19-6.39 10.28-6.39 4.11 0 8.22 2.14 10.33 6.39l23.43 47.52 52.43 7.64c9.4 1.36 13.17 12.95 6.35 19.59z"/>`;
// // 			return `<path fill="${hexColor}" d="M488 192H336v56c0 39.7-32.3 72-72 72s-72-32.3-72-72V126.4l-64.9 39C107.8 176.9 96 197.8 96 220.2v47.3l-80 46.2C.7 322.5-4.6 342.1 4.3 357.4l80 138.6c8.8 15.3 28.4 20.5 43.7 11.7L231.4 448H368c35.3 0 64-28.7 64-64h16c17.7 0 32-14.3 32-32v-64h8c13.3 0 24-10.7 24-24v-48c0-13.3-10.7-24-24-24zm147.7-37.4L555.7 16C546.9.7 527.3-4.5 512 4.3L408.6 64H306.4c-12 0-23.7 3.4-33.9 9.7L239 94.6c-9.4 5.8-15 16.1-15 27.1V248c0 22.1 17.9 40 40 40s40-17.9 40-40v-88h184c30.9 0 56 25.1 56 56v28.5l80-46.2c15.3-8.9 20.5-28.4 11.7-43.7z"/>`;
// // 		};

// // 		// Splitting the description text to fit within a specified width
// // 		const descriptionLines = pokemon.description.split(" ").reduce(
// // 			(lines, word) => {
// // 				const lastLine = lines[lines.length - 1];
// // 				if (
// // 					!lastLine ||
// // 					(lastLine.length + word.length + 1) * descriptionSize <
// // 						svgSize - 200
// // 				) {
// // 					lines[lines.length - 1] = lastLine
// // 						? `${lastLine} ${word}`
// // 						: word;
// // 				} else {
// // 					lines.push(word);
// // 				}
// // 				return lines;
// // 			},
// // 			[""]
// // 		);

// // 		const svgContent = `
// //         <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" xmlns="http://www.w3.org/2000/svg">
// //             <defs>
// //                 <style>
// //                     @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&amp;family=Oswald:wght@700&amp;family=Merriweather+Sans:wght@700&amp;display=swap');
// //                     .pokemon-name {
// //                         font-family: 'Oswald', sans-serif;
// //                         font-size: ${nameSize}px;
// //                         font-weight: bold;
// //                         letter-spacing: 2px;
// //                         fill: ${hexColor};
// //                     }
// //                     .emoji { font-size: ${emojiSize}px; }
// //                     .description {
// //                         font-family: 'Roboto', sans-serif;
// //                         font-size: ${descriptionSize}px;
// //                         font-weight: 700;
// //                         fill: ${hexColor};
// //                     }
// //                     .rank, .trait {
// //                         font-family: 'Merriweather Sans', sans-serif;
// //                         font-weight: bold;
// //                         fill: ${hexColor};
// //                     }
// //                     .rank { font-size: ${rankSize}px; }
// //                     .trait { font-size: ${traitSize}px; }
// //                 </style>
// //             </defs>

// //             <text x="${svgSize / 2}" y="${
// // 			80 * dpiScale
// // 		}" text-anchor="middle" class="pokemon-name">
// //                 ${pokemon.name.toUpperCase()} <tspan class="emoji">${emoji}</tspan>
// //             </text>

// //             <image href="${base64Image}" x="${(svgSize - imageSize) / 2}" y="${
// // 			100 * dpiScale
// // 		}" width="${imageSize}" height="${imageSize}" />

// //             ${descriptionLines
// // 				.map(
// // 					(line, index) =>
// // 						`<text x="${svgSize / 2}" y="${
// // 							100 * dpiScale +
// // 							imageSize +
// // 							50 * dpiScale +
// // 							index * descriptionSize * 1.2
// // 						}" text-anchor="middle" class="description">${line}</text>`
// // 				)
// // 				.join("")}

// //             <g transform="translate(${svgSize / 2 - 150 * dpiScale}, ${
// // 			svgSize - 180 * dpiScale
// // 		})">
// //                 <svg width="${40 * dpiScale}" height="${
// // 			40 * dpiScale
// // 		}" viewBox="0 0 576 512">
// //                     ${getRankIconSVG(index)}
// //                 </svg>
// //                 <text x="${50 * dpiScale}" y="${28 * dpiScale}" class="rank">
// //                     ${getRankText(index)}
// //                 </text>
// //             </g>

// //             ${pokemon.traits
// // 				.map(
// // 					(trait, i) =>
// // 						`<text x="${svgSize / 2}" y="${
// // 							svgSize - 100 * dpiScale + i * 30 * dpiScale
// // 						}" text-anchor="middle" class="trait">${trait}</text>`
// // 				)
// // 				.join("")}
// //         </svg>
// //         `;

// // 		return new NextResponse(svgContent, {
// // 			headers: {
// // 				"Content-Type": "image/svg+xml",
// // 				"Content-Disposition": `attachment; filename="${pokemon.name}.svg"`,
// // 			},
// // 		});
// // 	} catch (error) {
// // 		console.error("Error generating SVG:", error);
// // 		return NextResponse.json(
// // 			{ error: "Failed to generate SVG" },
// // 			{ status: 500 }
// // 		);
// // 	}
// // }

// import { NextRequest, NextResponse } from "next/server";
// import { convertFileToBase64 } from "@/lib/base64-utils";

// interface PokemonData {
// 	name: string;
// 	image: string | null;
// 	description: string;
// 	type: "grass" | "fire" | "water";
// 	traits: string[];
// }

// export async function POST(req: NextRequest) {
// 	try {
// 		const {
// 			pokemon,
// 			index,
// 			hexColor,
// 			emoji,
// 			originalImageSize,
// 			originalFontSize,
// 		}: {
// 			pokemon: PokemonData;
// 			index: number;
// 			hexColor: string;
// 			emoji: string;
// 			originalImageSize: number;
// 			originalFontSize: number;
// 		} = await req.json();

// 		console.log(
// 			`Original Image Size: ${originalImageSize}, Original Font Size: ${originalFontSize}`
// 		);

// 		const base64Image = await convertFileToBase64(
// 			pokemon.image || "/placeholder-pokemon.png"
// 		);

// 		// Adjust sizes for high DPI rendering
// 		const dpiScale = 600 / 96; // Standard SVG DPI is 96, scale to 600 DPI
// 		const svgSize = 1024 * dpiScale; // Increase base size proportionally
// 		const imageSize = 512 * dpiScale;
// 		const nameSize = 72 * dpiScale;
// 		const emojiSize = 60 * dpiScale;
// 		const descriptionSize = 24 * dpiScale;
// 		const rankSize = 36 * dpiScale;
// 		const traitSize = 20 * dpiScale;

// 		const getRankText = (index: number): string => {
// 			if (index < 3) return "Your Top Match!";
// 			if (index >= 3 && index < 6) return "Runner Up";
// 			return "Can Relate To";
// 		};

// 		const getRankIconSVG = (index: number): string => {
// 			if (index < 3)
// 				return `<path fill="${hexColor}" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/>`;
// 			if (index >= 3 && index < 6)
// 				return `<path fill="${hexColor}" d="M223.75 130.75L154.62 15.54A31.997 31.997 0 0 0 127.18 0H16.03C3.08 0-4.5 14.57 2.92 25.18l111.27 158.96c29.72-27.77 67.52-46.83 109.56-53.39zM495.97 0H384.82c-11.24 0-21.66 5.9-27.44 15.54l-69.13 115.21c42.04 6.56 79.84 25.62 109.56 53.38L509.08 25.18C516.5 14.57 508.92 0 495.97 0zM256 160c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm92.52 157.26l-37.93 36.96 8.97 52.22c1.6 9.36-8.26 16.51-16.65 12.09L256 393.88l-46.9 24.65c-8.4 4.45-18.25-2.74-16.65-12.09l8.97-52.22-37.93-36.96c-6.82-6.64-3.05-18.23 6.35-19.59l52.43-7.64 23.43-47.52c2.11-4.28 6.19-6.39 10.28-6.39 4.11 0 8.22 2.14 10.33 6.39l23.43 47.52 52.43 7.64c9.4 1.36 13.17 12.95 6.35 19.59z"/>`;
// 			return `<path fill="${hexColor}" d="M488 192H336v56c0 39.7-32.3 72-72 72s-72-32.3-72-72V126.4l-64.9 39C107.8 176.9 96 197.8 96 220.2v47.3l-80 46.2C.7 322.5-4.6 342.1 4.3 357.4l80 138.6c8.8 15.3 28.4 20.5 43.7 11.7L231.4 448H368c35.3 0 64-28.7 64-64h16c17.7 0 32-14.3 32-32v-64h8c13.3 0 24-10.7 24-24v-48c0-13.3-10.7-24-24-24zm147.7-37.4L555.7 16C546.9.7 527.3-4.5 512 4.3L408.6 64H306.4c-12 0-23.7 3.4-33.9 9.7L239 94.6c-9.4 5.8-15 16.1-15 27.1V248c0 22.1 17.9 40 40 40s40-17.9 40-40v-88h184c30.9 0 56 25.1 56 56v28.5l80-46.2c15.3-8.9 20.5-28.4 11.7-43.7z"/>`;
// 		};

// 		// Splitting the description text to fit within a specified width
// 		const descriptionLines = pokemon.description.split(" ").reduce(
// 			(lines, word) => {
// 				const lastLine = lines[lines.length - 1];
// 				if (
// 					!lastLine ||
// 					(lastLine.length + word.length + 1) * descriptionSize <
// 						svgSize - 200
// 				) {
// 					lines[lines.length - 1] = lastLine
// 						? `${lastLine} ${word}`
// 						: word;
// 				} else {
// 					lines.push(word);
// 				}
// 				return lines;
// 			},
// 			[""]
// 		);

// 		const svgContent = `
//         <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//                 <style>
//                     @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&amp;family=Oswald:wght@700&amp;family=Merriweather+Sans:wght@700&amp;display=swap');
//                     .pokemon-name {
//                         font-family: 'Oswald', sans-serif;
//                         font-size: ${nameSize}px;
//                         font-weight: bold;
//                         letter-spacing: 2px;
//                         fill: ${hexColor};
//                     }
//                     .emoji { font-size: ${emojiSize}px; }
//                     .description {
//                         font-family: 'Roboto', sans-serif;
//                         font-size: ${descriptionSize}px;
//                         font-weight: 700;
//                         fill: ${hexColor};
//                     }
//                     .rank, .trait {
//                         font-family: 'Merriweather Sans', sans-serif;
//                         font-weight: bold;
//                         fill: ${hexColor};
//                     }
//                     .rank { font-size: ${rankSize}px; }
//                     .trait { font-size: ${traitSize}px; }
//                 </style>
//                 <path id="archPath" d="M ${svgSize / 4} ${140 * dpiScale} Q ${
// 			svgSize / 2
// 		} ${100 * dpiScale}, ${(3 * svgSize) / 4} ${140 * dpiScale}" />
//             </defs>

//             <text text-anchor="middle" class="pokemon-name">
//                 <textPath href="#archPath" startOffset="50%">
//                     ${pokemon.name.toUpperCase()} <tspan class="emoji">${emoji}</tspan>
//                 </textPath>
//             </text>

//             <image href="${base64Image}" x="${(svgSize - imageSize) / 2}" y="${
// 			160 * dpiScale
// 		}" width="${imageSize}" height="${imageSize}" />

//             ${descriptionLines
// 				.map(
// 					(line, index) =>
// 						`<text x="${svgSize / 2}" y="${
// 							160 * dpiScale +
// 							imageSize +
// 							50 * dpiScale +
// 							index * descriptionSize * 1.2
// 						}" text-anchor="middle" class="description">${line}</text>`
// 				)
// 				.join("")}

//             <g transform="translate(${svgSize / 2 - 150 * dpiScale}, ${
// 			svgSize - 180 * dpiScale
// 		})">
//                 <svg width="${40 * dpiScale}" height="${
// 			40 * dpiScale
// 		}" viewBox="0 0 576 512">
//                     ${getRankIconSVG(index)}
//                 </svg>
//                 <text x="${50 * dpiScale}" y="${28 * dpiScale}" class="rank">
//                     ${getRankText(index)}
//                 </text>
//             </g>

//             ${pokemon.traits
// 				.map(
// 					(trait, i) =>
// 						`<text x="${svgSize / 2}" y="${
// 							svgSize - 100 * dpiScale + i * 30 * dpiScale
// 						}" text-anchor="middle" class="trait">${trait}</text>`
// 				)
// 				.join("")}
//         </svg>
//         `;

// 		return new NextResponse(svgContent, {
// 			headers: {
// 				"Content-Type": "image/svg+xml",
// 				"Content-Disposition": `attachment; filename="${pokemon.name}.svg"`,
// 			},
// 		});
// 	} catch (error) {
// 		console.error("Error generating SVG:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to generate SVG" },
// 			{ status: 500 }
// 		);
// 	}
// }

import { NextRequest, NextResponse } from "next/server";
// import { convertFileToBase64 } from "@/lib/base64-utils";
import { PokemonData } from "@/lib/constants";

export async function POST(req: NextRequest) {
	try {
		const {
			pokemon,
			pixelatedOg,
			index,
			hexColor,
			emoji,
			originalImageSize,
			originalFontSize,
		}: {
			pokemon: PokemonData;
			pixelatedOg: string;
			index: number;
			hexColor: string;
			emoji: string;
			originalImageSize: number;
			originalFontSize: number;
		} = await req.json();

		console.log(
			`Original Image Size: ${originalImageSize}, Original Font Size: ${originalFontSize}`
		);

		// const base64Image = await convertFileToBase64(
		// 	pokemon.image || "/placeholder-pokemon.png"
		// 	// "https://us-east.storage.cloudconvert.com/tasks/8c87b37c-7e2b-49bc-bb25-0f9572e48df4/DripTrace_DMT_entities_playing_with_sacred_geometrical_symmetry_8d2d2f62-81f3-46ee-8e38-e23abc3c9062.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cloudconvert-production%2F20241025%2Fva%2Fs3%2Faws4_request&X-Amz-Date=20241025T080408Z&X-Amz-Expires=86400&X-Amz-Signature=521f929cbc92b5a618ded96883fae5924b8560b364265cbbcf3421a03fb07bff&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3D%22DripTrace_DMT_entities_playing_with_sacred_geometrical_symmetry_8d2d2f62-81f3-46ee-8e38-e23abc3c9062.png%22&response-content-type=image%2Fpng&x-id=GetObject"
		// );

		// Adjust sizes for high DPI rendering, with a max of 300 DPI
		const dpiScale = 300 / 96; // Standard SVG DPI is 96, scale to 300 DPI
		const svgSize = 1024 * dpiScale; // Increase base size proportionally
		const imageSize = 512 * dpiScale;
		const nameSize = 72 * dpiScale;
		const emojiSize = 60 * dpiScale;
		const descriptionSize = 24 * dpiScale;
		const rankSize = 36 * dpiScale;
		const traitSize = 20 * dpiScale;

		const getRankText = (index: number): string => {
			if (index < 3) return "Your Top Match!";
			if (index >= 3 && index < 6) return "Runner Up";
			return "Can Relate To";
		};

		const getRankIconSVG = (index: number): string => {
			if (index < 3)
				return `<path fill="${hexColor}" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/>`;
			if (index >= 3 && index < 6)
				return `<path fill="${hexColor}" d="M223.75 130.75L154.62 15.54A31.997 31.997 0 0 0 127.18 0H16.03C3.08 0-4.5 14.57 2.92 25.18l111.27 158.96c29.72-27.77 67.52-46.83 109.56-53.39zM495.97 0H384.82c-11.24 0-21.66 5.9-27.44 15.54l-69.13 115.21c42.04 6.56 79.84 25.62 109.56 53.38L509.08 25.18C516.5 14.57 508.92 0 495.97 0zM256 160c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm92.52 157.26l-37.93 36.96 8.97 52.22c1.6 9.36-8.26 16.51-16.65 12.09L256 393.88l-46.9 24.65c-8.4 4.45-18.25-2.74-16.65-12.09l8.97-52.22-37.93-36.96c-6.82-6.64-3.05-18.23 6.35-19.59l52.43-7.64 23.43-47.52c2.11-4.28 6.19-6.39 10.28-6.39 4.11 0 8.22 2.14 10.33 6.39l23.43 47.52 52.43 7.64c9.4 1.36 13.17 12.95 6.35 19.59z"/>`;
			return `<path fill="${hexColor}" d="M488 192H336v56c0 39.7-32.3 72-72 72s-72-32.3-72-72V126.4l-64.9 39C107.8 176.9 96 197.8 96 220.2v47.3l-80 46.2C.7 322.5-4.6 342.1 4.3 357.4l80 138.6c8.8 15.3 28.4 20.5 43.7 11.7L231.4 448H368c35.3 0 64-28.7 64-64h16c17.7 0 32-14.3 32-32v-64h8c13.3 0 24-10.7 24-24v-48c0-13.3-10.7-24-24-24zm147.7-37.4L555.7 16C546.9.7 527.3-4.5 512 4.3L408.6 64H306.4c-12 0-23.7 3.4-33.9 9.7L239 94.6c-9.4 5.8-15 16.1-15 27.1V248c0 22.1 17.9 40 40 40s40-17.9 40-40v-88h184c30.9 0 56 25.1 56 56v28.5l80-46.2c15.3-8.9 20.5-28.4 11.7-43.7z"/>`;
		};

		// Splitting the description text to fit within a specified width
		const descriptionLines = pokemon.description.split(" ").reduce(
			(lines, word) => {
				const lastLine = lines[lines.length - 1];
				if (
					!lastLine ||
					(lastLine.length + word.length + 1) * descriptionSize <
						svgSize - 200
				) {
					lines[lines.length - 1] = lastLine
						? `${lastLine} ${word}`
						: word;
				} else {
					lines.push(word);
				}
				return lines;
			},
			[""]
		);

		const svgContent = `
        <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&amp;family=Oswald:wght@700&amp;family=Merriweather+Sans:wght@700&amp;display=swap');
                    .pokemon-name {
                        font-family: 'Oswald', sans-serif;
                        font-size: ${nameSize}px;
                        font-weight: bold;
                        letter-spacing: 2px;
                        fill: ${hexColor};
                    }
                    .emoji { font-size: ${emojiSize}px; }
                    .description {
                        font-family: 'Roboto', sans-serif;
                        font-size: ${descriptionSize}px;
                        font-weight: 700;
                        fill: ${hexColor};
                    }
                    .rank, .trait {
                        font-family: 'Merriweather Sans', sans-serif;
                        font-weight: bold;
                        fill: ${hexColor};
                    }
                    .rank { font-size: ${rankSize}px; }
                    .trait { font-size: ${traitSize}px; }
                </style>
                <path id="archPath" d="M ${svgSize / 4} ${140 * dpiScale} Q ${
			svgSize / 2
		} ${100 * dpiScale}, ${(3 * svgSize) / 4} ${140 * dpiScale}" />
            </defs>

            <text text-anchor="middle" class="pokemon-name">
                <textPath href="#archPath" startOffset="50%">
                    ${pokemon.name.toUpperCase()} <tspan class="emoji">${emoji}</tspan>
                </textPath>
            </text>

            <image href="${pixelatedOg}" x="${(svgSize - imageSize) / 2}" y="${
			160 * dpiScale
		}" width="${imageSize}" height="${imageSize}" />

            ${descriptionLines
				.map(
					(line, index) =>
						`<text x="${svgSize / 2}" y="${
							160 * dpiScale +
							imageSize +
							50 * dpiScale +
							index * descriptionSize * 1.2
						}" text-anchor="middle" class="description">${line}</text>`
				)
				.join("")}

            <g transform="translate(${svgSize / 2 - 150 * dpiScale}, ${
			svgSize - 180 * dpiScale
		})">
                <svg width="${40 * dpiScale}" height="${
			40 * dpiScale
		}" viewBox="0 0 576 512">
                    ${getRankIconSVG(index)}
                </svg>
                <text x="${50 * dpiScale}" y="${28 * dpiScale}" class="rank">
                    ${getRankText(index)}
                </text>
            </g>

            ${pokemon.traits
				.map(
					(trait, i) =>
						`<text x="${svgSize / 2}" y="${
							svgSize - 100 * dpiScale + i * 30 * dpiScale
						}" text-anchor="middle" class="trait">${trait}</text>`
				)
				.join("")}
        </svg>
        `;

		return new NextResponse(svgContent, {
			headers: {
				"Content-Type": "image/svg+xml",
				"Content-Disposition": `attachment; filename="${pokemon.name}.svg"`,
			},
		});
	} catch (error) {
		console.error("Error generating SVG:", error);
		return NextResponse.json(
			{ error: "Failed to generate SVG" },
			{ status: 500 }
		);
	}
}
