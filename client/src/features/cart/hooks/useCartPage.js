/* Audit Findings:
 - Cart page is public and currently redirects guests directly to login on checkout click.
 - Requirement calls for auth modal prompt during user-initiated checkout action.
 - Direct /checkout navigation is guarded separately by route protection.
*/
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useCart from './useCart';
import { selectPromoInfo } from '../../../app/store/slices/cartSlice';
import { openAuthModal } from '../../../app/store/slices/authModalSlice.js';
import { calculateOrderTotals } from '../../order/utils/orderCalculations.js';
import { useDispatch } from 'react-redux';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';

const useCartPage = () => {
    const { cart, isLoading, updateQuantity, removeFromCart, clearCart: clearCartAction } = useCart();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useCurrentUser();

    const { amount: couponDiscountAmount } = useSelector(selectPromoInfo);

    const cartItems = useMemo(() => cart?.items || [], [cart?.items]);
    const isLoadingItems = isLoading;

    const calculations = useMemo(() => calculateOrderTotals(cartItems, couponDiscountAmount), [cartItems, couponDiscountAmount]);

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
            dispatch(openAuthModal({
                message: "To provide the best experience, we recommend signing in. Or you can continue as a guest to finish your purchase.",
                redirectAfter: "/checkout"
            }));
        } else {
            navigate('/checkout');
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
