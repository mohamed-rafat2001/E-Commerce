import { useQuery } from "@tanstack/react-query";
import { getSubCategories } from "../services/subCategory.js";

export function useAdminSubCategories(params) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["subcategories", params],
		queryFn: () => getSubCategories(params),
	});

	return {
		subCategories: data?.data?.data || [],
		total: data?.data?.total || 0,
		results: data?.data?.results || 0,
		isLoading,
		error,
	};
}