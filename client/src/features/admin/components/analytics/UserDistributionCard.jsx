import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';

const UserDistributionCard = ({ users }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-6 border border-gray-100"
	>
		<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
			<FiUsers className="w-5 h-5 text-indigo-500" />
			User Distribution
		</h3>
		<div className="space-y-4">
			{users.byRole.map((item, index) => (
				<div key={item.role}>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-700">{item.role}</span>
						<span className="text-sm text-gray-500">{item.count.toLocaleString()} ({item.percentage}%)</span>
					</div>
					<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${item.percentage}%` }}
							transition={{ delay: index * 0.2, duration: 0.5 }}
							className={`h-full rounded-full ${
								item.role === 'Customers' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
								item.role === 'Sellers' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
								'bg-gradient-to-r from-purple-500 to-pink-500'
							}`}
						/>
					</div>
				</div>
			))}
		</div>
		<div className="mt-4 pt-4 border-t border-gray-100">
			<div className="flex items-center justify-between">
				<span className="text-sm text-gray-500">New this month</span>
				<span className="text-lg font-bold text-emerald-600">+{users.newThisMonth}</span>
			</div>
		</div>
	</motion.div>
);

export default UserDistributionCard;
