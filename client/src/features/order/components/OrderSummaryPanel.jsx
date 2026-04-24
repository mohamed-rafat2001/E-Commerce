import { motion } from 'framer-motion';
import { FiShoppingBag, FiCheckCircle } from 'react-icons/fi';

/**
 * Checkout sidebar — shows cart items and price summary
 */
const OrderSummaryPanel = ({ cartItems, calculations }) => {
	return (
		<motion.div
			className="sticky top-28 bg-white rounded-3xl border border-gray-100 shadow-xl p-6 space-y-5 h-fit"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className="text-lg font-bold text-gray-900 tracking-tight">Order Summary</h2>

			{/* Cart Items */}
			<div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
				{cartItems.map((item, index) => {
					const product = item.item || item.itemId || item.productId || item;
					const price = typeof product.price === 'object' ? product.price.amount : (product.price || item.price || 0);
					const image = product.imageCover || product.images?.[0] || '';
					return (
						<motion.div
							key={product._id || index}
							className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
							initial={{ opacity: 0, x: 10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1 + index * 0.05 }}
						>
							<div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
								{image ? (
									<img src={image} alt={product.title || product.name || ''} className="w-full h-full object-cover" />
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-300">
										<FiShoppingBag className="w-5 h-5" />
									</div>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-semibold text-gray-900 truncate">{product.title || product.name}</p>
								<p className="text-xs text-gray-400 font-medium">Qty: {item.quantity || 1}</p>
							</div>
							<span className="text-sm font-bold text-gray-900 whitespace-nowrap">${(price * (item.quantity || 1)).toFixed(2)}</span>
						</motion.div>
					);
				})}
			</div>

			{/* Divider */}
			<div className="h-px bg-gray-100" />

			{/* Price Breakdown */}
			{calculations && (
				<div className="space-y-3">
					<div className="flex justify-between text-sm text-gray-500">
						<span>Subtotal</span>
						<span className="text-gray-900 font-medium">${calculations.subtotal.toFixed(2)}</span>
					</div>
					{calculations.discountAmount > 0 && (
						<div className="flex justify-between text-sm text-emerald-600">
							<span>Discount</span>
							<span className="font-medium">-${calculations.discountAmount.toFixed(2)}</span>
						</div>
					)}
					<div className="flex justify-between text-sm text-gray-500">
						<span>Shipping</span>
						{calculations.shipping === 0 ? (
							<span className="text-emerald-500 font-bold text-xs uppercase tracking-wider">Free</span>
						) : (
							<span className="text-gray-900 font-medium">${calculations.shipping.toFixed(2)}</span>
						)}
					</div>
					<div className="flex justify-between text-sm text-gray-500">
						<span>Tax (8%)</span>
						<span className="text-gray-900 font-medium">${calculations.tax.toFixed(2)}</span>
					</div>

					<div className="h-px bg-gray-100" />

					<div className="flex justify-between items-center">
						<span className="font-bold text-gray-900 text-base">Total</span>
						<span className="font-black text-indigo-600 text-xl">${calculations.total.toFixed(2)}</span>
					</div>
				</div>
			)}

			{/* Protection Badge */}
			<div className="bg-[#DFFCF9] p-4 rounded-2xl flex gap-3 border border-[#72F1DE]/20">
				<div className="shrink-0 w-9 h-9 bg-[#72F1DE] rounded-full flex items-center justify-center shadow-lg shadow-[#72F1DE]/50">
					<FiCheckCircle className="w-5 h-5 text-emerald-800" />
				</div>
				<div>
					<h4 className="text-xs font-bold text-teal-900 mb-0.5 tracking-tight">Buyer Protection</h4>
					<p className="text-[11px] text-teal-800/80 font-medium leading-tight">
						Secure checkout with full purchase protection.
					</p>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderSummaryPanel;
