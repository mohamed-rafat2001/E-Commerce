import { FiX, FiTrash2, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/index.js';
import useWishlist from '../../features/wishList/hooks/useWishlist.js';
import useCurrentUser from '../../features/user/hooks/useCurrentUser.js';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from './AddToCartButton.jsx';

/**
 * Wishlist Drawer - Slide-in mini wishlist from the right
 * Shows wishlist items with add to cart functionality
 */
const WishlistDrawer = ({ isOpen, onClose }) => {
    const { wishlistItems, isLoading } = useWishlist();
    const { isAuthenticated } = useCurrentUser();
    const navigate = useNavigate();

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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[140]"
                    />

                    {/* Drawer */}
                    <motion.div
                        id="wishlist-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-[150] flex flex-col border-l border-gray-100 dark:border-gray-700"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FiX className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Wishlist Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                                </div>
                            ) : wishlistItems.length === 0 ? (
                                /* Empty State */
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center">
                                        <FiHeart className="w-12 h-12 text-pink-400" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-semibold text-gray-900">Your wishlist is empty</p>
                                        <p className="text-gray-500 mt-2">Save products you love</p>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            onClose();
                                            navigate('/');
                                        }}
                                        variant="primary"
                                        size="lg"
                                    >
                                        Discover Products
                                    </Button>
                                </div>
                            ) : (
                                /* Wishlist Items List */
                                <div className="space-y-4">
                                    {wishlistItems.map((item) => {
                                        const product = item.itemId || item.productId || item;
                                        const keyId = product._id || product.id || item._id || item.product_id;
                                        return (
                                            <WishlistItemCard
                                                key={keyId}
                                                product={product}
                                                onClose={onClose}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {wishlistItems.length > 0 && (
                            <div className="border-t border-gray-100 p-6 bg-gray-50">
                                <Button
                                    onClick={() => {
                                        onClose();
                                        navigate(isAuthenticated ? '/customer/wishlist' : '/public-wishlist');
                                    }}
                                    variant="outline"
                                    size="lg"
                                    fullWidth
                                >
                                    View Full Wishlist
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

/**
 * Individual Wishlist Item Card Component
 */
const WishlistItemCard = ({ product, onClose }) => {
    const { removeFromWishlist } = useWishlist();

    const price = product.price?.amount || product.price || 0;
    const image = product.coverImage?.secure_url || product.image || '';

    const handleRemove = () => {
        const productId = product._id || product.id || product.product_id;
        removeFromWishlist(productId);
    };

    return (
        <div className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            {/* Product Image */}
            <Link
                to={`/products/${product._id || product.id || product.product_id}`}
                onClick={onClose}
                className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 block"
            >
                <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </Link>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <Link
                    to={`/products/${product._id || product.id || product.product_id}`}
                    onClick={onClose}
                    className="font-semibold text-gray-900 truncate block hover:text-indigo-600 transition-colors"
                >
                    {product.name}
                </Link>
                <p className="text-indigo-600 font-bold mt-1">${typeof price === 'number' ? price.toFixed(2) : price}</p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-2">
                    <AddToCartButton
                        product={product}
                        size="sm"
                        showText={true}
                        className="flex-1 !text-[10px] !py-2 !rounded-full !bg-gray-900 !text-white !border-gray-900 uppercase font-black tracking-widest"
                    />
                    <button
                        onClick={handleRemove}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishlistDrawer;
