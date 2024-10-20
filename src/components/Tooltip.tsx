// // src/components/Tooltip.tsx

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import ReactDOM from "react-dom";
// import { motion, AnimatePresence } from "framer-motion";

// interface TooltipProps {
// 	content: string[];
// 	anchorRef: React.RefObject<HTMLElement>;
// 	isVisible: boolean;
// 	toggleVisibility: () => void; // Function to toggle tooltip visibility
// }

// const Tooltip: React.FC<TooltipProps> = ({
// 	content,
// 	anchorRef,
// 	isVisible,
// 	toggleVisibility,
// }) => {
// 	const tooltipRef = useRef<HTMLDivElement>(null);
// 	const [position, setPosition] = useState<"right" | "left">("right");

// 	useEffect(() => {
// 		const updatePosition = () => {
// 			if (!anchorRef.current || !tooltipRef.current) return;

// 			const { top, bottom, left, right } =
// 				anchorRef.current.getBoundingClientRect();
// 			const tooltipWidth = tooltipRef.current.offsetWidth;
// 			const tooltipHeight = tooltipRef.current.offsetHeight;
// 			const viewportWidth = window.innerWidth;
// 			const viewportHeight = window.innerHeight;

// 			// Calculate available space
// 			const spaceRight = viewportWidth - right;
// 			const spaceLeft = left;

// 			// Decide whether to place tooltip to the right or left
// 			if (spaceRight < tooltipWidth + 10 && spaceLeft > spaceRight) {
// 				setPosition("left");
// 			} else {
// 				setPosition("right");
// 			}

// 			// Calculate top position to align the tooltip vertically centered with the anchor
// 			const anchorCenterY = top + (bottom - top) / 2;
// 			const tooltipTop = anchorCenterY - tooltipHeight / 2;

// 			// Prevent tooltip from going off the top or bottom of the viewport
// 			const adjustedTop = Math.min(
// 				Math.max(tooltipTop, 10),
// 				viewportHeight - tooltipHeight - 10
// 			);

// 			// Apply styles based on position
// 			if (tooltipRef.current) {
// 				if (position === "right") {
// 					tooltipRef.current.style.left = `${right + 10}px`; // 10px margin from the anchor
// 				} else {
// 					tooltipRef.current.style.left = `${
// 						left - tooltipWidth - 10
// 					}px`; // 10px margin from the anchor
// 				}
// 				tooltipRef.current.style.top = `${adjustedTop}px`;
// 			}
// 		};

// 		if (isVisible) {
// 			// Delay the position update to allow tooltip to render and get dimensions
// 			setTimeout(updatePosition, 0);
// 			window.addEventListener("resize", updatePosition);
// 			window.addEventListener("scroll", updatePosition, true);

// 			// Intersection Observer to detect if anchor is in view
// 			const observer = new IntersectionObserver(
// 				(entries) => {
// 					entries.forEach((entry) => {
// 						if (!entry.isIntersecting) {
// 							toggleVisibility();
// 						}
// 					});
// 				},
// 				{
// 					root: null, // viewport
// 					threshold: 0.1, // 10% of the element is visible
// 				}
// 			);

// 			if (anchorRef.current) {
// 				observer.observe(anchorRef.current);
// 			}

// 			return () => {
// 				window.removeEventListener("resize", updatePosition);
// 				window.removeEventListener("scroll", updatePosition, true);
// 				if (anchorRef.current) {
// 					observer.unobserve(anchorRef.current);
// 				}
// 			};
// 		}
// 	}, [isVisible, anchorRef, position, toggleVisibility]);

// 	if (!isVisible || !anchorRef.current) return null;

