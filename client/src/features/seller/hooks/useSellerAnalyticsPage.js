import { useQuery } from "@tanstack/react-query";
import mainApi from "../../../api/mainApi";

// Mock analytics data for seller
const getSellerAnalyticsData = async (dateRange) => {
  // Simulate API call with mock data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockData = {
    stats: {
      totalRevenue: 12500,
      totalOrders: 156,
      totalProducts: 25,
      conversionRate: 3.2
    },
    revenueData: [
      { date: '2024-01-01', revenue: 800 },
      { date: '2024-01-02', revenue: 1200 },
      { date: '2024-01-03', revenue: 950 },
      { date: '2024-01-04', revenue: 1500 },
      { date: '2024-01-05', revenue: 1100 },
      { date: '2024-01-06', revenue: 1800 },
      { date: '2024-01-07', revenue: 2100 }
    ],
    topProducts: [
      { id: 1, name: 'Product A', sales: 45, revenue: 2250 },
      { id: 2, name: 'Product B', sales: 38, revenue: 1900 },
      { id: 3, name: 'Product C', sales: 32, revenue: 1600 },
      { id: 4, name: 'Product D', sales: 28, revenue: 1400 },
      { id: 5, name: 'Product E', sales: 22, revenue: 1100 }
    ],
    orderStatusData: [
      { status: 'Completed', count: 120 },
      { status: 'Pending', count: 12 },
      { status: 'Shipped', count: 18 },
      { status: 'Cancelled', count: 6 }
    ],
    performanceMetrics: {
      avgOrderValue: 80,
      customerRetention: 78,
      productReturnRate: 2.1
    }
  };

  return { data: mockData };
};

const useSellerAnalyticsPage = (dateRange = 'month') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sellerAnalytics", dateRange],
    queryFn: () => getSellerAnalyticsData(dateRange),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Transform data for the UI
  const analytics = {
    revenue: {
      total: data?.data?.stats?.totalRevenue || 0,
      change: 12.5, // Placeholder for actual calculation
      chartData: data?.data?.revenueData?.map(d => d.revenue) || [0, 0, 0, 0, 0, 0, 0],
    },
    orders: {
      total: data?.data?.stats?.totalOrders || 0,
      change: 8.2, // Placeholder
      chartData: data?.data?.orderStatusData?.map(d => d.count) || [0, 0, 0, 0],
    },
    products: {
      total: data?.data?.stats?.totalProducts || 0,
      active: data?.data?.stats?.totalProducts || 0,
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
    topProducts: data?.data?.topProducts || [],
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