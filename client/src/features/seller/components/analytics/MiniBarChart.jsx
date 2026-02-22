import { motion } from 'framer-motion';

const MiniBarChart = ({ data, color = 'indigo' }) => {
	if (!data || data.length === 0) {
		return (
			<div className="flex items-end gap-1 h-16 opacity-30">
				{[...Array(12)].map((_, i) => (
					<div key={i} className="flex-1 h-2 rounded-t bg-gray-200" />
				))}
			</div>
		);
	}
	
	const max = Math.max(...data);
	const colorClasses = {
		indigo: 'from-indigo-500 to-purple-600',
		emerald: 'from-emerald-500 to-teal-600',
		amber: 'from-amber-500 to-orange-500',
		rose: 'from-rose-500 to-red-500',
	};

	return (
		<div className="flex items-end gap-1 h-16">
			{data.map((value, index) => (
				<motion.div
					key={index}
					initial={{ height: 0 }}
					animate={{ height: `${(value / max) * 100}%` }}
					transition={{ delay: index * 0.05 }}
					className={`flex-1 rounded-t bg-linear-to-t ${colorClasses[color]} opacity-80 hover:opacity-100 transition-opacity min-h-[2px]`}
				/>
			))}
		</div>
	);
};

export default MiniBarChart;
