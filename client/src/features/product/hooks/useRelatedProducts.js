import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../services/product.js";

export default function useRelatedProducts(productId, categoryId) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["relatedProducts", categoryId, productId],
        queryFn: () => getAllProducts({
            primaryCategory: categoryId,
            limit: 6,
            // Provide a sort param or similar to get distinct items if backend isn't random
            sort: '-ratingAverage'
        }),
        enabled: !!categoryId,
    });

    // The backend might return the current product within the same category list
    // We must filter it out so we don't recommend the exact product they are viewing.
    const products = data?.data?.data || [];
    const relatedProducts = products.filter(p => p._id !== productId).slice(0, 4);

    return {
        relatedProducts,
        isLoading,
        error
    };
}
