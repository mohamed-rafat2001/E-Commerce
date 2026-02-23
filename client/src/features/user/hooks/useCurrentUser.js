import { useQuery } from "@tanstack/react-query";
import { getMeFunc } from "../../auth/services/auth.js";

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
		retry: (failureCount, error) => {
			// Immediately stop retrying for auth errors (401, 403) or rate limiting (429)
			if (
				error.response?.status === 401 || 
				error.response?.status === 403 || 
				error.response?.status === 429
			) return false;
			// For other errors, retry only once to speed up failure detection
			return failureCount < 1;
		},
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		// Ensure error state is caught immediately
		throwOnError: false,
	});

	const user = response?.data?.data?.user;

	// If there is an error (like 401), we are not authenticated
	const isError = !!error;

	return {
		isAuthenticated: !!user && !isError,
		user,
		userRole: user?.role || user?.userId?.role,
		isLoading: isLoading && !isError,
		error,
	};
}
