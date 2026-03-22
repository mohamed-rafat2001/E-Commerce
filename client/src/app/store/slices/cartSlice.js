import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	items: [], // Array of { id, name, price, quantity, color, size, material, image, ... }
	promoCode: null,
	discount: 0,
	isLoading: false,
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart: (state, action) => {
			const existingItem = state.items.find(item => item.id === action.payload.id);
			if (existingItem) {
				existingItem.quantity += action.payload.quantity || 1;
			} else {
				state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
			}
		},
		removeFromCart: (state, action) => {
			state.items = state.items.filter(item => item.id !== action.payload);
		},
		updateQuantity: (state, action) => {
			const { id, quantity } = action.payload;
			const item = state.items.find(item => item.id === id);
			if (item) {
				item.quantity = Math.max(1, quantity);
			}
		},
		applyPromoCode: (state, action) => {
			const code = action.payload.toUpperCase();
			// Mocking promo logic as requested: "if a /api/promo endpoint exists use it; otherwise handle locally"
			// I'll handle it locally for now with a simple "SAVE10" example.
			if (code === "SAVE10") {
				state.promoCode = code;
				state.discount = 10; // 10% discount
			} else {
				state.promoCode = null;
				state.discount = 0;
			}
		},
		clearCart: (state) => {
			state.items = [];
			state.promoCode = null;
			state.discount = 0;
		},
	},
});

export const { addToCart, removeFromCart, updateQuantity, applyPromoCode, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cartStore.items;
export const selectPromoInfo = (state) => ({ code: state.cartStore.promoCode, discount: state.cartStore.discount });

export default cartSlice.reducer;
