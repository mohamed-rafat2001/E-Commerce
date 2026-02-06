import { useQuery } from "@tanstack/react-query";
import { showCart } from "../services/cart.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import { useState, useEffect } from "react";

/**
 * Get current user query
 */
export default function useCart() {
	const { user } = useCurrentUser();
	const userId = user?.userId?._id;
	const [guestCart, setGuestCart] = useState(null);

	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["cart", userId],
		queryFn: () => showCart(),
		enabled: !!userId,
	});

	useEffect(() => {
		if (!userId) {
			const savedCart = localStorage.getItem("guest_cart");
			if (savedCart) {
				try {
					setGuestCart(JSON.parse(savedCart));
				} catch {
					setGuestCart({ items: [] });
				}
			} else {
				setGuestCart({ items: [] });
			}
		}
	}, [userId]);

	const cart = userId ? (response?.data?.data?.cart || response?.data?.data) : guestCart;

	return {
		cart,
		isLoading: userId ? isLoading : false,
		error,
	};
}
