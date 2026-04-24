import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { Button, Badge } from '../../../shared/ui/index.js';

/**
 * Post-checkout success page — shows order confirmation with order IDs
 */
const OrderSuccessPage = () => {
	const { state } = useLocation();
	const navigate = useNavigate();
	const orders = state?.orders || [];

	// Scroll to top
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// If someone navigates here directly without state, show fallback
	if (orders.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
				<motion.div
					className="text-center max-w-md"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
						<FiCheckCircle className="w-10 h-10 text-emerald-600" />
					</div>
					<h1 className="text-2xl font-black text-gray-900 mb-3">Order Placed!</h1>
					<p className="text-gray-500 mb-8">Your order has been placed successfully. Check your order history for details.</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Button variant="primary" onClick={() => navigate('/orders')} className="gap-2">
							<FiPackage className="w-4 h-4" /> Track My Orders
						</Button>
						<Button variant="outline" onClick={() => navigate('/')} className="gap-2">
							Continue Shopping <FiArrowRight className="w-4 h-4" />
						</Button>
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 font-sans">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
				{/* Success Animation */}
				<motion.div
					className="text-center mb-12"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: 'spring', stiffness: 200, damping: 20 }}
				>
					{/* Animated Checkmark */}
					<motion.div
						className="relative w-24 h-24 mx-auto mb-8"
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
					>
						<div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-20" />
						<div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-xl shadow-emerald-200 flex items-center justify-center">
							<motion.div
								initial={{ pathLength: 0, opacity: 0 }}
								animate={{ pathLength: 1, opacity: 1 }}
								transition={{ delay: 0.5, duration: 0.5 }}
							>
								<FiCheckCircle className="w-12 h-12 text-white" />
							</motion.div>
						</div>
					</motion.div>

					<motion.h1
						className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						Order Placed Successfully! 🎉
					</motion.h1>
					<motion.p
						className="text-gray-500 font-medium text-lg max-w-md mx-auto"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
					>
						{orders.length > 1
							? `${orders.length} orders have been created for your purchase.`
							: 'Your order has been confirmed and is being processed.'
						}
					</motion.p>
				</motion.div>

				{/* Order Cards */}
				<div className="space-y-4 mb-10">
					{orders.map((order, index) => (
						<motion.div
							key={order._id || index}
							className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 + index * 0.1 }}
						>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
										<FiPackage className="w-6 h-6 text-indigo-600" />
									</div>
									<div>
										<p className="font-bold text-gray-900">
											Order #{order._id ? `ORD-${order._id.substring(order._id.length - 8).toUpperCase()}` : `#${index + 1}`}
										</p>
										<p className="text-sm text-gray-500 mt-0.5">
											{order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 ? 's' : ''} 
											{order.totalPrice && ` • $${order.totalPrice.amount || order.totalPrice}`}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Badge variant="warning" size="sm">{order.status || 'Pending'}</Badge>
									<Link to={`/orders/${order._id}`}>
										<Button variant="ghost" size="sm" className="gap-1">
											View <FiArrowRight className="w-3 h-3" />
										</Button>
									</Link>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Action Buttons */}
				<motion.div
					className="flex flex-col sm:flex-row gap-4 justify-center"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
				>
					<Button
						variant="primary"
						size="lg"
						onClick={() => navigate('/orders')}
						className="gap-2 px-8"
					>
						<FiPackage className="w-5 h-5" /> Track My Orders
					</Button>
					<Button
						variant="outline"
						size="lg"
						onClick={() => navigate('/')}
						className="gap-2 px-8"
					>
						<FiShoppingBag className="w-5 h-5" /> Continue Shopping
					</Button>
				</motion.div>
			</div>
		</div>
	);
};

export default OrderSuccessPage;
