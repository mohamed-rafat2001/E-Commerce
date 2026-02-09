import { useMemo } from 'react';
import { Modal, Button } from '../../../../shared/ui/index.js';
import { FiUser, FiMail, FiPhone, FiCalendar, FiDollarSign, FiCheck, FiMapPin, FiBox, FiCreditCard } from 'react-icons/fi';
import { statusConfig, paymentMethodLabels } from './orderConstants.js';
import OrderStatusSelector from './OrderStatusSelector.jsx';

const OrderDetailModal = ({ order, isOpen, onClose, onUpdateStatus, isUpdating }) => {
	if (!order) return null;

	const addr = order.shippingAddress;

	const allItems = useMemo(() => {
		if (!order.items?.length) return [];
		return order.items.flatMap(orderItem => {
			if (orderItem.items && Array.isArray(orderItem.items)) {
				return orderItem.items.map(i => ({
					name: i.item?.name || 'Unknown Product',
					quantity: i.quantity,
					price: i.price?.amount,
					currency: i.price?.currency || 'USD',
					image: i.item?.coverImage?.secure_url,
				}));
			}
			return [{
				name: orderItem.product?.name || orderItem.name || 'Product',
				quantity: orderItem.quantity || 1,
				price: orderItem.price?.amount || orderItem.totalPrice?.amount,
				currency: orderItem.price?.currency || 'USD',
				image: orderItem.product?.coverImage?.secure_url,
			}];
		});
	}, [order.items]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Order Details" size="lg">
			<div className="space-y-6">
				{/* Order Header */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
					<div>
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
						<p className="text-sm font-mono font-semibold text-gray-800 select-all">{order._id}</p>
					</div>
					<div className="flex items-center gap-3">
						<OrderStatusSelector value={order.status} onChange={(newStatus) => onUpdateStatus(order._id, newStatus)} disabled={isUpdating} />
						<span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${order.isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
							<FiDollarSign className="w-3.5 h-3.5" />
							{order.isPaid ? 'Paid' : 'Unpaid'}
						</span>
					</div>
				</div>

				{/* Customer & Dates */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Customer</p>
						<div className="space-y-1.5">
							<p className="text-sm font-semibold text-gray-800 flex items-center gap-2"><FiUser className="w-3.5 h-3.5 text-indigo-500" />{order.userId?.firstName} {order.userId?.lastName}</p>
							{order.userId?.email && <p className="text-xs text-gray-500 flex items-center gap-2"><FiMail className="w-3.5 h-3.5 text-gray-400" />{order.userId.email}</p>}
							{order.userId?.phoneNumber && <p className="text-xs text-gray-500 flex items-center gap-2"><FiPhone className="w-3.5 h-3.5 text-gray-400" />{order.userId.phoneNumber}</p>}
						</div>
					</div>
					<div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Timeline</p>
						<div className="space-y-1.5">
							<p className="text-xs text-gray-600 flex items-center gap-2"><FiCalendar className="w-3.5 h-3.5 text-blue-500" /><span className="font-medium">Placed:</span> {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</p>
							{order.isPaid && order.paidAt && <p className="text-xs text-gray-600 flex items-center gap-2"><FiDollarSign className="w-3.5 h-3.5 text-emerald-500" /><span className="font-medium">Paid:</span> {new Date(order.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
							{order.isDelivered && order.deliveredAt && <p className="text-xs text-gray-600 flex items-center gap-2"><FiCheck className="w-3.5 h-3.5 text-emerald-500" /><span className="font-medium">Delivered:</span> {new Date(order.deliveredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
						</div>
					</div>
				</div>

				{/* Shipping Address */}
				{addr && (
					<div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Address</p>
						<div className="flex items-start gap-2">
							<FiMapPin className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
							<div className="text-sm text-gray-700">
								{addr.recipientName && <p className="font-semibold">{addr.recipientName}</p>}
								<p>{[addr.line1, addr.line2].filter(Boolean).join(', ')}</p>
								<p>{[addr.city, addr.state, addr.postalCode].filter(Boolean).join(', ')}</p>
								<p>{addr.country}</p>
								{addr.phone && <p className="text-gray-500 mt-1">{addr.phone}</p>}
							</div>
						</div>
					</div>
				)}

				{/* Order Items */}
				{allItems.length > 0 && (
					<div>
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Items ({allItems.length})</p>
						<div className="space-y-2">
							{allItems.map((item, idx) => (
								<div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
									{item.image ? (
										<div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
											<img src={item.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
										</div>
									) : (
										<div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
											<FiBox className="w-4 h-4 text-gray-400" />
										</div>
									)}
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
										<p className="text-xs text-gray-500">Qty: {item.quantity}</p>
									</div>
									{item.price != null && <p className="text-sm font-bold text-gray-800">${item.price.toFixed(2)}</p>}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Price Breakdown */}
				<div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
					<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Price Summary</p>
					<div className="flex justify-between text-sm text-gray-600"><span>Items</span><span className="font-semibold">${order.itemsPrice?.amount?.toFixed(2) || '0.00'}</span></div>
					<div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span className="font-semibold">${order.shippingPrice?.amount?.toFixed(2) || '0.00'}</span></div>
					<div className="flex justify-between text-sm text-gray-600"><span>Tax</span><span className="font-semibold">${order.taxPrice?.amount?.toFixed(2) || '0.00'}</span></div>
					<div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200"><span>Total</span><span className="text-indigo-600">${order.totalPrice?.amount?.toFixed(2) || '0.00'}</span></div>
				</div>

				{/* Payment */}
				<div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
					<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Method</p>
					<p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
						<FiCreditCard className="w-4 h-4 text-indigo-500" />
						{paymentMethodLabels[order.paymentMethod] || order.paymentMethod || '—'}
					</p>
				</div>

				<div className="flex justify-end pt-4 border-t border-gray-100">
					<Button variant="secondary" onClick={onClose}>Close</Button>
				</div>
			</div>
		</Modal>
	);
};

export default OrderDetailModal;
