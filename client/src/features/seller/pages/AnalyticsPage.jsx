import { motion } from 'framer-motion';
import { 
	ProductIcon
} from '../../../shared/constants/icons.jsx';
import { LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { 
	FiDollarSign, 
	FiShoppingBag,
	FiUsers
} from 'react-icons/fi';
import { useSellerAnalyticsPage } from '../hooks/index.js';
import LargeStatCard from '../components/analytics/LargeStatCard.jsx';
import SmallStatCard from '../components/analytics/SmallStatCard.jsx';
import StatusBreakdownCard from '../components/analytics/StatusBreakdownCard.jsx';
import TopProductsCard from '../components/analytics/TopProductsCard.jsx';
import RecentSalesCard from '../components/analytics/RecentSalesCard.jsx';
import RatingCard from '../components/analytics/RatingCard.jsx';

// Fallback analytics data
const fallbackAnalytics = {
	revenue: {
		total: 48521.34,
		change: 23.5,
		chartData: [3200, 4100, 3800, 5200, 4800, 6100, 5800, 7200, 6800, 8100, 7500, 8900],
	},
	orders: {
		total: 156,
		change: 12.3,
		chartData: [12, 18, 15, 22, 19, 25, 21, 28, 24, 31, 27, 34],
	},
	products: {
		total: 42,
		active: 38,
		draft: 4,
	},
	customers: {
		total: 89,
		returning: 45,
		new: 44,
	},
	rating: {
		average: 4.7,
		count: 234,
	},
	statusBreakdown: {
		Pending: 8,
		Processing: 12,
		Shipped: 25,
		Delivered: 89,
		Cancelled: 3,
	},
	topProducts: [
		{ name: 'Wireless Headphones', sales: 234, revenue: 8424, image: '🎧' },
		{ name: 'Smart Watch Pro', sales: 189, revenue: 18900, image: '⌚' },
		{ name: 'Laptop Stand', sales: 156, revenue: 4680, image: '💻' },
		{ name: 'Mechanical Keyboard', sales: 142, revenue: 14200, image: '⌨️' },
		{ name: 'USB-C Hub', sales: 128, revenue: 3840, image: '🔌' },
	],
	recentSales: [
		{ date: '2 hours ago', product: 'Wireless Headphones', amount: 149.99 },
		{ date: '5 hours ago', product: 'Smart Watch', amount: 299.99 },
		{ date: '8 hours ago', product: 'Phone Case', amount: 29.99 },
		{ date: '12 hours ago', product: 'Laptop Stand', amount: 79.99 },
		{ date: '1 day ago', product: 'USB-C Hub', amount: 49.99 },
	],
};

// Main Analytics Page
const AnalyticsPage = () => {
	const {
		analytics,
		isLoading,
		timeRange,
		setTimeRange
	} = useSellerAnalyticsPage();

	const safeAnalytics = analytics || fallbackAnalytics;

	return (
		<div className="space-y-6 pb-10">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">Sales Analytics 📈</h1>
					<p className="text-gray-500 font-medium mt-1">Track your store performance and insights</p>
				</motion.div>
				<div className="min-w-[200px]">
					<Select
						value={timeRange}
						onChange={setTimeRange}
						options={[
							{ value: 'week', label: 'Last 7 days' },
							{ value: 'month', label: 'Last 30 days' },
							{ value: 'quarter', label: 'Last 3 months' },
							{ value: 'year', label: 'Last 12 months' },
						]}
					/>
				</div>
			</div>

			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
					<LoadingSpinner size="lg" color="indigo" />
					<p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Loading Analytics...</p>
				</div>
			) : (
				<>
					{/* Main Stats Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<LargeStatCard
							title="Total Revenue"
							value={typeof safeAnalytics.revenue.total === 'number' ? safeAnalytics.revenue.total.toFixed(2) : safeAnalytics.revenue.total}
							change={safeAnalytics.revenue.change}
							icon={FiDollarSign}
							chartData={safeAnalytics.revenue.chartData}
							color="emerald"
							prefix="$"
						/>
						<LargeStatCard
							title="Total Orders"
							value={safeAnalytics.orders.total}
							change={safeAnalytics.orders.change}
							icon={FiShoppingBag}
							chartData={safeAnalytics.orders.chartData}
							color="indigo"
						/>
					</div>

					{/* Secondary Stats */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						<SmallStatCard
							title="Total Products"
							value={safeAnalytics.products.total}
							icon={ProductIcon}
							gradient="from-violet-500 to-purple-600"
						/>
						<SmallStatCard
							title="Active Listings"
							value={safeAnalytics.products.active}
							icon={FiShoppingBag}
							gradient="from-emerald-500 to-teal-600"
						/>
						<SmallStatCard
							title="Total Customers"
							value={safeAnalytics.customers.total}
							icon={FiUsers}
							gradient="from-blue-500 to-indigo-600"
						/>
						<SmallStatCard
							title="Draft Products"
							value={safeAnalytics.products.draft}
							icon={ProductIcon}
							gradient="from-gray-500 to-slate-600"
						/>
					</div>

					{/* Lower Section */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Top Products */}
						<div className="lg:col-span-2">
							<TopProductsCard products={safeAnalytics.topProducts || []} />
						</div>

						{/* Right Column */}
						<div className="space-y-6">
							<RatingCard average={safeAnalytics.rating.average} count={safeAnalytics.rating.count} />
							{safeAnalytics.statusBreakdown && (
								<StatusBreakdownCard statusBreakdown={safeAnalytics.statusBreakdown} />
							)}
						</div>
					</div>

					{/* Recent Sales */}
					<RecentSalesCard sales={safeAnalytics.recentSales || []} />
				</>
			)}
		</div>
	);
};

export default AnalyticsPage;
