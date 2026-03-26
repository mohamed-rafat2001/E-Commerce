import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollowBrand, getFollowStatus, getFollowersCount } from "../services/index.js";
import toast from "react-hot-toast";

export default function useBrandFollow(brandId, isAuthenticated) {
    const queryClient = useQueryClient();

    // Get follow status (only for authenticated users)
    const statusQuery = useQuery({
        queryKey: ["brands", "follow", "status", brandId],
        queryFn: () => getFollowStatus(brandId),
        enabled: Boolean(brandId) && isAuthenticated,
        staleTime: 30000,
    });

    // Get followers count (public)
    const countQuery = useQuery({
        queryKey: ["brands", "followers", "count", brandId],
        queryFn: () => getFollowersCount(brandId),
        enabled: Boolean(brandId),
        staleTime: 30000,
    });

    // Toggle follow mutation
    const toggleMutation = useMutation({
        mutationFn: () => toggleFollowBrand(brandId),
        onMutate: async () => {
            // Optimistic update
            await queryClient.cancelQueries(["brands", "follow", "status", brandId]);
            await queryClient.cancelQueries(["brands", "followers", "count", brandId]);

            const previousStatus = queryClient.getQueryData(["brands", "follow", "status", brandId]);
            const previousCount = queryClient.getQueryData(["brands", "followers", "count", brandId]);

            const currentIsFollowing = previousStatus?.data?.data?.isFollowing;
            const currentCount = previousCount?.data?.data?.followersCount || 0;

            queryClient.setQueryData(["brands", "follow", "status", brandId], (old) => ({
                ...old,
                data: {
                    ...old?.data,
                    data: {
                        ...old?.data?.data,
                        isFollowing: !currentIsFollowing,
                    },
                },
            }));

            queryClient.setQueryData(["brands", "followers", "count", brandId], (old) => ({
                ...old,
                data: {
                    ...old?.data,
                    data: {
                        ...old?.data?.data,
                        followersCount: currentIsFollowing ? currentCount - 1 : currentCount + 1,
                    },
                },
            }));

            return { previousStatus, previousCount };
        },
        onError: (err, _, context) => {
            // Rollback on error
            if (context?.previousStatus) {
                queryClient.setQueryData(["brands", "follow", "status", brandId], context.previousStatus);
            }
            if (context?.previousCount) {
                queryClient.setQueryData(["brands", "followers", "count", brandId], context.previousCount);
            }
            toast.error("Failed to update follow status");
        },
        onSettled: () => {
            queryClient.invalidateQueries(["brands", "follow", "status", brandId]);
            queryClient.invalidateQueries(["brands", "followers", "count", brandId]);
        },
    });

    const isFollowing = useMemo(
        () => statusQuery.data?.data?.data?.isFollowing || false,
        [statusQuery.data]
    );

    const followersCount = useMemo(
        () => countQuery.data?.data?.data?.followersCount || 0,
        [countQuery.data]
    );

    return {
        isFollowing,
        followersCount,
        isLoading: statusQuery.isLoading || countQuery.isLoading,
        toggleFollow: toggleMutation.mutate,
        isToggling: toggleMutation.isPending,
    };
}
