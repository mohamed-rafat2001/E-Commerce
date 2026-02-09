import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';

const TopProductsCard = ({ products }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-6 border border-gray-100"
	>
		<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
			<FiTrendingUp className="w-5 h-5 text-emerald-500" />
			Best Selling Products
		</h3>
		<div className="space-y-3">
			{products.map((product, index) => (
				<motion.div
					key={product.name}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.1 }}
					className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
				>
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
							{index + 1}
						</div>
						<div>
							<h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
							<p className="text-xs text-gray-500">{product.sales.toLocaleString()} sold</p>
						</div>
					</div>
					<span className="font-semibold text-gray-900">${(product.revenue / 1000).toFixed(1)}K</span>
				</motion.div>
			))}
		</div>
	</motion.div>
);

export default TopProductsCard;
