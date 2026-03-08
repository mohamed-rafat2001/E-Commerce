import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getFunc } from '../../../shared/services/handlerFactory';

/**
 * Hook to fetch brands with infinite scroll duplication
 */
const useBrands = () => {
    const { data: response, isLoading, error } = useQuery({
        queryKey: ['home-brands'],
        queryFn: () => getFunc('brands'),
        staleTime: 60 * 60 * 1000,
    });

    const rawBrands = response?.data?.data || [];

    const duplicatedBrands = useMemo(() => {
        if (!rawBrands.length) return [];
        // Duplicate array to ensure smooth infinite ticker
        return [...rawBrands, ...rawBrands, ...rawBrands];
    }, [rawBrands]);

    return {
        brands: duplicatedBrands,
        originalBrands: rawBrands,
        isLoading,
        error
    };
};

export default useBrands;
