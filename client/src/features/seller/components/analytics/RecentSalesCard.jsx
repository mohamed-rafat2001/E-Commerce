import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';

const RecentSalesCard = ({ sales }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-6 border border-gray-100"
	>
		<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
			<FiCalendar className="w-5 h-5 text-indigo-500" />
			Recent Sales
		</h3>
		<div className="space-y-3">
			{sales.map((sale, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.1 }}
					className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
				>
					<div>
						<h4 className="font-medium text-gray-900">{sale.product}</h4>
						<p className="text-sm text-gray-500">{sale.date}</p>
					</div>
					<span className="font-bold text-gray-900">+${sale.amount.toFixed(2)}</span>
				</motion.div>
			))}
			{sales.length === 0 && (
				<div className="text-center py-6 text-gray-400">
					<p className="text-sm">No recent sales data</p>
				</div>
			)}
		</div>
	</motion.div>
);

export default RecentSalesCard;
