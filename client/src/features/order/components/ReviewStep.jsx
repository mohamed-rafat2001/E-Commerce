import { motion } from 'framer-motion';
import { FiMapPin, FiCreditCard, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { Button, Badge } from '../../../shared/ui/index.js';

const PAYMENT_LABELS = {
	cash_on_delivery: { label: 'Cash on Delivery', icon: '💵' },
	card: { label: 'Credit / Debit Card', icon: '💳' },
	paypal: { label: 'PayPal', icon: '🅿️' },
	bank_transfer: { label: 'Bank Transfer', icon: '🏦' },
	wallet: { label: 'Digital Wallet', icon: '👝' },
};

/**
 * Review step — read-only confirmation of shipping address, payment method, and cart items
 */
const ReviewStep = ({ shippingAddress, paymentMethod, cartItems, calculations, onPlaceOrder, onBack, isPlacing }) => {
	const payment = PAYMENT_LABELS[paymentMethod] || { label: paymentMethod, icon: '💳' };

	return (
		<motion.div
			className="space-y-6"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			transition={{ duration: 0.3 }}
		>
			<div>
				<h2 className="text-xl font-bold text-gray-900 mb-1">Review Your Order</h2>
				<p className="text-sm text-gray-500">Double-check everything before placing your order.</p>
			</div>

			{/* Shipping Address Review */}
			<div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
				<div className="flex items-center gap-2 mb-3">
					<FiMapPin className="w-5 h-5 text-indigo-600" />
					<h3 className="font-bold text-gray-900 text-sm">Shipping Address</h3>
				</div>
				{shippingAddress ? (
					<div className="text-sm text-gray-600 space-y-0.5 pl-7">
						{(shippingAddress.recipientName || shippingAddress._fullAddr?.recipientName) && (
							<p className="font-semibold text-gray-800">{shippingAddress.recipientName || shippingAddress._fullAddr.recipientName}</p>
						)}
						<p>{shippingAddress.line1}</p>
						{shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
						<p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
						<p>{shippingAddress.country}</p>
					</div>
				) : (
					<div className="text-sm text-gray-400 italic pl-7">No address selected</div>
				)}
			</div>

			{/* Payment Method Review */}
			<div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
				<div className="flex items-center gap-2 mb-3">
					<FiCreditCard className="w-5 h-5 text-indigo-600" />
					<h3 className="font-bold text-gray-900 text-sm">Payment Method</h3>
				</div>
				<div className="flex items-center gap-3 pl-7">
					<span className="text-2xl">{payment.icon}</span>
					<span className="font-semibold text-gray-800 text-sm">{payment.label}</span>
				</div>
			</div>

			{/* Cart Items Review */}
			<div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
				<div className="flex items-center gap-2 mb-4">
					<FiShoppingBag className="w-5 h-5 text-indigo-600" />
					<h3 className="font-bold text-gray-900 text-sm">Order Items ({cartItems.length})</h3>
				</div>
				<div className="space-y-3 pl-7 max-h-64 overflow-y-auto">
					{cartItems.map((item, index) => {
						const product = item.item || item.itemId || item.productId || item;
						const price = typeof product.price === 'object' ? product.price.amount : (product.price || item.price || 0);
						const image = product.imageCover || product.images?.[0] || '';
						return (
							<div key={product._id || index} className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
									{image ? (
										<img src={image} alt={product.title || product.name} className="w-full h-full object-cover" />
									) : (
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<FiShoppingBag className="w-5 h-5" />
										</div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold text-gray-900 truncate">{product.title || product.name}</p>
									<p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
								</div>
								<span className="text-sm font-bold text-gray-900">${(price * (item.quantity || 1)).toFixed(2)}</span>
							</div>
						);
					})}
				</div>
			</div>

			{/* Price Summary */}
			{calculations && (
				<div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 space-y-2">
					<div className="flex justify-between text-sm text-gray-600">
						<span>Subtotal</span>
						<span className="font-semibold">${calculations.subtotal.toFixed(2)}</span>
					</div>
					<div className="flex justify-between text-sm text-gray-600">
						<span>Shipping</span>
						<span className="font-semibold">{calculations.shipping === 0 ? 'Free' : `$${calculations.shipping.toFixed(2)}`}</span>
					</div>
					<div className="flex justify-between text-sm text-gray-600">
						<span>Tax</span>
						<span className="font-semibold">${calculations.tax.toFixed(2)}</span>
					</div>
					<div className="h-px bg-indigo-200/50 my-1" />
					<div className="flex justify-between items-center">
						<span className="font-bold text-gray-900">Total</span>
						<span className="text-xl font-black text-indigo-600">${calculations.total.toFixed(2)}</span>
					</div>
				</div>
			)}

			{/* Navigation Buttons */}
			<div className="flex items-center justify-between pt-2">
				<Button variant="ghost" onClick={onBack} className="gap-2">
					<FiArrowLeft className="w-4 h-4" /> Back
				</Button>
				<Button
					variant="premium"
					size="lg"
					onClick={onPlaceOrder}
					isLoading={isPlacing}
					disabled={isPlacing}
					className="px-10 shadow-xl"
				>
					{isPlacing ? 'Placing Order...' : 'Place Order'}
				</Button>
			</div>
		</motion.div>
	);
};

export default ReviewStep;
