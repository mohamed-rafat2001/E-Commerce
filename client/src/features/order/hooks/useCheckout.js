import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutOrder, guestCheckoutOrder } from '../services/order.js';
import { useNavigate } from 'react-router-dom';
import useToast from '../../../shared/hooks/useToast.js';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';
import { clearGuestCart } from '../../cart/services/guestCart.js';

/**
 * Hook for checkout — places order from cart, navigates to success page
 */
export default function useCheckout() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
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
			if (isAuthenticated) {
				queryClient.invalidateQueries({ queryKey: ['cart'] });
				queryClient.invalidateQueries({ queryKey: ['orders'] });
				queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
			} else {
				clearGuestCart();
				// Also manually invalidate the cart query just in case
				queryClient.invalidateQueries({ queryKey: ['cart'] });
			}
			showSuccess('Order placed successfully!');
			navigate('/order-success', { state: { orders: response?.data?.data } });
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
