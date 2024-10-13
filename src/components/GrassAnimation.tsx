const GrassAnimation = () => (
	<div className="fixed inset-0 z-0 overflow-hidden">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox="0 0 1000 1000"
		>
			<g className="grass-blades">
				{[...Array(50)].map((_, i) => (
					<path
						key={i}
						d={`M${Math.random() * 1000} 1000 Q${
							Math.random() * 1000
						} ${800 + Math.random() * 200} ${
							Math.random() * 1000
						} 1000`}
						fill="none"
						stroke="#4CAF50"
						strokeWidth="2"
					>
						<animate
							attributeName="d"
							dur={`${3 + Math.random() * 2}s`}
							repeatCount="indefinite"
							values={`
                  M${Math.random() * 1000} 1000 Q${Math.random() * 1000} ${
								800 + Math.random() * 200
							} ${Math.random() * 1000} 1000;
                  M${Math.random() * 1000} 1000 Q${Math.random() * 1000} ${
								800 + Math.random() * 200
							} ${Math.random() * 1000} 1000;
                  M${Math.random() * 1000} 1000 Q${Math.random() * 1000} ${
								800 + Math.random() * 200
							} ${Math.random() * 1000} 1000
                `}
						/>
					</path>
				))}
			</g>
		</svg>
	</div>
);

export default GrassAnimation;
