/* Pattern Summary:
Modeled after features/product/hooks/useProductsPage.js and useProductFilters.js.
This hook keeps URL-driven filters with paginated product queries and maps sort options
to backend-compatible sort syntax while preserving shared query conventions.
*/
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBrandProducts } from "../services/index.js";

const sortMap = {
	newest: "-createdAt",
	priceLow: "price.amount",
	priceHigh: "-price.amount",
	popular: "-ratingAverage",
};

export default function usePublicBrandProducts({ brandId, category, subCategory, sort, page, limit = 12 }) {
	const requestParams = useMemo(() => {
		const params = {
			brandId,
			page,
			limit,
			sort: sortMap[sort] || sortMap.newest,
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

	const products = useMemo(() => query.data?.data?.data || [], [query.data]);
	const pagination = useMemo(() => query.data?.paginationResult || {}, [query.data]);

	return {
		...query,
		products,
		pagination,
	};
}
