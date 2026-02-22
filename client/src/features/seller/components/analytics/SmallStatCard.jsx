import { motion } from 'framer-motion';

const SmallStatCard = ({ title, value, icon: Icon, gradient }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.9 }}
		animate={{ opacity: 1, scale: 1 }}
		className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
	>
		<div className="flex items-center gap-4">
			<div className={`w-12 h-12 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center`}>
				{Icon && <Icon className="w-6 h-6 text-white" />}
			</div>
			<div>
				<h4 className="text-2xl font-bold text-gray-900">{value}</h4>
				<p className="text-sm text-gray-500">{title}</p>
			</div>
		</div>
	</motion.div>
);

export default SmallStatCard;
