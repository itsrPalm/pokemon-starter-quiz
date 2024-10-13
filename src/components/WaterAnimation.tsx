const WaterAnimation = () => (
	<div className="fixed inset-0 z-0 overflow-hidden">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox="0 0 1000 1000"
		>
			<g className="waves">
				{[...Array(5)].map((_, i) => (
					<path
						key={i}
						d={`M0 ${800 + i * 50} Q250 ${750 + i * 50} 500 ${
							800 + i * 50
						} T1000 ${800 + i * 50}`}
						fill="none"
						stroke="#2196F3"
						strokeWidth="20"
						opacity="0.3"
					>
						<animate
							attributeName="d"
							dur={`${3 + i}s`}
							repeatCount="indefinite"
							values={`
                  M0 ${800 + i * 50} Q250 ${750 + i * 50} 500 ${
								800 + i * 50
							} T1000 ${800 + i * 50};
                  M0 ${800 + i * 50} Q250 ${850 + i * 50} 500 ${
								800 + i * 50
							} T1000 ${800 + i * 50};
                  M0 ${800 + i * 50} Q250 ${750 + i * 50} 500 ${
								800 + i * 50
							} T1000 ${800 + i * 50}
                `}
						/>
					</path>
				))}
			</g>
		</svg>
	</div>
);

export default WaterAnimation;
