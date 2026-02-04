import { Card, Badge, Button } from '../../../shared/ui/index.js';
import { OrderIcon } from '../../../shared/constants/icons.jsx';

const OrderCard = ({ order }) => {
	return (
		<Card variant="elevated" className="overflow-hidden">
			<div className="flex flex-col md:flex-row gap-6">
				{/* Order Info */}
				<div className="flex-1 space-y-4">
					<div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
						<div className="flex items-center gap-3">
							<div className={`p-2 rounded-lg bg-${order.statusColor === 'warning' ? 'orange' : order.statusColor === 'info' ? 'blue' : 'green'}-50`}>
								<OrderIcon className={`w-5 h-5 text-${order.statusColor === 'warning' ? 'orange' : order.statusColor === 'info' ? 'blue' : 'green'}-600`} />
							</div>
							<div>
								<p className="font-bold text-gray-900">{order.id}</p>
								<p className="text-xs text-gray-500">{order.date}</p>
							</div>
						</div>
						<Badge variant={order.statusColor}>{order.status}</Badge>
					</div>

					<div className="space-y-3">
						{order.items.map((item, i) => (
							<div key={i} className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xl">
									{item.image}
								</div>
								<div className="flex-1">
									<p className="font-medium text-gray-900">{item.name}</p>
									<p className="text-sm text-gray-500">Qty: {item.qty} × {item.price}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Total & Actions */}
				<div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 gap-4">
					<div>
						<p className="text-sm text-gray-500">Total Amount</p>
						<p className="text-2xl font-bold text-gray-900">{order.total}</p>
					</div>
					<div className="space-y-2">
						<Button variant="primary" fullWidth size="sm">
							Track Order
						</Button>
						<Button variant="outline" fullWidth size="sm">
							View Invoice
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default OrderCard;
