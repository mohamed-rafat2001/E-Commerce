import { motion } from 'framer-motion';
import { LoadingSpinner } from '../../../shared/ui/index.js';
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
		<div className="space-y-6 pb-10">
			{/* Welcome Header */}
			<WelcomeHeader />

			{/* Stats/Quick Overview */}
			{isLoading ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100"
					style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
				>
					<div className="relative">
						<LoadingSpinner size="lg" color="indigo" />
						<div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl opacity-30 animate-pulse" />
					</div>
					<p className="mt-6 font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">Loading Dashboard...</p>
				</motion.div>
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
