import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getMyProducts } from '../../../product/services/product.js';

export default function useSellerProducts() {
    const [searchParams] = useSearchParams();
    
    // Convert all search params to object
    const params = Object.fromEntries(searchParams.entries());

    // Map 'stock' filter to API params (for Inventory page)
    if (params.stock) {
        if (params.stock === 'out_of_stock') {
            params.countInStock = 0;
        } else if (params.stock === 'low_stock') {
            params.countInStock = { gt: 0, lte: 10 };
        } else if (params.stock === 'in_stock') {
            params.countInStock = { gt: 10 };
        }
        delete params.stock;
    }
    
    // Ensure defaults
    if (!params.page) params.page = 1;
    if (!params.limit) params.limit = 6;
    if (!params.sort) params.sort = "-createdAt";

    const { 
        data: response, 
        isLoading, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ['seller-products', params],
        queryFn: () => getMyProducts(params),
        keepPreviousData: true,
    });

    const products = response?.data?.data || [];
    const total = response?.data?.total || 0;
    const totalPages = Math.ceil(total / params.limit);

    return {
        products,
        isLoading,
        error,
        refetch,
        total,
        totalPages
    };
}
