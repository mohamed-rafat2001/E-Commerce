/* Audit Findings:
 - Wishlist backend is protected and toggle behavior is POST /wishlist/:id.
 - Existing hook reads both authenticated server wishlist and guest localStorage wishlist.
 - Optimistic toggle with rollback is required for authenticated wishlist UX.
*/
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showWishList, addToWishlist as addToWishlistApi, deleteFromWishlist as deleteFromWishlistApi } from "../services/wishList.js";
import { getGuestWishlist, isInGuestWishlist, removeFromGuestWishlist } from "../services/guestWishlist.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

/**
 * Get current user wishlist query
 */
export default function useWishlist() {
	const { user, isAuthenticated } = useCurrentUser();
	const userId = user?.userId?._id;
	const [guestWishlist, setGuestWishlist] = useState(null);
	const queryClient = useQueryClient();

	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["wishlist", userId],
		queryFn: () => showWishList(),
		enabled: !!userId,
	});

	useEffect(() => {
		if (!userId) {
			const loadGuestWishlist = () => {
				const savedWishlist = localStorage.getItem("guest_wishlist");
				if (savedWishlist) {
					try {
						setGuestWishlist(JSON.parse(savedWishlist));
					} catch {
						setGuestWishlist({ items: [] });
					}
				} else {
					setGuestWishlist({ items: [] });
				}
			};

			loadGuestWishlist();

			if (typeof window !== "undefined") {
				window.addEventListener("guestWishlistUpdated", loadGuestWishlist);
				return () => window.removeEventListener("guestWishlistUpdated", loadGuestWishlist);
			}
		}
	}, [userId]);

	// Provide a way to refresh the guest wishlist from UI after local changes
	const refreshWishlist = useCallback(() => {
		if (!isAuthenticated) {
			setGuestWishlist(getGuestWishlist());
		} else {
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
			removeFromGuestWishlist(productId);
			setGuestWishlist(getGuestWishlist());
		}
	}, [isAuthenticated, queryClient]);

	const toggleWishlist = useCallback(async (productId) => {
		if (!isAuthenticated) {
			return { requiresAuth: true };
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
	}, [isAuthenticated, queryClient, userId]);

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
			// For guests, check localStorage
			return isInGuestWishlist(productId);
		}
	}, [isAuthenticated, response]);

	const wishlist = userId ? (response?.data?.data?.wishlist || response?.data?.data) : guestWishlist;

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
