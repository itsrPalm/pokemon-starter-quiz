const FireAnimation = () => (
	<div className="fixed inset-0 z-0 overflow-hidden">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox="0 0 1000 1000"
		>
			<g className="flames">
				{[...Array(30)].map((_, i) => (
					<path
						key={i}
						d={`M${500 + Math.random() * 400 - 200} 1000 Q${
							500 + Math.random() * 400 - 200
						} ${800 + Math.random() * 200} ${
							500 + Math.random() * 400 - 200
						} ${600 + Math.random() * 400}`}
						fill="none"
						stroke="#FF9800"
						strokeWidth="3"
					>
						<animate
							attributeName="d"
							dur={`${1 + Math.random()}s`}
							repeatCount="indefinite"
							values={`
                  M${500 + Math.random() * 400 - 200} 1000 Q${
								500 + Math.random() * 400 - 200
							} ${800 + Math.random() * 200} ${
								500 + Math.random() * 400 - 200
							} ${600 + Math.random() * 400};
                  M${500 + Math.random() * 400 - 200} 1000 Q${
								500 + Math.random() * 400 - 200
							} ${800 + Math.random() * 200} ${
								500 + Math.random() * 400 - 200
							} ${600 + Math.random() * 400};
                  M${500 + Math.random() * 400 - 200} 1000 Q${
								500 + Math.random() * 400 - 200
							} ${800 + Math.random() * 200} ${
								500 + Math.random() * 400 - 200
							} ${600 + Math.random() * 400}
                `}
						/>
					</path>
				))}
			</g>
		</svg>
	</div>
);

export default FireAnimation;
