// const WaterAnimation = () => (
// 	<div className="fixed inset-0 z-0 overflow-hidden">
// 		<svg
// 			xmlns="http://www.w3.org/2000/svg"
// 			width="100%"
// 			height="100%"
// 			viewBox="0 0 1000 1000"
// 		>
// 			<g className="waves">
// 				{[...Array(5)].map((_, i) => (
// 					<path
// 						key={i}
// 						d={`M0 ${800 + i * 50} Q250 ${750 + i * 50} 500 ${
// 							800 + i * 50
// 						} T1000 ${800 + i * 50}`}
// 						fill="none"
// 						stroke="#2196F3"
// 						strokeWidth="20"
// 						opacity="0.3"
// 					>
// 						<animate
// 							attributeName="d"
// 							dur={`${3 + i}s`}
// 							repeatCount="indefinite"
// 							values={`
//                   M0 ${800 + i * 50} Q250 ${750 + i * 50} 500 ${
// 								800 + i * 50
// 							} T1000 ${800 + i * 50};
//                   M0 ${800 + i * 50} Q250 ${850 + i * 50} 500 ${
// 								800 + i * 50
// 							} T1000 ${800 + i * 50};
//                   M0 ${800 + i * 50} Q250 ${750 + i * 50} 500 ${
// 								800 + i * 50
// 							} T1000 ${800 + i * 50}
//                 `}
// 						/>
// 					</path>
// 				))}
// 			</g>
// 		</svg>
// 	</div>
// );

// export default WaterAnimation;

import { motion } from "framer-motion";

const WaterAnimation = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="fixed inset-0 w-screen h-screen overflow-hidden bg-blue-100"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
		>
			<g className="waves">
				{[...Array(5)].map((_, i) => (
					<motion.path
						key={i}
						d={`M0 ${80 + i * 5} Q25 ${75 + i * 5} 50 ${
							80 + i * 5
						} T100 ${80 + i * 5}`}
						fill="none"
						stroke="#2196F3"
						strokeWidth="2"
						opacity="0.3"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{
							duration: 3 + i,
							repeat: Infinity,
							repeatType: "reverse",
						}}
					/>
				))}
			</g>
		</svg>
	</motion.div>
);

export default WaterAnimation;
