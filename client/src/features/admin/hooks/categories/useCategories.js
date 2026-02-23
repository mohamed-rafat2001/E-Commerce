import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/category.js";

/**
 * Get current user query
 */
export default function useCategories(params = {}) {
	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["categories", params],
		queryFn: () => getCategories(params),
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
