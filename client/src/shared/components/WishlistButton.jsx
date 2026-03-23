/* Audit Findings:
 - Wishlist interactions should require authentication for guests.
 - Optimistic authenticated toggle is centralized in useWishlist.toggleWishlist.
 - Auth modal stores pending wishlist intent for post-login completion.
*/
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import useWishlist from '../../features/wishList/hooks/useWishlist.js';
import useAuthGuard from '../../hooks/useAuthGuard.js';

/**
 * Universal Wishlist heart icon button component
 * Handles all states: default, hover, loading, added (filled)
 * Works for both authenticated and guest users
 */
const WishlistButton = ({ 
    product,
    size = 'md',
    className = '',
    onSuccess,
    onError
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { isAuthenticated, requireAuth } = useAuthGuard();

    const productId = product._id || product.id || product.product_id;
    const isInList = isInWishlist(productId);
    const isLoading = false;

    const handleClick = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isLoading) return;

        if (!isAuthenticated) {
            requireAuth({
                message: "Sign in to save items to your wishlist",
                redirectAfter: `/products/${productId}`,
                onSuccessCallback: "wishlist:add",
                callbackPayload: { productId }
            });
            return;
        }

        setIsAnimating(true);
        
        try {
            await toggleWishlist(productId);
            
            if (onSuccess) onSuccess(!isInList);
            
            // Reset animation after 1.5s
            setTimeout(() => {
                setIsAnimating(false);
            }, 1500);
        } catch (error) {
            setIsAnimating(false);
            
            if (onError) onError(error);
        }
    }, [isAuthenticated, isInList, isLoading, onError, onSuccess, productId, requireAuth, toggleWishlist]);

    // Size variants
    const sizeClasses = {
        sm: 'p-2 w-8 h-8',
        md: 'p-2.5 w-9 h-9',
        lg: 'p-3 w-10 h-10'
    };

    const iconSize = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.2 }}
            onClick={handleClick}
            disabled={isLoading}
            className={`
                ${sizeClasses[size]} 
                ${className}
                bg-white/80 backdrop-blur-md rounded-full 
                flex items-center justify-center
                shadow-lg transition-all duration-300
                hover:bg-white hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
        >
            {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
                <FiHeart 
                    className={`
                        ${iconSize[size]}
                        ${isInList ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}
                        transition-colors duration-200
                    `}
                />
            )}
        </motion.button>
    );
};

export default WishlistButton;
