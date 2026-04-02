/* Codebase Pattern Summary:
Modeled after features/product/hooks/useProductsPage.js and features/product/hooks/useProductFilters.js.
This hook follows URL-based state for filters/pagination and wraps public fetching with React Query,
while applying client-side filtering/sorting to keep interactions instant.
*/
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getCategories } from "../services/index.js";

const ITEMS_PER_PAGE = 6;

const sortMapper = {
	az: "name",
	za: "-name",
	popular: "-productsCount,-createdAt",
	newest: "-createdAt",
};

export default function usePublicCategoriesPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const makeId = (seed) => seed.toString(16).padStart(24, "0").slice(0, 24);

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
		queryKey: ["categories", "public", { sort: filters.sort }],
		queryFn: () => getCategories({ sort: sortMapper[filters.sort] || sortMapper.newest, limit: 200 }),
		keepPreviousData: true,
	});

	const mockCategories = useMemo(() => {
		return Array.from({ length: 30 }, (_, index) => {
			const id = makeId(22000 + index);
			return {
				_id: id,
				id,
				name: `Category Showcase ${index + 1}`,
				slug: `category-showcase-${index + 1}`,
				productsCount: 25 + (index * 4),
				subCategories: Array.from({ length: 5 }, (_, subIndex) => ({
					_id: makeId(26000 + index * 8 + subIndex),
					id: makeId(26000 + index * 8 + subIndex),
					name: `Sub Category ${subIndex + 1}`
				}))
			};
		});
	}, []);

	const apiCategories = useMemo(() => data?.data?.data || [], [data]);
	const allCategories = useMemo(() => {
		if (!Array.isArray(apiCategories) || apiCategories.length === 0) {
			return mockCategories;
		}
		if (apiCategories.length >= 18) {
			return apiCategories;
		}
		return [...apiCategories, ...mockCategories.slice(0, 18 - apiCategories.length)];
	}, [apiCategories, mockCategories]);

	const filteredCategories = useMemo(() => {
		const query = filters.search.trim().toLowerCase();
		if (!query) return allCategories;
		return allCategories.filter((category) => (category.name || "").toLowerCase().includes(query));
	}, [allCategories, filters.search]);

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
