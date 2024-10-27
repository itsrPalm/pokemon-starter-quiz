import { SourceOptions } from "@/lib/constants";

/** Utility Functions */
export const getFilterId = () => "filter-" + String(Math.random()).slice(2);

export const urlToImage = (url: string): Promise<HTMLImageElement> =>
	new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		image.crossOrigin = "anonymous";
		image.onload = () => resolve(image);
		image.onerror = () =>
			reject(new Error("Couldn't convert SVG to image element"));
		image.src = url;
	});

export const base64ToImage = (base64: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		// img.src = `data:image/png;base64,${base64}`;
		img.src = `${base64}`;
	});

export const svgToImage = async (
	svg: SVGSVGElement
): Promise<HTMLImageElement> => {
	const svgString = new XMLSerializer().serializeToString(svg);
	const blob = new Blob([svgString], {
		type: "image/svg+xml;charset=utf-8",
	});
	const url = URL.createObjectURL(blob);
	const image = await urlToImage(url);
	URL.revokeObjectURL(url);
	return image;
};

export const sourceToSvg = async (
	source: string,
	options?: SourceOptions
): Promise<SVGSVGElement> => {
	const { type = "image/svg+xml", trim = false, color = "" } = options || {};
	const ns = "http://www.w3.org/2000/svg";
	const parser = new DOMParser();
	const doc = parser.parseFromString(source, type);
	const svg = doc.querySelector("svg");

	let error = doc.querySelector("parsererror")?.textContent || "";
	[
		"This page contains the following errors:",
		"Below is a rendering of the page up to the first error.",
	].forEach((phrase) => (error = error.replace(phrase, "")));
	if (error) throw new Error(error);
	if (!svg) throw new Error("No root SVG element");

	if (trim) {
		document.body.append(svg);
		let { x, y, width, height } = svg.getBBox();
		const strokeWidths = Array.from(svg.querySelectorAll("*")).map(
			(el) => parseFloat(getComputedStyle(el).strokeWidth) || 0
		);
		const margin = Math.max(...strokeWidths) / 2;
		x -= margin;
		y -= margin;
		width += 2 * margin;
		height += 2 * margin;
		document.body.removeChild(svg);
		svg.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
	}

	if (color.startsWith("~")) {
		svg.setAttribute("color", color.replace(/^~/, ""));
	} else if (color) {
		const filterId = getFilterId();
		const filter = document.createElementNS(ns, "filter");
		filter.setAttribute("id", filterId);

		const flood = document.createElementNS(ns, "feFlood");
		flood.setAttribute("flood-color", color);
		flood.setAttribute("result", "flood");

		const composite = document.createElementNS(ns, "feComposite");
		composite.setAttribute("operator", "in");
		composite.setAttribute("in", "flood");
		composite.setAttribute("in2", "SourceAlpha");

		filter.appendChild(flood);
		filter.appendChild(composite);
		svg.appendChild(filter);
		svg.setAttribute("filter", `url(#${filterId})`);
	}

	return svg;
};

/** Pixelation Utility Functions */
export const getBayerMatrix = (size: string) => {
	switch (size) {
		case "4x4":
			return [
				[0, 8, 2, 10],
				[12, 4, 14, 6],
				[3, 11, 1, 9],
				[15, 7, 13, 5],
			];
		case "2x2":
			return [
				[0, 2],
				[3, 1],
			];
		case "8x8":
			return [
				[0, 48, 12, 60, 3, 51, 15, 63],
				[32, 16, 44, 28, 35, 19, 47, 31],
				[8, 56, 4, 52, 11, 59, 7, 55],
				[40, 24, 36, 20, 43, 27, 39, 23],
				[2, 50, 14, 62, 1, 49, 13, 61],
				[34, 18, 46, 30, 33, 17, 45, 29],
				[10, 58, 6, 54, 9, 57, 5, 53],
				[42, 26, 38, 22, 41, 25, 37, 21],
			];
		default:
			throw new Error(`Unsupported Bayer matrix size: ${size}`);
	}
};

export const colorDistance = (rgb1: number[], rgb2: number[]): number => {
	const rmean = (rgb1[0] + rgb2[0]) / 2;
	const r = rgb1[0] - rgb2[0];
	const g = rgb1[1] - rgb2[1];
	const b = rgb1[2] - rgb2[2];
	return Math.sqrt(
		(2 + rmean / 256) * r * r +
			4 * g * g +
			(2 + (255 - rmean) / 256) * b * b
	);
};

