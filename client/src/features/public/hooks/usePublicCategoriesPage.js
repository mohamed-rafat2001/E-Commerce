import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getCategories } from "../services/index.js";
import usePaginationLimit from "../../../shared/hooks/usePaginationLimit.js";

const sortMapper = {
	az: "name",
	za: "-name",
	popular: "-productsCount,-createdAt",
	newest: "-createdAt",
};

export default function usePublicCategoriesPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const paginationLimit = usePaginationLimit('PUBLIC_CATEGORIES');

	const filters = useMemo(
		() => ({
			search: searchParams.get("search") || "",
			sort: searchParams.get("sort") || "newest",
			page: parseInt(searchParams.get("page"), 10) || 1,
			limit: paginationLimit,
		}),
		[searchParams, paginationLimit]
	);

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["categories", "public", { sort: filters.sort }],
		queryFn: () => getCategories({ sort: sortMapper[filters.sort] || sortMapper.newest, limit: 200 }),
		keepPreviousData: true,
	});

	const apiCategories = useMemo(() => data?.data?.data || [], [data]);

	const filteredCategories = useMemo(() => {
		const query = filters.search.trim().toLowerCase();
		if (!query) return apiCategories;
		return apiCategories.filter((category) => (category.name || "").toLowerCase().includes(query));
	}, [apiCategories, filters.search]);

	const totalCount = filteredCategories.length;
	const totalPages = Math.max(1, Math.ceil(totalCount / filters.limit));
	const currentPage = Math.min(filters.page, totalPages);
	const start = (currentPage - 1) * filters.limit;
	const categories = filteredCategories.slice(start, start + filters.limit);

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
		categories,
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
