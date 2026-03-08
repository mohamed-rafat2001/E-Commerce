import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showCart } from "../services/cart.js";
import { getGuestCart } from "../services/guestCart.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import { useState, useEffect, useCallback } from "react";

/**
 * Unified cart hook — returns server cart if authenticated, guest cart if not.
 */
export default function useCart() {
	const { isAuthenticated, user } = useCurrentUser();
	const userId = user?.userId?._id;
	const [guestCart, setGuestCart] = useState(null);
	const queryClient = useQueryClient();

	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["cart", userId],
		queryFn: () => showCart(),
		enabled: !!userId,
	});

	// Load guest cart when not authenticated
	useEffect(() => {
		if (!isAuthenticated) {
			setGuestCart(getGuestCart());
		}
	}, [isAuthenticated]);

	// Provide a way to refresh the guest cart from UI after local changes
	const refreshGuestCart = useCallback(() => {
		if (!isAuthenticated) {
			setGuestCart(getGuestCart());
		} else {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		}
	}, [isAuthenticated, queryClient]);

	const cart = isAuthenticated
		? response?.data?.data || response?.data
		: guestCart;

	const cartItems = cart?.items || [];
	const cartTotal = isAuthenticated
		? cart?.totalPrice?.amount || 0
		: cart?.total || 0;
	const cartItemCount = cartItems.reduce(
		(sum, item) => sum + (item.quantity || 1),
		0
	);

	return {
		cart,
		cartItems,
		cartTotal,
		cartItemCount,
		isLoading: isAuthenticated ? isLoading : false,
		error,
		isAuthenticated,
		refreshGuestCart,
	};
}
