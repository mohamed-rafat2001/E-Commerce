import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../services/product';

/**
 * Hook to fetch product details by ID
 */
export const useProductDetail = (id) => {
    const { data: response, isLoading, error } = useQuery({
        queryKey: ['product-detail', id],
        queryFn: () => getProduct(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });

    return {
        product: response?.data?.data || null,
        isLoading,
        error
    };
};

export default useProductDetail;
