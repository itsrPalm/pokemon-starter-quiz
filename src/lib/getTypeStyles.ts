export const getTypeStyles = (type: "grass" | "fire" | "water" | "result") => {
	switch (type) {
		case "grass":
			return {
				background: "bg-green-200",
				border: "border-green-500",
				button: "bg-green-500 hover:bg-green-600",
				text: "text-green-900",
				emoji: "🌿",
			};
		case "fire":
			return {
				background: "bg-orange-200",
				border: "border-orange-500",
				button: "bg-orange-500 hover:bg-orange-600",
				text: "text-orange-900",
				emoji: "🔥",
			};
		case "water":
			return {
				background: "bg-blue-200",
				border: "border-blue-500",
				button: "bg-blue-500 hover:bg-blue-600",
				text: "text-blue-900",
				emoji: "💧",
			};
		default:
			return {
				background: "bg-gray-200",
				border: "border-gray-500",
				button: "bg-gray-500 hover:bg-gray-600",
				text: "text-gray-900",
				emoji: "❓",
			};
	}
};
