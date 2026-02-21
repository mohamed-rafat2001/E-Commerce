import { motion } from 'framer-motion';
import { Card, Badge } from '../../../shared/ui/index.js';
import { FiShoppingBag, FiCalendar, FiDollarSign } from 'react-icons/fi';

const PendingOrders = ({ orders = [] }) => {
	const hasOrders = orders && orders.length > 0;
	
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
		>
			<Card variant="elevated" className="h-full">
				<Card.Header>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FiShoppingBag className="w-5 h-5 text-indigo-600" />
							<Card.Title>Pending Orders</Card.Title>
						</div>
						<Badge variant="warning" size="sm">
							{hasOrders ? orders.length : 0} New
						</Badge>
					</div>
				</Card.Header>
				<Card.Content className="space-y-4">
					{hasOrders ? (
						orders.map((order, index) => (
							<motion.div
								key={order._id || order.id}
								className="p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 
									transition-all duration-200 border border-gray-100 hover:border-indigo-200"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.6 + index * 0.05 }}
							>
								<div className="flex items-center justify-between mb-3">
									<span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
										#{order._id?.slice(-6) || order.id?.slice(-6) || 'N/A'}
									</span>
									<Badge variant={order.status === 'pending' ? 'warning' : 'info'} size="sm">
										{order.status || 'Pending'}
									</Badge>
								</div>
								<p className="font-semibold text-gray-900 mb-2">
									{order.customer?.name || order.customer || 'Customer Name'}
								</p>
								<div className="grid grid-cols-2 gap-3 text-sm">
									<div className="flex items-center gap-2">
										<FiDollarSign className="w-4 h-4 text-emerald-600" />
										<span className="font-medium text-gray-900">
											${order.totalPrice?.toFixed(2) || order.amount?.toFixed(2) || '0.00'}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<FiCalendar className="w-4 h-4 text-indigo-600" />
										<span className="text-gray-600">
											{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
										</span>
									</div>
								</div>
							</motion.div>
						))
					) : (
						<div className="text-center py-8">
							<FiShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
							<p className="text-gray-500 font-medium">No pending orders</p>
							<p className="text-sm text-gray-400 mt-1">All orders are fulfilled</p>
						</div>
					)}
					<motion.button
						className="w-full py-3 text-center text-indigo-600 font-medium 
							rounded-xl border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 
							transition-all duration-200"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						View All Orders
					</motion.button>
				</Card.Content>
			</Card>
		</motion.div>
	);
};

export default PendingOrders;
