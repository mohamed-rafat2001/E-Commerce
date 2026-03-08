import { useCallback } from "react";
import { addToCart as addToCartApi } from "../services/cart.js";
import { addToGuestCart } from "../services/guestCart.js";
import useCurrentUser from "../../user/hooks/useCurrentUser.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
import useCart from "./useCart.js";

/**
 * Add to cart hook with guest/auth decision logic.
 * If authenticated → POST /api/v1/cart (MongoDB)
 * If guest → addToGuestCart (localStorage)
 */
export default function useAddToCart() {
	const { isAuthenticated } = useCurrentUser();
	const { refreshGuestCart } = useCart();

	// Mutation for authenticated users
	const { error, data, mutate, isLoading } = useMutationFactory(
		addToCartApi,
		"cart",
		{ title: "Add Failed", message: "Something went wrong, please try again" },
		{ title: "Added Successfully", message: "Product added to your cart" }
	);

	// Wrapper that decides guest vs. auth
	const addToCart = useCallback(
		(productOrPayload, quantity = 1) => {
			if (isAuthenticated) {
				// Authenticated: use API
				// Support both { itemId, quantity } format and product object
				const payload = productOrPayload.itemId
					? productOrPayload
					: {
						itemId: productOrPayload._id || productOrPayload.id || productOrPayload.product_id,
						quantity,
					};
				mutate(payload);
			} else {
				// Guest: use localStorage
				addToGuestCart(productOrPayload, quantity);
				refreshGuestCart();
			}
		},
		[isAuthenticated, mutate, refreshGuestCart]
	);

	return { error, data, addToCart, isLoading };
}
