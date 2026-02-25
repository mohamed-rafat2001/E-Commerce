import { useQuery } from '@tanstack/react-query';
import { getFunc } from '../../../../shared/services/handlerFactory';

export function useStockCounts() {
    const fetchStockCounts = async () => {
        // Fetch all products to calculate counts
        const response = await getFunc('products/myproducts', { 
            params: { 
                limit: 1000, // Fetch all products
                sort: '-createdAt'
            } 
        });
        
        const products = response?.data?.data || [];
        
        const counts = {
            in_stock: 0,
            low_stock: 0,
            out_of_stock: 0
        };
        
        products.forEach(product => {
            const stock = product.countInStock || 0;
            if (stock === 0) {
                counts.out_of_stock++;
            } else if (stock > 0 && stock <= 10) {
                counts.low_stock++;
            } else if (stock > 10) {
                counts.in_stock++;
            }
        });
        
        return counts;
    };

    const { 
        data: stockCounts, 
        isLoading, 
        error,
        refetch 
    } = useQuery({
        queryKey: ['stock-counts'],
        queryFn: fetchStockCounts,
        staleTime: 30000, // Cache for 30 seconds
        refetchOnWindowFocus: false,
    });

    return {
        stockCounts,
        isLoading,
        error,
        refetch
    };
}