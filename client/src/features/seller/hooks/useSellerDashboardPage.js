import { useQuery } from "@tanstack/react-query";
import { getSellerDashboardStats } from "../services/seller.js";

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

  // Enhanced mock data with realistic scenarios
  const generateMockData = () => {
    const baseProducts = [
      { id: 1, name: "Wireless Bluetooth Headphones", sales: 45, revenue: 2250, stock: 15 },
      { id: 2, name: "Smart Fitness Tracker", sales: 38, revenue: 1900, stock: 8 },
      { id: 3, name: "Portable Phone Charger", sales: 32, revenue: 1600, stock: 2 },
      { id: 4, name: "Ergonomic Office Chair", sales: 28, revenue: 2800, stock: 5 },
      { id: 5, name: "Stainless Steel Water Bottle", sales: 22, revenue: 660, stock: 0 }
    ];

    const baseOrders = [
      { id: "ORD-001", customer: "John Smith", amount: 250.99, status: "completed", date: "2024-01-15", items: 3 },
      { id: "ORD-002", customer: "Sarah Johnson", amount: 180.50, status: "pending", date: "2024-01-15", items: 2 },
      { id: "ORD-003", customer: "Mike Wilson", amount: 320.75, status: "shipped", date: "2024-01-14", items: 1 },
      { id: "ORD-004", customer: "Emily Davis", amount: 145.25, status: "processing", date: "2024-01-14", items: 4 },
      { id: "ORD-005", customer: "Robert Brown", amount: 89.99, status: "completed", date: "2024-01-13", items: 1 }
    ];

    // Simulate some dynamic data
    const lowStockItems = baseProducts.filter(p => p.stock <= 5).length;
    const pendingOrders = baseOrders.filter(o => o.status === "pending" || o.status === "processing").length;
    
    return {
      totalProducts: baseProducts.length,
      totalOrders: baseOrders.length * 12, // Simulate monthly orders
      totalRevenue: baseProducts.reduce((sum, p) => sum + p.revenue, 0) * 4, // Simulate monthly revenue
      pendingOrders: pendingOrders,
      lowStockItems: lowStockItems,
      recentOrders: baseOrders,
      topProducts: baseProducts.sort((a, b) => b.sales - a.sales),
      revenueTrend: [
        { month: "Jan", revenue: 8500 },
        { month: "Feb", revenue: 9200 },
        { month: "Mar", revenue: 11800 },
        { month: "Apr", revenue: 10500 },
        { month: "May", revenue: 12500 },
        { month: "Jun", revenue: 13200 }
      ],
      orderStats: {
        completed: baseOrders.filter(o => o.status === "completed").length * 8,
        pending: pendingOrders * 4,
        shipped: baseOrders.filter(o => o.status === "shipped").length * 6,
        cancelled: 3
      }
    };
  };

  const mockSellerStats = generateMockData();

  // Merge with API data if available
  const stats = {
    totalProducts: statsData?.data?.totalProducts || mockSellerStats.totalProducts,
    totalOrders: statsData?.data?.totalOrders || mockSellerStats.totalOrders,
    totalRevenue: statsData?.data?.totalRevenue || mockSellerStats.totalRevenue,
    pendingOrders: statsData?.data?.pendingOrders || mockSellerStats.pendingOrders,
    lowStockItems: statsData?.data?.lowStockItems || mockSellerStats.lowStockItems,
    recentOrders: statsData?.data?.recentOrders || mockSellerStats.recentOrders,
    topProducts: statsData?.data?.topProducts || mockSellerStats.topProducts,
    revenueTrend: statsData?.data?.revenueTrend || mockSellerStats.revenueTrend,
    orderStats: statsData?.data?.orderStats || mockSellerStats.orderStats
  };

  // Mock alerts data
  const alerts = [
    {
      title: "Low Stock Alert",
      message: "3 products are running low on inventory",
      type: "warning",
      action: { to: "/seller/inventory", label: "View Inventory" }
    },
    {
      title: "New Order",
      message: "You have 2 new orders to fulfill",
      type: "info",
      action: { to: "/seller/orders", label: "View Orders" }
    }
  ];

  // Mock products data
  const products = [
    { id: 1, name: "Product A", stock: 5, status: "active" },
    { id: 2, name: "Product B", stock: 0, status: "out_of_stock" },
    { id: 3, name: "Product C", stock: 12, status: "active" }
  ];

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
      icon: "ProductIcon",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      id: "totalOrders",
      title: "Total Orders",
      value: stats.totalOrders,
      change: "+8%",
      changeType: "positive",
      icon: "OrderIcon",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      id: "totalRevenue",
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "+15%",
      changeType: "positive",
      icon: "AnalyticsIcon",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      id: "lowStockItems",
      title: "Low Stock Items",
      value: stats.lowStockItems,
      change: "-2",
      changeType: "negative",
      icon: "InventoryIcon",
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