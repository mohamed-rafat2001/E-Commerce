import { useState, useCallback } from 'react';
import { Button } from '../ui/index.js';
import { FiShoppingBag, FiCheck, FiX } from 'react-icons/fi';
import useAddToCart from '../../features/cart/hooks/useAddToCart.js';
import useCart from '../../features/cart/hooks/useCart.js';

/**
 * Universal Add to Cart button component
 * Handles all states: default, loading, success, error, in-cart, out-of-stock
 * Works for both authenticated and guest users
 */
const AddToCartButton = ({
    product,
    quantity = 1,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    showText = true,
    className = '',
    onSuccess,
    onError
}) => {
    const [buttonState, setButtonState] = useState('default'); // default, loading, success, error
    const { addToCart, isLoading } = useAddToCart();
    const { cartItems } = useCart();

    // Check if product is already in cart
    const isInCart = cartItems.some(item => {
        const p = item.item || item.itemId || item.productId || item;
        const pId = p?._id || p?.id || item.product_id;
        return pId === product._id || pId === product.id;
    });

    // Check stock availability
    const isOutOfStock = product.countInStock === 0;
    const hasStockLimit = quantity > product.countInStock && product.countInStock > 0;

    const handleClick = useCallback(async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isOutOfStock) return;

        setButtonState('loading');

        try {
            await addToCart(product, quantity);
            setButtonState('success');

            if (onSuccess) onSuccess();

            // Reset to default after 1.5s
            setTimeout(() => {
                setButtonState('default');
            }, 1500);
        } catch (error) {
            setButtonState('error');

            if (onError) onError(error);

            // Reset to default after 2s
            setTimeout(() => {
                setButtonState('default');
            }, 2000);
        }
    }, [product, quantity, addToCart, onSuccess, onError, isOutOfStock]);

    // Determine button content based on state
    const getButtonContent = () => {
        switch (buttonState) {
            case 'loading':
                return (
                    <div className="flex items-center gap-2">
                        <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                        {showText && <span>Adding...</span>}
                    </div>
                );
            case 'success':
                return (
                    <div className="flex items-center gap-2">
                        <FiCheck className="w-4 h-4" /> 
                        {showText && <span>Added</span>}
                    </div>
                );
            case 'error':
                return (
                    <div className="flex items-center gap-2">
                        <FiX className="w-4 h-4" /> 
                        {showText && <span>Error</span>}
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2">
                        <FiShoppingBag className="w-4 h-4" /> 
                        {showText && <span>Add to Cart</span>}
                    </div>
                );
        }
    };

    // If out of stock, show disabled button
    if (isOutOfStock) {
        return (
            <Button
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                disabled
                className={`${className} opacity-60 cursor-not-allowed`}
            >
                <div className="flex items-center gap-2">
                    <FiX className="w-4 h-4" /> 
                    {showText && <span>Out of Stock</span>}
                </div>
            </Button>
        );
    }

    // If stock limit reached
    if (hasStockLimit) {
        return (
            <Button
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                onClick={handleClick}
                className={`${className}`}
            >
                {showText ? (
                    <span className="text-[10px]">Only {product.countInStock} left</span>
                ) : (
                    <FiShoppingBag className="w-4 h-4" />
                )}
            </Button>
        );
    }

    return (
        <Button
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            onClick={handleClick}
            isLoading={isLoading || buttonState === 'loading'}
            disabled={buttonState === 'success' || buttonState === 'error'}
            className={`${className} transition-all duration-300 font-bold`}
        >
            {getButtonContent()}
        </Button>
    );
};

export default AddToCartButton;
