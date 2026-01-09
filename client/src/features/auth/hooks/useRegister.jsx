import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { RegisterFunc } from "../../../services/auth.js";
import toast from "react-hot-toast";
import ToastError from "../../../ui/ToastError.jsx";
import ToastSuccess from "../../../ui/ToastSuccess.jsx";

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
				/>
			);
		},
		onError: () => {
			toast.error(
				<ToastError
					errorObj={{
						title: "Registration Failed",
						message: "Please try again.",
					}}
				/>
			);
		},
	});
	return { registerUser, isRegistering, registerError, registerData };
}
