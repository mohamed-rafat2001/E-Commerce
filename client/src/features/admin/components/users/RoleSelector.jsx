import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { roleConfig, roleOptions } from './userConstants.js';

const RoleSelector = ({ value, onChange, disabled }) => {
	const [isOpen, setIsOpen] = useState(false);
	const config = roleConfig[value] || roleConfig.Customer;
	const ActiveIcon = config.icon;
	
	return (
		<div className="relative">
			<button
				disabled={disabled}
				onClick={() => setIsOpen(!isOpen)}
				className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${config.color} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
			>
				{ActiveIcon && <ActiveIcon className="w-3.5 h-3.5" />}
				{config.label}
				{!disabled && <FiChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
			</button>
			
			<AnimatePresence>
				{isOpen && !disabled && (
					<>
						<div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
						<motion.div
							initial={{ opacity: 0, y: 5, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 5, scale: 0.95 }}
							className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 z-40"
						>
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2 border-b border-gray-50 mb-1">Change Role</p>
							{roleOptions.map((opt) => {
								const OptionIcon = roleConfig[opt.value]?.icon;
								return (
									<button
										key={opt.value}
										onClick={() => { onChange(opt.value); setIsOpen(false); }}
										className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-medium transition-all ${value === opt.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-600'}`}
									>
										<div className={`w-6 h-6 rounded-md flex items-center justify-center border ${roleConfig[opt.value]?.color}`}>
											{OptionIcon && <OptionIcon className="w-3.5 h-3.5" />}
										</div>
										{opt.label}
									</button>
								);
							})}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

export default RoleSelector;
