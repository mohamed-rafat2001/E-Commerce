import { useQuery } from "@tanstack/react-query";
import { showCart } from "../services/cart.js";

/**
 * Get current user query
 */
export default function useCart() {
	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["cart"],
		queryFn: showCart,
	});

	const cart = response?.data?.data;

	return {
		cart,
		isLoading,
		error,
	};
}