// 	const tooltipContent = (
// 		<AnimatePresence>
// 			{isVisible && (
// 				<motion.div
// 					className="p-2 bg-white rounded shadow-lg text-sm max-w-xs"
// 					style={{
// 						position: "fixed",
// 						zIndex: 1000,
// 					}}
// 					initial={{ opacity: 0, scale: 0.95 }}
// 					animate={{ opacity: 1, scale: 1 }}
// 					exit={{ opacity: 0, scale: 0.95 }}
// 					transition={{ duration: 0.2 }}
// 					ref={tooltipRef}
// 				>
// 					<ul className="list-disc pl-4 text-gray-800">
// 						{content.map((item, index) => (
// 							<li key={index}>{item}</li>
// 						))}
// 					</ul>
// 				</motion.div>
// 			)}
// 		</AnimatePresence>
// 	);

// 	return ReactDOM.createPortal(tooltipContent, document.body);
// };

// export default Tooltip;

// src/components/Tooltip.tsx

"use client";

import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
	content: string[];
	anchorRef: React.RefObject<HTMLElement>;
	isVisible: boolean;
	toggleVisibility: () => void; // Function to toggle tooltip visibility
}

const Tooltip: React.FC<TooltipProps> = ({
	content,
	anchorRef,
	isVisible,
	toggleVisibility,
}) => {
	const tooltipRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = React.useState<"right" | "left">("right");

	useEffect(() => {
		const updatePosition = () => {
			if (!anchorRef.current || !tooltipRef.current) return;

			const { top, bottom, left, right } =
				anchorRef.current.getBoundingClientRect();
			const tooltipWidth = tooltipRef.current.offsetWidth;
			const tooltipHeight = tooltipRef.current.offsetHeight;
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			// Calculate available space
			const spaceRight = viewportWidth - right;
			const spaceLeft = left;

			// Decide whether to place tooltip to the right or left
			if (spaceRight < tooltipWidth + 10 && spaceLeft > spaceRight) {
				setPosition("left");
			} else {
				setPosition("right");
			}

			// Calculate top position to align the tooltip vertically centered with the anchor
			const anchorCenterY = top + (bottom - top) / 2;
			const tooltipTop = anchorCenterY - tooltipHeight / 2;

			// Prevent tooltip from going off the top or bottom of the viewport
			const adjustedTop = Math.min(
				Math.max(tooltipTop, 10),
				viewportHeight - tooltipHeight - 10
			);

			// Apply styles based on position
			if (tooltipRef.current) {
				if (position === "right") {
					tooltipRef.current.style.left = `${right + 10}px`; // 10px margin from the anchor
				} else {
					tooltipRef.current.style.left = `${
						left - tooltipWidth - 10
					}px`; // 10px margin from the anchor
				}
				tooltipRef.current.style.top = `${adjustedTop}px`;
			}
		};

		if (isVisible) {
			// Delay the position update to allow tooltip to render and get dimensions
			setTimeout(updatePosition, 0);
			window.addEventListener("resize", updatePosition);
			window.addEventListener("scroll", updatePosition, true);

			// Intersection Observer to detect if anchor is in view
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) {
							toggleVisibility();
						}
					});
				},
				{
					root: null, // viewport
					threshold: 0.1, // 10% of the element is visible
				}
			);

			if (anchorRef.current) {
				observer.observe(anchorRef.current);
			}

			return () => {
				window.removeEventListener("resize", updatePosition);
				window.removeEventListener("scroll", updatePosition, true);
				if (anchorRef.current) {
					observer.unobserve(anchorRef.current);
				}
			};
		}
	}, [isVisible, anchorRef, position, toggleVisibility]);

	if (!isVisible || !anchorRef.current) return null;

	const tooltipContent = (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					className="p-2 bg-white rounded shadow-lg text-sm max-w-xs"
					style={{
						position: "fixed",
						zIndex: 1000,
					}}
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.2 }}
					ref={tooltipRef}
				>
					<ul className="list-disc pl-4 text-gray-800">
						{content.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				</motion.div>
			)}
		</AnimatePresence>
	);

	return ReactDOM.createPortal(tooltipContent, document.body);
};

export default Tooltip;
