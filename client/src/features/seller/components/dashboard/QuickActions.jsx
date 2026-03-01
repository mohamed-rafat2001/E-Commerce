import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlus, FiShoppingBag, FiArchive, FiArrowRight } from 'react-icons/fi';

const quickActions = [
	{
		icon: FiShoppingBag,
		title: 'View Orders',
		to: '/seller/orders',
		gradient: 'from-blue-500 to-indigo-600',
		shadow: 'shadow-blue-200/50',
		hoverBorder: 'hover:border-blue-200',
		description: 'Manage customer orders',
	},
	{
		icon: FiArchive,
		title: 'Inventory',
		to: '/seller/inventory',
		gradient: 'from-emerald-500 to-teal-600',
		shadow: 'shadow-emerald-200/50',
		hoverBorder: 'hover:border-emerald-200',
		description: 'Update stock levels',
	},
];

const QuickActions = () => {
	return (
		<div>
			<h3 className="text-lg font-black text-gray-900 mb-4 tracking-tight">Quick Actions ⚡</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{quickActions.map((action, index) => {
					const IconComponent = action.icon;
					return (
						<Link key={action.title} to={action.to} className="group">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.08, type: 'spring', bounce: 0.3 }}
								whileHover={{ y: -4, transition: { duration: 0.2 } }}
								whileTap={{ scale: 0.98 }}
								className={`bg-white rounded-2xl p-6 border border-gray-100 ${action.hoverBorder}
									hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
								style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}
							>
								<div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg ${action.shadow}`}>
									<IconComponent className="w-5 h-5 text-white" />
								</div>
								<h4 className="font-bold text-gray-900 text-sm mb-1.5 group-hover:text-indigo-600 transition-colors">{action.title}</h4>
								<p className="text-xs text-gray-400 leading-relaxed font-medium">{action.description}</p>
								<div className="absolute top-6 right-6 w-8 h-8 rounded-xl bg-gray-50
									flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
									<FiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600
										group-hover:translate-x-0.5 transition-all duration-200" />
								</div>
							</motion.div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default QuickActions;
