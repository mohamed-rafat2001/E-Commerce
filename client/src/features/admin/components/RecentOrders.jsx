import { motion } from 'framer-motion';
import { Card, Badge } from '../../../shared/ui/index.js';

const RecentOrders = ({ orders }) => {
	return (
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
								{orders.map((order, index) => (
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
	);
};

export default RecentOrders;
