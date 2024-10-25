// src/components/Modal.tsx

import React from "react";

interface ModalProps {
	isVisible: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export default function Modal({ isVisible, onClose, children }: ModalProps) {
	if (!isVisible) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="relative bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full mx-4">
				<button
					className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
					onClick={onClose}
					aria-label="Close Modal"
				>
					&times;
				</button>
				{children}
			</div>
		</div>
	);
}
