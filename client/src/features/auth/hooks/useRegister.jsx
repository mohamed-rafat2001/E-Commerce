import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { RegisterFunc } from "../services/auth.js";
import toast from "react-hot-toast";
import { ToastSuccess, ToastError } from "../../../shared/ui/index.js";

export default function useRegister() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		mutate: registerUser,
		isLoading: isRegistering,
		error: registerError,
		data: registerData,
	} = useMutation({
		mutationFn: RegisterFunc,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			navigate("/login");
			toast.success(
				<ToastSuccess
					successObj={{
						title: "Registration Successful",
						message: "Welcome to our platform!",
					}}
				/>,
				{ icon: null }
			);
		},
		onError: (err) => {
			toast.error(
				<ToastError
					errorObj={{
						title: "Registration Failed",
						message: err?.response?.data?.message || "Please try again.",
					}}
				/>,
				{ icon: null }
			);
		},
	});
	return { registerUser, isRegistering, registerError, registerData };
}
