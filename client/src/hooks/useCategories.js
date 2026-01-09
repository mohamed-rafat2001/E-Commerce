import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/category.js";

/**
 * Get current user query
 */
export default function useCategories() {
	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["categories"],
		queryFn: getCategories,
	});

	const categories = response?.data?.data;

	return {
		categories,
		isLoading,
		error,
	};
}
