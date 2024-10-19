// const AnimatedTitle = () => {
// 	return (
// 		<div className="text-center my-8">
// 			<h1 className="text-4xl md:text-6xl font-bold pokemon-title relative inline-block">
// 				<span className="relative z-10">
// 					<span className="text-yellow-400">P</span>
// 					<span className="text-blue-500">o</span>
// 					<span className="text-red-500">k</span>
// 					<span className="text-green-500">É</span>
// 					<span className="text-yellow-400">m</span>
// 					<span className="text-blue-500">o</span>
// 					<span className="text-red-500">n</span>
// 				</span>
// 				<span className="block text-2xl md:text-4xl mt-2 text-white">
// 					STARTER QUIZ
// 				</span>
// 				<div className="absolute inset-0 bg-black -z-10 skew-y-3 transform scale-110"></div>
// 			</h1>
// 			<style jsx>{`
// 				@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");

// 				.pokemon-title {
// 					font-family: "Bungee", cursive;
// 					text-shadow: -1px -1px 0 #395fa3, 1px -1px 0 #395fa3,
// 						-1px 1px 0 #395fa3, 1px 1px 0 #395fa3, 0 0 10px #ffd900;
// 					animation: bounce 0.5s ease infinite alternate;
// 				}

// 				@keyframes bounce {
// 					from {
// 						transform: translateY(0px);
// 					}
// 					to {
// 						transform: translateY(-10px);
// 					}
// 				}

// 				.pokemon-title span {
// 					display: inline-block;
// 					animation: wobble 2s ease infinite;
// 					animation-delay: calc(0.1s * var(--i));
// 				}

// 				@keyframes wobble {
// 					0%,
// 					100% {
// 						transform: translateY(0);
// 					}
// 					50% {
// 						transform: translateY(-10px);
// 					}
// 				}
// 			`}</style>
// 		</div>
// 	);
// };

// export default AnimatedTitle;

import { motion } from "framer-motion";

const AnimatedTitle = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="text-center my-4 md:my-8"
		>
			<h1 className="text-3xl md:text-6xl font-bold pokemon-title relative inline-block">
				<span className="relative z-10">
					<span className="text-yellow-400">P</span>
					<span className="text-blue-500">o</span>
					<span className="text-red-500">k</span>
					<span className="text-green-500">É</span>
					<span className="text-yellow-400">m</span>
					<span className="text-blue-500">o</span>
					<span className="text-red-500">n</span>
				</span>
				<span className="block text-xl md:text-4xl mt-2 text-white">
					STARTER QUIZ
				</span>
				<div className="absolute inset-0 bg-black -z-10 skew-y-3 transform scale-110"></div>
			</h1>
			<style jsx>{`
				@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");

				.pokemon-title {
					font-family: "Bungee", cursive;
					text-shadow: -1px -1px 0 #395fa3, 1px -1px 0 #395fa3,
						-1px 1px 0 #395fa3, 1px 1px 0 #395fa3, 0 0 10px #ffd900;
					animation: bounce 0.5s ease infinite alternate;
				}

				@keyframes bounce {
					from {
						transform: translateY(0px);
					}
					to {
						transform: translateY(-5px);
					}
				}

				.pokemon-title span {
					display: inline-block;
					animation: wobble 2s ease infinite;
				}

				@keyframes wobble {
					0%,
					100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-5px);
					}
				}
			`}</style>
		</motion.div>
	);
};

export default AnimatedTitle;
