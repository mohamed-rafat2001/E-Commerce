import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAllProducts } from "../services/product.js";
import useProductFilters from "./useProductFilters.js";

export default function useProductsPage() {
    const { filters, apiParams, setFilter, clearFilters, hasActiveFilters } = useProductFilters();

    const { data, isLoading, error } = useQuery({
        queryKey: ["products", "public", apiParams],
        queryFn: () => getAllProducts(apiParams),
        keepPreviousData: true, // Keep showing old data while refreshing filters
    });

    const responseData = data?.data;
    const products = useMemo(
        () => (Array.isArray(responseData?.data) ? responseData.data : []),
        [responseData]
    );
    const totalCount = responseData?.total || responseData?.results || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / filters.limit));

    return {
        products,
        totalCount,
        totalPages,
        currentPage: filters.page,
        isLoading,
        error,
        filters,
        setFilter,
        clearFilters,
        hasActiveFilters
    };
}
