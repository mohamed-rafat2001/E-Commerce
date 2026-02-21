import { useQuery } from "@tanstack/react-query";
import { getSubCategories } from "../services/subCategory.js";

export function useAdminSubCategories() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["subcategories"],
		queryFn: getSubCategories,
	});

	return {
		subCategories: data?.data?.data || [],
		isLoading,
		error,
	};
}