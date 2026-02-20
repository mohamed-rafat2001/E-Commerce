import { motion } from 'framer-motion';
import { Card, Badge } from '../../../shared/ui/index.js';

const TopProducts = ({ products = [] }) => {
	return (
		<motion.div
			className="lg:col-span-2"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<Card variant="elevated">
				<Card.Header>
					<div className="flex items-center justify-between">
						<Card.Title>Top Selling Products</Card.Title>
						<Badge variant="success" size="sm">
							This Month
						</Badge>
					</div>
				</Card.Header>
				<Card.Content>
					<div className="space-y-4">
						{(products || []).map((product, index) => (
							<motion.div
								key={product._id || product.id}
								className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 
									hover:bg-gray-100/50 transition-all duration-200"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5 + index * 0.05 }}
							>
								<span className="w-12 h-12 rounded-xl bg-white shadow-sm 
									flex items-center justify-center text-2xl">
									{product.name?.charAt(0) || 'P'}
								</span>
								<div className="flex-1">
									<p className="font-semibold text-gray-900">{product.name}</p>
									<p className="text-sm text-gray-500">Rating: {product.ratingAverage || 'N/A'}</p>
								</div>
								<div className="text-right">
									<p className="font-bold text-gray-900">${product.price || '0.00'}</p>
									<p className="text-xs text-gray-500">Price</p>
								</div>
							</motion.div>
						))}
					</div>
				</Card.Content>
			</Card>
		</motion.div>
	);
};

export default TopProducts;
