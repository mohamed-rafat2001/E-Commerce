import { useQuery } from "@tanstack/react-query";
import { getSellerAnalytics } from "../services/seller.js";

const useSellerAnalyticsPage = (dateRange = 'month') => {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["sellerAnalytics", dateRange],
    queryFn: getSellerAnalytics,
    refetchInterval: 300000,
  });

  const data = response?.data?.data;

  // Transform data for the UI with proper fallbacks
  const analytics = data ? {
    revenue: {
      total: data.totalRevenue || 0,
      change: data.revenueTrend?.length >= 2 
        ? ((data.revenueTrend[data.revenueTrend.length - 1]?.revenue - data.revenueTrend[data.revenueTrend.length - 2]?.revenue) / 
           (data.revenueTrend[data.revenueTrend.length - 2]?.revenue || 1) * 100).toFixed(1)
        : 0,
      chartData: data.revenueTrend?.map(d => d.revenue) || [],
    },
    orders: {
      total: data.totalOrders || 0,
      change: data.revenueTrend?.length >= 2 
        ? ((data.revenueTrend[data.revenueTrend.length - 1]?.orders - data.revenueTrend[data.revenueTrend.length - 2]?.orders) /
           (data.revenueTrend[data.revenueTrend.length - 2]?.orders || 1) * 100).toFixed(1)
        : 0,
      chartData: data.revenueTrend?.map(d => d.orders) || [],
    },
    products: {
      total: data.totalProducts || 0,
      active: data.activeProducts || 0,
      draft: data.draftProducts || 0,
    },
    customers: {
      total: data.statusBreakdown
        ? Object.values(data.statusBreakdown).reduce((a, b) => a + b, 0) 
        : 0,
      returning: data.statusBreakdown?.Delivered || 0,
      new: data.statusBreakdown?.Pending || 0,
    },
    rating: {
      average: data.sellerRating?.average || 0,
      count: data.sellerRating?.count || 0,
    },
    statusBreakdown: data.statusBreakdown || {},
    topProducts: (data.topProducts || []).map(p => ({
      name: p.name,
      sales: p.sales,
      revenue: p.revenue,
      image: p.image || '📦'
    })),
    recentSales: (data.recentSales || []).map(s => ({
      date: formatTimeAgo(s.date),
      product: s.product,
      amount: s.amount,
      status: s.status
    })),
  } : null;

  return {
    analytics,
    isLoading,
    error,
    timeRange: dateRange,
  };
};

function formatTimeAgo(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

export default useSellerAnalyticsPage;