/* Audit Findings:
 - Authenticated cart endpoint is POST /cart with itemId/product_id and quantity.
 - Guest cart persists in localStorage (guest_cart) and updates via guestCart service.
 - First guest add-to-cart should prompt authentication without blocking guest cart behavior.
*/
import { useCallback } from "react";
import { addToCart as addToCartApi } from "../services/cart.js";
import { addToGuestCart } from "../services/guestCart.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
import useCart from "./useCart.js";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { openAuthModal } from "../../../app/store/slices/authModalSlice.js";

/**
 * Add to cart hook with guest/auth decision logic.
 * If authenticated → POST /api/v1/cart (MongoDB)
 * If guest → addToGuestCart (localStorage)
 */
export default function useAddToCart() {
	const { isAuthenticated, user } = useCurrentUser();
	const { refreshGuestCart } = useCart();
	const dispatch = useDispatch();

	const { error, data, mutateAsync, isLoading } = useMutationFactory(
		addToCartApi,
		"cart",
		{ title: "Add Failed", message: "Something went wrong, please try again" },
		{ title: "Added Successfully", message: "Product added to your cart" }
	);

	const queryClient = useQueryClient();
	const userId = user?.userId?._id || user?._id;

	// Wrapper that decides guest vs. auth
	const addToCart = useCallback(
		async (productOrPayload, quantity = 1) => {
			if (isAuthenticated) {
				// Authenticated: use API
				const pid = productOrPayload.itemId || productOrPayload._id || productOrPayload.id || productOrPayload.product_id;
				const payload = productOrPayload.itemId
					? productOrPayload
					: {
						itemId: pid,
						quantity,
					};

				// Optimistic Update
				const previousCart = queryClient.getQueryData(["cart", userId]);
				if (previousCart) {
					queryClient.setQueryData(["cart", userId], (old) => {
						// The structure is axiosResponse.data.data.data
						if (!old || !old.data?.data?.data) return old;
						const cartData = old.data.data.data;
						const newItems = [...(cartData.items || [])];

						const existingIndex = newItems.findIndex(i => {
							const id = i.item?._id || i.itemId?._id || i.productId || i.item;
							return id === pid;
						});

						if (existingIndex >= 0) {
							newItems[existingIndex] = {
								...newItems[existingIndex],
								quantity: newItems[existingIndex].quantity + quantity
							};
						} else {
							newItems.push({
								item: productOrPayload, // Using the full object so UI has details to render instantly
								quantity,
								price: productOrPayload.price
							});
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

				try {
					return await mutateAsync(payload);
				} catch (err) {
					if (previousCart) {
						queryClient.setQueryData(["cart", userId], previousCart);
					}
					throw err;
				}
			} else {
				// Guest: use localStorage
				addToGuestCart(productOrPayload, quantity);
				refreshGuestCart();
				const hasShownPrompt = localStorage.getItem("guest_cart_auth_prompt_shown") === "true";
				if (!hasShownPrompt) {
					dispatch(
						openAuthModal({
							message: "Sign in to complete your purchase",
							redirectAfter: "/cart",
							onSuccessCallback: "merge:guestCart",
						})
					);
					localStorage.setItem("guest_cart_auth_prompt_shown", "true");
				}
				return Promise.resolve();
			}
		},
		[dispatch, isAuthenticated, mutateAsync, refreshGuestCart, queryClient, userId]
	);

	return { error, data, addToCart, isLoading };
}
