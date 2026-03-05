import { useQuery } from "@tanstack/react-query";
import { getSubCategories } from "../../services/subCategory.js";

export function useAdminSubCategories(params, options = {}) {
	const { data, isLoading, isFetching, error } = useQuery({
		queryKey: ["subcategories", params],
		queryFn: () => getSubCategories(params),
		enabled: options.enabled !== false,
		...options
	});

	const subCategories = data?.data?.data || [];

	return {
		subCategories,
		total: data?.data?.total || 0,
		results: data?.data?.results || 0,
		isLoading: isLoading || isFetching,
		error,
	};
}