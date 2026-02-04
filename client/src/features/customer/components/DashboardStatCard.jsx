import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/index.js';

const DashboardStatCard = ({ stat, index }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
		>
			<Card variant="elevated" className="flex items-center gap-4">
				<div
					className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
				>
					<stat.icon className="w-6 h-6" />
				</div>
				<div>
					<p className="text-sm text-gray-500">{stat.label}</p>
					<p className="text-2xl font-bold text-gray-900">{stat.value}</p>
				</div>
			</Card>
		</motion.div>
	);
};

export default DashboardStatCard;
