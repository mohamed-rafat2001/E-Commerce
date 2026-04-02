import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
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

    const mockProducts = useMemo(() => {
        const makeId = (seed) => seed.toString(16).padStart(24, '0').slice(0, 24);
        return Array.from({ length: 18 }, (_, index) => {
            const id = makeId(12000 + index);
            const price = 59 + index * 7;
            return {
                _id: id,
                id,
                isMock: true,
                name: [
                    'Minimal Leather Tote',
                    'Premium Oversized Hoodie',
                    'Wireless Desk Lamp',
                    'Sculpted Ceramic Vase',
                    'Noise-Canceling Headset',
                    'Retro Analog Watch',
                    'Collector Sneakers',
                    'Modern Travel Backpack',
                    'Studio Keyboard',
                    'Pure Cotton Shirt',
                    'Smart Home Hub',
                    'Designer Sunglasses',
                    'Nordic Chair',
                    'Performance Running Shoe',
                    'Professional Microphone',
                    'Linen Bedding Set',
                    'Metal Water Bottle',
                    'Portable Power Bank'
                ][index] || `Featured Product ${index + 1}`,
                price: { amount: price },
                originalPrice: price + 25,
                images: [{ secure_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' }],
                coverImage: { secure_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' }
            };
        });
    }, []);

    const apiProducts = useMemo(() => response?.data?.data || [], [response]);
    const products = useMemo(() => {
        if (!Array.isArray(apiProducts) || apiProducts.length === 0) {
            return mockProducts;
        }
        if (apiProducts.length >= 8) {
            return apiProducts;
        }
        return [...apiProducts, ...mockProducts.slice(0, 8 - apiProducts.length)];
    }, [apiProducts, mockProducts]);

    const handleAddToCart = useCallback(async (product) => {
        try {
            if (product?.isMock) {
                showSuccess(`${product.name} added to cart!`);
                return;
            }
            await addToCart({ productId: product._id, quantity: 1 });
            showSuccess(`${product.name} added to cart!`);
        } catch {
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
