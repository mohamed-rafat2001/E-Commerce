/* Codebase Pattern Summary:
Modeled after features/product/hooks/useProductsPage.js and features/product/hooks/useProductFilters.js.
This hook keeps URL-driven filters via useSearchParams, wraps data fetching in React Query,
and computes client-side filtering/sorting/pagination for the page layer.
*/
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBrands } from "../services/index.js";

const ITEMS_PER_PAGE = 6;

const sortMapper = {
	az: "name",
	za: "-name",
	popular: "-productsCount,-createdAt",
	newest: "-createdAt",
};

export default function usePublicBrandsPage() {
	const [searchParams, setSearchParams] = useSearchParams();

	const filters = useMemo(
		() => ({
			search: searchParams.get("search") || "",
			sort: searchParams.get("sort") || "newest",
			page: parseInt(searchParams.get("page"), 10) || 1,
			limit: parseInt(searchParams.get("limit"), 10) || ITEMS_PER_PAGE,
		}),
		[searchParams]
	);

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["brands", "public", { sort: filters.sort }],
		queryFn: () => getBrands({ sort: sortMapper[filters.sort] || sortMapper.newest, limit: 200 }),
		keepPreviousData: true,
	});

	const allBrands = useMemo(() => data?.data?.data || [], [data]);

	const filteredBrands = useMemo(() => {
		const query = filters.search.trim().toLowerCase();
		if (!query) return allBrands;
		return allBrands.filter((brand) => (brand.name || "").toLowerCase().includes(query));
	}, [allBrands, filters.search]);

	const totalCount = filteredBrands.length;
	const totalPages = Math.max(1, Math.ceil(totalCount / filters.limit));
	const currentPage = Math.min(filters.page, totalPages);
	const start = (currentPage - 1) * filters.limit;
	const brands = filteredBrands.slice(start, start + filters.limit);

	const setFilter = (key, value) => {
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			if (value === "" || value == null) {
				next.delete(key);
			} else {
				next.set(key, String(value));
			}
			if (key !== "page") next.delete("page");
			return next;
		});
	};

	const clearSearch = () => setFilter("search", "");

	return {
		brands,
		totalCount,
		totalPages,
		currentPage,
		filters,
		isLoading,
		error,
		refetch,
		setFilter,
		clearSearch,
	};
}
