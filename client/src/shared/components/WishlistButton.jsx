import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import useAddToWishlist from '../../features/wishList/hooks/useAddToWishlist.js';
import useDeleteFromWishlist from '../../features/wishList/hooks/useDeleteFromWishlist.js';
import useWishlist from '../../features/wishList/hooks/useWishlist.js';

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
    const { addToWishlist, isLoading: isAdding } = useAddToWishlist();
    const { deleteFromWishlist, isLoading: isRemoving } = useDeleteFromWishlist();
    const { isInWishlist } = useWishlist();

    const productId = product._id || product.id || product.product_id;
    const isInList = isInWishlist(productId);
    const isLoading = isAdding || isRemoving;

    const handleClick = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isLoading) return;

        setIsAnimating(true);
        
        try {
            if (isInList) {
                // Remove from wishlist
                await deleteFromWishlist(productId);
            } else {
                // Add to wishlist
                await addToWishlist(product);
            }
            
            if (onSuccess) onSuccess(!isInList);
            
            // Reset animation after 1.5s
            setTimeout(() => {
                setIsAnimating(false);
            }, 1500);
        } catch (error) {
            setIsAnimating(false);
            
            if (onError) onError(error);
        }
    }, [productId, product, isInList, isLoading, addToWishlist, deleteFromWishlist, onSuccess, onError]);

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
