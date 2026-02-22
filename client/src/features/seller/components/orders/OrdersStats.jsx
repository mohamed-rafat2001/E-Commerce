import { motion } from 'framer-motion';
import { FiClock, FiPackage, FiTruck, FiCheck } from 'react-icons/fi';

const OrdersStats = ({ orderStats }) => {
	const statsConfig = [
		{
			label: 'Pending',
			value: orderStats.pending,
			icon: FiClock,
			gradient: 'from-amber-500 to-orange-500',
			delay: 0
		},
		{
			label: 'Processing',
			value: orderStats.processing,
			icon: FiPackage,
			gradient: 'from-blue-500 to-indigo-500',
			delay: 0.1
		},
		{
			label: 'Shipped',
			value: orderStats.shipped,
			icon: FiTruck,
			gradient: 'from-purple-500 to-pink-500',
			delay: 0.2
		},
		{
			label: 'Delivered',
			value: orderStats.delivered,
			icon: FiCheck,
			gradient: 'from-emerald-500 to-teal-500',
			delay: 0.3
		}
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{statsConfig.map((stat, index) => (
				<motion.div
					key={stat.label}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: stat.delay }}
					className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
				>
					<div className="flex items-center justify-between mb-2">
						<div>
							<p className="text-gray-500 text-sm font-medium">{stat.label}</p>
							<h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
						</div>
						<div className={`w-10 h-10 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center`}>
							<stat.icon className="w-5 h-5 text-white" />
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default OrdersStats;
