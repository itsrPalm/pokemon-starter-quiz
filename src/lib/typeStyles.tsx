// lib/typeStyles.ts
import { FaStar, FaMedal, FaHandsHelping } from "react-icons/fa";

export const typeStyles: Record<
	"grass" | "fire" | "water",
	{
		background: string;
		text: string;
		rankIcon: JSX.Element;
	}
> = {
	grass: {
		background: "bg-green-100",
		text: "text-green-800",
		rankIcon: (
			<FaStar className="inline-block mr-2" aria-label="Top Match Icon" />
		),
	},
	fire: {
		background: "bg-red-100",
		text: "text-red-800",
		rankIcon: (
			<FaMedal
				className="inline-block mr-2"
				aria-label="Runner Up Icon"
			/>
		),
	},
	water: {
		background: "bg-blue-100",
		text: "text-blue-800",
		rankIcon: (
			<FaHandsHelping
				className="inline-block mr-2"
				aria-label="Can Relate To Icon"
			/>
		),
	},
};
