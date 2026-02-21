import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../services/admin.js";

/**
 * Hook to fetch all categories (admin only)
 */
export default function useAdminCategories(params) {
	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["admin-categories", params],
		queryFn: () => getAllCategories(params),
	});

	const categories = response?.data?.data || [];
	const total = response?.data?.total || 0;
	const results = response?.data?.results || 0;

	return {
		categories,
		total,
		results,
		isLoading,
		error,
		refetch,
	};
}
