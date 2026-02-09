import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { statusConfig, statusOptions } from './productConstants.js';

const ProductStatusSelector = ({ value, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const config = statusConfig[value] || statusConfig.draft;
	
	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${config.color} hover:shadow-sm`}
			>
				<div className={`w-1.5 h-1.5 rounded-full ${config.dot} ${value === 'active' ? 'animate-pulse' : ''}`} />
				{config.label}
				<FiChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</button>
			
			<AnimatePresence>
				{isOpen && (
					<>
						<div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
						<motion.div
							initial={{ opacity: 0, y: 5, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 5, scale: 0.95 }}
							className="absolute top-full left-0 mt-1.5 w-36 bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 z-40"
						>
							{statusOptions.map((opt) => (
								<button
									key={opt.value}
									onClick={() => { onChange(opt.value); setIsOpen(false); }}
									className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium transition-all ${value === opt.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-600'}`}
								>
									<div className={`w-1.5 h-1.5 rounded-full ${statusConfig[opt.value]?.dot}`} />
									{opt.label}
								</button>
							))}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ProductStatusSelector;
