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
			{statsConfig.map((stat) => (
				<motion.div
					key={stat.label}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: stat.delay, type: 'spring', bounce: 0.3 }}
					whileHover={{ y: -4, transition: { duration: 0.2 } }}
					className="bg-white rounded-2xl p-5 border border-gray-100 transition-all duration-300 relative overflow-hidden group hover:shadow-lg"
					style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}
				>
					{/* Subtle top gradient bar */}
					<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-full`} />

					<div className="flex items-center justify-between mb-2">
						<div>
							<p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
							<h3 className="text-2xl font-black text-gray-900 mt-1 tabular-nums">{stat.value}</h3>
						</div>
						<div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
							<stat.icon className="w-5 h-5 text-white" />
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default OrdersStats;
