import { motion } from 'framer-motion';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import MiniBarChart from './MiniBarChart.jsx';

const LargeStatCard = ({ title, value, change, icon: Icon, chartData, color, prefix = '' }) => {
	const isPositive = change >= 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
		>
			<div className="flex items-start justify-between mb-4">
				<div>
					<p className="text-gray-500 text-sm font-medium">{title}</p>
					<h3 className="text-3xl font-bold text-gray-900 mt-1">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</h3>
					<div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
						{isPositive ? <FiArrowUpRight className="w-4 h-4" /> : <FiArrowDownRight className="w-4 h-4" />}
						<span>{isPositive ? '+' : ''}{change}% from last month</span>
					</div>
				</div>
				<div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center`}>
					<Icon className="w-6 h-6 text-white" />
				</div>
			</div>
			{chartData && <MiniBarChart data={chartData} color={color} />}
		</motion.div>
	);
};

export default LargeStatCard;
