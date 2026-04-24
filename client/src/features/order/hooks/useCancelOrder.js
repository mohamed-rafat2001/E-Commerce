import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelOrder } from '../services/order.js';
import useToast from '../../../shared/hooks/useToast.js';

/**
 * Hook to cancel a pending order
 * @param {string} orderId - The order ID to cancel
 */
export default function useCancelOrder(orderId) {
	const queryClient = useQueryClient();
	const { showSuccess, showError } = useToast();

	const { mutate: cancel, isPending: isCancelling, error } = useMutation({
		mutationFn: (reason) => cancelOrder(orderId, reason),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['order', orderId] });
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
			showSuccess('Order cancelled successfully.');
		},
		onError: (err) => showError(err?.response?.data?.message || 'Cannot cancel this order'),
	});

	return {
		cancel,
		isCancelling,
		error,
	};
}
