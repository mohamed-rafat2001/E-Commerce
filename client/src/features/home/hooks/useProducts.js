import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getFunc } from '../../../shared/services/handlerFactory';
import { addToCart } from '../../cart/services/cart';
import useToast from '../../../shared/hooks/useToast';

/**
 * Hook to fetch latest products for the landing page
 */
const useProducts = () => {
    const { showSuccess, showError } = useToast();

    const { data: response, isLoading, error, refetch } = useQuery({
        queryKey: ['latest-products'],
        queryFn: () => getFunc('products', { params: { sort: '-createdAt', limit: 8 } }),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const products = response?.data?.data || [];

    const handleAddToCart = useCallback(async (product) => {
        try {
            await addToCart({ productId: product._id, quantity: 1 });
            showSuccess(`${product.name} added to cart!`);
        } catch (err) {
            showError('Failed to add to cart. Please try again.');
        }
    }, [showSuccess, showError]);

    return {
        products,
        isLoading,
        error,
        refetch,
        handleAddToCart
    };
};

export default useProducts;
