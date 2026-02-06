import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { Button } from '../../ui';

const CartDropdown = ({ items = [], total = 0, isLoading, viewAllPath, onRemove }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: 10, scale: 0.95 }}
			className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-50 overflow-hidden"
		>
			<div className="px-4 pb-3 border-b border-gray-50 flex items-center justify-between">
				<h3 className="text-sm font-bold text-gray-900">Shopping Cart</h3>
				<span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
					{items.length} {items.length === 1 ? 'Item' : 'Items'}
				</span>
			</div>

			<div className="max-h-80 overflow-y-auto py-2 custom-scrollbar">
				{isLoading ? (
					<div className="py-8 text-center">
						<div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
					</div>
				) : items.length === 0 ? (
					<div className="py-8 px-4 text-center">
						<div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
							<FiShoppingBag className="text-gray-400 w-6 h-6" />
						</div>
						<p className="text-sm text-gray-500">Your cart is empty</p>
					</div>
				) : (
					<div className="space-y-1">
						{items.slice(0, 3).map((item) => (
							<div key={item.itemId._id} className="px-4 py-2 hover:bg-gray-50 transition-colors flex gap-3 group">
								<div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-100">
									<img 
										src={item.itemId.image?.secure_url || '/placeholder-product.png'} 
										alt={item.itemId.name}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="text-sm font-bold text-gray-900 truncate">{item.itemId.name}</h4>
									<p className="text-xs text-gray-500 mb-1">{item.quantity} x ${item.itemId.price}</p>
									<p className="text-sm font-bold text-indigo-600">${(item.quantity * item.itemId.price).toFixed(2)}</p>
								</div>
								{onRemove && (
									<button 
										onClick={() => onRemove(item.itemId._id)}
										className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
									>
										<FiTrash2 className="w-4 h-4" />
									</button>
								)}
							</div>
						))}
						{items.length > 3 && (
							<p className="text-center text-xs text-gray-400 py-2">
								+ {items.length - 3} more items
							</p>
						)}
					</div>
				)}
			</div>

			{items.length > 0 && (
				<div className="px-4 pt-3 border-t border-gray-50 space-y-3">
					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-500">Subtotal</span>
						<span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
					</div>
					<Link to={viewAllPath} className="block">
						<Button fullWidth size="sm" icon={<FiArrowRight />} iconPosition="right">
							View All Products
						</Button>
					</Link>
				</div>
			)}
		</motion.div>
	);
};

export default CartDropdown;
