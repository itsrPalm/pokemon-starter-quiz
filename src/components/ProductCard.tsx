// src/components/ProductCard.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { Variant } from "@/lib/constants";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface ProductCardProps {
	variant: Variant;
}

export default function ProductCard({ variant }: ProductCardProps) {
	const [mockupUrl, setMockupUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (file) {
			setIsLoading(true);
			const formData = new FormData();
			formData.append("file", file);
			try {
				const uploadResponse = await axios.post(
					"/api/upload",
					formData,
					{
						headers: { "Content-Type": "multipart/form-data" },
					}
				);
				const imageUrl = uploadResponse.data.imageUrl;

				const mockupResponse = await axios.post("/api/mockup", {
					variantId: variant.printfulId,
					imageUrl,
				});
				setMockupUrl(mockupResponse.data.mockupUrl);
			} catch (error) {
				console.error(
					"Error uploading image or generating mockup:",
					error
				);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handlePurchase = async () => {
		if (!mockupUrl) return;
		try {
			const response = await axios.post("/api/stripe/create-session", {
				variantId: variant.id,
				mockupUrl,
			});
			const stripe = await stripePromise;
			await stripe?.redirectToCheckout({
				sessionId: response.data.sessionId,
			});
		} catch (error) {
			console.error("Error initiating purchase:", error);
		}
	};

	return (
		<div className="border rounded-lg p-4 shadow-md">
			<h2 className="text-xl font-semibold mb-2">{variant.name}</h2>
			<p className="mb-2">Price: ${variant.retailPrice.toFixed(2)}</p>
			<input
				type="file"
				accept="image/png"
				onChange={handleImageUpload}
				className="mb-4"
			/>
			{isLoading && <p>Generating mockup...</p>}
			{mockupUrl && (
				<div className="relative">
					<Image
						src={mockupUrl}
						alt="Product Mockup"
						className="w-full"
						height={512}
						width={512}
					/>
					<button
						onClick={handlePurchase}
						className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
					>
						Buy Now
					</button>
				</div>
			)}
		</div>
	);
}
