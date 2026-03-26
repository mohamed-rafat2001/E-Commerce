import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showCart, updateCartItemQuantity, deleteFromCart, clearCart } from "../services/cart.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
	removeFromCart as reduxRemoveFromCart,
	updateQuantity as reduxUpdateQuantity,
	clearCart as reduxClearCart,
	selectCartItems
} from "../../../app/store/slices/cartSlice.js";

/**
 * Unified cart hook — returns server cart if authenticated, Redux cart if not.
 * Includes all cart actions: add, remove, update, clear
 */
export default function useCart() {
	const { isAuthenticated, user } = useCurrentUser();
	const userId = user?.userId?._id || user?._id;
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	// Get guest cart directly from Redux State
	const reduxItems = useSelector(selectCartItems);

	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["cart", userId],
		queryFn: () => showCart(),
		enabled: !!userId,
	});

	// Provide a way to refresh the guest cart from UI if needed
	const refreshGuestCart = useCallback(() => {
		if (isAuthenticated) {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		}
	}, [isAuthenticated, queryClient]);

	// Remove from cart (auth + guest)
	const removeFromCart = useCallback((productId) => {
		if (isAuthenticated) {
			const previousCart = queryClient.getQueryData(["cart", userId]);

			if (previousCart) {
				queryClient.setQueryData(["cart", userId], (old) => {
					if (!old || !old.data?.data?.data) return old;
					const cartData = old.data.data.data;
					const newItems = (cartData.items || []).filter(i => {
						const pid = i.item?._id || i.itemId?._id || i.productId || i.item;
						return pid !== productId;
					});

					return {
						...old,
						data: {
							...old.data,
							data: {
								...old.data.data,
								data: {
									...cartData,
									items: newItems
								}
							}
						}
					};
				});
			}

			deleteFromCart(productId).then(() => {
				queryClient.invalidateQueries({ queryKey: ["cart"] });
			}).catch(() => {
				if (previousCart) {
					queryClient.setQueryData(["cart", userId], previousCart);
				}
				toast.error("Failed to remove item from cart");
			});
		} else {
			dispatch(reduxRemoveFromCart(productId));
		}
	}, [isAuthenticated, queryClient, userId, dispatch]);

	// Update quantity (auth + guest)
	const updateQuantity = useCallback((productId, quantity) => {
		if (quantity < 1) return;

		if (isAuthenticated) {
			const previousCart = queryClient.getQueryData(["cart", userId]);

			if (previousCart) {
				queryClient.setQueryData(["cart", userId], (old) => {
					if (!old || !old.data?.data?.data) return old;
					const cartData = old.data.data.data;
					const newItems = [...(cartData.items || [])];

					const existingIndex = newItems.findIndex(i => {
						const pid = i.item?._id || i.itemId?._id || i.productId || i.item;
						return pid === productId;
					});

					if (existingIndex >= 0) {
						newItems[existingIndex] = {
							...newItems[existingIndex],
							quantity: quantity
						};
					}

					return {
						...old,
						data: {
							...old.data,
							data: {
								...old.data.data,
								data: {
									...cartData,
									items: newItems
								}
							}
						}
					};
				});
			}

			updateCartItemQuantity(productId, quantity).then(() => {
				queryClient.invalidateQueries({ queryKey: ["cart"] });
			}).catch(() => {
				if (previousCart) {
					queryClient.setQueryData(["cart", userId], previousCart);
				}
				toast.error("Failed to update quantity");
			});
		} else {
			dispatch(reduxUpdateQuantity({ id: productId, quantity }));
		}
	}, [isAuthenticated, queryClient, userId, dispatch]);

	// Clear cart (auth + guest)
	const clearCartAction = useCallback(() => {
		if (isAuthenticated) {
			const previousCart = queryClient.getQueryData(["cart", userId]);

			if (previousCart) {
				queryClient.setQueryData(["cart", userId], (old) => {
					if (!old || !old.data?.data?.data) return old;
					const cartData = old.data.data.data;

					return {
						...old,
						data: {
							...old.data,
							data: {
								...old.data.data,
								data: {
									...cartData,
									items: []
								}
							}
						}
					};
				});
			}

			clearCart().then(() => {
				queryClient.invalidateQueries({ queryKey: ["cart"] });
			}).catch(() => {
				if (previousCart) {
					queryClient.setQueryData(["cart", userId], previousCart);
				}
				toast.error("Failed to clear cart");
			});
		} else {
			dispatch(reduxClearCart());
		}
	}, [isAuthenticated, queryClient, userId, dispatch]);

	const cart = isAuthenticated
		? response?.data?.data?.data || response?.data?.data || response?.data
		: { items: reduxItems };

	const cartItems = useMemo(() => cart?.items || [], [cart?.items]);

	const cartTotal = useMemo(() => {
		return cartItems.reduce((sum, item) => {
			const product = item.item || item.itemId || item.productId || item;
			const price = typeof product.price === 'object' ? product.price.amount : (product.price || item.price || 0);
			return sum + (price * (item.quantity || 1));
		}, 0);
	}, [cartItems]);

	const cartItemCount = useMemo(() => {
		return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
	}, [cartItems]);

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
