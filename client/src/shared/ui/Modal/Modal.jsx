import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	footer,
	size = 'md',
	showClose = true
}) => {
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') onClose();
		};
		if (isOpen) window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const sizes = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-2xl',
		xl: 'max-w-5xl',
		full: 'max-w-[95vw]',
	};

	if (typeof document === 'undefined') return null;

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
					/>

					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
						className={`relative w-full ${sizes[size]} max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden z-10`}
					>
						{(title || showClose) && (
							<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
								{title && (
									<h3 className="text-lg font-semibold text-gray-900 truncate">
										{title}
									</h3>
								)}
								{showClose && (
									<button
										onClick={onClose}
										className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 ml-auto"
									>
										<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								)}
							</div>
						)}

						<div className="px-6 py-5 overflow-y-auto flex-1 min-h-0">
							{children}
						</div>

						{footer && (
							<div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0 rounded-b-2xl">
								{footer}
							</div>
						)}
					</motion.div>
				</div>
			)}
		</AnimatePresence>,
		document.body
	);
};

export default Modal;
