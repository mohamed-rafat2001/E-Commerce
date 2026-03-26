import { deleteFromWishlist as deleteFromWishlistApi } from "../services/wishList.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
import useWishlist from "./useWishlist.js";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { deleteFromWishList as reduxDeleteFromWishlist } from "../../../app/store/slices/wishList.js";

export default function useDeleteFromWishlist() {
	const { isAuthenticated } = useCurrentUser();
	const { refreshWishlist } = useWishlist();
	const dispatch = useDispatch();

	const { error, data, mutate, isLoading } = useMutationFactory(
		deleteFromWishlistApi,
		"wishlist",
		{ title: "Deleted Failed", message: "Something wrong, please try again" },
		{ title: "Deleted Successful", message: "Product deleted from your wish list" },
		{ onSuccess: () => refreshWishlist() }
	);

	const deleteFromWishlist = useCallback((productId) => {
		if (isAuthenticated) {
			mutate(productId);
		} else {
			dispatch(reduxDeleteFromWishlist({ id: productId }));
		}
	}, [isAuthenticated, mutate, dispatch]);

	return { error, data, deleteFromWishlist, isLoading };
}
