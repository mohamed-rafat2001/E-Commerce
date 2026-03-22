import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from './useCart';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';

const useCartPage = () => {
    const { cart, isLoading, updateQuantity, removeFromCart, clearCart: clearCartAction } = useCart();
    const { isAuthenticated } = useCurrentUser();
    const navigate = useNavigate();

    const cartItems = useMemo(() => cart?.items || [], [cart?.items]);
    const isLoadingItems = isLoading;

    const calculations = useMemo(() => {
        const subtotal = cartItems.reduce((acc, item) => {
            const product = item.item || item.itemId || item.productId || item;
            const price = typeof product.price === 'object' ? product.price.amount : (product.price || item.price || 0);
            return acc + (price * (item.quantity || 1));
        }, 0);

        // Standardized financial logic
        const discountAmount = 0; // Promo logic can be added here later
        const taxableAmount = subtotal - discountAmount;
        const tax = taxableAmount * 0.08;
        const shipping = subtotal === 0 ? 0 : (subtotal > 500 ? 0 : 25);
        const total = taxableAmount + tax + shipping;

        return { subtotal, discountAmount, tax, shipping, total };
    }, [cartItems]);

    const handleQuantityChange = (productId, delta) => {
        const item = cartItems.find(i => {
            const p = i.item || i.itemId || i.productId || i;
            const id = p?._id || p?.id || i.product_id || i.id;
            return id === productId;
        });
        if (!item) return;

        const newQty = (item.quantity || 1) + delta;
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
        cartItems,
        isLoading: isLoadingItems,
        calculations,
        handleQuantityChange,
        removeFromCart,
        clearCartAction,
        handleCheckout,
    };
};

export default useCartPage;