export const findClosestPaletteColor = (
	rgb: number[],
	palette: number[][]
): number[] => {
	let minDist = Number.MAX_VALUE;
	let closest = palette[0];

	for (const color of palette) {
		const dist = colorDistance(rgb, color);
		if (dist < minDist) {
			minDist = dist;
			closest = color;
		}
	}

	return closest;
};

export const distributeError = (
	data: Uint8ClampedArray,
	x: number,
	y: number,
	width: number,
	height: number,
	errR: number,
	errG: number,
	errB: number,
	factor: number
) => {
	if (x < 0 || x >= width || y < 0 || y >= height) return;

	const i = (y * width + x) * 4;
	data[i] = Math.min(255, Math.max(0, data[i] + errR * factor));
	data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + errG * factor));
	data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + errB * factor));
};

export const floydSteinbergDither = (
	imageData: ImageData,
	width: number,
	height: number,
	strength: number,
	palette: number[][]
): ImageData => {
	const data = new Uint8ClampedArray(imageData.data);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = (y * width + x) * 4;

			const oldR = data[i];
			const oldG = data[i + 1];
			const oldB = data[i + 2];

			const newColor = findClosestPaletteColor(
				[oldR, oldG, oldB],
				palette
			);

			data[i] = newColor[0];
			data[i + 1] = newColor[1];
			data[i + 2] = newColor[2];

			const errR = (oldR - newColor[0]) * strength;
			const errG = (oldG - newColor[1]) * strength;
			const errB = (oldB - newColor[2]) * strength;

			distributeError(
				data,
				x + 1,
				y,
				width,
				height,
				errR,
				errG,
				errB,
				7 / 16
			);
			distributeError(
				data,
				x - 1,
				y + 1,
				width,
				height,
				errR,
				errG,
				errB,
				3 / 16
			);
			distributeError(
				data,
				x,
				y + 1,
				width,
				height,
				errR,
				errG,
				errB,
				5 / 16
			);
			distributeError(
				data,
				x + 1,
				y + 1,
				width,
				height,
				errR,
				errG,
				errB,
				1 / 16
			);
		}
	}

	return new ImageData(data, width, height);
};

export const atkinsonDither = (
	imageData: ImageData,
	width: number,
	height: number,
	strength: number,
	palette: number[][]
): ImageData => {
	const data = new Uint8ClampedArray(imageData.data);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = (y * width + x) * 4;

			const oldR = data[i];
			const oldG = data[i + 1];
			const oldB = data[i + 2];

			const newColor = findClosestPaletteColor(
				[oldR, oldG, oldB],
				palette
			);

			data[i] = newColor[0];
			data[i + 1] = newColor[1];
			data[i + 2] = newColor[2];

			const errR = (oldR - newColor[0]) * strength;
			const errG = (oldG - newColor[1]) * strength;
			const errB = (oldB - newColor[2]) * strength;

			distributeError(
				data,
				x + 1,
				y,
				width,
				height,
				errR,
				errG,
				errB,
				1 / 8
			);
			distributeError(
				data,
				x + 2,
				y,
				width,
				height,
				errR,
				errG,
				errB,
				1 / 8
			);
			distributeError(
				data,
				x - 1,
				y + 1,
				width,
				height,
				errR,
				errG,
				errB,
				1 / 8
			);
			distributeError(
				data,
				x,
				y + 1,
				width,
				height,
				errR,
				errG,
				errB,
				1 / 8
			);
			distributeError(
				data,
				x + 1,
				y + 1,
				width,
				height,
				errR,
				errG,
				errB,
				1 / 8
			);
			distributeError(
				data,
				x,
				y + 2,
				width,
				height,
				errR,
				errG,
				errB,
				1 / 8
			);
		}
	}

	return new ImageData(data, width, height);
};

