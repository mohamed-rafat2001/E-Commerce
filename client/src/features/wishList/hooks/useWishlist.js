import { useQuery } from "@tanstack/react-query";
import { showWishList } from "../services/wishList.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import { useState, useEffect } from "react";

/**
 * Get current user wishlist query
 */
export default function useWishlist() {
	const { user } = useCurrentUser();
	const userId = user?.userId?._id;
	const [guestWishlist, setGuestWishlist] = useState(null);

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
		}
	}, [userId]);

	const wishlist = userId ? (response?.data?.data?.wishlist || response?.data?.data) : guestWishlist;

	return {
		wishlist,
		isLoading: userId ? isLoading : false,
		error,
	};
}
