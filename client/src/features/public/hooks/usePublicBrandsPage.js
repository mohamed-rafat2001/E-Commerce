import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBrands } from "../services/index.js";

const ITEMS_PER_PAGE = 9;

const sortMapper = {
	az: "name",
	za: "-name",
	popular: "-ratingAverage,-ratingCount",
	newest: "-createdAt",
};

export default function usePublicBrandsPage() {
	const [searchParams, setSearchParams] = useSearchParams();

	const filters = useMemo(
		() => ({
			search: searchParams.get("search") || "",
			sort: searchParams.get("sort") || "newest",
			category: searchParams.get("category") || "",
			page: parseInt(searchParams.get("page"), 10) || 1,
			limit: parseInt(searchParams.get("limit"), 10) || ITEMS_PER_PAGE,
		}),
		[searchParams]
	);

	const requestParams = useMemo(() => {
		const params = {
			sort: sortMapper[filters.sort] || sortMapper.newest,
			page: filters.page,
			limit: filters.limit,
		};
		if (filters.search) params.search = filters.search;
		if (filters.category) params.primaryCategory = filters.category;
		return params;
	}, [filters]);

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["brands", "public", requestParams],
		queryFn: () => getBrands(requestParams),
		keepPreviousData: true,
	});

	const brands = useMemo(() => data?.data?.data || [], [data]);
	const totalCount = useMemo(() => data?.data?.total || data?.data?.paginationResult?.totalResults || 0, [data]);
	const totalPages = useMemo(() => data?.data?.paginationResult?.numberOfPages || 1, [data]);
	const currentPage = useMemo(() => data?.data?.paginationResult?.currentPage || 1, [data]);

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
	const clearCategory = () => setFilter("category", "");

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
		clearCategory,
	};
}
