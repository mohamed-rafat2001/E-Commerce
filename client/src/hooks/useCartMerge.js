import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import useCurrentUser from "../features/user/hooks/useCurrentUser.js";
import { mergeGuestCart } from "../features/cart/services/cart.js";
import { selectCartItems, clearCart as reduxClearCart } from "../app/store/slices/cartSlice.js";

export default function useCartMerge() {
	const { isAuthenticated } = useCurrentUser();
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	const previousAuthRef = useRef(false);
	const guestItems = useSelector(selectCartItems);

	// Use a ref to hold the current items so we don't trigger the effect on every change
	const itemsRef = useRef(guestItems);
	useEffect(() => {
		itemsRef.current = guestItems;
	}, [guestItems]);

	useEffect(() => {
		let isCancelled = false;

		const runMerge = async () => {
			const justLoggedIn = !previousAuthRef.current && isAuthenticated;
			if (!justLoggedIn) {
				previousAuthRef.current = isAuthenticated;
				return;
			}

			const itemsToMerge = itemsRef.current || [];
			if (!itemsToMerge.length) {
				previousAuthRef.current = isAuthenticated;
				return;
			}

			try {
				await mergeGuestCart(itemsToMerge);
				if (!isCancelled) {
					dispatch(reduxClearCart());
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
	}, [isAuthenticated, queryClient, dispatch]);
}
