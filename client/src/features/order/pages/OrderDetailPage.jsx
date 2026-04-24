import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMapPin, FiCreditCard, FiShoppingBag, FiAlertCircle } from 'react-icons/fi';
import useOrder from '../hooks/useOrder.js';
import useCancelOrder from '../hooks/useCancelOrder.js';
import OrderTimeline from '../components/OrderTimeline.jsx';
import { Button, Badge, Skeleton, Modal } from '../../../shared/ui/index.js';

const PAYMENT_LABELS = {
	cash_on_delivery: 'Cash on Delivery',
	card: 'Credit / Debit Card',
	paypal: 'PayPal',
	bank_transfer: 'Bank Transfer',
	wallet: 'Digital Wallet',
};

const STATUS_BADGE = {
	pending: 'warning',
	processing: 'warning',
	shipped: 'primary',
	delivered: 'success',
	cancelled: 'danger',
};

/**
 * Order Detail Page (/orders/:orderId)
 * Shows full order info, items, timeline, and cancel action
 */
const OrderDetailPage = () => {
	const { orderId } = useParams();
	const navigate = useNavigate();
	const { order, isLoading, error } = useOrder(orderId);
	const { cancel, isCancelling } = useCancelOrder(orderId);
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [cancelReason, setCancelReason] = useState('');

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleCancel = () => {
		cancel(cancelReason || 'Customer requested cancellation', {
			onSuccess: () => setShowCancelModal(false),
		});
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-6">
					<Skeleton variant="text" className="w-1/3 h-10" />
					<Skeleton variant="image" className="h-20 rounded-2xl" count={4} />
				</div>
			</div>
		);
	}

	if (error || !order) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
				<div className="text-center">
					<FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
					<h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
					<p className="text-gray-500 mb-6">We couldn't find this order. It may have been removed.</p>
					<Button variant="primary" onClick={() => navigate('/orders')}>Back to Orders</Button>
				</div>
			</div>
		);
	}

	const status = (order.status || 'pending').toLowerCase();
	const shortId = order._id ? `ORD-${order._id.substring(order._id.length - 8).toUpperCase()}` : '';
	const items = order.orderItems || [];
	const address = order.shippingAddress || {};
	const totalPrice = order.totalPrice?.amount || order.totalPrice || 0;
	const shippingPrice = order.shippingPrice?.amount || order.shippingPrice || 0;
	const taxPrice = order.taxPrice?.amount || order.taxPrice || 0;
	const itemsPrice = order.itemsPrice?.amount || order.itemsPrice || 0;
	const isPaid = order.isPaid;
	const paymentMethod = order.paymentMethod || 'cash_on_delivery';
	const canCancel = status === 'pending';

	return (
		<div className="min-h-screen bg-gray-50 font-sans">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
				{/* Back */}
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					className="mb-6"
				>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate('/orders')}
						className="gap-2 text-gray-500 hover:text-gray-900"
					>
						<FiArrowLeft className="w-4 h-4" /> Back to Orders
					</Button>
				</motion.div>

				{/* Header */}
				<motion.div
					className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<div>
						<h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{shortId}</h1>
						<p className="text-sm text-gray-500 mt-1">
							Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
								year: 'numeric', month: 'long', day: 'numeric'
							})}
						</p>
					</div>
					<Badge variant={STATUS_BADGE[status] || 'primary'} size="lg">
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</Badge>
				</motion.div>

				{/* Order Tracking Timeline */}
				<motion.div
					className="bg-white rounded-2xl border border-gray-200 p-6 mb-6"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<h2 className="font-bold text-gray-900 mb-5">Order Tracking</h2>
					<OrderTimeline status={status} />
				</motion.div>

				{/* Order Items */}
				<motion.div
					className="bg-white rounded-2xl border border-gray-200 p-6 mb-6"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
						<FiShoppingBag className="w-5 h-5 text-indigo-600" />
						Order Items ({items.length})
					</h2>
					<div className="divide-y divide-gray-100">
						{items.map((oi, index) => {
							const product = oi.product || oi.item || oi;
							const price = oi.price?.amount || oi.price || product.price?.amount || product.price || 0;
							const image = product?.imageCover || product?.images?.[0] || '';
							return (
								<div key={product._id || index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
									<div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
										{image ? (
											<img src={image} alt={product.title || product.name || ''} className="w-full h-full object-cover" />
										) : (
											<div className="w-full h-full flex items-center justify-center text-gray-300">
												<FiShoppingBag className="w-6 h-6" />
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-gray-900 truncate">{product.title || product.name}</p>
										<p className="text-sm text-gray-500">Qty: {oi.quantity || 1}</p>
									</div>
									<span className="font-bold text-gray-900">${(Number(price) * (oi.quantity || 1)).toFixed(2)}</span>
								</div>
							);
						})}
					</div>
				</motion.div>

				{/* Shipping & Payment */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<motion.div
						className="bg-white rounded-2xl border border-gray-200 p-6"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
							<FiMapPin className="w-5 h-5 text-indigo-600" />
							Shipping Address
						</h2>
						{address.street || address.line1 ? (
							<div className="text-sm text-gray-600 space-y-1">
								{address.recipientName && <p className="font-semibold text-gray-800">{address.recipientName}</p>}
								<p>{address.street || address.line1}</p>
								{address.line2 && <p>{address.line2}</p>}
								<p>{address.city}, {address.state} {address.postalCode}</p>
								<p>{address.country}</p>
							</div>
						) : (
							<p className="text-sm text-gray-400">No address provided</p>
						)}
					</motion.div>

					<motion.div
						className="bg-white rounded-2xl border border-gray-200 p-6"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.35 }}
					>
						<h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
							<FiCreditCard className="w-5 h-5 text-indigo-600" />
							Payment Method
						</h2>
						<p className="text-sm font-semibold text-gray-800">{PAYMENT_LABELS[paymentMethod] || paymentMethod}</p>
						<p className="text-sm text-gray-500 mt-1">
							Status: {isPaid ? (
								<span className="text-emerald-600 font-bold">Paid</span>
							) : (
								<span className="text-amber-600 font-bold">Not Paid</span>
							)}
						</p>
					</motion.div>
				</div>

				{/* Order Summary */}
				<motion.div
					className="bg-white rounded-2xl border border-gray-200 p-6 mb-6"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
					<div className="space-y-3 max-w-sm">
						<div className="flex justify-between text-sm text-gray-600">
							<span>Items</span>
							<span className="font-medium">${Number(itemsPrice).toFixed(2)}</span>
						</div>
						<div className="flex justify-between text-sm text-gray-600">
							<span>Shipping</span>
							<span className="font-medium">{Number(shippingPrice) === 0 ? 'Free' : `$${Number(shippingPrice).toFixed(2)}`}</span>
						</div>
						<div className="flex justify-between text-sm text-gray-600">
							<span>Tax</span>
							<span className="font-medium">${Number(taxPrice).toFixed(2)}</span>
						</div>
						<div className="h-px bg-gray-100" />
						<div className="flex justify-between items-center">
							<span className="font-bold text-gray-900">Total</span>
							<span className="text-xl font-black text-indigo-600">${Number(totalPrice).toFixed(2)}</span>
						</div>
					</div>
				</motion.div>

				{/* Cancel Button */}
				{canCancel && (
					<motion.div
						className="flex justify-end"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
					>
						<Button
							variant="outline"
							onClick={() => setShowCancelModal(true)}
							className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
						>
							Cancel Order
						</Button>
					</motion.div>
				)}

				{/* Cancel Confirmation Modal */}
				<Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)}>
					<div className="p-6 space-y-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
								<FiAlertCircle className="w-5 h-5 text-red-600" />
							</div>
							<h3 className="text-lg font-bold text-gray-900">Cancel Order</h3>
						</div>
						<p className="text-sm text-gray-600">
							Are you sure you want to cancel order <strong>{shortId}</strong>? This action cannot be undone.
						</p>
						<textarea
							className="w-full p-3 rounded-xl border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
							placeholder="Reason for cancellation (optional)"
							rows={3}
							value={cancelReason}
							onChange={(e) => setCancelReason(e.target.value)}
						/>
						<div className="flex justify-end gap-3">
							<Button variant="ghost" onClick={() => setShowCancelModal(false)}>
								Keep Order
							</Button>
							<Button
								variant="primary"
								onClick={handleCancel}
								isLoading={isCancelling}
								className="bg-red-600 hover:bg-red-700 border-red-600"
							>
								Cancel Order
							</Button>
						</div>
					</div>
				</Modal>
			</div>
		</div>
	);
};

export default OrderDetailPage;