export const orderedDither = (
	imageData: ImageData,
	width: number,
	height: number,
	strength: number,
	palette: number[][],
	bayerMatrix: number[][]
): ImageData => {
	const data = new Uint8ClampedArray(imageData.data);
	const matrixSize = bayerMatrix.length;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = (y * width + x) * 4;
			const oldColor = [data[i], data[i + 1], data[i + 2]];

			const threshold =
				((bayerMatrix[y % matrixSize][x % matrixSize] + 0.5) /
					(matrixSize * matrixSize)) *
				255;

			const adjustedColor = [
				oldColor[0] + (threshold - 127.5) * strength,
				oldColor[1] + (threshold - 127.5) * strength,
				oldColor[2] + (threshold - 127.5) * strength,
			];

			const newColor = findClosestPaletteColor(adjustedColor, palette);

			data[i] = newColor[0];
			data[i + 1] = newColor[1];
			data[i + 2] = newColor[2];
		}
	}

	return new ImageData(data, width, height);
};

export const pixelate = async (options: {
	image: HTMLImageElement;
	width: number;
	dither?: string;
	strength?: number;
	palette?: string[];
	resolution?: "original" | "pixel";
}): Promise<string> => {
	const {
		image,
		width,
		dither = "none",
		strength = 0,
		palette = null,
		resolution = "original",
	} = options;

	const aspectRatio = image.height / image.width;
	const pixelsWide = width;
	const pixelsHigh = Math.round(pixelsWide * aspectRatio);

	const canvas = document.createElement("canvas");
	canvas.width = pixelsWide;
	canvas.height = pixelsHigh;

	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Failed to get canvas context");
	ctx.imageSmoothingEnabled = false;

	ctx.drawImage(image, 0, 0, pixelsWide, pixelsHigh);

	let imageData = ctx.getImageData(0, 0, pixelsWide, pixelsHigh);

	if (palette) {
		const rgbPalette = palette.map((hex) => {
			const r = parseInt(hex.substr(1, 2), 16);
			const g = parseInt(hex.substr(3, 2), 16);
			const b = parseInt(hex.substr(5, 2), 16);
			return [r, g, b];
		});

		switch (dither) {
			case "Floyd-Steinberg":
				imageData = floydSteinbergDither(
					imageData,
					pixelsWide,
					pixelsHigh,
					strength / 100,
					rgbPalette
				);
				break;
			case "4x4 Bayer":
				imageData = orderedDither(
					imageData,
					pixelsWide,
					pixelsHigh,
					strength / 100,
					rgbPalette,
					getBayerMatrix("4x4")
				);
				break;
			case "Atkinson":
				imageData = atkinsonDither(
					imageData,
					pixelsWide,
					pixelsHigh,
					strength / 100,
					rgbPalette
				);
				break;
			case "2x2 Bayer":
				imageData = orderedDither(
					imageData,
					pixelsWide,
					pixelsHigh,
					strength / 100,
					rgbPalette,
					getBayerMatrix("2x2")
				);
				break;
			case "ordered":
				imageData = orderedDither(
					imageData,
					pixelsWide,
					pixelsHigh,
					strength / 100,
					rgbPalette,
					getBayerMatrix("8x8")
				);
				break;
		}

		ctx.putImageData(imageData, 0, 0);
	}

	if (resolution === "original") {
		const finalCanvas = document.createElement("canvas");
		finalCanvas.width = image.width;
		finalCanvas.height = image.height;
		const finalCtx = finalCanvas.getContext("2d");
		if (!finalCtx) throw new Error("Failed to get final canvas context");
		finalCtx.imageSmoothingEnabled = false;
		finalCtx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);
		return finalCanvas.toDataURL("image/png").split(",")[1];
	}

	return canvas.toDataURL("image/png").split(",")[1];
};

// export type PixelizedImage = ProductModalProps["pngImage"]

// export const pixelation: (imageBase64: string) => Promise<PixelizedImage> = async (imageBase64: string): Promise<string> => {
//     try {
//         const image = await base64ToImage(imageBase64);

//         const options = {
//             image,
//             width: pixelSizes[
//                 Math.floor(Math.random() * pixelSizes.length)
//             ],
//             dither: ditherTypes[
//                 Math.floor(Math.random() * ditherTypes.length)
//             ],
//             strength: Math.floor(
//                 Math.random() *
//                     (strengthRange.max - strengthRange.min) +
//                     strengthRange.min
//             ),
//             palette: DEFAULT_PALETTES[0].colors,
//             resolution: "original" as const,
//         };

//         return await pixelate(options);
//     } catch (error) {
//         console.error("Error during pixelation:", error);
//         throw new Error("Failed to pixelate image");
//     }
// }
