import { useQuery } from "@tanstack/react-query";
import { getOrderForCustomer } from "../services/order.js";

/**
 * Hook to fetch a single order by ID
 * @param {string} id - Order ID
 * @param {Object} options - Custom options
 * @param {Function} options.queryFn - Function to fetch order
 * @param {string[]} options.queryKey - Query key
 */
export default function useOrder(id, { 
    queryFn = () => getOrderForCustomer(id), 
    queryKey = ["order", id] 
} = {}) {
	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: queryKey,
		queryFn: queryFn,
		enabled: !!id,
	});

	const order = response?.data?.data;

	return {
		order,
		isLoading,
		error,
		refetch,
	};
}