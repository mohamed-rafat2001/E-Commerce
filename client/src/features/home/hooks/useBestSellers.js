import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFunc } from '../../../shared/services/handlerFactory';

/**
 * Hook to manage best sellers data and category filtering logic
 */
export const useBestSellers = () => {
    const [activeTab, setActiveTab] = useState("All");

    const { data: response, isLoading, error } = useQuery({
        queryKey: ['best-sellers-products'],
        queryFn: () => getFunc('products', { params: { sort: '-ratingsAverage', limit: 12 } }),
        staleTime: 5 * 60 * 1000,
    });

    const products = useMemo(() => {
        return response?.data?.data || [];
    }, [response]);

    const filteredProducts = useMemo(() => {
        if (activeTab === "All") return products;
        return products.filter(p => {
            const categoryName = p.category?.name || p.category || "";
            return String(categoryName).toLowerCase().includes(activeTab.toLowerCase());
        });
    }, [products, activeTab]);

    return {
        products,
        filteredProducts,
        isLoading,
        error,
        activeTab,
        setActiveTab,
    };
};

export default useBestSellers;
