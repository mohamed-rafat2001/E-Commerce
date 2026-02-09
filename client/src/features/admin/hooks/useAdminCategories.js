import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../services/admin.js";

/**
 * Hook to fetch all categories (admin only)
 */
export default function useAdminCategories() {
	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["admin-categories"],
		queryFn: getAllCategories,
	});

	const categories = response?.data?.data || [];

	return {
		categories,
		isLoading,
		error,
		refetch,
	};
}
