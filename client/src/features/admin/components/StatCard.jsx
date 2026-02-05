import { motion } from 'framer-motion';
import { Card, Badge } from '../../../shared/ui/index.js';

const StatCard = ({ stat, index }) => {
	const Icon = stat.icon;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
		>
			<Card variant="elevated" className="relative overflow-hidden group">
				{/* Background gradient */}
				<div
					className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
				/>

				<div className="flex items-start justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500">{stat.name}</p>
						<p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
						<div className="flex items-center gap-1 mt-2">
							<Badge
								variant={stat.changeType === 'positive' ? 'success' : 'danger'}
								size="sm"
							>
								{stat.change}
							</Badge>
							<span className="text-xs text-gray-500">vs last month</span>
						</div>
					</div>
					<div
						className={`p-3 rounded-xl bg-linear-to-br ${stat.gradient} text-white shadow-lg`}
					>
						<Icon className="w-6 h-6" />
					</div>
				</div>
			</Card>
		</motion.div>
	);
};

export default StatCard;
