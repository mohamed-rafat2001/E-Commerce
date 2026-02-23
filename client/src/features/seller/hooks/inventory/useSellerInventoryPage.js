import useSellerProducts from '../products/useSellerProducts.js';
import useUpdateProduct from '../products/useUpdateProduct.js';

const useSellerInventoryPage = () => {
    // We rely on useSellerProducts to handle fetching with pagination/filtering
    const { products, total, totalPages, isLoading, refetch } = useSellerProducts();
    const { updateProduct, isUpdating } = useUpdateProduct();

    const handleUpdateStock = (id, stock) => {
        updateProduct({ id, product: { countInStock: stock } }, { 
            onSuccess: refetch 
        });
    };

    // Stats are limited with pagination
    // Ideally we should have a separate endpoint for stats
    const stats = {
        totalProducts: total || 0,
        inStockCount: 0, // Placeholder
        lowStockCount: 0,
        outOfStockCount: 0
    };

    return {
        products,
        filteredProducts: products, // Alias for component compatibility
        total,
        totalPages,
        isLoading,
        isUpdating,
        stats,
        handleUpdateStock,
        refetch
    };
};

export default useSellerInventoryPage;