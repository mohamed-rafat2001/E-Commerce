import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrder } from "../../services/admin.js";
import toast from "react-hot-toast";

/**
 * Hook to update an order (status, payment, etc.)
 */
export function useUpdateOrder() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: ({ id, data }) => updateOrder(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
			toast.success("Order updated successfully!");
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Failed to update order");
		},
	});

	return {
		updateOrder: mutate,
		isUpdating: isPending,
		error,
	};
}
