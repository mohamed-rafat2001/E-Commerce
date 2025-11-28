/**
 * Authentication Hooks using React Query
 * React Query handles API calls
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getMeFunc,
	LoginFunc,
	LogoutFunc,
	RegisterFunc,
} from "../services/auth.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useLogin = () => {
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
				<div>
					<h1 className="text-green-500 font-bold text-sm">Login Successful</h1>
					<p className="text-green-500 text-xs">
						Welcome Back,you are now signed in
					</p>
				</div>
			);
		},
		onError: () => {
			toast.error(
				<div>
					<h1 className="text-red-500 font-bold text-sm">Login Failed</h1>
					<p className="text-red-500 text-xs">
						Invalid credentials, please try again.
					</p>
				</div>
			);
		},
	});
	return { login, isLoggingIn, loginError, loginData };
};

/**
 * Register mutation using React Query
 */
export const useRegister = () => {
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
				<div>
					<h1 className="text-green-500 font-bold text-sm">
						Registration Successful
					</h1>
					<p className="text-green-500 text-xs">Welcome to our platform!</p>
				</div>
			);
		},
		onError: () => {
			toast.error(
				<div>
					<h1 className="text-red-500 font-bold text-sm">
						Registration Failed
					</h1>
					<p className="text-red-500 text-xs">Please try again.</p>
				</div>
			);
		},
	});
	return { registerUser, isRegistering, registerError, registerData };
};

/**
 * Logout mutation using React Query
 */
export const useLogout = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { mutate: logout } = useMutation({
		mutationFn: LogoutFunc,
		onSuccess: () => {
			queryClient.clear();
			navigate("/login");
			toast.success(
				<div>
					<h1 className="text-green-500 font-bold text-sm">
						Logout Successful
					</h1>
					<p className="text-green-500 text-xs">You have been signed out.</p>
				</div>
			);
		},
		onError: () => {
			toast.error(
				<div>
					<h1 className="text-red-500 font-bold text-sm">Logout Failed</h1>
					<p className="text-red-500 text-xs">Please try again.</p>
				</div>
			);
		},
	});
	return { logout };
};

/**
 * Get current user query using React Query
 */
export const useGetCurrentUser = () => {
	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user"],
		queryFn: getMeFunc,
		retry: Infinity,
		staleTime: 5 * 60 * 1000,
	});

	const user = response?.data?.data?.user;

	return {
		isAuthenticated: !!user,
		user,
		userRole: user?.userId?.role,
		isLoading,
		error,
	};
};

/**
 * Update user mutation
 * Updates both React Query cache
 */
export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => {},
		onSuccess: () => {
			// Update React Query cache
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
};
