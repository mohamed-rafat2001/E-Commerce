import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPackage, FiArrowRight, FiCalendar } from 'react-icons/fi';
import { Badge, Button } from '../../../shared/ui/index.js';

const STATUS_BADGE = {
	pending: 'warning',
	processing: 'warning',
	shipped: 'primary',
	delivered: 'success',
	cancelled: 'danger',
};

/**
 * Card representing a single order in the orders list view
 */
const OrderListCard = ({ order, index = 0 }) => {
	const orderId = order._id;
	const shortId = orderId ? `ORD-${orderId.substring(orderId.length - 8).toUpperCase()}` : '';
	const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
		year: 'numeric', month: 'short', day: 'numeric'
	}) : '';
	const status = (order.status || 'pending').toLowerCase();
	const totalPrice = order.totalPrice?.amount || order.totalPrice || 0;
	const items = order.orderItems || [];

	// Collect up to 3 thumbnail images
	const thumbnails = items
		.slice(0, 3)
		.map((oi) => {
			const product = oi.product || oi.item || oi;
			return product?.imageCover || product?.images?.[0] || null;
		})
		.filter(Boolean);

	const remainingCount = items.length - thumbnails.length;

	return (
		<motion.div
			className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.05 }}
		>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				{/* Left section: icon + info */}
				<div className="flex items-start gap-4 flex-1 min-w-0">
					<div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
						<FiPackage className="w-6 h-6 text-indigo-600" />
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-3 flex-wrap mb-1">
							<h3 className="font-bold text-gray-900 text-sm">{shortId}</h3>
							<Badge variant={STATUS_BADGE[status] || 'primary'} size="sm">
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</Badge>
						</div>
						<div className="flex items-center gap-3 text-sm text-gray-500">
							<span className="flex items-center gap-1">
								<FiCalendar className="w-3.5 h-3.5" />
								{date}
							</span>
							<span>•</span>
							<span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
						</div>

						{/* Product thumbnails */}
						{thumbnails.length > 0 && (
							<div className="flex items-center gap-1.5 mt-3">
								{thumbnails.map((src, i) => (
									<div key={i} className="w-9 h-9 rounded-lg overflow-hidden border-2 border-white shadow-sm">
										<img src={src} alt="" className="w-full h-full object-cover" />
									</div>
								))}
								{remainingCount > 0 && (
									<div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
										+{remainingCount}
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Right section: price + action */}
				<div className="flex items-center gap-4 sm:flex-col sm:items-end">
					<span className="text-lg font-black text-gray-900">${Number(totalPrice).toFixed(2)}</span>
					<Link to={`/orders/${orderId}`}>
						<Button variant="ghost" size="sm" className="gap-1.5 text-indigo-600 hover:text-indigo-700">
							Details <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
						</Button>
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderListCard;
