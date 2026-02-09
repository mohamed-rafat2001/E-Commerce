import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../services/admin.js";

/**
 * Hook to fetch all orders (admin only)
 */
export default function useAdminOrders() {
	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["admin-orders"],
		queryFn: getAllOrders,
	});

	const orders = response?.data?.data || [];

	return {
		orders,
		isLoading,
		error,
		refetch,
	};
}
