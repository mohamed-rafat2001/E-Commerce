/* Pattern Summary:
Modeled after features/product/hooks/useProduct.js and features/home/hooks/useCategories.js.
Data fetching lives in dedicated feature hooks using useQuery with stable query keys,
and the hook normalizes API response shape for page-level consumption.
*/
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBrandById } from "../services/index.js";

export default function usePublicBrand(brandId) {
	const query = useQuery({
		queryKey: ["brands", "public", "detail", brandId],
		queryFn: () => getBrandById(brandId),
		enabled: Boolean(brandId),
	});

	const brand = useMemo(() => {
		const collection = query.data?.data?.data || [];
		return Array.isArray(collection) ? collection[0] || null : null;
	}, [query.data]);

	return {
		...query,
		brand,
	};
}
