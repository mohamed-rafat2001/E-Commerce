import { motion } from 'framer-motion';
import { Card, Badge, Avatar } from '../../shared/ui/index.js';
import {
	OrderIcon,
	InventoryIcon,
	UsersIcon,
} from '../../shared/constants/icons.jsx';

const tasks = [
	{ id: 1, title: 'Process new orders', count: 8, priority: 'high' },
	{ id: 2, title: 'Update inventory', count: 3, priority: 'medium' },
	{ id: 3, title: 'Customer inquiries', count: 12, priority: 'high' },
	{ id: 4, title: 'Returns processing', count: 2, priority: 'low' },
];

const ordersToProcess = [
	{ id: 'ORD-445', customer: 'Emma Watson', items: 2, time: '10 min ago' },
	{ id: 'ORD-444', customer: 'John Carter', items: 5, time: '25 min ago' },
	{ id: 'ORD-443', customer: 'Sarah Mills', items: 1, time: '1 hour ago' },
];

const EmployeeDashboardPage = () => {
	return (
		<div className="space-y-8">
			{/* Page Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
			>
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Good morning! 💼
					</h1>
					<p className="text-gray-500 mt-1">
						Here are your tasks for today.
					</p>
				</div>
				<Badge
					variant="gradient"
					size="lg"
					className="!bg-gradient-to-r !from-pink-500 !to-amber-400"
				>
					Employee Portal
				</Badge>
			</motion.div>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{[
					{ icon: OrderIcon, label: 'Orders to Process', value: '23', color: 'from-pink-500 to-rose-500' },
					{ icon: InventoryIcon, label: 'Low Stock Alerts', value: '7', color: 'from-amber-500 to-orange-500' },
					{ icon: UsersIcon, label: 'Customer Messages', value: '12', color: 'from-indigo-500 to-purple-500' },
				].map((stat, index) => (
					<motion.div
						key={stat.label}
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
				))}
			</div>

			{/* Main Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Tasks List */}
				<motion.div
					className="lg:col-span-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<Card variant="elevated">
						<Card.Header>
							<Card.Title>Today's Tasks</Card.Title>
						</Card.Header>
						<Card.Content className="space-y-3">
							{tasks.map((task, index) => (
								<motion.div
									key={task.id}
									className="flex items-center justify-between p-4 rounded-xl 
										bg-gray-50/50 hover:bg-gray-100/50 transition-all cursor-pointer"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 + index * 0.05 }}
									whileHover={{ scale: 1.01 }}
								>
									<div className="flex items-center gap-4">
										<div
											className={`w-3 h-3 rounded-full ${
												task.priority === 'high'
													? 'bg-rose-500'
													: task.priority === 'medium'
													? 'bg-amber-500'
													: 'bg-emerald-500'
											}`}
										/>
										<span className="font-medium text-gray-900">{task.title}</span>
									</div>
									<Badge
										variant={
											task.priority === 'high'
												? 'danger'
												: task.priority === 'medium'
												? 'warning'
												: 'success'
										}
										size="sm"
									>
										{task.count} pending
									</Badge>
								</motion.div>
							))}
						</Card.Content>
					</Card>
				</motion.div>

				{/* Orders Queue */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Card variant="elevated" className="h-full">
						<Card.Header>
							<div className="flex items-center justify-between">
								<Card.Title>Order Queue</Card.Title>
								<Badge variant="danger" size="sm">
									{ordersToProcess.length} New
								</Badge>
							</div>
						</Card.Header>
						<Card.Content className="space-y-3">
							{ordersToProcess.map((order, index) => (
								<motion.div
									key={order.id}
									className="p-4 rounded-xl border border-gray-100 
										hover:border-pink-200 hover:shadow-sm transition-all"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.5 + index * 0.05 }}
								>
									<div className="flex items-center gap-3">
										<Avatar name={order.customer} size="sm" />
										<div className="flex-1">
											<p className="font-medium text-gray-900">{order.customer}</p>
											<p className="text-sm text-gray-500">
												{order.id} • {order.items} items
											</p>
										</div>
									</div>
									<p className="text-xs text-gray-400 mt-2">{order.time}</p>
								</motion.div>
							))}
							<motion.button
								className="w-full py-3 text-center text-pink-600 font-medium 
									rounded-xl border border-pink-200 hover:bg-pink-50 transition-colors"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								View All Orders
							</motion.button>
						</Card.Content>
					</Card>
				</motion.div>
			</div>
		</div>
	);
};

export default EmployeeDashboardPage;
