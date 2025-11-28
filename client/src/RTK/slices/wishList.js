import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	items: [],
};
const wishListSlice = createSlice({
	name: "wishList",
	initialState,
	reducers: {
		// add item to wishList
		addToWishList: (state, action) => {
			state.items.push(action.payload);
			return state;
		},
		// delete item from wishList
		deleteFromWishList: (state, action) => {
			state.items = state.items.filter(
				(items) => items.id !== action.payload.id
			);
			return state;
		},
		// delete all items from wishList
        clearWishList: (state) => {
            state.items = [];
            return state;
        },
	},
});
export const { addToWishList, deleteFromWishList, clearWishList } =
	wishListSlice.actions;
export default wishListSlice.reducer;
