import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "../../../shared/hooks/useToast.js";

/**
 * Hook to update order status
 * @param {Function} updateFn - Function to update order
 * @param {Object} options - Custom options
 * @param {string[]} options.invalidateKeys - Query keys to invalidate on success
 */
export default function useUpdateOrder({ updateFn, invalidateKeys = ["orders"] } = {}) {
	const queryClient = useQueryClient();
	const { showSuccess, showError } = useToast();

	const { mutate, isPending, error } = useMutation({
		mutationFn: updateFn,
		onSuccess: () => {
			invalidateKeys.forEach(key => {
				queryClient.invalidateQueries({ queryKey: [key] });
			});
			showSuccess("Order status updated successfully!");
		},
		onError: (err) => {
			showError(err?.response?.data?.message || "Failed to update order status");
		},
	});

	return {
		updateOrder: mutate,
		isUpdating: isPending,
		error,
	};
}