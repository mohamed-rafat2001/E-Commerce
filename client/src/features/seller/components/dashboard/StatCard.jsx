import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const StatCard = ({ stat, index, title, value, change, changeType, icon: Icon, gradient, color }) => {
	const useStatObject = !!stat;

	const finalTitle = useStatObject ? stat.title : title;
	const finalValue = useStatObject ? stat.value : value;
	const finalChange = useStatObject ? stat.change : change;
	const finalChangeType = useStatObject ? stat.changeType : changeType;
	const finalGradient = useStatObject ? stat.gradient : gradient || color;
	const FinalIcon = useStatObject ? stat.icon : Icon;

	const isPositive = finalChangeType === 'positive';
	const isNeutral = finalChangeType === 'neutral';

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: (index !== undefined) ? index * 0.08 : 0, type: 'spring', bounce: 0.3 }}
			whileHover={{ y: -4, transition: { duration: 0.2 } }}
			className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
			style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}
		>
			{/* Subtle top gradient bar */}
			<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${finalGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-full`} />

			<div className="flex items-start justify-between mb-4">
				<div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${finalGradient} flex items-center justify-center shadow-lg`}>
					{FinalIcon && <FinalIcon className="w-5 h-5 text-white" />}
				</div>
				<div className="text-right">
					<p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{finalTitle}</p>
					<h3 className="text-2xl font-black text-gray-900 mt-1 tabular-nums">{finalValue}</h3>
				</div>
			</div>
			{finalChange && (
				<div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
					isPositive
						? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
						: isNeutral
							? 'bg-gray-50 text-gray-500 border border-gray-100'
							: 'bg-rose-50 text-rose-600 border border-rose-100'
				}`}>
					{isPositive ? <FiTrendingUp className="w-3.5 h-3.5" /> : isNeutral ? <FiMinus className="w-3.5 h-3.5" /> : <FiTrendingDown className="w-3.5 h-3.5" />}
					{finalChange}
				</div>
			)}
		</motion.div>
	);
};

export default StatCard;