import { useState, useMemo } from 'react';
import { useAdminAnalytics } from './useAdminAnalytics.js';

const useAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const {
    stats,
    revenueData,
    topProducts,
    topSellers,
    isLoading,
    error
  } = useAdminAnalytics(timeRange);

  const analytics = useMemo(() => {
    // Ensure defaults
    const safeStats = stats || {};
    const safeRevenueData = revenueData || [];
    const safeTopProducts = topProducts || [];
    const safeTopSellers = topSellers || [];
    const safeUsersByRole = safeStats.usersByRole || [];

    // Calculate total users from usersByRole if possible, or use stats.totalUsers
    const totalUsersFromRole = safeUsersByRole.reduce((acc, curr) => acc + curr.count, 0);
    const totalUsers = safeStats.totalUsers || totalUsersFromRole || 0;

    const byRole = safeUsersByRole.map(role => ({
      role: role._id,
      count: role.count,
      percentage: totalUsers > 0 ? Math.round((role.count / totalUsers) * 100) : 0
    }));

    return {
      revenue: {
        total: safeStats.totalRevenue || 0,
        change: 0,
        chartData: safeRevenueData.map(d => d.revenue),
        byMonth: [],
      },
      orders: {
        total: safeStats.totalOrders || 0,
        change: 0,
        chartData: safeRevenueData.map(d => d.orders),
      },
      users: {
        total: totalUsers,
        newThisMonth: 0,
        change: 0,
        byRole: byRole,
      },
      products: {
        total: safeStats.totalProducts || 0,
        active: safeStats.activeProducts || 0,
        outOfStock: safeStats.outOfStockProducts || 0,
      },
      topSellers: safeTopSellers.map(s => ({
        name: s.name,
        sales: s.sales,
        revenue: s.revenue,
        rating: 0 
      })),
      topProducts: safeTopProducts.map(p => ({
        name: p.name,
        sales: p.sales,
        revenue: p.revenue
      })),
      recentActivity: []
    };
  }, [stats, revenueData, topProducts, topSellers]);

  return {
    timeRange,
    setTimeRange,
    analytics,
    isLoading,
    error
  };
};

export default useAnalyticsPage;
