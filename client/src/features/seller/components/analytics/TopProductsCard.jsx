import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { ProductIcon } from '../../../../shared/constants/icons.jsx';

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
					{product.image?.startsWith('http') ? (
						<img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" crossOrigin="anonymous" />
					) : (
						<span className="text-2xl w-10 h-10 flex items-center justify-center">{product.image}</span>
					)}
					<div className="flex-1">
						<h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
						<p className="text-sm text-gray-500">{product.sales} sales</p>
					</div>
					<div className="text-right">
						<span className="font-bold text-emerald-600">${product.revenue.toLocaleString()}</span>
					</div>
				</motion.div>
			))}
			{products.length === 0 && (
				<div className="text-center py-6 text-gray-400">
					<ProductIcon className="w-10 h-10 mx-auto mb-2" />
					<p className="text-sm">No product data available yet</p>
				</div>
			)}
		</div>
	</motion.div>
);

export default TopProductsCard;
