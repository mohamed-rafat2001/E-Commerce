import useOrders from "../../../features/order/hooks/useOrders.js";
import { getOrdersForCustomer } from "../../../features/order/services/order.js";

/**
 * Hook to get current customer's order history
 */
export default function useOrderHistory() {
	const {
		orders,
		isLoading,
		error,
		refetch,
	} = useOrders({
		queryFn: getOrdersForCustomer,
		queryKey: ["orderHistory"],
	});

	return {
		orders,
		isLoading,
		error,
		refetch,
	};
}
