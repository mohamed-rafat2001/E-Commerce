import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Badge } from '../../../shared/ui/index.js';
import { OrderIcon } from '../../../shared/constants/icons.jsx';
import useOrderHistory from '../hooks/useOrderHistory.js';

const STATUS_COLOR = {
	pending: 'warning',
	processing: 'warning',
	shipped: 'primary',
	delivered: 'success',
	cancelled: 'danger',
};

/**
 * RecentOrders — wired to real order data via useOrderHistory 
 */
const RecentOrders = () => {
	const navigate = useNavigate();
	const { orders, isLoading } = useOrderHistory({ limit: 3 });

	// Map real data to card format
	const recentOrders = (orders || []).slice(0, 3).map((o) => ({
		id: `ORD-${o._id.substring(o._id.length - 4)}`,
		orderId: o._id,
		date: new Date(o.createdAt).toLocaleDateString(),
		items: o.orderItems?.length || 0,
		total: `$${o.totalPrice?.amount || 0}`,
		status: o.status || 'pending',
		statusColor: STATUS_COLOR[(o.status || 'pending').toLowerCase()] || 'primary',
	}));

	return (
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
						<Link to="/customer/orderHistory">
							<motion.button
								className="text-sm font-medium text-blue-600 hover:text-blue-700"
								whileHover={{ scale: 1.05 }}
							>
								View All
							</motion.button>
						</Link>
					</div>
				</Card.Header>
				<Card.Content className="space-y-4">
					{isLoading ? (
						<div className="space-y-3">
							{[1, 2, 3].map((i) => (
								<div key={i} className="h-16 bg-gray-100/50 rounded-xl animate-pulse" />
							))}
						</div>
					) : recentOrders.length === 0 ? (
						<div className="text-center py-8">
							<OrderIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
							<p className="text-sm text-gray-400 font-medium">No orders yet</p>
						</div>
					) : (
						recentOrders.map((order, index) => (
							<motion.div
								key={order.orderId}
								className="flex flex-col sm:flex-row sm:items-center justify-between 
									gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-all cursor-pointer"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.4 + index * 0.05 }}
								onClick={() => navigate(`/orders/${order.orderId}`)}
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
						))
					)}
				</Card.Content>
			</Card>
		</motion.div>
	);
};

export default RecentOrders;
