import { useQuery } from "@tanstack/react-query";
import { getSellerOrders } from "../../services/seller.js";

/**
 * Hook to fetch orders containing seller's products
 */
export default function useSellerOrders() {
	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["seller-orders"],
		queryFn: getSellerOrders,
	});

	const orders = response?.data?.data || [];

	return {
		orders,
		isLoading,
		error,
		refetch,
	};
}
