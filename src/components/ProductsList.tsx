// src/components/ProductsList.tsx

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { Variant } from "@/lib/constants";

export default function ProductList() {
	const [variants, setVariants] = useState<Variant[]>([]);
	const [randomVariant, setRandomVariant] = useState<Variant | null>(null);

	useEffect(() => {
		async function fetchVariants() {
			try {
				const response = await axios.get("/api/products");
				const allVariants: Variant[] = response.data.flatMap(
					(product: { variants: Variant[] }) => product.variants
				);
				setVariants(allVariants);
			} catch (error) {
				console.error("Error fetching variants:", error);
			}
		}
		fetchVariants();
	}, []);

	const handleRandomize = () => {
		if (variants.length === 0) return;

		const randomIndex = Math.floor(Math.random() * variants.length);
		setRandomVariant(variants[randomIndex]);
	};

	return (
		<div>
			<button onClick={handleRandomize} className="btn btn-primary mb-4">
				Randomize
			</button>
			{randomVariant && <ProductCard variant={randomVariant} />}
			{/* Display all variants */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{variants.map((variant) => (
					<ProductCard key={variant.id} variant={variant} />
				))}
			</div>
		</div>
	);
}
