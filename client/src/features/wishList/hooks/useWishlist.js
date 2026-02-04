import { useQuery } from "@tanstack/react-query";
import { showWishlist } from "../services/wishList.js";

/**
 * Get current user query
 */
export default function useWishlist() {
	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["wishlist"],
		queryFn: showWishlist,
	});

	const wishlist = response?.data?.data;

	return {
		wishlist,
		isLoading,
		error,
	};
}
