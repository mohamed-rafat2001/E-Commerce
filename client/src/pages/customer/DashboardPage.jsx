import { motion } from 'framer-motion';
import { Card, Badge, Button } from '../../shared/ui/index.js';
import {
	OrderIcon,
	HeartIcon,
	ShippingIcon,
} from '../../shared/constants/icons.jsx';

const recentOrders = [
	{
		id: 'ORD-7821',
		date: 'Feb 3, 2026',
		items: 2,
		total: '$189.00',
		status: 'Delivered',
		statusColor: 'success',
	},
	{
		id: 'ORD-7820',
		date: 'Feb 1, 2026',
		items: 1,
		total: '$49.00',
		status: 'Shipped',
		statusColor: 'info',
	},
	{
		id: 'ORD-7819',
		date: 'Jan 28, 2026',
		items: 3,
		total: '$329.00',
		status: 'Processing',
		statusColor: 'warning',
	},
];

const wishlistItems = [
	{ id: 1, name: 'Sony WH-1000XM5', price: '$349.00', image: '🎧', discount: '-15%' },
	{ id: 2, name: 'Apple Watch Ultra', price: '$799.00', image: '⌚', discount: null },
	{ id: 3, name: 'Nike Air Max', price: '$159.00', image: '👟', discount: '-20%' },
];

const CustomerDashboardPage = () => {
	return (
		<div className="space-y-8">
			{/* Welcome Banner */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="relative overflow-hidden rounded-3xl p-8 text-white"
				style={{
					background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
				}}
			>
				{/* Decorative shapes */}
				<div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
				<div className="absolute bottom-0 left-20 w-24 h-24 bg-white/10 rounded-full translate-y-1/2" />

				<div className="relative z-10">
					<h1 className="text-3xl font-bold mb-2">Welcome back! 🛒</h1>
					<p className="text-white/80 max-w-xl">
						Track your orders, manage your wishlist, and discover amazing deals waiting just for you.
					</p>
					<div className="flex flex-wrap gap-4 mt-6">
						<Button variant="secondary" size="md">
							Start Shopping
						</Button>
						<Button
							variant="ghost"
							size="md"
							className="text-white border border-white/30 hover:bg-white/10"
						>
							View Deals
						</Button>
					</div>
				</div>
			</motion.div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{[
					{ icon: OrderIcon, label: 'Total Orders', value: '24', color: 'from-blue-500 to-cyan-500' },
					{ icon: HeartIcon, label: 'Wishlist Items', value: '12', color: 'from-pink-500 to-rose-500' },
					{ icon: ShippingIcon, label: 'Saved Addresses', value: '3', color: 'from-emerald-500 to-teal-500' },
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

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recent Orders */}
				<motion.div
					className="lg:col-span-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<Card variant="elevated">
						<Card.Header>
							<div className="flex items-center justify-between">
								<Card.Title>Recent Orders</Card.Title>
								<motion.button
									className="text-sm font-medium text-blue-600 hover:text-blue-700"
									whileHover={{ scale: 1.05 }}
								>
									View All
								</motion.button>
							</div>
						</Card.Header>
						<Card.Content className="space-y-4">
							{recentOrders.map((order, index) => (
								<motion.div
									key={order.id}
									className="flex flex-col sm:flex-row sm:items-center justify-between 
										gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-all"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 + index * 0.05 }}
								>
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
											<OrderIcon className="w-6 h-6 text-blue-600" />
										</div>
										<div>
											<p className="font-semibold text-gray-900">{order.id}</p>
											<p className="text-sm text-gray-500">{order.date} • {order.items} items</p>
										</div>
									</div>
									<div className="flex items-center justify-between sm:justify-end gap-4">
										<span className="font-bold text-gray-900">{order.total}</span>
										<Badge variant={order.statusColor} size="sm">
											{order.status}
										</Badge>
									</div>
								</motion.div>
							))}
						</Card.Content>
					</Card>
				</motion.div>

				{/* Wishlist Preview */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Card variant="elevated" className="h-full">
						<Card.Header>
							<div className="flex items-center justify-between">
								<Card.Title>My Wishlist</Card.Title>
								<HeartIcon className="w-5 h-5 text-rose-500" />
							</div>
						</Card.Header>
						<Card.Content className="space-y-3">
							{wishlistItems.map((item, index) => (
								<motion.div
									key={item.id}
									className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 
										hover:border-rose-200 hover:shadow-sm transition-all"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.5 + index * 0.05 }}
								>
									<span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
										{item.image}
									</span>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-gray-900 truncate">{item.name}</p>
										<div className="flex items-center gap-2">
											<span className="font-bold text-gray-900">{item.price}</span>
											{item.discount && (
												<Badge variant="danger" size="sm">
													{item.discount}
												</Badge>
											)}
										</div>
									</div>
								</motion.div>
							))}
							<Button variant="outline" fullWidth className="mt-4">
								View All Wishlist
							</Button>
						</Card.Content>
					</Card>
				</motion.div>
			</div>
		</div>
	);
};

export default CustomerDashboardPage;
