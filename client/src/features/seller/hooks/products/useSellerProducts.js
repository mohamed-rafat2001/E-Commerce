import useProducts from '../../../product/hooks/useProducts.js';
import { getMyProducts } from '../../../product/services/product.js';

export default function useSellerProducts(params = {}) {
    return useProducts({
        queryFn: () => getMyProducts(params),
        queryKey: ['seller-products', params]
    });
}
