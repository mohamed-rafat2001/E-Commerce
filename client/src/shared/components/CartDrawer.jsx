/* Audit Findings:
 - Drawer checkout currently hard-redirects guests to login.
 - Requirement calls for contextual auth modal from action entry points.
 - Checkout route remains protected for direct URL access.
*/
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/index.js';
import useCart from '../../features/cart/hooks/useCart.js';
import useCurrentUser from '../../features/user/hooks/useCurrentUser.js';
import { useNavigate } from 'react-router-dom';
import useAuthGuard from '../../hooks/useAuthGuard.js';

/**
 * Cart Drawer - Slide-in mini cart from the right
 * Shows cart items, quantities, and checkout button
 */
const CartDrawer = ({ isOpen, onClose }) => {
    const { cartItems, cartTotal, isLoading } = useCart();
    const { isAuthenticated } = useCurrentUser();
    const { requireAuth } = useAuthGuard();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!isAuthenticated) {
            requireAuth({
                message: "You need an account to place an order",
                redirectAfter: "/checkout",
            });
        } else {
            navigate('/checkout');
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
                    />

                    {/* Drawer */}
                    <motion.div
                        id="cart-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-screen w-full max-w-md bg-white dark:bg-gray-900 shadow-[0_0_50px_rgba(0,0,0,0.3)] z-[1000] flex flex-col border-l border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-20 flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Cart</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group"
                            >
                                <FiX className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                                </div>
                            ) : cartItems.length === 0 ? (
                                /* Empty State */
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                        <FiShoppingBag className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-semibold text-gray-900">Your cart is empty</p>
                                        <p className="text-gray-500 mt-2">Start shopping to add items</p>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            onClose();
                                            navigate('/');
                                        }}
                                        variant="primary"
                                        size="lg"
                                    >
                                        Start Shopping
                                    </Button>
                                </div>
                            ) : (
                                /* Cart Items List */
                                <div className="space-y-4">
                                    {cartItems.map((item, index) => {
                                        const product = item.item || item.itemId || item.productId || item;
                                        const productId = product?._id || product?.id || item.product_id || item._id || `cart-drawer-${index}`;
                                        return <CartItemCard key={productId} item={item} onClose={onClose} />;
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer with Total and Checkout */}
                        {cartItems.length > 0 && (
                            <div className="border-t border-gray-100 dark:border-gray-800 p-6 space-y-6 bg-white dark:bg-gray-900">
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-semibold text-gray-600 dark:text-gray-400">Subtotal:</span>
                                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                        ${cartTotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => {
                                            onClose();
                                            navigate(isAuthenticated ? '/customer/cart' : '/cart');
                                        }}
                                        variant="outline"
                                        size="lg"
                                        className="rounded-full text-xs font-bold uppercase tracking-wider"
                                    >
                                        View Full Cart
                                    </Button>
                                    <Button
                                        onClick={handleCheckout}
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        className="rounded-full text-xs font-bold uppercase tracking-wider !bg-gray-900 !text-white"
                                    >
                                        Checkout
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

/**
 * Individual Cart Item Card Component
 */
const CartItemCard = ({ item, onClose }) => {
    const { removeFromCart, updateQuantity } = useCart();

    const product = item.item || item.itemId || item.productId || item;
    const quantity = item.quantity || 1;
    const price = typeof product.price === 'object' ? product.price.amount : (product.price || item.price || 0);
    const productId = product?._id || product?.id || item.product_id;
    const name = product?.name || item.name;
    const image = product?.coverImage?.secure_url || product?.image?.secure_url || product?.image || item.image || "";

    if (!productId) return null;

    return (
        <div className="relative flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 group">
            {/* Product Image */}
            <Link
                to={`/products/${productId}`}
                onClick={onClose}
                className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 block border border-gray-50 dark:border-gray-800"
            >
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    crossOrigin="anonymous"
                />
            </Link>

            {/* Product Details */}
            <div className="flex-1 min-w-0 pr-8">
                <Link to={`/products/${productId}`} onClick={onClose} className="font-bold text-gray-900 dark:text-white truncate block hover:text-indigo-600 transition-colors text-sm">
                    {name}
                </Link>
                <p className="text-indigo-600 dark:text-indigo-400 font-extrabold text-lg mt-0.5">${price.toFixed(2)}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 p-0.5">
                        <button
                            onClick={() => updateQuantity(productId, Math.max(1, quantity - 1))}
                            className="p-1 hover:bg-white dark:hover:bg-gray-800 rounded transition-all disabled:opacity-30"
                            disabled={quantity <= 1}
                        >
                            <FiMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm tracking-tighter">{quantity}</span>
                        <button
                            onClick={() => updateQuantity(productId, quantity + 1)}
                            className="p-1 hover:bg-white dark:hover:bg-gray-800 rounded transition-all"
                        >
                            <FiPlus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Remove Button - Top Right */}
            <button
                onClick={() => removeFromCart(productId)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all duration-300"
                aria-label="Remove item"
            >
                <FiTrash2 className="w-4 h-4" />
            </button>
        </div>
    );
};

export default CartDrawer;
