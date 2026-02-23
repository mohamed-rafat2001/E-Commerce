import { useQuery } from "@tanstack/react-query";
import { getProduct as getProductService } from "../services/product.js";

/**
 * Hook to fetch a single product by ID
 * @param {string} id - Product ID
 */
export default function useGetProduct(id) {
	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["product", id],
		queryFn: () => getProductService(id),
		enabled: !!id,
	});

	const product = response?.data?.data;

	return {
		product,
		isLoading,
		error,
	};
}
