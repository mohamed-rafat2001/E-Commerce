import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../services/adminService.js";

export const useDashboardStats = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboardStats"],
        queryFn: getDashboardStats,
        refetchInterval: 60000, // Refetch every minute
    });

    return {
        stats: data?.data?.stats || [],
        recentOrders: data?.data?.recentOrders || [],
        isLoading,
        error
    };
};
