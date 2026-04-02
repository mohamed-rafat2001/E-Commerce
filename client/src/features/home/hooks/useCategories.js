import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
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

    const mockCategories = useMemo(() => {
        const makeId = (seed) => seed.toString(16).padStart(24, '0').slice(0, 24);
        return Array.from({ length: 14 }, (_, index) => {
            const categoryId = makeId(1000 + index);
            return {
                _id: categoryId,
                id: categoryId,
                name: [
                    'Streetwear',
                    'Luxury Fashion',
                    'Tech Essentials',
                    'Home Decor',
                    'Beauty Picks',
                    'Wellness',
                    'Outdoor Gear',
                    'Stationery',
                    'Jewelry',
                    'Footwear',
                    'Art & Craft',
                    'Gaming',
                    'Baby Care',
                    'Kitchen Pro'
                ][index] || `Category ${index + 1}`,
                slug: `category-${index + 1}`,
                subCategories: Array.from({ length: 4 }, (_, subIndex) => {
                    const subId = makeId(5000 + index * 10 + subIndex);
                    return {
                        _id: subId,
                        id: subId,
                        name: `Collection ${subIndex + 1}`
                    };
                })
            };
        });
    }, []);

    const apiCategories = useMemo(() => response?.data?.data || [], [response]);
    const categories = useMemo(() => {
        if (!Array.isArray(apiCategories) || apiCategories.length === 0) {
            return mockCategories;
        }
        if (apiCategories.length >= 10) {
            return apiCategories;
        }
        return [...apiCategories, ...mockCategories.slice(0, 10 - apiCategories.length)];
    }, [apiCategories, mockCategories]);

    return {
        categories,
        isLoading,
        error
    };
};

export default useCategories;
