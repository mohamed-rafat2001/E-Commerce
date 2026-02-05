import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

const Modal = ({ 
	isOpen, 
	onClose, 
	title, 
	children, 
	size = 'md',
	showClose = true 
}) => {
	// Close on escape key
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') onClose();
		};
		if (isOpen) window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, [isOpen, onClose]);

	// Prevent scrolling when modal is open
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
		sm: 'max-w-md',
		md: 'max-w-xl',
		lg: 'max-w-3xl',
		xl: 'max-w-5xl',
		full: 'max-w-[95vw]',
	};

	if (typeof document === 'undefined') return null;

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
					/>

					{/* Modal Content */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
						className={`relative w-full ${sizes[size]} bg-white rounded-3xl shadow-2xl overflow-hidden z-10`}
					>
						{/* Header */}
						{(title || showClose) && (
							<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
								{title && (
									<h3 className="text-xl font-bold text-gray-900 truncate">
										{title}
									</h3>
								)}
								{showClose && (
									<button
										onClick={onClose}
										className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
									>
										<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								)}
							</div>
						)}

						{/* Body */}
						<div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
							{children}
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>,
		document.body
	);
};

export default Modal;
