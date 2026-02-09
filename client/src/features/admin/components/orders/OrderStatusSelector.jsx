import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { statusConfig, allowedTransitions } from './orderConstants.js';

const OrderStatusSelector = ({ value, onChange, disabled }) => {
	const [isOpen, setIsOpen] = useState(false);
	const config = statusConfig[value] || statusConfig.Pending;
	const allowed = allowedTransitions[value] || [];
	const isTerminal = allowed.length === 0;

	return (
		<div className="relative">
			<button
				onClick={() => !isTerminal && !disabled && setIsOpen(!isOpen)}
				disabled={isTerminal || disabled}
				className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${config.color} ${isTerminal || disabled ? 'opacity-70 cursor-default' : 'hover:shadow-sm cursor-pointer'}`}
			>
				<span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
				{config.label}
				{!isTerminal && !disabled && <FiChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
						<div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
						<motion.div
							initial={{ opacity: 0, y: 5, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 5, scale: 0.95 }}
							className="absolute top-full left-0 mt-1.5 w-40 bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 z-40"
						>
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2 border-b border-gray-50 mb-1">Move to</p>
							{allowed.map((status) => {
								const sc = statusConfig[status];
								return (
									<button
										key={status}
										onClick={() => { onChange(status); setIsOpen(false); }}
										className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium hover:bg-gray-50 text-gray-600 transition-all"
									>
										<span className={`w-1.5 h-1.5 rounded-full ${sc?.dot}`} />
										{sc?.label}
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

export default OrderStatusSelector;
