import { useQuery } from "@tanstack/react-query";
import { getMeFunc } from "../services/auth.js";

/**
 * Get current user query
 */
export default function useCurrentUser() {
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
}
