import { motion } from 'framer-motion';
import { HeartIcon, StoreIcon } from '../../../constants/icons.jsx';
import ThemeToggle from '../../../components/ThemeToggle.jsx';

/**
 * QuickActions - Cart, Wishlist, and Search controls
 */
const QuickActions = ({ 
    wishlistCount, 
    cartCount, 
    onToggleWishlist, 
    onToggleCart, 
    isPanel,
    showWishlistCart = true 
}) => {
    return (
        <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-3 shrink-0">
            <ThemeToggle />
            
            {/* Search Bar - hidden on mobile/panel */}
            {!isPanel && (
                <div className="hidden 2xl:flex w-full min-w-[260px]">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search curated findings..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 dark:bg-gray-800/80 border-0 rounded-2xl
                                text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500
                                focus:ring-2 focus:ring-gray-900/5 dark:focus:ring-white/5 focus:bg-white dark:focus:bg-gray-900
                                transition-all duration-300 outline-none font-medium"
                        />
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            )}

            {showWishlistCart && (
                <div className="flex items-center gap-1.5 xl:gap-2">
                    {/* Wishlist Trigger */}
                    <div className="relative">
                        <motion.button
                            onClick={onToggleWishlist}
                            className="relative p-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <HeartIcon className="w-5 h-5" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gray-900 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </motion.button>
                    </div>

                    {/* Cart Trigger */}
                    <div className="relative">
                        <motion.button
                            onClick={onToggleCart}
                            className="relative p-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <StoreIcon className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gray-900 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </motion.button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuickActions;
