import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LoginFunc } from "../services/auth.js";
import toast from "react-hot-toast";
import { ToastSuccess, ToastError } from "../../../shared/ui/index.js";

export default function useLogin() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const {
		mutate: login,
		isLoading: isLoggingIn,
		error: loginError,
		data: loginData,
	} = useMutation({
		mutationFn: LoginFunc,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			const userRole = data?.data?.data?.user?.role || data?.data?.data?.user?.userId?.role;
			
			// Redirect based on role
			if (userRole === "Customer") {
				navigate("/customer/dashboard");
			} else if (userRole === "Seller") {
				navigate("/seller/dashboard");
			} else if (userRole === "Admin") {
				navigate("/admin/dashboard");
			} else {
				navigate("/");
			}

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
						message: err.response?.data?.message || "Invalid credentials, please try again.",
					}}
				/>,
				{ icon: null }
			);
		},
	});
	return { login, isLoggingIn, loginError, loginData };
}
