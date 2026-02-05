import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/index.js';

const actions = [
	{ label: 'Add New User', icon: '👤', color: 'from-indigo-500 to-purple-500' },
	{ label: 'Add Product', icon: '📦', color: 'from-emerald-500 to-teal-500' },
	{ label: 'View Reports', icon: '📊', color: 'from-orange-500 to-red-500' },
	{ label: 'Manage Settings', icon: '⚙️', color: 'from-gray-500 to-gray-700' },
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
					<Card.Title>Quick Actions</Card.Title>
				</Card.Header>
				<Card.Content className="space-y-3">
					{actions.map((action, index) => (
						<motion.button
							key={action.label}
							className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-100 
								hover:border-gray-200 hover:shadow-md transition-all duration-200 text-left"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.6 + index * 0.05 }}
						>
							<span
								className={`w-10 h-10 rounded-lg bg-linear-to-br ${action.color} 
									flex items-center justify-center text-xl shadow-sm`}
							>
								{action.icon}
							</span>
							<span className="font-medium text-gray-700">{action.label}</span>
						</motion.button>
					))}
				</Card.Content>
			</Card>
		</motion.div>
	);
};

export default QuickActions;
