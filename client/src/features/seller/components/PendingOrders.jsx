import { motion } from 'framer-motion';
import { Card, Badge } from '../../../shared/ui/index.js';

const PendingOrders = ({ orders = [] }) => {
	return (
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
							{(orders || []).length} New
						</Badge>
					</div>
				</Card.Header>
				<Card.Content className="space-y-3">
					{(orders || []).map((order, index) => (
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
	);
};

export default PendingOrders;
