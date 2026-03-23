/* Audit Findings:
 - Auth uses cookie-based session with getMe query and login mutation.
 - Guest cart merge endpoint exists and is now centralized in useCartMerge hook.
 - Wishlist backend toggles via POST /wishlist/:id; modal intent should be resumed after login.
*/
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginFunc } from "../services/auth.js";
import { addToWishlist } from "../../wishList/services/wishList.js";
import toast from "react-hot-toast";
import { ToastSuccess, ToastError } from "../../../shared/ui/index.js";
import { resetAuthModal } from "../../../app/store/slices/authModalSlice.js";

export default function useLogin() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { onSuccessCallback, callbackPayload } = useSelector((state) => state.authModalStore);
	const {
		mutate: login,
		isLoading: isLoggingIn,
		error: loginError,
		data: loginData,
	} = useMutation({
		mutationFn: LoginFunc,
		onSuccess: async (data) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			queryClient.invalidateQueries({ queryKey: ["cart"] });
			queryClient.invalidateQueries({ queryKey: ["wishlist"] });

			if (onSuccessCallback === "wishlist:add" && callbackPayload?.productId) {
				try {
					await addToWishlist(callbackPayload.productId);
					queryClient.invalidateQueries({ queryKey: ["wishlist"] });
					toast.success("Added to wishlist!");
				} catch {
					toast.error("Failed to update wishlist");
				}
			}

			const userRole =
				data?.data?.data?.user?.role ||
				data?.data?.data?.user?.userId?.role;

			const params = new URLSearchParams(window.location.search);
			const redirectTarget = params.get("redirect");
			if (redirectTarget) {
				navigate(redirectTarget.startsWith("/") ? redirectTarget : `/${redirectTarget}`);
			} else if (userRole === "Customer") {
				navigate("/customer/dashboard");
			} else if (userRole === "Seller") {
				navigate("/seller/dashboard");
			} else if (userRole === "Admin") {
				navigate("/admin/dashboard");
			} else {
				navigate("/");
			}
			dispatch(resetAuthModal());

			toast.success(
				<ToastSuccess
					successObj={{
						title: "Login Successful",
						message: `Welcome Back, ${data?.data?.data?.user?.firstName}!`,
					}}
				/>,
				{ icon: null }
			);
		},
		onError: (err) => {
			toast.error(
				<ToastError
					errorObj={{
						title: "Login Failed",
						message:
							err.response?.data?.message ||
							"Invalid credentials, please try again.",
					}}
				/>,
				{ icon: null }
			);
		},
	});
	return { login, isLoggingIn, loginError, loginData };
}
