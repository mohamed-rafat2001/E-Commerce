import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LoginFunc } from "../../../services/auth.js";
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
			const userRole = data?.data?.data?.user?.role;
			if (userRole === "Customer") {
				navigate("/customer/personalDetails");
			} else if (userRole === "Seller") {
				navigate("/seller/personalDetails");
			} else if (userRole === "Employee") {
				navigate("/employee/personalDetails");
			} else if (userRole === "Admin") {
				navigate("/admin/personalDetails");
			}
			// } else {
			// 	navigate("/");
			// }
			toast.success(
				<ToastSuccess
					successObj={{
						title: "Login Successful",
						message: "Welcome Back,you are now signed in",
					}}
				/>
			);
		},
		onError: () => {
			toast.error(
				<ToastError
					errorObj={{
						title: "Login Failed",
						message: "Invalid credentials, please try again.",
					}}
				/>
			);
		},
	});
	return { login, isLoggingIn, loginError, loginData };
}
