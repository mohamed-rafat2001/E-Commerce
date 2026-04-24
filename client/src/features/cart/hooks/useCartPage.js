/* Audit Findings:
 - Cart page is public and currently redirects guests directly to login on checkout click.
 - Requirement calls for auth modal prompt during user-initiated checkout action.
 - Direct /checkout navigation is guarded separately by route protection.
*/
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from './useCart';
import { calculateOrderTotals } from '../../order/utils/orderCalculations.js';

const useCartPage = () => {
    const { cart, isLoading, updateQuantity, removeFromCart, clearCart: clearCartAction } = useCart();
    const navigate = useNavigate();

    const cartItems = useMemo(() => cart?.items || [], [cart?.items]);
    const isLoadingItems = isLoading;

    const calculations = useMemo(() => calculateOrderTotals(cartItems), [cartItems]);

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
        navigate('/checkout');
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
