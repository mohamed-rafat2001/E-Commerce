import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFunc } from '../../../shared/services/handlerFactory';

/**
 * Hook to manage flash sale state and countdown timer
 */
export const useFlashSale = () => {
    // Current time + 12 hours for the mock end time
    const [endTime] = useState(() => new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString());

    const { data: response, isLoading, error } = useQuery({
        queryKey: ['flash-sale-products'],
        queryFn: () => getFunc('products', { params: { 'price.discount': { gt: 0 }, limit: 6 } }),
        staleTime: 5 * 60 * 1000,
    });

    const products = response?.data?.data || [];

    return {
        products,
        isLoading,
        error,
        endTime
    };
};

export default useFlashSale;
