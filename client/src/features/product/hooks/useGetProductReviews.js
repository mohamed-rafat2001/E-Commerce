import { useQuery } from "@tanstack/react-query";
import { getReview } from "../services/review";

const useGetProductReviews = (productId, params = {}) => {
    return useQuery({
        queryKey: ["product-reviews", productId, params],
        queryFn: () => getReview(productId, { params }),
        enabled: !!productId,
        select: (data) => data?.data || data,
    });
};

export default useGetProductReviews;
