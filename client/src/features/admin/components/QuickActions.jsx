import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../../../shared/ui/index.js';
import { 
	FiUserPlus, 
	FiPlus, 
	FiBarChart2, 
	FiSettings,
	FiArrowRight
} from 'react-icons/fi';

const actions = [
	{ 
		label: 'Manage Users', 
		description: 'View and manage all users',
		icon: FiUserPlus, 
		color: 'from-indigo-500 to-purple-500', 
		to: 'users' 
	},
	{ 
		label: 'Manage Products', 
		description: 'Review and update products',
		icon: FiPlus, 
		color: 'from-emerald-500 to-teal-500', 
		to: 'products' 
	},
	{ 
		label: 'View Reports', 
		description: 'Check sales and performance',
		icon: FiBarChart2, 
		color: 'from-orange-500 to-red-500', 
		to: 'analytics' 
	},
	{ 
		label: 'Platform Settings', 
		description: 'Configure system options',
		icon: FiSettings, 
		color: 'from-gray-500 to-gray-700', 
		to: 'settings' 
	},
];

const QuickActions = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
		>
			<Card variant="elevated" className="h-full">
				<Card.Header>
					<Card.Title>Quick Actions ⚡</Card.Title>
				</Card.Header>
				<Card.Content className="space-y-3">
					{actions.map((action, index) => {
						const Icon = action.icon;
						return (
							<Link to={action.to} key={action.label} className="block group">
								<motion.div
									className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 
										bg-white hover:border-indigo-100 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.6 + index * 0.05 }}
								>
									<div
										className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} 
											flex items-center justify-center text-white text-xl shadow-sm`}
									>
										<Icon className="w-6 h-6" />
									</div>
									<div className="flex-1">
										<h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
											{action.label}
										</h4>
										<p className="text-sm text-gray-500">{action.description}</p>
									</div>
									<FiArrowRight className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
								</motion.div>
							</Link>
						);
					})}
				</Card.Content>
			</Card>
		</motion.div>
	);
};

export default QuickActions;
