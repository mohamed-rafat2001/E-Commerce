/* Audit Findings:
 - Wishlist backend is protected and toggle behavior is POST /wishlist/:id.
 - Existing hook reads both authenticated server wishlist and guest localStorage wishlist.
 - Optimistic toggle with rollback is required for authenticated wishlist UX.
*/
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showWishList, addToWishlist as addToWishlistApi, deleteFromWishlist as deleteFromWishlistApi } from "../services/wishList.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
	addToWishList as reduxAddToWishlist,
	deleteFromWishList as reduxDeleteFromWishlist,
} from "../../../app/store/slices/wishList.js";
import { openAuthModal } from "../../../app/store/slices/authModalSlice.js";

/**
 * Get current user wishlist query
 */
export default function useWishlist() {
	const { user, isAuthenticated } = useCurrentUser();
	const userId = user?.userId?._id;
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	// Get guest wishlist directly from Redux State
	const guestWishlistItems = useSelector((state) => state.wishListStore.items);

	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["wishlist", userId],
		queryFn: () => showWishList(),
		enabled: !!userId,
	});

	// Provide a way to refresh the wishlist from UI after local changes
	const refreshWishlist = useCallback(() => {
		if (isAuthenticated) {
			queryClient.invalidateQueries({ queryKey: ["wishlist"] });
		}
	}, [isAuthenticated, queryClient]);

	// Remove from wishlist (auth + guest)
	const removeFromWishlist = useCallback(async (productId) => {
		if (isAuthenticated) {
			try {
				await deleteFromWishlistApi(productId);
				queryClient.invalidateQueries({ queryKey: ["wishlist"] });
				toast.success('Removed from wishlist');
			} catch {
				toast.error('Failed to remove from wishlist');
			}
		} else {
			dispatch(reduxDeleteFromWishlist({ id: productId }));
		}
	}, [isAuthenticated, queryClient, dispatch]);

	const toggleWishlist = useCallback(async (productId, productData = null) => {
		if (!isAuthenticated) {
			// Guest: use Redux
			const currentlyInWishlist = guestWishlistItems.some(item => (item.id || item._id) === productId);

			if (currentlyInWishlist) {
				dispatch(reduxDeleteFromWishlist({ id: productId }));
			} else {
				// Store full product details if provided, otherwise just ID
				dispatch(reduxAddToWishlist(productData || { id: productId, _id: productId }));

				// Show login prompt for guests
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
			return { success: true };
		}

		const queryKey = ["wishlist", userId];
		const previousWishlist = queryClient.getQueryData(queryKey);
		const previousData = previousWishlist?.data?.data?.wishlist || previousWishlist?.data?.data || { items: [] };
		const previousItems = previousData?.items || [];
		const currentlyInWishlist = previousItems.some((item) => {
			const id = item?._id || item?.productId?._id || item?.productId || item;
			return id === productId;
		});

		queryClient.setQueryData(queryKey, (old) => {
			const wishlistData = old?.data?.data?.wishlist || old?.data?.data || { items: [] };
			const currentItems = wishlistData?.items || [];
			const normalized = currentItems.map((item) => item?._id || item?.productId?._id || item?.productId || item);
			const nextItems = currentlyInWishlist
				? normalized.filter((id) => id !== productId)
				: [...normalized, productId];

			return {
				...old,
				data: {
					...(old?.data || {}),
					data: {
						...(old?.data?.data || {}),
						wishlist: {
							...(wishlistData || {}),
							items: nextItems,
						},
					},
				},
			};
		});

		try {
			await addToWishlistApi(productId);
			queryClient.invalidateQueries({ queryKey: ["wishlist"] });
			toast.success(currentlyInWishlist ? "Removed from wishlist" : "Added to wishlist!");
			return { success: true };
		} catch {
			if (previousWishlist) {
				queryClient.setQueryData(queryKey, previousWishlist);
			}
			toast.error("Failed to update wishlist");
			return { success: false };
		}
	}, [isAuthenticated, queryClient, userId, dispatch, guestWishlistItems]);

	// Check if product is in wishlist
	const isInWishlist = useCallback((productId) => {
		if (isAuthenticated) {
			// For auth users, check the loaded wishlist data
			const wishlistData = response?.data?.data?.wishlist || response?.data?.data;
			const items = wishlistData?.items || [];

			// Check if any item's _id matches the productId
			return items.some(item => {
				const itemId = item._id || item.productId?._id || item.productId || item.product_id;
				return itemId === productId;
			});
		} else {
			// For guests, check Redux
			return guestWishlistItems.some(item => (item.id || item._id) === productId);
		}
	}, [isAuthenticated, response, guestWishlistItems]);

	const wishlist = isAuthenticated ? (response?.data?.data?.wishlist || response?.data?.data) : { items: guestWishlistItems };

	return {
		wishlist,
		wishlistItems: wishlist?.items || [],
		isLoading: isAuthenticated ? isLoading : false,
		error,
		isAuthenticated,
		refreshWishlist,
		isInWishlist,
		removeFromWishlist,
		toggleWishlist,
	};
}
