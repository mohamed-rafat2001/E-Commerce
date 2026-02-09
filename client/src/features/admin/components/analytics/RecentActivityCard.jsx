import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';

const RecentActivityCard = ({ activities }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-6 border border-gray-100"
	>
		<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
			<FiCalendar className="w-5 h-5 text-indigo-500" />
			Recent Activity
		</h3>
		<div className="space-y-3">
			{activities.map((activity, index) => {
				const ActivityIcon = activity.icon;
				return (
					<motion.div
						key={index}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.1 }}
						className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
					>
						<div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
							activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
							activity.type === 'user' ? 'bg-emerald-100 text-emerald-600' :
							activity.type === 'product' ? 'bg-amber-100 text-amber-600' :
							'bg-purple-100 text-purple-600'
						}`}>
							<ActivityIcon className="w-4 h-4" />
						</div>
						<div className="flex-1">
							<p className="text-sm text-gray-700">{activity.message}</p>
							<p className="text-xs text-gray-400">{activity.time}</p>
						</div>
					</motion.div>
				);
			})}
		</div>
	</motion.div>
);

export default RecentActivityCard;
