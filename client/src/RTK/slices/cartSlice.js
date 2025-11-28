import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	items: [],
	totalPrice: 0,
};
const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		// add item to cart
		addToCart: (state, action) => {
			const totalPriceForItem = action.payload.price * action.payload.quantity;

			state.items.push({ ...action.payload, totalPriceForItem });
			state.totalPrice += totalPriceForItem;

			return state;
		},
		// delete item from cart
		deleteFromCart: (state, action) => {
			state.items = state.items.filter(
				(items) => items.id !== action.payload.id
			);
			state.totalPrice -= action.payload.totalPriceForItem;
			return state;
		},
		// delete all items from cart
        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
            return state;
        },
	},
});
export const { addToCart, deleteFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
