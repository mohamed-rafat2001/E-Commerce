/* Audit Findings:
 - Frontend auth state is derived from useCurrentUser (React Query), not a dedicated auth Redux slice.
 - Axios uses withCredentials and backend Protect middleware accepts cookie or Bearer token.
 - Guest cart and guest wishlist are already stored in localStorage keys guest_cart and guest_wishlist.
 - Existing protected routing is role-based via ProtectedRoute and redirects to /login without query redirect.
*/
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isOpen: false,
	message: "",
	redirectAfter: "",
	onSuccessCallback: null,
	callbackPayload: null,
};

const authModalSlice = createSlice({
	name: "authModal",
	initialState,
	reducers: {
		openAuthModal: (state, action) => {
			state.isOpen = true;
			state.message = action.payload?.message || "Sign in to continue";
			state.redirectAfter = action.payload?.redirectAfter || "";
			state.onSuccessCallback = action.payload?.onSuccessCallback || null;
			state.callbackPayload = action.payload?.callbackPayload || null;
		},
		closeAuthModal: (state) => {
			state.isOpen = false;
		},
		resetAuthModal: () => initialState,
	},
});

export const { openAuthModal, closeAuthModal, resetAuthModal } = authModalSlice.actions;
export default authModalSlice.reducer;
