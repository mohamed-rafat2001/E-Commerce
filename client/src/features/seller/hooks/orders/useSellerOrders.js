import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getSellerOrders } from '../../../order/services/order.js';

export default function useSellerOrders() {
    const [searchParams] = useSearchParams();
    
    // Convert all search params to object
    const params = Object.fromEntries(searchParams.entries());
    
    // Ensure defaults
    if (!params.page) params.page = 1;
    if (!params.limit) params.limit = 10;
    if (!params.sort) params.sort = "-createdAt";

    const { 
        data: response, 
        isLoading, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ['seller-orders', params],
        queryFn: () => getSellerOrders(params),
        keepPreviousData: true,
    });

    const orders = response?.data?.data?.data || [];
    const total = response?.data?.data?.total || 0;
    const totalPages = Math.ceil(total / params.limit);

    return {
        orders,
        isLoading,
        error,
        refetch,
        total,
        totalPages
    };
}