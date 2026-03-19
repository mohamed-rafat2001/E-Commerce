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
                    <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Adding...
                    </>
                );
            case 'success':
                return (
                    <>
                        <FiCheck className="w-4 h-4" /> Added ✓
                    </>
                );
            case 'error':
                return (
                    <>
                        <FiX className="w-4 h-4" /> Try Again
                    </>
                );
            case 'in-cart':
                return isInCart ? (
                    <>
                        <FiShoppingBag className="w-4 h-4" /> Go to Cart →
                    </>
                ) : null;
            default:
                return (
                    <>
                        <FiShoppingBag className="w-4 h-4" /> Add to Cart
                    </>
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
                <FiX className="w-4 h-4 mr-2" /> Out of Stock
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
                Only {product.countInStock} left
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
            className={`${className} transition-all duration-200`}
        >
            {getButtonContent()}
        </Button>
    );
};

export default AddToCartButton;
