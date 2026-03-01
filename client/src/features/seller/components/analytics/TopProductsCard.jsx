import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { ProductIcon } from '../../../../shared/constants/icons.jsx';

const TopProductsCard = ({ products }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
	>
		<h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
			<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-200/50">
				<FiStar className="w-5 h-5 text-white" />
			</div>
			Top Performing Products
		</h3>
		<div className="space-y-3">
			{products.map((product, index) => (
				<motion.div
					key={product.name}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.1 }}
					className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50/80 transition-all border border-transparent hover:border-gray-100 hover:shadow-sm group cursor-pointer"
				>
					<span className="text-sm font-bold text-gray-400 w-6 group-hover:text-amber-500 transition-colors">#{index + 1}</span>
					{product.image?.startsWith('http') ? (
						<img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" crossOrigin="anonymous" />
					) : (
						<span className="text-2xl w-10 h-10 flex items-center justify-center">{product.image}</span>
					)}
					<div className="flex-1 min-w-0">
						<h4 className="font-bold text-gray-900 truncate text-sm">{product.name}</h4>
						<p className="text-xs text-gray-500 font-medium mt-0.5">{product.sales} sales</p>
					</div>
					<div className="text-right shrink-0">
						<span className="font-black text-emerald-600 tabular-nums">${product.revenue.toLocaleString()}</span>
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
