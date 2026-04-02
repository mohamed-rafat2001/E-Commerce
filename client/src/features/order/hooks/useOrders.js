import { useQuery } from "@tanstack/react-query";
import { getOrdersForCustomer } from "../services/order.js";

/**
 * Hook to fetch orders
 * @param {Object} options - Custom options
 * @param {Function} options.queryFn - Function to fetch orders
 * @param {string[]} options.queryKey - Query key
 */
export default function useOrders({ 
    queryFn = getOrdersForCustomer, 
    queryKey = ["orders"] 
} = {}) {
	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: queryKey,
		queryFn: queryFn,
	});

	const orders = response?.data?.data || [];
	const total = response?.data?.total || 0;
	const totalPages = response?.data?.numberOfPages || 1;

	return {
		orders,
		total,
		totalPages,
		isLoading,
		error,
		refetch,
	};
}