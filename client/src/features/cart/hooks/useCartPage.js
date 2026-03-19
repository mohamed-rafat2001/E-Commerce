import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from './useCart';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';

const useCartPage = () => {
    const { cart, isLoading, updateQuantity, removeFromCart, clearCart: clearCartAction } = useCart();
    const { isAuthenticated } = useCurrentUser();
    const navigate = useNavigate();

    const cartItems = useMemo(() => cart?.items || [], [cart]);

    const subtotal = useMemo(() => cartItems.reduce((acc, item) => {
        const price = item.item?.price?.amount || item.itemId?.price?.amount || item.price || 0;
        return acc + (price * (item.quantity || 1));
    }, 0), [cartItems]);

    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shipping;

    const handleQuantityChange = (productId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;
        updateQuantity(productId, newQty);
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login?redirect=checkout');
        } else {
            navigate('/customer/checkout');
        }
    };

    return {
        cartItems, isLoading, subtotal, shipping, total,
        handleQuantityChange, removeFromCart, clearCartAction, handleCheckout,
    };
};

export default useCartPage;
