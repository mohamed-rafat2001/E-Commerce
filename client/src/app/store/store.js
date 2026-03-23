/* Audit Findings:
 - Store currently mounts cartStore and wishListStore only.
 - Auth state is not in Redux; it is read via useCurrentUser query.
 - A global modal state is required to trigger auth prompts from any feature.
*/
import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice.js";
import wishListSlice from "./slices/wishList.js";
import authModalSlice from "./slices/authModalSlice.js";

const store = configureStore({
	reducer: {
		cartStore: cartSlice,
		wishListStore: wishListSlice,
		authModalStore: authModalSlice,
	},
});

// Make store available globally for axios interceptor
// if (typeof window !== "undefined") {
// 	window.store = store;
// }

export default store;
