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
    const apiProducts = useMemo(() => responseData?.data || [], [responseData]);
    const makeId = (seed) => seed.toString(16).padStart(24, '0').slice(0, 24);
    const mockProducts = useMemo(() => {
        return Array.from({ length: 48 }, (_, index) => {
            const categoryId = makeId(2000 + (index % 8));
            const subCategoryId = makeId(4000 + (index % 16));
            const brandId = makeId(6000 + (index % 12));
            const priceAmount = 35 + index * 3;
            return {
                _id: makeId(10000 + index),
                id: makeId(10000 + index),
                isMock: true,
                name: `Curated Piece ${index + 1}`,
                price: { amount: priceAmount, oldAmount: priceAmount + 20 },
                coverImage: { secure_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80' },
                images: [{ secure_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80' }],
                primaryCategory: { _id: categoryId, name: `Category ${1 + (index % 8)}` },
                subCategory: { _id: subCategoryId, name: `Subcategory ${1 + (index % 16)}` },
                brandId: { _id: brandId, name: `Brand ${1 + (index % 12)}` },
                ratingAverage: 3.5 + ((index % 15) / 10),
                ratingCount: 12 + (index * 3),
                countInStock: index % 9 === 0 ? 0 : 20 + (index % 30)
            };
        });
    }, []);

    const mergedProducts = useMemo(() => {
        if (!Array.isArray(apiProducts) || apiProducts.length === 0) {
            return mockProducts;
        }
        if (apiProducts.length >= 18) {
            return apiProducts;
        }
        return [...apiProducts, ...mockProducts.slice(0, 18 - apiProducts.length)];
    }, [apiProducts, mockProducts]);

    const isUsingMock = Boolean(error) || !Array.isArray(apiProducts) || apiProducts.length === 0;
    const filteredMockProducts = useMemo(() => {
        if (!isUsingMock) return mergedProducts;
        const minPrice = Number(filters['price[gte]'] || 0);
        const maxPrice = Number(filters['price[lte]'] || Infinity);
        const minRating = Number(filters['ratingAverage[gte]'] || 0);
        const search = String(filters.search || '').trim().toLowerCase();
        return mergedProducts
            .filter((item) => !search || item.name.toLowerCase().includes(search))
            .filter((item) => !filters.category || item.primaryCategory?._id === filters.category)
            .filter((item) => !filters.subCategory || item.subCategory?._id === filters.subCategory)
            .filter((item) => !filters.brandId || item.brandId?._id === filters.brandId)
            .filter((item) => Number(item.price?.amount || 0) >= minPrice && Number(item.price?.amount || 0) <= maxPrice)
            .filter((item) => Number(item.ratingAverage || 0) >= minRating)
            .filter((item) => !filters.inStock || Number(item.countInStock || 0) > 0);
    }, [isUsingMock, mergedProducts, filters]);

    const effectiveTotalCount = isUsingMock ? filteredMockProducts.length : (responseData?.results || 0);
    const effectiveTotalPages = Math.max(1, Math.ceil(effectiveTotalCount / filters.limit));
    const start = (Math.min(filters.page, effectiveTotalPages) - 1) * filters.limit;
    const paginatedMockProducts = filteredMockProducts.slice(start, start + filters.limit);

    const products = isUsingMock ? paginatedMockProducts : apiProducts;
    const totalCount = isUsingMock ? effectiveTotalCount : (responseData?.results || 0);
    const totalPages = isUsingMock ? effectiveTotalPages : (responseData?.pagination?.numberOfPages || 1);

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
