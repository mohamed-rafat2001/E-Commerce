import useOrders from "../../../order/hooks/useOrders.js";
import { getSellerOrders } from "../../../order/services/order.js";

/**
 * Hook to fetch orders containing seller's products
 */
export default function useSellerOrders() {
	const {
		orders,
		isLoading,
		error,
		refetch,
	} = useOrders({
		queryFn: getSellerOrders,
		queryKey: ["seller-orders"],
	});

	return {
		orders,
		isLoading,
		error,
		refetch,
	};
}
