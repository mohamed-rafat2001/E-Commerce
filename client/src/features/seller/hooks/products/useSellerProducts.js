import useProducts from '../../../product/hooks/useProducts.js';
import { getMyProducts } from '../../../product/services/product.js';

export default function useSellerProducts() {
    return useProducts({
        queryFn: getMyProducts,
        queryKey: ['seller-products']
    });
}
