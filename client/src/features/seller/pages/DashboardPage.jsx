import { Card, LoadingSpinner } from '../../../shared/ui/index.js';
import WelcomeHeader from '../components/dashboard/WelcomeHeader.jsx';
import AlertsBanner from '../components/dashboard/AlertsBanner.jsx';
import StatsGrid from '../components/dashboard/StatsGrid.jsx';
import PendingOrders from '../components/dashboard/PendingOrders.jsx';
import TopProducts from '../components/dashboard/TopProducts.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import { useSellerDashboardPage } from '../hooks/index.js';

const DashboardPage = () => {
	const {
		stats,
		statsArray,
		products,
		alerts,
		isLoading
	} = useSellerDashboardPage();

	return (
		<div className="space-y-8 pb-12">
			{/* Welcome Header */}
			<WelcomeHeader />

			{/* Stats/Quick Overview */}
			{isLoading ? (
				<Card variant="elevated" className="py-16">
					<div className="flex flex-col items-center justify-center">
						<LoadingSpinner size="lg" message="Loading your dashboard..." />
					</div>
				</Card>
			) : (
				<>
					{/* Alerts Banner */}
					<AlertsBanner alerts={alerts} />

					{/* Main Stats */}
					<StatsGrid statsArray={statsArray} />

					{/* Middle Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<PendingOrders orders={stats?.recentOrders || []} />
						<TopProducts products={products || stats?.topProducts || []} />
					</div>

					{/* Quick Actions */}
					<QuickActions />
				</>
			)}
		</div>
	);
};

export default DashboardPage;
