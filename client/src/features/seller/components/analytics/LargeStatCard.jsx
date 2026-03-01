import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import MiniBarChart from './MiniBarChart.jsx';

const LargeStatCard = ({ title, value, change, icon: Icon, chartData, color, prefix = '' }) => {
	const isPositive = Number(change) >= 0;

	const gradient = color === 'emerald' ? 'from-emerald-500 to-teal-600' :
					 color === 'indigo' ? 'from-indigo-500 to-purple-600' :
					 color === 'amber' ? 'from-amber-500 to-orange-500' :
					 'from-rose-500 to-red-500';

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', bounce: 0.3 }}
			whileHover={{ y: -4, transition: { duration: 0.2 } }}
			className="bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300 relative overflow-hidden group hover:shadow-lg"
			style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}
		>
			{/* Subtle top gradient bar */}
			<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-full`} />

			<div className="flex items-start justify-between mb-4">
				<div>
					<p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
					<h3 className="text-3xl font-black text-gray-900 mt-1 tabular-nums tracking-tight leading-none">
						{prefix}{typeof value === 'number' ? value.toLocaleString() : value}
					</h3>
					<div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mt-4 border ${
						isPositive 
							? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
							: 'bg-rose-50 text-rose-600 border-rose-100'
					}`}>
						{isPositive ? <FiTrendingUp className="w-3.5 h-3.5" /> : <FiTrendingDown className="w-3.5 h-3.5" />}
						<span>{isPositive ? '+' : ''}{change}% from last month</span>
					</div>
				</div>
				<div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg ${gradient} group-hover:scale-105 transition-transform`}>
					{Icon && <Icon className="w-5 h-5 text-white" />}
				</div>
			</div>
			{chartData && <MiniBarChart data={chartData} color={color} />}
		</motion.div>
	);
};

export default LargeStatCard;
