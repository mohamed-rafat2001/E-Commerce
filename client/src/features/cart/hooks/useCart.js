import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showCart, updateCartItemQuantity, deleteFromCart, clearCart } from "../services/cart.js";
import { getGuestCart, updateGuestCartQty, removeFromGuestCart, clearGuestCart } from "../services/guestCart.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import { useState, useEffect, useCallback } from "react";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
import toast from "react-hot-toast";

/**
 * Unified cart hook — returns server cart if authenticated, guest cart if not.
 * Includes all cart actions: add, remove, update, clear
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

	// Remove from cart (auth + guest)
	const removeFromCart = useCallback((productId) => {
		if (isAuthenticated) {
			deleteFromCart(productId).then(() => {
				queryClient.invalidateQueries({ queryKey: ["cart"] });
			}).catch(err => {
				toast.error("Failed to remove item from cart");
			});
		} else {
			removeFromGuestCart(productId);
			setGuestCart(getGuestCart());
		}
	}, [isAuthenticated, queryClient]);

	// Update quantity (auth + guest)
	const updateQuantity = useCallback((productId, quantity) => {
		if (quantity < 1) return;
		
		if (isAuthenticated) {
			updateCartItemQuantity(productId, quantity).then(() => {
				queryClient.invalidateQueries({ queryKey: ["cart"] });
			}).catch(err => {
				toast.error("Failed to update quantity");
			});
		} else {
			updateGuestCartQty(productId, quantity);
			setGuestCart(getGuestCart());
		}
	}, [isAuthenticated, queryClient]);

	// Clear cart (auth + guest)
	const clearCartAction = useCallback(() => {
		if (isAuthenticated) {
			clearCart().then(() => {
				queryClient.invalidateQueries({ queryKey: ["cart"] });
			});
		} else {
			clearGuestCart();
			setGuestCart({ items: [], total: 0 });
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
		removeFromCart,
		updateQuantity,
		clearCart: clearCartAction,
	};
}
