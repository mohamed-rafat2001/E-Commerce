import { useQuery } from "@tanstack/react-query";
import { getAdminAnalytics } from "../services/admin";

export const useAdminAnalytics = (dateRange) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminAnalytics", dateRange],
    queryFn: () => getAdminAnalytics(dateRange),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // data is the axios response object
  const analyticsData = data?.data || {};

  return {
    stats: analyticsData.stats || {},
    revenueData: analyticsData.revenueData || [],
    topProducts: analyticsData.topProducts || [],
    topSellers: analyticsData.topSellers || [],
    userGrowthData: analyticsData.userGrowthData || [],
    isLoading,
    error
  };
};
