import { useQuery } from "@tanstack/react-query";
import { getSellerAnalytics } from "../services/seller.js";

const useSellerAnalyticsPage = (dateRange = 'month') => {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["sellerAnalytics", dateRange],
    queryFn: getSellerAnalytics,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const data = response?.data?.data;

  // Transform data for the UI
  const analytics = {
    revenue: {
      total: data?.totalRevenue || 0,
      change: 12.5, // Placeholder for actual calculation
      chartData: data?.revenueTrend?.map(d => d.revenue) || [0, 0, 0, 0, 0, 0, 0],
    },
    orders: {
      total: data?.totalOrders || 0,
      change: 8.2, // Placeholder
      chartData: data?.revenueTrend?.map(d => d.revenue > 0 ? Math.floor(d.revenue / 50) : 0) || [0, 0, 0, 0], // Simple mock for orders trend
    },
    products: {
      total: data?.totalProducts || 0,
      active: data?.totalProducts || 0,
      draft: 0,
    },
    customers: {
      total: 89, // Placeholder
      returning: 45, // Placeholder
      new: 44, // Placeholder
    },
    rating: {
      average: 4.7, // Placeholder
      count: 234, // Placeholder
    },
    topProducts: data?.topProducts || [],
    recentSales: [
      { date: '2 hours ago', product: 'Wireless Headphones', amount: 149.99 },
      { date: '5 hours ago', product: 'Smart Watch', amount: 299.99 },
    ], // Placeholder
  };

  return {
    analytics,
    isLoading,
    error,
    timeRange: dateRange,
  };
};

export default useSellerAnalyticsPage;