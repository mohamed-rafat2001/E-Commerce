import { deleteFromWishlist as deleteFromWishlistApi } from "../services/wishList.js";
import { removeFromGuestWishlist } from "../services/guestWishlist.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
import useWishlist from "./useWishlist.js";
import { useCallback } from "react";

export default function useDeleteFromWishlist() {
	const { isAuthenticated } = useCurrentUser();
	const { refreshWishlist } = useWishlist();

	const { error, data, mutate, isLoading } = useMutationFactory(
		deleteFromWishlistApi,
		"wishlist",
		{ title: "Deleted Failed", message: "Something wrong,please try again" },
		{ title: "Deleted Successful", message: "Product deleted from your wish list" },
		{ onSuccess: () => refreshWishlist() }
	);

	const deleteFromWishlist = useCallback((productId) => {
		if (isAuthenticated) {
			mutate(productId);
		} else {
			removeFromGuestWishlist(productId);
			refreshWishlist();
		}
	}, [isAuthenticated, mutate, refreshWishlist]);

	return { error, data, deleteFromWishlist, isLoading };
}
