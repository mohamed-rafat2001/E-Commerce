import { useQuery } from "@tanstack/react-query";
import { getSellerProducts } from "../services/seller.js";

/**
 * Hook to fetch seller's own products
 */
export default function useSellerProducts() {
	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["seller-products"],
		queryFn: getSellerProducts,
	});

	const products = response?.data?.data || [];

	return {
		products,
		isLoading,
		error,
		refetch,
	};
}
