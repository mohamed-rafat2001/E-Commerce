import { forwardRef, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

const Select = forwardRef(
	(
		{
			label,
			error,
			options = [],
			placeholder = 'Select an option',
			className = '',
			containerClassName = '',
			disabled = false,
			value,
			onChange,
			...props
		},
		ref
	) => {
		const [isOpen, setIsOpen] = useState(false);
		const containerRef = useRef(null);

		const selectedOption = options.find((opt) => opt.value === value);

		useEffect(() => {
			const handleClickOutside = (event) => {
				if (containerRef.current && !containerRef.current.contains(event.target)) {
					setIsOpen(false);
				}
			};
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}, []);

		const handleSelect = (optionValue) => {
			if (onChange) {
				onChange(optionValue);
			}
			setIsOpen(false);
		};

		return (
			<motion.div
				ref={containerRef}
				className={`relative ${containerClassName}`}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.2 }}
			>
				{label && (
					<label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
						{label}
					</label>
				)}

				<div className="relative">
					<button
						type="button"
						onClick={() => !disabled && setIsOpen(!isOpen)}
						disabled={disabled}
						className={`
							w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50 
							flex items-center justify-between transition-all duration-300
							hover:bg-white hover:border-indigo-200
							focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500/50
							${isOpen ? 'ring-4 ring-indigo-50 border-indigo-500 bg-white shadow-sm' : 'shadow-xs'}
							${error ? 'border-red-300 focus:ring-red-50' : ''}
							${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'cursor-pointer'}
							${className}
						`}
					>
						<span className={`truncate font-bold ${selectedOption ? 'text-gray-800' : 'text-gray-400'}`}>
							{selectedOption ? selectedOption.label : placeholder}
						</span>
						<FiChevronDown 
							className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} 
						/>
					</button>

					{/* Hidden input for react-hook-form integration */}
					<input
						ref={ref}
						type="hidden"
						value={value || ''}
						{...props}
					/>

					<AnimatePresence>
						{isOpen && (
							<motion.div
								initial={{ opacity: 0, y: 10, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 10, scale: 0.95 }}
								transition={{ duration: 0.2 }}
								className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden"
							>
								{options.length > 0 ? (
									<div className="max-h-60 overflow-y-auto custom-scrollbar">
										{options.map((option) => (
											<button
												key={option.value}
												type="button"
												onClick={() => handleSelect(option.value)}
												className={`
													w-full flex items-center justify-between px-4 py-3 text-sm transition-colors
													${option.value === value 
														? 'bg-indigo-50 text-indigo-700 font-bold' 
														: 'text-gray-600 hover:bg-gray-50'
													}
												`}
											>
												<span className="truncate">{option.label}</span>
												{option.value === value && <FiCheck className="w-4 h-4" />}
											</button>
										))}
									</div>
								) : (
									<div className="px-4 py-8 text-center">
										<p className="text-gray-400 text-sm font-medium">No options available</p>
									</div>
								)}
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{error && (
					<motion.p
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-2 text-xs font-bold text-red-500 ml-1"
					>
						{error}
					</motion.p>
				)}
			</motion.div>
		);
	}
);

Select.displayName = 'Select';

export default Select;
