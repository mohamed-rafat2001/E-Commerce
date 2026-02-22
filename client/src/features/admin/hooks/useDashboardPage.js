import { useDashboardStats } from './index.js';
import {
  UsersIcon,
  ProductIcon,
  OrderIcon,
  AnalyticsIcon,
  TagIcon,
} from '../../../shared/constants/icons.jsx';

const iconMap = {
  UsersIcon,
  ProductIcon,
  OrderIcon,
  AnalyticsIcon,
  TagIcon,
};

const useDashboardPage = () => {
  const { stats, recentOrders, isLoading, error } = useDashboardStats();

  // Map icons for display
  const displayStats = stats ? stats.map(stat => ({
    ...stat,
    icon: iconMap[stat.icon] || AnalyticsIcon
  })) : [];

  // Format orders for the component
  const formattedOrders = recentOrders ? recentOrders.map(order => ({
    id: order._id.substring(0, 8),
    customer: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'Guest Customer',
    product: 'Review items', // Simplified for list
    amount: `$${order.totalPrice.amount.toLocaleString()}`,
    status: order.status,
    statusColor: 
      order.status === 'Delivered' ? 'success' : 
      order.status === 'Pending' ? 'warning' : 
      order.status === 'Cancelled' ? 'danger' : 'info'
  })) : [];

  return {
    stats: displayStats,
    recentOrders: formattedOrders,
    isLoading,
    error
  };
};

export default useDashboardPage;
