import { useQuery } from '@tanstack/react-query';
import { getFunc } from '../../../shared/services/handlerFactory';

/**
 * Hook to fetch featured products for the landing page
 */
const useFeaturedProducts = () => {
    const { data: response, isLoading, error } = useQuery({
        queryKey: ['featured-products'],
        queryFn: () => getFunc('products', { params: { isFeatured: true, limit: 5 } }),
        staleTime: 10 * 60 * 1000,
    });

    const featuredProducts = response?.data?.data || [];

    return {
        featuredProducts,
        isLoading,
        error
    };
};

export default useFeaturedProducts;
