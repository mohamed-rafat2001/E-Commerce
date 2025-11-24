import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice.js";
import wishListSlice from "./slices/wishList.js";

const store = configureStore({
	reducer: {
		cartStore: cartSlice,
		wishListStore: wishListSlice,
	},
});

// Make store available globally for axios interceptor
// if (typeof window !== "undefined") {
// 	window.store = store;
// }

export default store;
