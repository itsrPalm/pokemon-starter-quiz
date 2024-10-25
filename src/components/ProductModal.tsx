// src/components/ProductModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FaRandom, FaShoppingCart, FaTshirt, FaSpinner } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import NextImage from "next/image";
import { Pokemon } from "@/lib/constants";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface ProductModalProps {
	isVisible: boolean;
	onClose: () => void;
	pokemon: Pokemon | undefined;
	pngImage: string | null;
}

interface HatProduct {
	id: string;
	printfulId: number;
	mainCategoryId: number;
	type: string;
	description: string;
	title: string;
	brand: string;
	model: string;
	image: string;
	variantCount: number;
	currency: string;
	options: HatOption[];
	techniques: Technique[];
	files: HatFile[];
}

interface Technique {
	key: string;
	display_name: string;
	is_default: boolean;
}

interface HatFile {
	id: string;
	type: string;
	title: string;
	additional_price: string | null;
	options: FileOption[];
}

interface FileOption {
	id: string;
	type: string;
	title: string;
	additional_price: number;
}

interface HatOption {
	id: string;
	title: string;
	type: "radio" | "multi_select" | "text";
	values: Record<string, string> | null;
	additional_price: number | null;
	additional_price_breakdown: Record<string, string> | null;
}

type SelectedOptions = {
	[key: string]: string | string[];
};

