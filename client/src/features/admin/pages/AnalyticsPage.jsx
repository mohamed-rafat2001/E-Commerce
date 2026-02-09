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

// Mock analytics data
const mockAnalytics = {
	revenue: {
		total: 248521.34,
		change: 18.7,
		chartData: [18200, 21100, 19800, 25200, 24800, 28100, 26800, 32200, 29800, 35100, 32500, 38900],
		byMonth: [
			{ month: 'Jan', revenue: 18200 },
			{ month: 'Feb', revenue: 21100 },
			{ month: 'Mar', revenue: 19800 },
			{ month: 'Apr', revenue: 25200 },
			{ month: 'May', revenue: 24800 },
			{ month: 'Jun', revenue: 28100 },
		],
	},
	orders: {
		total: 34182,
		change: 23.1,
		chartData: [2800, 3200, 2900, 3800, 3500, 4200, 3900, 4800, 4200, 5100, 4700, 5400],
	},
	users: {
		total: 12847,
		newThisMonth: 892,
		change: 12.5,
		byRole: [
			{ role: 'Customers', count: 11234, percentage: 87 },
			{ role: 'Sellers', count: 1589, percentage: 12 },
			{ role: 'Admins', count: 24, percentage: 1 },
		],
	},
	products: {
		total: 4523,
		active: 3892,
		outOfStock: 234,
	},
	topSellers: [
		{ name: 'TechStore Pro', sales: 15234, revenue: 482400, rating: 4.9 },
		{ name: 'FashionHub', sales: 12089, revenue: 356200, rating: 4.8 },
		{ name: 'HomeDecor Plus', sales: 9856, revenue: 289100, rating: 4.7 },
		{ name: 'GadgetWorld', sales: 8234, revenue: 245600, rating: 4.8 },
		{ name: 'SportZone', sales: 7123, revenue: 198400, rating: 4.6 },
	],
	topProducts: [
		{ name: 'Wireless Headphones Pro', sales: 2834, revenue: 424100 },
		{ name: 'Smart Watch Ultra', sales: 2156, revenue: 862400 },
		{ name: 'Laptop Stand Premium', sales: 1893, revenue: 151440 },
		{ name: 'Mechanical Keyboard', sales: 1672, revenue: 267520 },
		{ name: 'USB-C Hub Pro', sales: 1534, revenue: 122720 },
	],
	recentActivity: [
		{ type: 'order', message: 'New order #ORD-2024-156 placed', time: '5 mins ago', icon: StoreIcon },
		{ type: 'user', message: 'New seller registered: TechGuru', time: '15 mins ago', icon: FiUsers },
		{ type: 'product', message: 'Product "iPhone Case" out of stock', time: '1 hour ago', icon: ProductIcon },
		{ type: 'review', message: 'New 5-star review on "Smart Watch"', time: '2 hours ago', icon: FiStar },
		{ type: 'order', message: 'Order #ORD-2024-152 delivered', time: '3 hours ago', icon: StoreIcon },
	],
};

const AnalyticsPage = () => {
	const [timeRange, setTimeRange] = useState('month');
	const isLoading = false;
	const analytics = mockAnalytics;

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
							value="1,234"
							subtitle="Processing now"
							icon={OrderIcon}
							gradient="from-blue-500 to-indigo-600"
						/>
						<SmallStatCard
							title="Conversion Rate"
							value="3.2%"
							subtitle="+0.5% this week"
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
