import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';

const RecentSalesCard = ({ sales }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
	>
		<h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
			<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200/50">
				<FiCalendar className="w-5 h-5 text-white" />
			</div>
			Recent Sales
		</h3>
		<div className="space-y-3">
			{sales.map((sale, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.1 }}
					className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50/80 transition-all border border-transparent hover:border-gray-100 hover:shadow-sm"
				>
					<div>
						<h4 className="font-bold text-gray-900 text-sm">{sale.product}</h4>
						<p className="text-xs text-gray-500 font-medium mt-0.5">{sale.date}</p>
					</div>
					<span className="font-black text-emerald-600 tabular-nums text-sm">+${sale.amount.toFixed(2)}</span>
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
