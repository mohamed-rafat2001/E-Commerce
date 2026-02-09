import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const TopProductsCard = ({ products }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-6 border border-gray-100"
	>
		<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
			<FiStar className="w-5 h-5 text-amber-500" />
			Top Performing Products
		</h3>
		<div className="space-y-4">
			{products.map((product, index) => (
				<motion.div
					key={product.name}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.1 }}
					className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
				>
					<span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
					<span className="text-2xl">{product.image}</span>
					<div className="flex-1">
						<h4 className="font-medium text-gray-900">{product.name}</h4>
						<p className="text-sm text-gray-500">{product.sales} sales</p>
					</div>
					<div className="text-right">
						<span className="font-bold text-emerald-600">${product.revenue.toLocaleString()}</span>
					</div>
				</motion.div>
			))}
		</div>
	</motion.div>
);

export default TopProductsCard;
