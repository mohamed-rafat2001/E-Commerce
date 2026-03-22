import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/index.js';
import useCart from '../../features/cart/hooks/useCart.js';
import useCurrentUser from '../../features/user/hooks/useCurrentUser.js';
import { useNavigate } from 'react-router-dom';

/**
 * Cart Drawer - Slide-in mini cart from the right
 * Shows cart items, quantities, and checkout button
 */
const CartDrawer = ({ isOpen, onClose }) => {
    const { cartItems, cartTotal, isLoading } = useCart();
    const { isAuthenticated } = useCurrentUser();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!isAuthenticated) {
            // Redirect to login with checkout redirect
            navigate('/login?redirect=checkout');
        } else {
            // Go to checkout page
            navigate('/customer/checkout');
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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        id="cart-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FiX className="w-6 h-6 text-gray-600" />
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
                                    {cartItems.map((item) => {
                                        const product = item.item || item.itemId || item.productId || item;
                                        const productId = product?._id || product?.id || item.product_id;
                                        return <CartItemCard key={productId} item={item} />;
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer with Total and Checkout */}
                        {cartItems.length > 0 && (
                            <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50">
                                <div className="flex items-center justify-between text-lg">
                                    <span className="font-medium text-gray-700">Subtotal:</span>
                                    <span className="text-2xl font-bold text-indigo-600">
                                        ${cartTotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={() => {
                                            onClose();
                                            navigate(isAuthenticated ? '/customer/cart' : '/cart');
                                        }}
                                        variant="outline"
                                        size="lg"
                                    >
                                        View Full Cart
                                    </Button>
                                    <Button
                                        onClick={handleCheckout}
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        className="!bg-gray-900 !text-white !border-gray-900 !rounded-full !py-4 uppercase font-black tracking-widest text-xs shadow-xl active:scale-95"
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
const CartItemCard = ({ item }) => {
    const { removeFromCart, updateQuantity } = useCart();

    const product = item.item || item.itemId || item.productId || item;
    const quantity = item.quantity || 1;
    const price = typeof product.price === 'object' ? product.price.amount : (product.price || item.price || 0);
    const productId = product?._id || product?.id || item.product_id;
    const name = product?.name || item.name;
    const image = product?.coverImage?.secure_url || product?.image?.secure_url || product?.image || item.image || "";

    if (!productId) return null;

    return (
        <div className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            {/* Product Image */}
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
                <p className="text-indigo-600 font-bold mt-1">${price.toFixed(2)}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={() => updateQuantity(productId, Math.max(1, quantity - 1))}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        disabled={quantity <= 1}
                    >
                        <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                        onClick={() => updateQuantity(productId, quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <FiPlus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Remove Button */}
            <button
                onClick={() => removeFromCart(productId)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
            >
                <FiTrash2 className="w-5 h-5" />
            </button>
        </div>
    );
};

export default CartDrawer;
