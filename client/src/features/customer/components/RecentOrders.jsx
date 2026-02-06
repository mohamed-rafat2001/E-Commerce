import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../../../shared/ui/index.js';
import { OrderIcon } from '../../../shared/constants/icons.jsx';

const RecentOrders = ({ orders }) => {
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
					{orders.map((order, index) => (
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
	);
};

export default RecentOrders;
