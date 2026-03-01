import { motion } from 'framer-motion';

const SmallStatCard = ({ title, value, icon: Icon, gradient }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.95 }}
		animate={{ opacity: 1, scale: 1 }}
		transition={{ type: 'spring', bounce: 0.3 }}
		whileHover={{ y: -4, transition: { duration: 0.2 } }}
		className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
		style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}
	>
		{/* Subtle top gradient bar */}
		<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-full`} />
		
		<div className="flex items-center gap-4">
			<div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
				{Icon && <Icon className="w-5 h-5 text-white" />}
			</div>
			<div>
				<h4 className="text-2xl font-black text-gray-900 tabular-nums leading-none tracking-tight">{value}</h4>
				<p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{title}</p>
			</div>
		</div>
	</motion.div>
);

export default SmallStatCard;
