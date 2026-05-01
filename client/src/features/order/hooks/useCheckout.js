import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { removePromo } from '../../../app/store/slices/cartSlice';
import { checkoutOrder, guestCheckoutOrder } from '../services/order.js';
import { useNavigate } from 'react-router-dom';
import useToast from '../../../shared/hooks/useToast.js';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';
import { clearGuestCart } from '../../cart/services/guestCart.js';
import { saveGuestOrder, saveGuestEmail } from '../services/guestOrders.js';

/**
 * Hook for checkout — places order from cart, navigates to success page
 */
export default function useCheckout() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showSuccess, showError } = useToast();
	const { isAuthenticated } = useCurrentUser();

	const { mutate: checkout, isPending: isCheckingOut, error, data } = useMutation({
		mutationFn: (orderData) => {
			if (isAuthenticated) {
				return checkoutOrder(orderData);
			} else {
				return guestCheckoutOrder(orderData);
			}
		},
		onSuccess: (response) => {
			// Clear promo code from Redux
			dispatch(removePromo());

			if (isAuthenticated) {
				queryClient.invalidateQueries({ queryKey: ['cart'] });
				queryClient.invalidateQueries({ queryKey: ['orders'] });
				queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
			} else {
				clearGuestCart();
				const createdOrders = response?.data?.data || [];
				if (createdOrders.length > 0) {
					const email = createdOrders[0].guestEmail || response?.data?.data?.[0]?.guestEmail;
					if (email) saveGuestEmail(email);
					createdOrders.forEach(o => saveGuestOrder(o._id, email, o.orderNumber));
				}
				// Also manually invalidate the cart query just in case
				queryClient.invalidateQueries({ queryKey: ['cart'] });
			}
			showSuccess('Order placed successfully!');
			navigate('/order-success', { state: { orders: response?.data?.data, email: response?.data?.data?.[0]?.guestEmail } });
		},
		onError: (err) => showError(err?.response?.data?.message || 'Checkout failed. Please try again.'),
	});

	return {
		checkout,
		isCheckingOut,
		error,
		orders: data?.data?.data,
	};
}
