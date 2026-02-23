import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../services/admin.js";

/**
 * Hook to fetch all users (admin only)
 */
export default function useAdminUsers() {
	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["admin-users"],
		queryFn: getAllUsers,
	});

	const users = response?.data?.data || [];

	return {
		users,
		isLoading,
		error,
		refetch,
	};
}
