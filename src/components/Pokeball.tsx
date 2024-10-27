import { PokeballProps } from "@/lib/constants";

export const Pokeball = ({ isOpen, children, imageSize }: PokeballProps) => (
	<div
		className="relative flex items-center justify-center"
		style={{
			width: `${imageSize}px`,
			height: `${imageSize}px`,
			overflow: "hidden",
		}}
	>
		<svg viewBox="0 0 100 100" className="w-full h-full">
			<circle cx="50" cy="50" r="50" fill="#f2f2f2" />
			<path
				d="M5,50 a1,1 0 0,1 90,0"
				fill="#ff1a1a"
				className={`transition-all duration-1000 ${
					isOpen ? "translate-y-[-25px] rotate-[-25deg]" : ""
				}`}
			/>
			<circle
				cx="50"
				cy="50"
				r="12"
				fill="#2c2c2c"
				stroke="#f2f2f2"
				strokeWidth="2"
			/>
			<path
				d="M95,50 a1,1 0 0,1 -90,0"
				fill="#f2f2f2"
				className={`transition-all duration-1000 ${
					isOpen ? "translate-y-[25px] rotate-[25deg]" : ""
				}`}
			/>
		</svg>
		<div
			className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
				isOpen ? "opacity-100" : "opacity-0"
			}`}
		>
			{children}
		</div>
	</div>
);
