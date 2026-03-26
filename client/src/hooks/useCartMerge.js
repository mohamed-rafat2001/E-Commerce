/* Audit Findings:
 - Backend supports authenticated merge endpoint POST /api/v1/cart/merge with guest_items array.
 - Guest cart is persisted in localStorage under guest_cart and already has helper utilities.
 - Login currently attempts merge in auth hook; centralized post-login merge is more reliable.
*/
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useCurrentUser from "../features/user/hooks/useCurrentUser.js";
import { mergeGuestCart } from "../features/cart/services/cart.js";
import { getGuestCart, clearGuestCart } from "../features/cart/services/guestCart.js";

export default function useCartMerge() {
	const { isAuthenticated } = useCurrentUser();
	const queryClient = useQueryClient();
	const previousAuthRef = useRef(false);

	useEffect(() => {
		let isCancelled = false;

		const runMerge = async () => {
			const justLoggedIn = !previousAuthRef.current && isAuthenticated;
			if (!justLoggedIn) {
				previousAuthRef.current = isAuthenticated;
				return;
			}

			const guestCart = getGuestCart();
			const guestItems = guestCart?.items || [];
			if (!guestItems.length) {
				previousAuthRef.current = isAuthenticated;
				return;
			}

			try {
				await mergeGuestCart(guestItems);
				if (!isCancelled) {
					clearGuestCart();
					queryClient.invalidateQueries({ queryKey: ["cart"] });
					toast.success("Cart items saved to account!");
				}
			} catch {
				if (!isCancelled) {
					toast.error("Failed to update cart");
				}
			} finally {
				previousAuthRef.current = isAuthenticated;
			}
		};

		runMerge();

		return () => {
			isCancelled = true;
		};
	}, [isAuthenticated, queryClient]);
}
