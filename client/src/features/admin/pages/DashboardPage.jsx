import RecentOrders from '../components/dashboard/RecentOrders.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import RevenueChart from '../components/dashboard/RevenueChart.jsx';
import StatsGrid from '../components/dashboard/StatsGrid.jsx';

import { useDashboardPage } from '../hooks/index.js';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';

const AdminDashboardPage = () => {
	const { stats, recentOrders, isLoading, error } = useDashboardPage();

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

	return (
		<div className="space-y-8">
			{/* Page Header */}
			<DashboardHeader 
				title="Welcome back, Admin! 👋"
				subtitle="Here's what's happening with your store today."
				role="Super Admin"
			/>

			{/* Stats Grid */}
			<StatsGrid stats={stats} />

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Sales Chart */}
				<RevenueChart />

				{/* Quick Actions */}
				<QuickActions />
			</div>

			<div className="grid grid-cols-1 gap-6">
				{/* Recent Orders */}
				<RecentOrders orders={recentOrders} />
			</div>
		</div>
	);
};

export default AdminDashboardPage;
