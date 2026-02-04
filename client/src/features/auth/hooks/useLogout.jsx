import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LogoutFunc } from "../services/auth.js";
import toast from "react-hot-toast";
import { ToastSuccess, ToastError } from "../../../shared/ui/index.js";

export default function useLogout() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { mutate: logout } = useMutation({
		mutationFn: LogoutFunc,
		onSuccess: () => {
			queryClient.clear();
			navigate("/login");
			toast.success(
				<ToastSuccess
					successObj={{
						title: "Logout Successful",
						message: "You have been signed out.",
					}}
				/>
			);
		},
		onError: () => {
			toast.error(
				<ToastError
					errorObj={{
						title: "Logout Failed",
						message: "Please try again.",
					}}
				/>
			);
		},
	});
	return { logout };
}
