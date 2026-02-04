import { motion } from 'framer-motion';
import { Card, Badge, Avatar } from '../../../shared/ui/index.js';

const RecentOrders = ({ orders }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
		>
			<Card variant="elevated">
				<Card.Header>
					<Card.Title>Recent Orders</Card.Title>
				</Card.Header>
				<Card.Content className="space-y-4">
					{orders.map((order) => (
						<div key={order.id} className="flex items-center gap-3">
							<Avatar name={order.customer} size="sm" />
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate">
									{order.customer}
								</p>
								<p className="text-xs text-gray-500">
									{order.items} items • {order.time}
								</p>
							</div>
							<Badge variant="outline" size="sm">
								{order.id}
							</Badge>
						</div>
					))}
				</Card.Content>
			</Card>
		</motion.div>
	);
};

export default RecentOrders;
