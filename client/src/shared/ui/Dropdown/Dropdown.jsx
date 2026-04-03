import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({ 
	trigger, 
	children, 
	align = 'right', 
	width = 'w-56',
	className = '' 
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Close when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const alignments = {
		left: 'left-0',
		right: 'right-0',
		center: 'left-1/2 -translate-x-1/2',
	};

	return (
		<div className={`relative inline-block ${className}`} ref={dropdownRef}>
			{/* Trigger */}
			<div 
				className="cursor-pointer" 
				onClick={() => setIsOpen((prev) => !prev)}
			>
				{trigger}
			</div>

			{/* Menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 10 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className={`absolute z-50 mt-2 ${width} ${alignments[align]} 
							rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700
							overflow-hidden backdrop-blur-xl bg-white/95 dark:bg-gray-800/95`}
					>
						<div className="py-1" onClick={() => setIsOpen(false)}>
							{children}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const DropdownItem = ({ 
	onClick, 
	children, 
	icon, 
	variant = 'default',
	disabled = false 
}) => {
	const variants = {
		default: 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
		danger: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30',
		primary: 'text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30',
	};

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200
				${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
		>
			{icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
			{children}
		</button>
	);
};

const DropdownDivider = () => <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />;

Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;

export default Dropdown;
