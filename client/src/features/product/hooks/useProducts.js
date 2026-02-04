import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../services/product.js";

/**
 * Get current user query
 */
export default function useProducts() {
	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["products"],
		queryFn: getAllProducts,
	});

	const products = response?.data?.data;

	return {
		products,
		isLoading,
		error,
	};
}