const ProductModal = ({
	isVisible,
	onClose,
	pokemon,
	pngImage,
}: ProductModalProps) => {
	const [hatProduct, setHatProduct] = useState<HatProduct | null>(null);
	const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
	const [isGeneratingMockup, setIsGeneratingMockup] = useState(false);
	const [mockupUrl, setMockupUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isVisible) {
			fetchHatProduct();
		}
	}, [isVisible]);

	const fetchHatProduct = async () => {
		try {
			const response = await fetch("/api/hat");
			const data: HatProduct = await response.json();
			setHatProduct(data);

			// Initialize selectedOptions
			const initialOptions: SelectedOptions = {};
			data.options.forEach((option: HatOption) => {
				if (option.type === "radio") {
					const values = option.values
						? Object.keys(option.values)
						: [];
					const defaultValue = values[0];
					initialOptions[option.id] = defaultValue;
				} else if (option.type === "multi_select") {
					initialOptions[option.id] = [];
				} else if (option.type === "text") {
					initialOptions[option.id] = "";
				}
			});
			setSelectedOptions(initialOptions);
		} catch (error) {
			console.error("Error fetching hat product:", error);
			setError("Failed to load product data. Please try again later.");
		}
	};

	const handleOptionChange = (optionId: string, value: string | string[]) => {
		setSelectedOptions((prev) => ({
			...prev,
			[optionId]: value,
		}));
	};

	const handleRandomize = () => {
		if (!hatProduct) return;
		const randomizedOptions: SelectedOptions = {};
		hatProduct.options.forEach((option: HatOption) => {
			if (option.type === "radio") {
				const values = option.values ? Object.keys(option.values) : [];
				const randomValue =
					values[Math.floor(Math.random() * values.length)];
				randomizedOptions[option.id] = randomValue;
			} else if (option.type === "multi_select") {
				const values = option.values ? Object.keys(option.values) : [];
				const selectedValues = values.filter(() => Math.random() < 0.5);
				randomizedOptions[option.id] = selectedValues;
			} else if (option.type === "text") {
				randomizedOptions[option.id] = "";
			}
		});
		setSelectedOptions(randomizedOptions);
	};

	const generateMockup = async () => {
		if (!pngImage) return;

		try {
			setIsGeneratingMockup(true);
			const response = await fetch("/api/create-hat-variant", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					selectedOptions,
					pngImage,
				}),
			});

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			setMockupUrl(data.mockupUrl);
			return data;
		} catch (error) {
			console.error("Error generating mockup:", error);
			setError("Failed to generate mockup. Please try again.");
		} finally {
			setIsGeneratingMockup(false);
		}
	};

	const handleCheckout = async () => {
		if (!pngImage) return;

		try {
			setIsGeneratingMockup(true);

			const data = await generateMockup();

			if (!data || !data.sessionId) {
				throw new Error("Invalid response from mockup generation.");
			}

			const stripe = await stripePromise;
			if (stripe) {
				await stripe.redirectToCheckout({ sessionId: data.sessionId });
			}
		} catch (error) {
			console.error("Error during checkout:", error);
			setError("Failed to proceed to checkout. Please try again.");
		} finally {
			setIsGeneratingMockup(false);
		}
	};

	if (!isVisible || !pokemon || !pngImage || !hatProduct) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
				<CardHeader className="border-b">
					<button
						className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
						onClick={onClose}
						aria-label="Close Modal"
					>
						×
					</button>
					<div className="flex items-center">
						<FaTshirt className="text-3xl text-purple-600 mr-3" />
						<h2 className="text-2xl font-bold text-purple-800">
							Customize Your {pokemon.name} Hat
						</h2>
					</div>
				</CardHeader>

				<CardContent className="p-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div className="space-y-6">
							{error && (
								<div className="bg-red-100 text-red-700 p-3 rounded">
									{error}
								</div>
							)}

							{/* Options Form */}
							{hatProduct.options.map((option: HatOption) => (
								<div key={option.id} className="mb-4">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										{option.title}
									</label>
									{option.type === "radio" &&
										option.values && (
											<select
												value={
													selectedOptions[
														option.id
													] as string
												}
												onChange={(e) =>
													handleOptionChange(
														option.id,
														e.target.value
													)
												}
												className="mt-1 block w-full border-gray-300 rounded-md"
											>
												{Object.entries(
													option.values
												).map(([value, label]) => (
													<option
														key={value}
														value={value}
													>
														{label}
													</option>
												))}
											</select>
										)}
									{option.type === "multi_select" &&
										option.values && (
											<div className="grid grid-cols-3 gap-2">
												{Object.entries(
													option.values
												).map(([value, label]) => (
													<label
														key={value}
														className="flex items-center"
													>
														<input
															type="checkbox"
															value={value}
															checked={(
																selectedOptions[
																	option.id
																] as string[]
															).includes(value)}
															onChange={(e) => {
																const checked =
																	e.target
																		.checked;
																setSelectedOptions(
																	(prev) => {
																		const selectedValues: string[] =
																			(prev[
																				option
																					.id
																			] as string[]) ||
																			[];
																		if (
																			checked
																		) {
																			return {
																				...prev,
																				[option.id]:
																					[
																						...selectedValues,
																						value,
																					],
																			};
																		} else {
																			return {
																				...prev,
																				[option.id]:
																					selectedValues.filter(
																						(
																							v
																						) =>
																							v !==
																							value
																					),
																			};
																		}
																	}
																);
															}}
															className="mr-2"
														/>
														<span>{label}</span>
													</label>
												))}
											</div>
										)}
									{option.type === "text" && (
										<input
											type="text"
											value={
												selectedOptions[
													option.id
												] as string
											}
											onChange={(e) =>
												handleOptionChange(
													option.id,
													e.target.value
												)
											}
											className="mt-1 block w-full border-gray-300 rounded-md"
										/>
									)}
								</div>
							))}

							<div className="flex items-center space-x-4">
								<Button onClick={handleRandomize}>
									<FaRandom className="mr-2" />
									Randomize
								</Button>
								<Button
									onClick={handleCheckout}
									disabled={isGeneratingMockup}
								>
									{isGeneratingMockup ? (
										<>
											<FaSpinner className="animate-spin mr-2" />
											Generating...
										</>
									) : (
										<>
											<FaShoppingCart className="mr-2" />
											Buy Now
										</>
									)}
								</Button>
							</div>
						</div>

						{/* Product Viewer */}
						<div className="flex flex-col items-center">
							{isGeneratingMockup ? (
								<div className="flex items-center justify-center w-[512px] h-[512px]">
									<FaSpinner className="animate-spin h-8 w-8 text-purple-600" />
									<span className="ml-2">
										Generating preview...
									</span>
								</div>
							) : mockupUrl ? (
								<div className="relative w-[512px] h-[512px]">
									<NextImage
										src={mockupUrl}
										alt="Product mockup"
										layout="fill"
										className="object-contain"
									/>
								</div>
							) : (
								<div className="relative w-[512px] h-[512px]">
									<NextImage
										src={pngImage}
										alt="Original design"
										layout="fill"
										className="object-contain"
									/>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ProductModal;
