// src/app/api/create-variant/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import { getPrintfulClient } from "@/lib/printful/printful-auth";

const prisma = new PrismaClient();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
	throw new Error(
		"STRIPE_SECRET_KEY is not defined in environment variables"
	);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: "2024-09-30.acacia",
});

// Constants for available options
const THREAD_COLORS = {
	"#FFFFFF": "1801 White",
	"#000000": "1800 Black",
	"#96A1A8": "1718 Grey",
	"#A67843": "1672 Old Gold",
	"#FFCC00": "1951 Gold",
	"#E25C27": "1987 Orange",
	"#CC3366": "1910 Flamingo",
	"#CC3333": "1839 Red",
	"#660000": "1784 Maroon",
	"#333366": "1966 Navy",
	"#005397": "1842 Royal",
	"#3399FF": "1695 Aqua/Teal",
	"#6B5294": "1832 Purple",
	"#01784E": "1751 Kelly Green",
	"#7BA35A": "1848 Kiwi Green",
};

const EMBROIDERY_POSITIONS = {
	front: { id: "embroidery_front", price: 2.95 },
	front_large: { id: "embroidery_front_large", price: 2.95 },
	back: { id: "embroidery_back", price: 2.95 },
	right: { id: "embroidery_right", price: 2.95 },
	left: { id: "embroidery_left", price: 2.95 },
};

const EMBROIDERY_TYPES = {
	flat: { title: "Flat Embroidery", price: 0.0 },
	"3d": { title: "3D Puff", price: 1.5 },
	both: { title: "Partial 3D Puff", price: 1.5 },
};

interface VariantData {
	id: string;
	printfulFileId: number;
	name: string;
	color: string;
	size: string;
	image: string;
	retailPrice: number;
	currency: string;
	stripePriceId: string;
	hatProduct: { connect: { id: string } };
	selectedOptions: Record<string, string | string[] | null>;
	createdAt: Date;
	updatedAt: Date;
}

function randomizeThreadColors(): string[] {
	const colorKeys = Object.keys(THREAD_COLORS);
	const numberOfColors = Math.floor(Math.random() * 3) + 1; // 1-3 colors
	return colorKeys.sort(() => Math.random() - 0.5).slice(0, numberOfColors);
}

function selectRandomEmbroideryType(): string {
	const types = Object.keys(EMBROIDERY_TYPES);
	return types[Math.floor(Math.random() * types.length)];
}

function getRandomEmbroideryPositions(): string[] {
	const positions = Object.keys(EMBROIDERY_POSITIONS);
	const numberOfPositions =
		Math.floor(Math.random() * (positions.length - 1)) + 1;
	return positions
		.sort(() => Math.random() - 0.5)
		.slice(0, numberOfPositions);
}

function generateOptions(): Record<string, string | string[] | null> {
	const selectedOptions: Record<string, string | string[] | null> = {};

	const embroideryType = selectRandomEmbroideryType();
	selectedOptions["embroidery_type"] = embroideryType;

	if (embroideryType === "flat" || embroideryType === "both") {
		selectedOptions["thread_colors"] = randomizeThreadColors();
	}
	if (embroideryType === "3d" || embroideryType === "both") {
		selectedOptions["thread_colors_3d"] = randomizeThreadColors();
	}

	const selectedPositions = getRandomEmbroideryPositions();
	selectedPositions.forEach((position) => {
		const optionKey =
			position === "front_large"
				? embroideryType === "3d"
					? "thread_colors_3d_front_large"
					: "thread_colors_front_large"
				: `thread_colors_${position}`;

		selectedOptions[optionKey] = randomizeThreadColors();
	});

	selectedOptions["notes"] = "Custom embroidered design";

	return selectedOptions;
}

