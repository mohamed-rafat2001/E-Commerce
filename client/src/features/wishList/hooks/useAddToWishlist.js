import { addToWishlist as addToWishlistApi } from "../services/wishList.js";
import { addToGuestWishlist } from "../services/guestWishlist.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
import useWishlist from "./useWishlist.js";

export default function useAddToWishlist() {
	const { isAuthenticated } = useCurrentUser();
	const { refreshWishlist } = useWishlist();

	// Mutation for authenticated users
	const { error, data, mutate, isLoading } = useMutationFactory(
		addToWishlistApi,
		"wishlist",
		{ title: "Add Failed", message: "Something wrong,please try again" },
		{ title: "Added Successful", message: "Product added to your wish list" },
		{
			onSuccess: () => {
				// Refresh wishlist after successful add
				refreshWishlist();
			}
		}
	);

	// Wrapper that decides guest vs auth
	const addToWishlist = (product) => {
		if (isAuthenticated) {
			// Authenticated: use API
			mutate(product._id || product.id || product.product_id);
		} else {
			// Guest: use localStorage
			addToGuestWishlist(product);
			refreshWishlist();
		}
	};

	return { error, data, addToWishlist, isLoading };
}
