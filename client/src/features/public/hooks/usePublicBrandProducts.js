import { useMemo } from "react";
import usePaginationLimit from "../../../shared/hooks/usePaginationLimit.js";
import { useQuery } from "@tanstack/react-query";
import { getBrandProducts } from "../services/index.js";

const sortMap = {
	newest: "-createdAt",
	priceLow: "price.amount",
	priceHigh: "-price.amount",
	popular: "-ratingAverage",
};

export default function usePublicBrandProducts({ brandId, category, subCategory, sort, page, limit: propLimit }) {
	const defaultLimit = usePaginationLimit('PUBLIC_PRODUCTS');
	const limit = propLimit || defaultLimit;
	const requestParams = useMemo(() => {
		const params = {
			brandId,
			page,
			limit,
			sort: sortMap[sort] || sortMap.newest,
			status: "active",
		};

		if (category) params.primaryCategory = category;
		if (subCategory) params.subCategory = subCategory;
		return params;
	}, [brandId, category, subCategory, sort, page, limit]);

	const query = useQuery({
		queryKey: ["products", "public", "brand", requestParams],
		queryFn: () => getBrandProducts(requestParams),
		enabled: Boolean(brandId),
		keepPreviousData: true,
	});

	// Response shape: axios wraps in { data: { status, results, total, data: [...] } }
	const apiData = useMemo(() => query.data?.data || {}, [query.data]);
	const products = useMemo(() => apiData.data || [], [apiData]);

	const total = apiData.total || 0;
	const currentPage = page || 1;
	const numberOfPages = Math.max(1, Math.ceil(total / limit));

	const pagination = useMemo(() => ({
		totalResults: total,
		currentPage,
		numberOfPages,
		limit,
	}), [total, currentPage, numberOfPages, limit]);

	return {
		...query,
		products,
		pagination,
	};
}
