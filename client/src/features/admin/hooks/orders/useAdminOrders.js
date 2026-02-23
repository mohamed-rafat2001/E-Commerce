import useOrders from "../../../order/hooks/useOrders.js";
import { getAllOrdersForAdmin } from "../../../order/services/order.js";

/**
 * Hook to fetch all orders (admin only)
 */
export default function useAdminOrders() {
	const {
		orders,
		isLoading,
		error,
		refetch,
	} = useOrders({
		queryFn: getAllOrdersForAdmin,
		queryKey: ["admin-orders"],
	});

	return {
		orders,
		isLoading,
		error,
		refetch,
	};
}
