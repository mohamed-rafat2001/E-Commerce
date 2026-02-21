import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../../../shared/ui/index.js';
import { FiDollarSign, FiShoppingBag, FiUsers, FiStar, FiCalendar, FiEye, FiShoppingCart } from 'react-icons/fi';
import { UsersIcon, ProductIcon, OrderIcon, StoreIcon } from '../../../shared/constants/icons.jsx';
import LargeStatCard from '../components/analytics/LargeStatCard.jsx';
import SmallStatCard from '../components/analytics/SmallStatCard.jsx';
import TopSellersCard from '../components/analytics/TopSellersCard.jsx';
import TopProductsCard from '../components/analytics/TopProductsCard.jsx';
import UserDistributionCard from '../components/analytics/UserDistributionCard.jsx';
import RecentActivityCard from '../components/analytics/RecentActivityCard.jsx';
import { useAdminAnalytics } from '../hooks/useAdminAnalytics';

const AnalyticsPage = () => {
	const [timeRange, setTimeRange] = useState('month');
	const {
		stats,
		revenueData,
		topProducts,
		topSellers,
		userGrowthData,
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
	}, [stats, revenueData, topProducts, topSellers, userGrowthData]);

	if (error) return <div className="text-red-500">Error loading analytics: {error.message}</div>;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Platform Analytics 📊</h1>
					<p className="text-gray-500 mt-1">Comprehensive overview of your e-commerce platform</p>
				</div>
				<select
					value={timeRange}
					onChange={(e) => setTimeRange(e.target.value)}
					className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				>
					<option value="week">Last 7 days</option>
					<option value="month">Last 30 days</option>
					<option value="quarter">Last 3 months</option>
					<option value="year">Last 12 months</option>
				</select>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-20">
					<LoadingSpinner />
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<LargeStatCard
							title="Total Revenue"
							value={`${(analytics.revenue.total / 1000).toFixed(1)}K`}
							change={analytics.revenue.change}
							icon={FiDollarSign}
							chartData={analytics.revenue.chartData}
							color="emerald"
							prefix="$"
						/>
						<LargeStatCard
							title="Total Orders"
							value={analytics.orders.total}
							change={analytics.orders.change}
							icon={FiShoppingBag}
							chartData={analytics.orders.chartData}
							color="indigo"
						/>
					</div>

					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						<SmallStatCard
							title="Total Users"
							value={analytics.users.total.toLocaleString()}
							subtitle={`+${analytics.users.change}% growth`}
							icon={UsersIcon}
							gradient="from-indigo-500 to-purple-600"
						/>
						<SmallStatCard
							title="Total Products"
							value={analytics.products.total.toLocaleString()}
							subtitle={`${analytics.products.active} active`}
							icon={ProductIcon}
							gradient="from-emerald-500 to-teal-600"
						/>
						<SmallStatCard
							title="Active Orders"
							value="0" // TODO: Add to API
							subtitle="Processing now"
							icon={OrderIcon}
							gradient="from-blue-500 to-indigo-600"
						/>
						<SmallStatCard
							title="Conversion Rate"
							value="0%"
							subtitle="+0% this week"
							icon={FiEye}
							gradient="from-pink-500 to-rose-600"
						/>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<TopSellersCard sellers={analytics.topSellers} />
						<TopProductsCard products={analytics.topProducts} />
						<div className="space-y-6">
							<UserDistributionCard users={analytics.users} />
							<RecentActivityCard activities={analytics.recentActivity} />
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default AnalyticsPage;
