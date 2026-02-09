import StatCard from '../components/StatCard.jsx';
import RecentOrders from '../components/RecentOrders.jsx';
import QuickActions from '../components/QuickActions.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import RevenueChart from '../components/RevenueChart.jsx';
import {
	UsersIcon,
	ProductIcon,
	OrderIcon,
	AnalyticsIcon,
} from '../../../shared/constants/icons.jsx';

import { useDashboardStats } from '../hooks/useDashboardStats.js';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';

const iconMap = {
	UsersIcon,
	ProductIcon,
	OrderIcon,
	AnalyticsIcon,
};

const AdminDashboardPage = () => {
	const { stats, recentOrders, isLoading, error } = useDashboardStats();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<LoadingSpinner size="lg" message="Loading dashboard data..." />
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100">
				<p className="text-red-600 font-medium">Failed to load dashboard statistics. Please try again later.</p>
			</div>
		);
	}

	// Map icons for display
	const displayStats = stats.map(stat => ({
		...stat,
		icon: iconMap[stat.icon] || AnalyticsIcon
	}));

	// Format orders for the component
	const formattedOrders = recentOrders.map(order => ({
		id: order._id.substring(0, 8),
		customer: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'Guest Customer',
		product: 'Review items', // Simplified for list
		amount: `$${order.totalPrice.amount.toLocaleString()}`,
		status: order.status,
		statusColor: 
			order.status === 'Delivered' ? 'success' : 
			order.status === 'Pending' ? 'warning' : 
			order.status === 'Cancelled' ? 'danger' : 'info'
	}));

	return (
		<div className="space-y-8">
			{/* Page Header */}
			<DashboardHeader 
				title="Welcome back, Admin! 👋"
				subtitle="Here's what's happening with your store today."
				role="Super Admin"
			/>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{displayStats.map((stat, index) => (
					<StatCard key={stat.id} stat={stat} index={index} />
				))}
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Sales Chart */}
				<RevenueChart />

				{/* Quick Actions */}
				<QuickActions />
			</div>

			<div className="grid grid-cols-1 gap-6">
				{/* Recent Orders */}
				<RecentOrders orders={formattedOrders} />
			</div>
		</div>
	);
};

export default AdminDashboardPage;
