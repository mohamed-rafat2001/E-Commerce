import { motion } from 'framer-motion';
import { FiShoppingBag, FiClock, FiPackage, FiTruck, FiCheck } from 'react-icons/fi';

const StatusBreakdownCard = ({ statusBreakdown }) => {
	const total = Object.values(statusBreakdown).reduce((a, b) => a + b, 0) || 1;
	const statusConfig = [
		{ key: 'Pending', color: 'bg-amber-500', icon: FiClock, label: 'Pending' },
		{ key: 'Processing', color: 'bg-blue-500', icon: FiPackage, label: 'Processing' },
		{ key: 'Shipped', color: 'bg-purple-500', icon: FiTruck, label: 'Shipped' },
		{ key: 'Delivered', color: 'bg-emerald-500', icon: FiCheck, label: 'Delivered' },
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
		>
			<h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
				<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200/50">
					<FiShoppingBag className="w-5 h-5 text-white" />
				</div>
				Order Breakdown
			</h3>
			<div className="space-y-5">
				{statusConfig.map(({ key, color, icon, label }) => {
					const StatusIconComponent = icon;
					const count = statusBreakdown[key] || 0;
					const percentage = ((count / total) * 100).toFixed(0);

					return (
						<div key={key} className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<StatusIconComponent className="w-4 h-4 text-gray-400" />
									<span className="font-medium text-gray-700">{label}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="font-bold text-gray-900">{count}</span>
									<span className="text-gray-400 text-xs">({percentage}%)</span>
								</div>
							</div>
							<div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
								<motion.div
									className={`${color} h-full rounded-full`}
									initial={{ width: 0 }}
									animate={{ width: `${percentage}%` }}
									transition={{ delay: 0.3, duration: 0.8 }}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</motion.div>
	);
};

export default StatusBreakdownCard;