function calculateTotalPrice(
	selectedOptions: Record<string, string | string[] | null>
): number {
	let totalPrice = 29.99; // Base price

	const embroideryType = selectedOptions["embroidery_type"] as string;
	totalPrice +=
		EMBROIDERY_TYPES[embroideryType as keyof typeof EMBROIDERY_TYPES].price;

	Object.keys(selectedOptions).forEach((key) => {
		if (key.startsWith("thread_colors_") && selectedOptions[key]) {
			const position = key
				.replace("thread_colors_", "")
				.replace("_3d", "");
			if (
				EMBROIDERY_POSITIONS[
					position as keyof typeof EMBROIDERY_POSITIONS
				]
			) {
				totalPrice +=
					EMBROIDERY_POSITIONS[
						position as keyof typeof EMBROIDERY_POSITIONS
					].price;
			}
		}
	});

	return totalPrice * 2;
}

function getSelectedColorNames(
	selectedOptions: Record<string, string | string[] | null>
): string {
	const colorSet = new Set<string>();

	Object.entries(selectedOptions)
		.filter(([key]) => key.includes("thread_colors"))
		.forEach(([_, colors]) => {
			if (Array.isArray(colors)) {
				colors.forEach((color) => {
					const colorName =
						THREAD_COLORS[color as keyof typeof THREAD_COLORS];
					if (colorName) colorSet.add(colorName);
				});
			}
		});

	return Array.from(colorSet).join(", ") || "Default Colors";
}

async function uploadToPrintful(
	imageUrl: string
): Promise<{ id: number; url: string }> {
	try {
		const printfulClient = await getPrintfulClient();
		const printfulPayload = {
			role: "printfile",
			url: imageUrl,
			filename: `hat_variant_${uuidv4()}.png`,
			visible: true,
		};

		const printfulResponse = (await printfulClient.post(
			"v2/files",
			printfulPayload
		)) as { data: { id: number; url: string } };
		const fileId = printfulResponse.data.id;

		if (!fileId) {
			throw new Error("Invalid response from Printful API");
		}

		return { id: fileId, url: imageUrl };
	} catch (error) {
		throw new Error(`Failed to upload to Printful:\n${error}`);
	}
}

export async function POST(req: NextRequest) {
	try {
		const { resultId, imageUrl } = await req.json();

		if (!resultId || !imageUrl) {
			return NextResponse.json(
				{ error: "Missing required parameters" },
				{ status: 400 }
			);
		}

		const { id: printfulFileId, url: printfulUrl } = await uploadToPrintful(
			imageUrl
		);

		const hatProductRaw = await prisma.hatProduct.findUnique({
			where: { id: resultId },
			include: { options: true, techniques: true },
		});

		if (!hatProductRaw) {
			return NextResponse.json(
				{ error: "HatProduct not found" },
				{ status: 404 }
			);
		}

		const selectedOptions = generateOptions();
		const finalRetailPrice = calculateTotalPrice(selectedOptions);
		const variantName = `Custom Hat - ${getSelectedColorNames(
			selectedOptions
		)}`;

		const stripeProduct = await stripe.products.create({
			name: variantName,
			description: hatProductRaw.description || undefined,
			images: [printfulUrl],
		});

		const stripePrice = await stripe.prices.create({
			product: stripeProduct.id,
			unit_amount: Math.round(finalRetailPrice * 100),
			currency: hatProductRaw.currency.toLowerCase(),
		});

		const variantData: VariantData = {
			id: uuidv4(),
			printfulFileId,
			name: variantName,
			color: getSelectedColorNames(selectedOptions),
			size: "M",
			image: printfulUrl,
			retailPrice: finalRetailPrice,
			currency: hatProductRaw.currency,
			stripePriceId: stripePrice.id,
			hatProduct: { connect: { id: hatProductRaw.id } },
			selectedOptions,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const variant = await prisma.hatVariant.create({ data: variantData });

		return NextResponse.json({ variant }, { status: 200 });
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error: "Failed to generate hat variant.",
					details: error.response?.data,
				},
				{ status: error.response?.status || 500 }
			);
		} else if (error instanceof Error) {
			return NextResponse.json(
				{ error: "Internal Server Error." },
				{ status: 500 }
			);
		} else {
			return NextResponse.json(
				{ error: "An unexpected error occurred." },
				{ status: 500 }
			);
		}
	} finally {
		await prisma.$disconnect();
	}
}
