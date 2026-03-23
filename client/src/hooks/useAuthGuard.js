/* Audit Findings:
 - User authentication is available from useCurrentUser() and not Redux auth slice.
 - Guest users can browse public pages; action-level prompts are needed instead of hard redirects.
 - Auth modal state is centralized in Redux for cross-feature triggers.
*/
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import useCurrentUser from "../features/user/hooks/useCurrentUser.js";
import { openAuthModal } from "../app/store/slices/authModalSlice.js";

export default function useAuthGuard() {
	const { isAuthenticated } = useCurrentUser();
	const dispatch = useDispatch();
	const location = useLocation();

	const requireAuth = useCallback(
		({
			message = "Sign in to continue",
			redirectAfter,
			onSuccessCallback = null,
			callbackPayload = null,
		} = {}) => {
			if (isAuthenticated) return true;

			dispatch(
				openAuthModal({
					message,
					redirectAfter: redirectAfter || `${location.pathname}${location.search}`,
					onSuccessCallback,
					callbackPayload,
				})
			);
			return false;
		},
		[dispatch, isAuthenticated, location.pathname, location.search]
	);

	return { isAuthenticated, requireAuth };
}
