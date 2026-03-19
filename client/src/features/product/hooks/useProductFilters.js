import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export default function useProductFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Parse current filters from URL
    const filters = useMemo(() => {
        const parsed = {
            category: searchParams.get('category') || '',
            search: searchParams.get('search') || '',
            sort: searchParams.get('sort') || '-createdAt',
            minPrice: searchParams.get('price[gte]') || '',
            maxPrice: searchParams.get('price[lte]') || '',
            brand: searchParams.get('brandId') || '',
            rating: searchParams.get('ratingAverage[gte]') || '',
            page: parseInt(searchParams.get('page')) || 1,
            limit: parseInt(searchParams.get('limit')) || 12,
        };
        // Add boolean flags
        if (searchParams.get('sale') === 'true') parsed.sale = true;
        if (searchParams.get('inStock') === 'true') parsed.inStock = true;

        return parsed;
    }, [searchParams]);

    // Build the query object for the API
    const apiParams = useMemo(() => {
        const params = {
            page: filters.page,
            limit: filters.limit,
            sort: filters.sort,
        };

        if (filters.search) params.search = filters.search;
        if (filters.category) params.primaryCategory = filters.category;
        if (filters.brand) params.brandId = filters.brand;
        if (filters.minPrice) params['price.amount[gte]'] = filters.minPrice;
        if (filters.maxPrice) params['price.amount[lte]'] = filters.maxPrice;
        if (filters.rating) params['ratingAverage[gte]'] = filters.rating;

        // Sale and InStock are custom flags that might need specific backend handling
        // For standard Mongoose queries:
        if (filters.inStock) params['countInStock[gt]'] = 0;

        return params;
    }, [filters]);

    // Update specific filter
    const setFilter = useCallback((key, value) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);

            if (value === '' || value === null || value === undefined || value === false) {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }

            // Reset to page 1 whenever any filter aside from 'page' or 'sort' changes
            if (key !== 'page' && key !== 'sort') {
                newParams.delete('page');
            }

            return newParams;
        });
    }, [setSearchParams]);

    // Clear all product filters
    const clearFilters = useCallback(() => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams();
            // Preserve sort parameter if it exists
            if (prev.has('sort')) newParams.set('sort', prev.get('sort'));
            // Preserve limit parameter if it exists
            if (prev.has('limit')) newParams.set('limit', prev.get('limit'));
            return newParams;
        });
    }, [setSearchParams]);

    return {
        filters,
        apiParams,
        setFilter,
        clearFilters,
        hasActiveFilters: Array.from(searchParams.keys()).some(k => k !== 'page' && k !== 'sort' && k !== 'limit')
    };
}
