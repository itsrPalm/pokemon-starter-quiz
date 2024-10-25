// src/types/printful.ts

export interface HatProduct {
	id: number;
	main_category_id: number;
	type: string; // Consider using enums if types are fixed
	description: string;
	type_name: string;
	title: string;
	brand: string;
	model: string;
	image: string;
	variant_count: number;
	currency: string;
	options: Option[];
	dimensions: Dimensions | null;
	is_discontinued: boolean;
	avg_fulfillment_time: string | null;
	techniques: Technique[];
	files: File[];
	origin_country: string | null;
}

export interface Dimensions {
	width: number;
	height: number;
	depth: number;
}

export interface Option {
	id: string;
	title: string;
	type: OptionType;
	values: Record<string, string> | null;
	additional_price: string | null;
	additional_price_breakdown: PriceBreakdown;
}

export type OptionType = "radio" | "multi_select" | "text";

export interface PriceBreakdown {
	flat: string;
	"3d": string;
	both: string;
}

export interface Technique {
	key: string;
	display_name: string;
	is_default: boolean;
}

export interface File {
	id: string;
	type: FileType;
	title: string;
	additional_price: string | null;
	options: FileOption[];
}

export type FileType =
	| "embroidery_front_large"
	| "embroidery_front"
	| "embroidery_back"
	| "embroidery_right"
	| "embroidery_left"
	| "mockup";

export interface FileOption {
	id: string;
	type: FileOptionType;
	title: string;
	additional_price: number;
}

export type FileOptionType = "bool";
