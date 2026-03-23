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
            'price[gte]': searchParams.get('price[gte]') || '',
            'price[lte]': searchParams.get('price[lte]') || '',
            brandId: searchParams.get('brandId') || '',
            'ratingAverage[gte]': searchParams.get('ratingAverage[gte]') || '',
            subCategory: searchParams.get('subCategory') || '',
            page: parseInt(searchParams.get('page')) || 1,
            limit: parseInt(searchParams.get('limit')) || 6,
            inStock: searchParams.get('inStock') === 'true'
        };

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
        if (filters.subCategory) params.subCategory = filters.subCategory;
        if (filters.brandId) params.brandId = filters.brandId;
        if (filters['price[gte]']) params['price.amount[gte]'] = filters['price[gte]'];
        if (filters['price[lte]']) params['price.amount[lte]'] = filters['price[lte]'];
        if (filters['ratingAverage[gte]']) params['ratingAverage[gte]'] = filters['ratingAverage[gte]'];

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
