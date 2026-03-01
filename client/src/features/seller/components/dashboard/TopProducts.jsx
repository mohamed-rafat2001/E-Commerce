import { motion } from 'framer-motion';
import { Badge } from '../../../../shared/ui/index.js';
import { FiBox, FiStar, FiTrendingUp } from 'react-icons/fi';

const TopProducts = ({ products = [] }) => {
	const hasProducts = products && products.length > 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.35, type: 'spring', bounce: 0.2 }}
			className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col"
			style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}
		>
			{/* Header */}
			<div className="px-6 pt-5 pb-4 border-b border-gray-100/80 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-200/50">
						<FiBox className="w-4 h-4 text-white" />
					</div>
					<h3 className="font-bold text-gray-900 text-sm">Top Selling Products</h3>
				</div>
				<Badge variant="success" size="sm">This Month</Badge>
			</div>

			{/* Content */}
			<div className="flex-1 p-4 space-y-3">
				{hasProducts ? (
					products.map((product, index) => (
						<motion.div
							key={product._id || product.id}
							className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/80 hover:bg-emerald-50/50
								border border-gray-100 hover:border-emerald-200 hover:shadow-sm
								transition-all duration-200 group cursor-pointer"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 + index * 0.05 }}
						>
							<div className="relative">
								<span className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600
									flex items-center justify-center text-white font-bold text-sm shadow-md">
									{product.name?.charAt(0) || 'P'}
								</span>
								{product.ratingAverage > 4 && (
									<div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full
										flex items-center justify-center shadow-sm">
										<FiTrendingUp className="w-3 h-3 text-white" />
									</div>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-bold text-gray-900 text-sm truncate">{product.name}</p>
								<div className="flex items-center gap-2 mt-0.5">
									<div className="flex items-center gap-1">
										<FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
										<span className="text-xs text-gray-500 font-medium">
											{product.ratingAverage || 'N/A'}
										</span>
									</div>
									<span className="text-gray-300 text-[8px]">•</span>
									<span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
										{product.soldCount || 0} sold
									</span>
								</div>
							</div>
							<div className="text-right shrink-0">
								<p className="font-black text-emerald-600 tabular-nums">
									${product.price?.toFixed(2) || '0.00'}
								</p>
								<div className="flex items-center justify-end gap-1 mt-0.5">
									<FiTrendingUp className="w-3 h-3 text-emerald-500" />
									<span className="text-[10px] text-emerald-600 font-bold">+{product.growth || '0'}%</span>
								</div>
							</div>
						</motion.div>
					))
				) : (
					<div className="text-center py-10">
						<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-3">
							<FiBox className="w-7 h-7 text-emerald-400" />
						</div>
						<p className="text-gray-900 font-bold text-sm">No products data available</p>
						<p className="text-xs text-gray-400 mt-1 font-medium">Add products to see analytics</p>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default TopProducts;
