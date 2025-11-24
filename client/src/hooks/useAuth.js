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
import { Navigate } from "react-router-dom";

export const useLogin = () => {
	const queryClient = useQueryClient();

	const {
		mutate: login,
		isLoading: isLoggingIn,
		error: loginError,
		data: loginData,
	} = useMutation({
		mutationFn: LoginFunc,
		onSuccess: (data) => {
			// Invalidate user queries
			queryClient.setQueriesData(["user"], data);
		},
	});
	return { login, isLoggingIn, loginError, loginData };
};

/**
 * Register mutation using React Query
 */
export const useRegister = () => {
	const queryClient = useQueryClient();

	const {
		mutate: register,
		isLoading: isRegistering,
		error: registerError,
		data: registerData,
	} = useMutation({
		mutationFn: RegisterFunc,
		onSuccess: (data) => {
			queryClient.setQueriesData(["user"], data);
		},
	});
	return { register, isRegistering, registerError, registerData };
};

/**
 * Logout mutation using React Query
 */
export const useLogout = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: LogoutFunc,
		onSuccess: () => {
			// Clear React Query cache
			queryClient.clear();
			Navigate("/");
		},
	});
};

/**
 * Get current user query using React Query
 */
export const useGetCurrentUser = () => {
	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user"],
		queryFn: getMeFunc,
		retry: 1, // retry once on failure
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	return {
		isAuthenticated: !!user,
		user,
		userRole: user?.role,
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
