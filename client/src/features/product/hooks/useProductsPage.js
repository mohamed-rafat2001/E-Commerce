import { useQuery } from "@tanstack/react-query";
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
    const products = responseData?.data || [];
    const pagination = responseData?.pagination || {};

    const totalCount = responseData?.results || 0;
    const totalPages = pagination.numberOfPages || 1;

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
