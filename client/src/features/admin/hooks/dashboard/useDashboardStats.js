import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getAnalytics } from "../../services/adminService.js";

export const useDashboardStats = () => {
    const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery({
        queryKey: ["dashboardStats"],
        queryFn: getDashboardStats,
        refetchInterval: 60000,
    });

    const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
        queryKey: ["adminAnalytics"],
        queryFn: getAnalytics,
        refetchInterval: 300000, // 5 minutes
    });

    return {
        stats: statsData?.data?.stats || [],
        recentOrders: statsData?.data?.recentOrders || [],
        revenueTrend: analyticsData?.data?.revenueData || [],
        analyticsStats: analyticsData?.data?.stats || {},
        isLoading: statsLoading || analyticsLoading,
        error: statsError
    };
};
