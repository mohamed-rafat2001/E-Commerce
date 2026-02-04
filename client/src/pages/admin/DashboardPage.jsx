import { motion } from 'framer-motion';
import { Card, Badge } from '../../shared/ui/index.js';
import {
	UsersIcon,
	ProductIcon,
	OrderIcon,
	AnalyticsIcon,
} from '../../shared/constants/icons.jsx';

const stats = [
	{
		id: 1,
		name: 'Total Users',
		value: '12,847',
		change: '+12.5%',
		changeType: 'positive',
		icon: UsersIcon,
		gradient: 'from-indigo-500 to-purple-600',
	},
	{
		id: 2,
		name: 'Total Products',
		value: '4,523',
		change: '+8.2%',
		changeType: 'positive',
		icon: ProductIcon,
		gradient: 'from-emerald-500 to-teal-600',
	},
	{
		id: 3,
		name: 'Total Orders',
		value: '34,182',
		change: '+23.1%',
		changeType: 'positive',
		icon: OrderIcon,
		gradient: 'from-orange-500 to-red-500',
	},
	{
		id: 4,
		name: 'Revenue',
		value: '$248.5K',
		change: '+18.7%',
		changeType: 'positive',
		icon: AnalyticsIcon,
		gradient: 'from-pink-500 to-rose-500',
	},
];

const recentOrders = [
	{
		id: 'ORD-001',
		customer: 'John Smith',
		product: 'MacBook Pro 16"',
		amount: '$2,499.00',
		status: 'Completed',
		statusColor: 'success',
	},
	{
		id: 'ORD-002',
		customer: 'Sarah Johnson',
		product: 'iPhone 15 Pro Max',
		amount: '$1,199.00',
		status: 'Processing',
		statusColor: 'warning',
	},
	{
		id: 'ORD-003',
		customer: 'Mike Davis',
		product: 'AirPods Pro',
		amount: '$249.00',
		status: 'Shipped',
		statusColor: 'info',
	},
	{
		id: 'ORD-004',
		customer: 'Emily Wilson',
		product: 'iPad Air',
		amount: '$599.00',
		status: 'Pending',
		statusColor: 'secondary',
	},
];

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
					className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
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
						className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
					>
						<Icon className="w-6 h-6" />
					</div>
				</div>
			</Card>
		</motion.div>
	);
};

const AdminDashboardPage = () => {
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
						Welcome back, Admin! 👋
					</h1>
					<p className="text-gray-500 mt-1">
						Here's what's happening with your store today.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Badge variant="gradient" size="lg" icon={<span>👑</span>}>
						Super Admin
					</Badge>
				</div>
			</motion.div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => (
					<StatCard key={stat.id} stat={stat} index={index} />
				))}
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recent Orders */}
				<motion.div
					className="lg:col-span-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Card variant="elevated">
						<Card.Header>
							<div className="flex items-center justify-between">
								<Card.Title>Recent Orders</Card.Title>
								<Badge variant="primary" size="sm">
									View All
								</Badge>
							</div>
						</Card.Header>
						<Card.Content>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="text-left text-sm text-gray-500 border-b border-gray-100">
											<th className="pb-3 font-medium">Order ID</th>
											<th className="pb-3 font-medium">Customer</th>
											<th className="pb-3 font-medium hidden sm:table-cell">Product</th>
											<th className="pb-3 font-medium">Amount</th>
											<th className="pb-3 font-medium">Status</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-50">
										{recentOrders.map((order, index) => (
											<motion.tr
												key={order.id}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 0.5 + index * 0.05 }}
												className="hover:bg-gray-50/50 transition-colors"
											>
												<td className="py-4 font-medium text-gray-900">
													{order.id}
												</td>
												<td className="py-4 text-gray-600">{order.customer}</td>
												<td className="py-4 text-gray-600 hidden sm:table-cell">
													{order.product}
												</td>
												<td className="py-4 font-semibold text-gray-900">
													{order.amount}
												</td>
												<td className="py-4">
													<Badge variant={order.statusColor} size="sm">
														{order.status}
													</Badge>
												</td>
											</motion.tr>
										))}
									</tbody>
								</table>
							</div>
						</Card.Content>
					</Card>
				</motion.div>

				{/* Quick Actions */}
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
							{[
								{ label: 'Add New User', icon: '👤', color: 'from-indigo-500 to-purple-500' },
								{ label: 'Add Product', icon: '📦', color: 'from-emerald-500 to-teal-500' },
								{ label: 'View Reports', icon: '📊', color: 'from-orange-500 to-red-500' },
								{ label: 'Manage Settings', icon: '⚙️', color: 'from-gray-500 to-gray-700' },
							].map((action, index) => (
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
										className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} 
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
			</div>
		</div>
	);
};

export default AdminDashboardPage;
