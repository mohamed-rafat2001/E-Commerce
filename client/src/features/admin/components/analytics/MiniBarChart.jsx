import { motion } from 'framer-motion';

const MiniBarChart = ({ data, color = 'indigo' }) => {
	const max = Math.max(...data);
	const colorClasses = {
		indigo: 'from-indigo-500 to-purple-600',
		emerald: 'from-emerald-500 to-teal-600',
		amber: 'from-amber-500 to-orange-500',
		rose: 'from-rose-500 to-pink-500',
	};

	return (
		<div className="flex items-end gap-1 h-20">
			{data.map((value, index) => (
				<motion.div
					key={index}
					initial={{ height: 0 }}
					animate={{ height: `${(value / max) * 100}%` }}
					transition={{ delay: index * 0.05, duration: 0.3 }}
					className={`flex-1 rounded-t-sm bg-gradient-to-t ${colorClasses[color]} opacity-80 hover:opacity-100 transition-opacity`}
				/>
			))}
		</div>
	);
};

export default MiniBarChart;
