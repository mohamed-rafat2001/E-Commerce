import { useQuery } from "@tanstack/react-query";
import mainApi from "../../../api/mainApi";

// Mock analytics data since there's no specific analytics endpoint
// In a real application, you would have specific API endpoints for analytics
const getAnalyticsData = async (dateRange) => {
  // Simulate API call with mock data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockData = {
    stats: {
      totalRevenue: 125000,
      totalOrders: 1250,
      totalUsers: 8900,
      totalProducts: 450
    },
    revenueData: [
      { date: '2024-01-01', revenue: 12000 },
      { date: '2024-01-02', revenue: 15000 },
      { date: '2024-01-03', revenue: 18000 },
      { date: '2024-01-04', revenue: 14000 },
      { date: '2024-01-05', revenue: 16000 },
      { date: '2024-01-06', revenue: 19000 },
      { date: '2024-01-07', revenue: 21000 }
    ],
    topProducts: [
      { id: 1, name: 'Product A', sales: 150, revenue: 7500 },
      { id: 2, name: 'Product B', sales: 120, revenue: 6000 },
      { id: 3, name: 'Product C', sales: 95, revenue: 4750 },
      { id: 4, name: 'Product D', sales: 80, revenue: 4000 },
      { id: 5, name: 'Product E', sales: 65, revenue: 3250 }
    ],
    topSellers: [
      { id: 1, name: 'Seller A', sales: 250, revenue: 12500 },
      { id: 2, name: 'Seller B', sales: 200, revenue: 10000 },
      { id: 3, name: 'Seller C', sales: 180, revenue: 9000 },
      { id: 4, name: 'Seller D', sales: 150, revenue: 7500 },
      { id: 5, name: 'Seller E', sales: 120, revenue: 6000 }
    ],
    userGrowthData: [
      { month: 'Jan', users: 1200 },
      { month: 'Feb', users: 1350 },
      { month: 'Mar', users: 1500 },
      { month: 'Apr', users: 1700 },
      { month: 'May', users: 1900 },
      { month: 'Jun', users: 2100 }
    ]
  };

  return { data: mockData };
};

export const useAdminAnalytics = (dateRange) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminAnalytics", dateRange],
    queryFn: () => getAnalyticsData(dateRange),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  return {
    stats: data?.data?.stats || {},
    revenueData: data?.data?.revenueData || [],
    topProducts: data?.data?.topProducts || [],
    topSellers: data?.data?.topSellers || [],
    userGrowthData: data?.data?.userGrowthData || [],
    isLoading,
    error
  };
};