import { motion } from 'framer-motion';

const StatCard = ({ title, value, color, icon: Icon }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.9 }}
		animate={{ opacity: 1, scale: 1 }}
		className="bg-white rounded-2xl p-5 border border-gray-100"
	>
		<div className="flex items-center gap-3">
			<div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
				<Icon className="w-5 h-5 text-white" />
			</div>
			<div>
				<p className="text-2xl font-bold text-gray-900">{value}</p>
				<p className="text-sm text-gray-500">{title}</p>
			</div>
		</div>
	</motion.div>
);

export default StatCard;
