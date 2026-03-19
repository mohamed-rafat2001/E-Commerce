import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReview, addReview } from "../services/review.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";

export default function useProductReviews(productId) {
    const [page, setPage] = useState(1);
    const limit = 5;

    const { data: response, isLoading: isFetching, error: fetchError } = useQuery({
        queryKey: ["reviews", productId, page],
        queryFn: () => getReview(productId, { params: { page, limit } }),
        enabled: !!productId,
        keepPreviousData: true
    });

    const reviewsData = response?.data?.data || [];
    const totalCount = response?.data?.results || 0;

    // Process reviews to calculate rating distribution if not provided by backend
    const reviews = Array.isArray(reviewsData) ? reviewsData : [];

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : 0;

    // Calculate the percentage for each star (1-5) based on the visible or total reviews
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => r.rating === star).length;
        const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
        return { star, count, percentage };
    });

    // Submitting new review
    const { mutateAsync: submitReview, isPending: isSubmitting, error: submitError } = useMutationFactory(
        (reviewData) => addReview(reviewData, productId),
        "reviews",
        { title: "Error submitting review", message: "Something went wrong." },
        { title: "Review submitted", message: "Thank you for your feedback!" }
    );

    return {
        reviews,
        totalCount,
        averageRating,
        ratingDistribution,
        page,
        setPage,
        totalPages: Math.ceil(totalCount / limit) || 1,
        isFetching,
        fetchError,
        submitReview,
        isSubmitting,
        submitError
    };
}
