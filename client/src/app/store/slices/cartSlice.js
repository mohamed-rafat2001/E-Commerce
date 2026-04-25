import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { validatePromoCode } from "../../../features/cart/services/cart.js";

export const validatePromo = createAsyncThunk(
	"cart/validatePromo",
	async ({ code, cartItems }, { rejectWithValue }) => {
		try {
			// Backend expects { code, cartItems }
			// cartItems should be array of { item: productId, quantity }
			const normalizedItems = cartItems.map(i => {
				const product = i.item || i.itemId || i.productId || i;
				const productId = product?._id || product?.id || i.product_id;
				return { item: productId, quantity: i.quantity || 1 };
			});

			const response = await validatePromoCode({ code, cartItems: normalizedItems });
			return response.data.data; // { code, discountAmount, type, value, couponId }
		} catch (error) {
			return rejectWithValue(error.response?.data?.message || "Invalid promo code");
		}
	}
);
const initialState = {
	items: [],
	promoCode: null,
	discount: 0, // percentage for display
	couponDiscountAmount: 0, // absolute savings
	isLoading: false,
	error: null,
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
		clearCart: (state) => {
			state.items = [];
			state.promoCode = null;
			state.discount = 0;
			state.couponDiscountAmount = 0;
			state.error = null;
		},
		removePromo: (state) => {
			state.promoCode = null;
			state.discount = 0;
			state.couponDiscountAmount = 0;
			state.error = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(validatePromo.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(validatePromo.fulfilled, (state, action) => {
				state.isLoading = false;
				state.promoCode = action.payload.code;
				state.discount = action.payload.type === 'percentage' ? action.payload.value : 0;
				state.couponDiscountAmount = action.payload.discountAmount;
				state.error = null;
			})
			.addCase(validatePromo.rejected, (state, action) => {
				state.isLoading = false;
				state.promoCode = null;
				state.discount = 0;
				state.couponDiscountAmount = 0;
				state.error = action.payload || "Failed to validate promo code";
			});
	},
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, removePromo } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cartStore.items;
export const selectPromoInfo = createSelector(
	(state) => state.cartStore.promoCode,
	(state) => state.cartStore.discount,
	(state) => state.cartStore.couponDiscountAmount,
	(state) => state.cartStore.error,
	(state) => state.cartStore.isLoading,
	(code, discount, amount, error, isLoading) => ({ code, discount, amount, error, isLoading })
);

export default cartSlice.reducer;
