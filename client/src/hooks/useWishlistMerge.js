import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useCurrentUser from "../features/user/hooks/useCurrentUser.js";
import { forceAddToWishlist } from "../features/wishList/services/wishList.js";
import { getGuestWishlist, clearGuestWishlist } from "../features/wishList/services/guestWishlist.js";
import toast from "react-hot-toast";

export default function useWishlistMerge() {
	const { isAuthenticated } = useCurrentUser();
	const queryClient = useQueryClient();
	const previousAuthRef = useRef(false);

	useEffect(() => {
		const runMerge = async () => {
			const justLoggedIn = !previousAuthRef.current && isAuthenticated;
			if (!justLoggedIn) {
				previousAuthRef.current = isAuthenticated;
				return;
			}

			previousAuthRef.current = true; // Lock immediately to prevent double fires

			// Safely read and clear items instantly so strict-mode second pass sees empty array
			const guestWishlist = getGuestWishlist();
			const guestItems = guestWishlist?.items || [];
			
			if (guestItems.length === 0) return;

            clearGuestWishlist();
            toast.loading("Syncing saved items...", { id: 'wishlist-merge' });

			try {
				// Prevent skipping items if component unmounts mid-merge (StrictMode)
                let finalWishlist = null;
				for (const item of guestItems) {
					const productId = item.product_id || item._id || item.id || item.productId;
					if (productId) {
						try {
							finalWishlist = await forceAddToWishlist(productId);
						} catch {
							// Ignore individual failures
						}
					}
				}

                // Immediately update local cache to prevent React Query race conditions
                const userId = queryClient.getQueryData(["user"])?.data?.data?.user?._id;
                if (userId && finalWishlist) {
                    queryClient.setQueryData(["wishlist", userId], finalWishlist);
                }

				queryClient.invalidateQueries({ queryKey: ["wishlist"] });
				toast.success("Wishlist updated with your saves", { id: 'wishlist-merge' });
			} catch (err) {
                console.error("Wishlist merge failed", err);
            }
		};

		runMerge();
	}, [isAuthenticated, queryClient]);
}
