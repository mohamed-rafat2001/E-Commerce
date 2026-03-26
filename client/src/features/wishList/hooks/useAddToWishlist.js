import { addToWishlist as addToWishlistApi } from "../services/wishList.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
import useWishlist from "./useWishlist.js";
import { useDispatch } from "react-redux";
import { addToWishList as reduxAddToWishlist } from "../../../app/store/slices/wishList.js";
import { openAuthModal } from "../../../app/store/slices/authModalSlice.js";

export default function useAddToWishlist() {
	const { isAuthenticated } = useCurrentUser();
	const { refreshWishlist } = useWishlist();
	const dispatch = useDispatch();

	// Mutation for authenticated users
	const { error, data, mutate, isLoading } = useMutationFactory(
		addToWishlistApi,
		"wishlist",
		{ title: "Add Failed", message: "Something wrong, please try again" },
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
			// Guest: use Redux
			const pid = product._id || product.id || product.product_id;
			dispatch(reduxAddToWishlist({ ...product, id: pid, _id: pid }));

			// Show auth prompt for first time wishlist add as guest
			const hasShownPrompt = localStorage.getItem("guest_wishlist_auth_prompt_shown") === "true";
			if (!hasShownPrompt) {
				dispatch(
					openAuthModal({
						message: "Sign in to save items to your wishlist across devices",
						redirectAfter: window.location.pathname,
						onSuccessCallback: "merge:guestWishlist",
					})
				);
				localStorage.setItem("guest_wishlist_auth_prompt_shown", "true");
			}
		}
	};

	return { error, data, addToWishlist, isLoading };
}
