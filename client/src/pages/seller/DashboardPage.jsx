import { motion } from 'framer-motion';
import { Card, Badge } from '../../shared/ui/index.js';
import {
	ProductIcon,
	OrderIcon,
	AnalyticsIcon,
	InventoryIcon,
} from '../../shared/constants/icons.jsx';

const stats = [
	{
		id: 1,
		name: 'Total Products',
		value: '156',
		change: '+8.2%',
		changeType: 'positive',
		icon: ProductIcon,
		gradient: 'from-emerald-500 to-teal-600',
	},
	{
		id: 2,
		name: 'Active Orders',
		value: '43',
		change: '+12.5%',
		changeType: 'positive',
		icon: OrderIcon,
		gradient: 'from-indigo-500 to-purple-600',
	},
	{
		id: 3,
		name: 'Revenue Today',
		value: '$4,821',
		change: '+23.1%',
		changeType: 'positive',
		icon: AnalyticsIcon,
		gradient: 'from-orange-500 to-red-500',
	},
	{
		id: 4,
		name: 'Low Stock Items',
		value: '12',
		change: '-5%',
		changeType: 'negative',
		icon: InventoryIcon,
		gradient: 'from-pink-500 to-rose-500',
	},
];

const topProducts = [
	{
		id: 1,
		name: 'Wireless Headphones',
		sold: 234,
		revenue: '$8,424',
		image: '🎧',
	},
	{
		id: 2,
		name: 'Smart Watch Pro',
		sold: 189,
		revenue: '$18,900',
		image: '⌚',
	},
	{
		id: 3,
		name: 'Laptop Stand',
		sold: 156,
		revenue: '$4,680',
		image: '💻',
	},
	{
		id: 4,
		name: 'Mechanical Keyboard',
		sold: 142,
		revenue: '$14,200',
		image: '⌨️',
	},
];

const pendingOrders = [
	{ id: 'ORD-891', customer: 'Alex Chen', items: 3, total: '$289.00' },
	{ id: 'ORD-892', customer: 'Maria Lopez', items: 1, total: '$199.00' },
	{ id: 'ORD-893', customer: 'James Wilson', items: 5, total: '$459.00' },
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

const SellerDashboardPage = () => {
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
						Store Dashboard 🏪
					</h1>
					<p className="text-gray-500 mt-1">
						Track your sales and manage your products.
					</p>
				</div>
				<motion.button
					className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white 
						font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					+ Add New Product
				</motion.button>
			</motion.div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => (
					<StatCard key={stat.id} stat={stat} index={index} />
				))}
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Top Products */}
				<motion.div
					className="lg:col-span-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Card variant="elevated">
						<Card.Header>
							<div className="flex items-center justify-between">
								<Card.Title>Top Selling Products</Card.Title>
								<Badge variant="success" size="sm">
									This Month
								</Badge>
							</div>
						</Card.Header>
						<Card.Content>
							<div className="space-y-4">
								{topProducts.map((product, index) => (
									<motion.div
										key={product.id}
										className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 
											hover:bg-gray-100/50 transition-all duration-200"
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.5 + index * 0.05 }}
									>
										<span className="w-12 h-12 rounded-xl bg-white shadow-sm 
											flex items-center justify-center text-2xl">
											{product.image}
										</span>
										<div className="flex-1">
											<p className="font-semibold text-gray-900">{product.name}</p>
											<p className="text-sm text-gray-500">{product.sold} units sold</p>
										</div>
										<div className="text-right">
											<p className="font-bold text-gray-900">{product.revenue}</p>
											<p className="text-xs text-gray-500">Total Revenue</p>
										</div>
									</motion.div>
								))}
							</div>
						</Card.Content>
					</Card>
				</motion.div>

				{/* Pending Orders */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
				>
					<Card variant="elevated" className="h-full">
						<Card.Header>
							<div className="flex items-center justify-between">
								<Card.Title>Pending Orders</Card.Title>
								<Badge variant="warning" size="sm">
									{pendingOrders.length} New
								</Badge>
							</div>
						</Card.Header>
						<Card.Content className="space-y-3">
							{pendingOrders.map((order, index) => (
								<motion.div
									key={order.id}
									className="p-4 rounded-xl border border-gray-100 hover:border-emerald-200 
										hover:shadow-sm transition-all duration-200"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.6 + index * 0.05 }}
								>
									<div className="flex items-center justify-between mb-2">
										<span className="font-mono text-sm text-gray-500">{order.id}</span>
										<Badge variant="warning" size="sm">Pending</Badge>
									</div>
									<p className="font-semibold text-gray-900">{order.customer}</p>
									<div className="flex items-center justify-between mt-2 text-sm">
										<span className="text-gray-500">{order.items} items</span>
										<span className="font-bold text-emerald-600">{order.total}</span>
									</div>
								</motion.div>
							))}
							<motion.button
								className="w-full py-3 text-center text-emerald-600 font-medium 
									rounded-xl border border-emerald-200 hover:bg-emerald-50 transition-colors"
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

export default SellerDashboardPage;
