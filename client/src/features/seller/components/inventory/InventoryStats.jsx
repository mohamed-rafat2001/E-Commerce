import { motion } from 'framer-motion';
import { FiPackage, FiCheck, FiAlertTriangle, FiX } from 'react-icons/fi';

const InventoryStats = ({ totalProducts, inStockCount, lowStockCount, outOfStockCount }) => {
	const stats = [
		{ label: 'Total Products', value: totalProducts, gradient: 'from-indigo-500 to-purple-600', icon: FiPackage },
		{ label: 'In Stock', value: inStockCount, gradient: 'from-emerald-500 to-teal-600', icon: FiCheck },
		{ label: 'Low Stock', value: lowStockCount, gradient: 'from-amber-500 to-orange-500', icon: FiAlertTriangle },
		{ label: 'Out of Stock', value: outOfStockCount, gradient: 'from-rose-500 to-red-500', icon: FiX },
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{stats.map((stat, index) => (
				<motion.div
					key={stat.label}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
					className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
				>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 font-medium">{stat.label}</p>
							<h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
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

export default InventoryStats;
