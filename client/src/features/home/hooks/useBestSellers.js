import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFunc } from '../../../shared/services/handlerFactory';

/**
 * Hook to manage best sellers data and category filtering logic
 */
export const useBestSellers = () => {
    const { data: response, isLoading, error } = useQuery({
        queryKey: ['best-sellers-products'],
        queryFn: () => getFunc('products', { params: { sort: '-ratingsAverage', limit: 12 } }),
        staleTime: 5 * 60 * 1000,
    });

    const products = useMemo(() => {
        return response?.data?.data || [];
    }, [response]);

    return {
        products,
        isLoading,
        error,
    };
};

export default useBestSellers;
