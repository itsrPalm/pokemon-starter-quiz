// const GrassAnimation = () => (
// 	<div className="fixed inset-0 z-0 overflow-hidden">
// 		<svg
// 			xmlns="http://www.w3.org/2000/svg"
// 			width="100%"
// 			height="100%"
// 			viewBox="0 0 1000 1000"
// 		>
// 			<g className="grass-blades">
// 				{[...Array(50)].map((_, i) => (
// 					<path
// 						key={i}
// 						d={`M${Math.random() * 1000} 1000 Q${
// 							Math.random() * 1000
// 						} ${800 + Math.random() * 200} ${
// 							Math.random() * 1000
// 						} 1000`}
// 						fill="none"
// 						stroke="#4CAF50"
// 						strokeWidth="2"
// 					>
// 						<animate
// 							attributeName="d"
// 							dur={`${3 + Math.random() * 2}s`}
// 							repeatCount="indefinite"
// 							values={`
//                   M${Math.random() * 1000} 1000 Q${Math.random() * 1000} ${
// 								800 + Math.random() * 200
// 							} ${Math.random() * 1000} 1000;
//                   M${Math.random() * 1000} 1000 Q${Math.random() * 1000} ${
// 								800 + Math.random() * 200
// 							} ${Math.random() * 1000} 1000;
//                   M${Math.random() * 1000} 1000 Q${Math.random() * 1000} ${
// 								800 + Math.random() * 200
// 							} ${Math.random() * 1000} 1000
//                 `}
// 						/>
// 					</path>
// 				))}
// 			</g>
// 		</svg>
// 	</div>
// );

// export default GrassAnimation;

import { motion } from "framer-motion";

const GrassAnimation = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="fixed inset-0 w-screen h-screen overflow-hidden bg-green-100"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
		>
			<g className="grass-blades">
				{[...Array(50)].map((_, i) => (
					<motion.path
						key={i}
						d={`M${Math.random() * 100} 100 Q${
							Math.random() * 100
						} ${80 + Math.random() * 20} ${
							Math.random() * 100
						} 100`}
						fill="none"
						stroke="#4CAF50"
						strokeWidth="0.2"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{
							duration: 2,
							repeat: Infinity,
							repeatType: "reverse",
						}}
					/>
				))}
			</g>
		</svg>
	</motion.div>
);

export default GrassAnimation;
