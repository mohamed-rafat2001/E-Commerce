import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSellerOrderStatus } from "../services/seller.js";
import toast from "react-hot-toast";

/**
 * Hook to update order status from seller panel
 */
export default function useUpdateOrderStatus() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: ({ orderId, status }) => updateSellerOrderStatus(orderId, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
			queryClient.invalidateQueries({ queryKey: ["sellerDashboardStats"] });
			toast.success("Order status updated!");
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Failed to update order status");
		},
	});

	return {
		updateOrderStatus: mutate,
		isUpdating: isPending,
		error,
	};
}
