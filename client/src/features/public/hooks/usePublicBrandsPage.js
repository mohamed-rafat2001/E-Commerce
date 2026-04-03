import usePaginationLimit from "../../../shared/hooks/usePaginationLimit.js";
const sortMapper = {
	az: "name",
	za: "-name",
	popular: "-ratingAverage,-ratingCount",
	newest: "-createdAt",
};

export default function usePublicBrandsPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const makeId = (seed) => seed.toString(16).padStart(24, "0").slice(0, 24);

	const filters = useMemo(
		() => ({
			search: searchParams.get("search") || "",
			sort: searchParams.get("sort") || "newest",
			category: searchParams.get("category") || "",
			page: parseInt(searchParams.get("page"), 10) || 1,
			limit: usePaginationLimit('PUBLIC_BRANDS'),
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

	const mockBrands = useMemo(() => {
		return Array.from({ length: 36 }, (_, index) => {
			const id = makeId(16000 + index);
			return {
				_id: id,
				id,
				name: `Brand Showcase ${index + 1}`,
				slug: `brand-showcase-${index + 1}`,
				primaryCategory: { _id: makeId(3000 + (index % 8)), name: `Category ${1 + (index % 8)}` },
				productsCount: 20 + index * 3,
				ratingAverage: 3.9 + ((index % 8) / 10),
				ratingCount: 100 + index * 9,
			};
		});
	}, []);

	const apiBrands = useMemo(() => data?.data?.data || [], [data]);
	const sourceBrands = useMemo(() => {
		if (!Array.isArray(apiBrands) || apiBrands.length === 0) {
			return mockBrands;
		}
		if (apiBrands.length >= 18) {
			return apiBrands;
		}
		return [...apiBrands, ...mockBrands.slice(0, 18 - apiBrands.length)];
	}, [apiBrands, mockBrands]);
	const usingMockPagination = Boolean(error) || !Array.isArray(apiBrands) || apiBrands.length === 0;

	const filteredBrands = useMemo(() => {
		if (!usingMockPagination) return sourceBrands;
		const search = String(filters.search || "").trim().toLowerCase();
		return sourceBrands.filter((brand) => {
			const categoryId = brand?.primaryCategory?._id || brand?.primaryCategory;
			const matchesSearch = !search || String(brand.name || "").toLowerCase().includes(search);
			const matchesCategory = !filters.category || categoryId === filters.category;
			return matchesSearch && matchesCategory;
		});
	}, [usingMockPagination, sourceBrands, filters.search, filters.category]);

	const paginatedBrands = useMemo(() => {
		if (!usingMockPagination) return sourceBrands;
		const totalPagesCount = Math.max(1, Math.ceil(filteredBrands.length / filters.limit));
		const current = Math.min(filters.page, totalPagesCount);
		const start = (current - 1) * filters.limit;
		return filteredBrands.slice(start, start + filters.limit);
	}, [usingMockPagination, sourceBrands, filteredBrands, filters.limit, filters.page]);

	const brands = useMemo(() => (usingMockPagination ? paginatedBrands : sourceBrands), [usingMockPagination, paginatedBrands, sourceBrands]);
	const totalCount = useMemo(() => (usingMockPagination ? filteredBrands.length : (data?.data?.total || data?.data?.paginationResult?.totalResults || 0)), [usingMockPagination, filteredBrands.length, data]);
	const totalPages = useMemo(() => (usingMockPagination ? Math.max(1, Math.ceil(filteredBrands.length / filters.limit)) : (data?.data?.paginationResult?.numberOfPages || 1)), [usingMockPagination, filteredBrands.length, filters.limit, data]);
	const currentPage = useMemo(() => (usingMockPagination ? Math.min(filters.page, Math.max(1, Math.ceil(filteredBrands.length / filters.limit))) : (data?.data?.paginationResult?.currentPage || 1)), [usingMockPagination, filters.page, filters.limit, filteredBrands.length, data]);

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
