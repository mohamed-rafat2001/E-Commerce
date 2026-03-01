import { motion } from 'framer-motion';
import { FiPackage, FiCheck, FiAlertTriangle, FiXCircle, FiTrendingUp } from 'react-icons/fi';

const cards = [
	{
		key: 'all',
		label: 'All Products',
		icon: FiPackage,
		gradient: 'from-indigo-500 via-indigo-600 to-purple-600',
		lightBg: 'bg-indigo-50',
		lightText: 'text-indigo-600',
		ring: 'ring-indigo-500/30',
		border: 'border-indigo-200',
		shadow: 'shadow-indigo-200/50',
		countKey: null,
	},
	{
		key: 'in_stock',
		label: 'In Stock',
		icon: FiCheck,
		gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
		lightBg: 'bg-emerald-50',
		lightText: 'text-emerald-600',
		ring: 'ring-emerald-500/30',
		border: 'border-emerald-200',
		shadow: 'shadow-emerald-200/50',
		countKey: 'in_stock',
	},
	{
		key: 'low_stock',
		label: 'Low Stock',
		icon: FiAlertTriangle,
		gradient: 'from-amber-500 via-amber-600 to-orange-600',
		lightBg: 'bg-amber-50',
		lightText: 'text-amber-600',
		ring: 'ring-amber-500/30',
		border: 'border-amber-200',
		shadow: 'shadow-amber-200/50',
		countKey: 'low_stock',
	},
	{
		key: 'out_of_stock',
		label: 'Out of Stock',
		icon: FiXCircle,
		gradient: 'from-rose-500 via-rose-600 to-red-600',
		lightBg: 'bg-rose-50',
		lightText: 'text-rose-600',
		ring: 'ring-rose-500/30',
		border: 'border-rose-200',
		shadow: 'shadow-rose-200/50',
		countKey: 'out_of_stock',
	},
];

const StockFilterCards = ({ stockFilter, total, onFilterChange, stockCounts }) => {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{cards.map((card, i) => {
				const isActive = stockFilter === card.key;
				const count = card.countKey ? (stockCounts?.[card.countKey] || 0) : (total || 0);
				const Icon = card.icon;

				return (
					<motion.button
						key={card.key}
						onClick={() => onFilterChange(card.key)}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: i * 0.08, type: 'spring', bounce: 0.3 }}
						whileHover={{ y: -4, transition: { duration: 0.2 } }}
						whileTap={{ scale: 0.97 }}
						className={`relative rounded-2xl p-5 border overflow-hidden transition-all duration-300 text-left cursor-pointer group ${
							isActive
								? `${card.border} ring-2 ${card.ring} bg-white shadow-lg ${card.shadow}`
								: 'border-gray-100 bg-white hover:shadow-md hover:border-gray-200'
						}`}
					>
						{/* Active indicator bar */}
						<motion.div
							initial={false}
							animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
							transition={{ duration: 0.3 }}
							className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} origin-left rounded-b-full`}
						/>

						{/* Background glow when active */}
						{isActive && (
							<div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${card.lightBg} opacity-40 blur-2xl pointer-events-none`} />
						)}

						<div className="relative flex items-start justify-between">
							<div className="space-y-2">
								<p className={`text-xs font-bold uppercase tracking-wider ${
									isActive ? card.lightText : 'text-gray-400'
								} transition-colors`}>
									{card.label}
								</p>
								<div className="flex items-baseline gap-2">
									<motion.span
										key={count}
										initial={{ scale: 0.5, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										className="text-3xl font-black text-gray-900 tabular-nums"
									>
										{count}
									</motion.span>
									{isActive && count > 0 && (
										<motion.span
											initial={{ opacity: 0, x: -8 }}
											animate={{ opacity: 1, x: 0 }}
											className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${card.lightText}`}
										>
											<FiTrendingUp className="w-3 h-3" />
											items
										</motion.span>
									)}
								</div>
							</div>

							<div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
								isActive
									? `bg-gradient-to-br ${card.gradient} shadow-lg ${card.shadow}`
									: `${card.lightBg} group-hover:scale-110`
							}`}>
								<Icon className={`w-5 h-5 ${
									isActive ? 'text-white' : card.lightText
								} transition-colors`} />
							</div>
						</div>

						{/* Progress bar at bottom */}
						{total > 0 && (
							<div className="mt-4 relative">
								<div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
									<motion.div
										initial={{ width: 0 }}
										animate={{ width: `${Math.min((count / total) * 100, 100)}%` }}
										transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
										className={`h-full rounded-full bg-gradient-to-r ${card.gradient}`}
									/>
								</div>
								<p className={`text-[10px] font-semibold mt-1.5 ${
									isActive ? card.lightText : 'text-gray-400'
								} transition-colors`}>
									{total > 0 ? Math.round((count / total) * 100) : 0}% of total
								</p>
							</div>
						)}
					</motion.button>
				);
			})}
		</div>
	);
};

export default StockFilterCards;
