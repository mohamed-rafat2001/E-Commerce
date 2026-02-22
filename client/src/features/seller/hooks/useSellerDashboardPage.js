import { useQuery } from "@tanstack/react-query";
import { getSellerDashboardStats } from "../services/seller.js";
import { ProductIcon, OrderIcon, AnalyticsIcon, InventoryIcon } from '../../../shared/constants/icons.jsx';

const useSellerDashboardPage = () => {
  // Get seller-specific dashboard stats with enhanced error handling
  const { 
    data: statsData, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ["sellerDashboardStats"],
    queryFn: getSellerDashboardStats,
    refetchInterval: 60000, // Refetch every minute
    retry: 2, // Retry failed requests twice
    retryDelay: 1000, // 1 second delay between retries
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 300000, // Cache data for 5 minutes
  });

  // Use only real API data
  const stats = {
    totalProducts: statsData?.data?.totalProducts || 0,
    totalOrders: statsData?.data?.totalOrders || 0,
    totalRevenue: statsData?.data?.totalRevenue || 0,
    pendingOrders: statsData?.data?.pendingOrders || 0,
    lowStockItems: statsData?.data?.lowStockItems || 0,
    recentOrders: statsData?.data?.recentOrders || [],
    topProducts: statsData?.data?.topProducts || [],
    revenueTrend: statsData?.data?.revenueTrend || [],
    orderStats: statsData?.data?.orderStats || {}
  };

  // Dynamic alerts based on real data
  const alerts = [];
  
  if (stats.lowStockItems > 0) {
    alerts.push({
      title: "Low Stock Alert",
      message: `${stats.lowStockItems} products are running low on inventory`,
      type: "warning",
      action: { to: "/seller/inventory", label: "View Inventory" }
    });
  }
  
  if (stats.pendingOrders > 0) {
    alerts.push({
      title: "New Order",
      message: `You have ${stats.pendingOrders} new orders to fulfill`,
      type: "info",
      action: { to: "/seller/orders", label: "View Orders" }
    });
  }

  // Use real products data from seller's inventory
  const products = stats.topProducts || [];

  // Enhanced error handling with user-friendly messages
  const error = statsError || statsData?.error;
  const errorMessage = error ? 
    (error.response?.data?.message || error.message || "Failed to load dashboard data") : 
    null;

  // Create stats array for mapping in the component
  const statsArray = [
    {
      id: "totalProducts",
      title: "Total Products",
      value: stats.totalProducts,
      change: "+12%",
      changeType: "positive",
      icon: ProductIcon,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      id: "totalOrders",
      title: "Total Orders",
      value: stats.totalOrders,
      change: "+8%",
      changeType: "positive",
      icon: OrderIcon,
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      id: "totalRevenue",
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "+15%",
      changeType: "positive",
      icon: AnalyticsIcon,
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      id: "lowStockItems",
      title: "Low Stock Items",
      value: stats.lowStockItems,
      change: "-2",
      changeType: "negative",
      icon: InventoryIcon,
      gradient: "from-amber-500 to-orange-600"
    }
  ];

  return {
    products,
    stats,
    statsArray,
    topProducts: stats.topProducts,
    pendingOrders: stats.recentOrders.filter(o => o.status === "pending" || o.status === "processing"),
    alerts,
    isLoading: statsLoading,
    error: errorMessage,
    refetch: refetchStats,
    isError: !!error
  };
};

export default useSellerDashboardPage;