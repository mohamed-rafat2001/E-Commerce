import { motion } from 'framer-motion';
import { Card, Badge } from '../../../shared/ui/index.js';
import { FiBox, FiStar, FiTrendingUp } from 'react-icons/fi';

const TopProducts = ({ products = [] }) => {
	const hasProducts = products && products.length > 0;
	
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<Card variant="elevated">
				<Card.Header>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FiBox className="w-5 h-5 text-emerald-600" />
							<Card.Title>Top Selling Products</Card.Title>
						</div>
						<Badge variant="success" size="sm">
							This Month
						</Badge>
					</div>
				</Card.Header>
				<Card.Content>
					{hasProducts ? (
						<div className="space-y-3">
							{products.map((product, index) => (
								<motion.div
									key={product._id || product.id}
									className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white to-gray-50 
										border border-gray-100 hover:border-emerald-200 hover:shadow-sm 
										transition-all duration-200 group"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.5 + index * 0.05 }}
								>
									<div className="relative">
										<span className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 
											flex items-center justify-center text-white font-bold text-lg shadow-md">
											{product.name?.charAt(0) || 'P'}
										</span>
										{product.ratingAverage > 4 && (
											<div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full 
												flex items-center justify-center">
												<FiTrendingUp className="w-3 h-3 text-white" />
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-gray-900 truncate">{product.name}</p>
										<div className="flex items-center gap-2 mt-1">
											<div className="flex items-center gap-1">
												<FiStar className="w-4 h-4 text-amber-500" />
												<span className="text-sm text-gray-600">
													{product.ratingAverage || 'N/A'}
												</span>
											</div>
											<span className="text-xs text-gray-400">•</span>
											<span className="text-xs text-gray-500">
												{product.soldCount || 0} sold
											</span>
										</div>
									</div>
									<div className="text-right">
										<p className="font-bold text-emerald-600 text-lg">
											${product.price?.toFixed(2) || '0.00'}
										</p>
										<div className="flex items-center justify-end gap-1 mt-1">
											<FiTrendingUp className="w-3 h-3 text-emerald-500" />
											<span className="text-xs text-emerald-600 font-medium">+{product.growth || '0'}%</span>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<FiBox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
							<p className="text-gray-500 font-medium">No products data available</p>
							<p className="text-sm text-gray-400 mt-1">Add products to see analytics</p>
						</div>
					)}
				</Card.Content>
			</Card>
		</motion.div>
	);
};

export default TopProducts;
