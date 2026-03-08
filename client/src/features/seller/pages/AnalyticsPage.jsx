import { motion } from 'framer-motion';
import {
	PageHeader,
	Card,
	StatCard,
	Select,
	Skeleton,
	DataTable,
	Badge
} from '../../../shared/ui/index.js';
import {
	FiDollarSign,
	FiShoppingBag,
	FiUsers,
	FiTrendingUp,
	FiStar
} from 'react-icons/fi';
import { useSellerAnalyticsPage } from '../hooks/index.js';
import LargeStatCard from '../components/analytics/LargeStatCard.jsx';
import TopProductsCard from '../components/analytics/TopProductsCard.jsx';
import RecentSalesCard from '../components/analytics/RecentSalesCard.jsx';
import RatingCard from '../components/analytics/RatingCard.jsx';
import StatusBreakdownCard from '../components/analytics/StatusBreakdownCard.jsx';

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

const AnalyticsPage = () => {
	const {
		analytics,
		isLoading,
		timeRange,
		setTimeRange
	} = useSellerAnalyticsPage();

	const safeAnalytics = analytics || fallbackAnalytics;

	if (isLoading) {
		return (
			<div className="space-y-8">
				<Skeleton variant="text" className="w-1/3 h-10" />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Skeleton variant="card" className="h-64" />
					<Skeleton variant="card" className="h-64" />
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
					<Skeleton variant="card" count={4} />
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8 pb-10">
			<PageHeader
				title="Sales Analytics"
				subtitle="Comprehensive insights into your shop's performance and customer behavior."
				actions={
					<div className="min-w-[180px]">
						<Select
							value={timeRange}
							onChange={setTimeRange}
							options={[
								{ value: 'week', label: 'Last 7 days' },
								{ value: 'month', label: 'Last 30 days' },
								{ value: 'quarter', label: 'Last 3 months' },
								{ value: 'year', label: 'Last 12 months' },
							]}
							className="bg-white"
						/>
					</div>
				}
			/>

			{/* Main Graphs */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<LargeStatCard
					title="Revenue Performance"
					value={`$${(safeAnalytics.revenue.total || 0).toLocaleString()}`}
					change={safeAnalytics.revenue.change}
					icon={FiDollarSign}
					chartData={safeAnalytics.revenue.chartData}
					color="emerald"
				/>
				<LargeStatCard
					title="Order Volume"
					value={safeAnalytics.orders.total}
					change={safeAnalytics.orders.change}
					icon={FiShoppingBag}
					chartData={safeAnalytics.orders.chartData}
					color="indigo"
				/>
			</div>

			{/* Secondary KPIs */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Active Listings"
					value={safeAnalytics.products.active}
					icon={<FiShoppingBag />}
					color="success"
				/>
				<StatCard
					title="Total Customers"
					value={safeAnalytics.customers.total}
					icon={<FiUsers />}
					color="info"
				/>
				<StatCard
					title="Average Rating"
					value={safeAnalytics.rating.average}
					icon={<FiStar />}
					color="warning"
				/>
				<StatCard
					title="New Growth"
					value={`+${safeAnalytics.customers.new}`}
					icon={<FiTrendingUp />}
					color="primary"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<TopProductsCard products={safeAnalytics.topProducts || []} />
				</div>
				<div className="space-y-6">
					<RatingCard average={safeAnalytics.rating.average} count={safeAnalytics.rating.count} />
					{safeAnalytics.statusBreakdown && (
						<StatusBreakdownCard statusBreakdown={safeAnalytics.statusBreakdown} />
					)}
				</div>
			</div>

			<RecentSalesCard sales={safeAnalytics.recentSales || []} />
		</div>
	);
};

export default AnalyticsPage;
