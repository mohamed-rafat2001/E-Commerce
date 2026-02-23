import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../services/admin.js";

/**
 * Hook to fetch all products (admin only)
 */
export default function useAdminProducts() {
	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["admin-products"],
		queryFn: getAllProducts,
	});

	const products = response?.data?.data || [];

	return {
		products,
		isLoading,
		error,
		refetch,
	};
}
