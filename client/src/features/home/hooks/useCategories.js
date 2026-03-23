import { useQuery } from '@tanstack/react-query';
import { getFunc } from '../../../shared/services/handlerFactory';

/**
 * Hook to fetch categories for the landing page
 */
const useCategories = () => {
    const { data: response, isLoading, error } = useQuery({
        queryKey: ['home-categories'],
        queryFn: () => getFunc('categories?populate=subCategories'),
        staleTime: 60 * 60 * 1000,
    });

    const categories = response?.data?.data || [];

    return {
        categories,
        isLoading,
        error
    };
};

export default useCategories;
