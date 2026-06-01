import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../services/product.js";

/**
 * Hook to fetch products
 * @param {Object} options - Custom options
 * @param {Function} options.queryFn - Function to fetch products
 * @param {string[]} options.queryKey - Query key
 */
export default function useProducts({ queryFn = getAllProducts, queryKey = ["products"], ...options } = {}) {
	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: queryKey,
		queryFn: queryFn,
		...options,
	});

	const products = response?.data?.data || [];

	return {
		products,
		isLoading,
		error,
		refetch,
	};
}
