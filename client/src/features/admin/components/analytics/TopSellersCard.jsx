import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const TopSellersCard = ({ sellers }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-6 border border-gray-100"
	>
		<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
			<FiStar className="w-5 h-5 text-amber-500" />
			Top Performing Sellers
		</h3>
		<div className="space-y-4">
			{sellers.map((seller, index) => (
				<motion.div
					key={seller.name}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.1 }}
					className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
				>
					<span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
					<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
						{seller.name[0]}
					</div>
					<div className="flex-1">
						<h4 className="font-medium text-gray-900">{seller.name}</h4>
						<div className="flex items-center gap-2 text-sm text-gray-500">
							<span>{seller.sales.toLocaleString()} sales</span>
							<span>•</span>
							<span className="flex items-center gap-1">
								<FiStar className="w-3 h-3 text-amber-500" />
								{seller.rating}
							</span>
						</div>
					</div>
					<div className="text-right">
						<span className="font-bold text-emerald-600">${(seller.revenue / 1000).toFixed(1)}K</span>
					</div>
				</motion.div>
			))}
		</div>
	</motion.div>
);

export default TopSellersCard;
