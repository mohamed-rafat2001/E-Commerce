import { useQuery } from "@tanstack/react-query";
import { getFunc } from "../../../shared/services/handlerFactory.js";

/**
 * Hook to get current customer's order history
 */
export default function useOrderHistory() {
	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["orderHistory"],
		queryFn: () => getFunc("orders/myorders"),
	});

	const orders = response?.data?.data || [];

	return {
		orders,
		isLoading,
		error,
	};
}
