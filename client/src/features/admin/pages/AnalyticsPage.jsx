import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
	AnalyticsIcon,
	UsersIcon,
	ProductIcon,
	OrderIcon 
} from '../../../shared/constants/icons.jsx';
import { LoadingSpinner } from '../../../shared/ui/index.js';
import { 
	FiTrendingUp, 
	FiTrendingDown, 
	FiDollarSign, 
	FiShoppingBag,
	FiUsers,
	FiStar,
	FiCalendar,
	FiArrowUpRight,
	FiArrowDownRight,
	FiEye,
	FiShoppingCart
} from 'react-icons/fi';

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
		{ type: 'order', message: 'New order #ORD-2024-156 placed', time: '5 mins ago', icon: FiShoppingCart },
		{ type: 'user', message: 'New seller registered: TechGuru', time: '15 mins ago', icon: FiUsers },
		{ type: 'product', message: 'Product "iPhone Case" out of stock', time: '1 hour ago', icon: ProductIcon },
		{ type: 'review', message: 'New 5-star review on "Smart Watch"', time: '2 hours ago', icon: FiStar },
		{ type: 'order', message: 'Order #ORD-2024-152 delivered', time: '3 hours ago', icon: FiShoppingCart },
	],
};

// Mini Bar Chart
const MiniBarChart = ({ data, color = 'indigo' }) => {
	const max = Math.max(...data);
	const colorClasses = {
		indigo: 'from-indigo-500 to-purple-600',
		emerald: 'from-emerald-500 to-teal-600',
		amber: 'from-amber-500 to-orange-500',
		rose: 'from-rose-500 to-pink-500',
	};

	return (
		<div className="flex items-end gap-1 h-20">
			{data.map((value, index) => (
				<motion.div
					key={index}
					initial={{ height: 0 }}
					animate={{ height: `${(value / max) * 100}%` }}
					transition={{ delay: index * 0.05, duration: 0.3 }}
					className={`flex-1 rounded-t-sm bg-gradient-to-t ${colorClasses[color]} opacity-80 hover:opacity-100 transition-opacity`}
				/>
			))}
		</div>
	);
};

// Large Stat Card with Chart
const LargeStatCard = ({ title, value, change, icon: Icon, chartData, color, prefix = '' }) => {
	const isPositive = change >= 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
		>
			<div className="flex items-start justify-between mb-4">
				<div>
					<p className="text-gray-500 text-sm font-medium">{title}</p>
					<h3 className="text-3xl font-bold text-gray-900 mt-1">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</h3>
					<div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
						{isPositive ? <FiArrowUpRight className="w-4 h-4" /> : <FiArrowDownRight className="w-4 h-4" />}
						<span>{isPositive ? '+' : ''}{change}% from last month</span>
					</div>
				</div>
				<div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center`}
					style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}>
					<Icon className="w-6 h-6 text-white" />
				</div>
			</div>
			{chartData && <MiniBarChart data={chartData} color={color} />}
		</motion.div>
	);
};

// Small Stat Card
const SmallStatCard = ({ title, value, subtitle, icon: Icon, gradient }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.95 }}
		animate={{ opacity: 1, scale: 1 }}
		className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
	>
		<div className="flex items-center gap-4">
			<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
				<Icon className="w-6 h-6 text-white" />
			</div>
			<div>
				<h4 className="text-2xl font-bold text-gray-900">{value}</h4>
				<p className="text-sm text-gray-500">{title}</p>
				{subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
			</div>
		</div>
	</motion.div>
);

// Top Sellers Card
const TopSellersCard = ({ sellers }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-6 border border-gray-100"
	>
		<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
			<FiStar className="w-5 h-5 text-amber-500" />
			Top Performing Sellers
		</h3>
		<div className="space-y-4">
			{sellers.map((seller, index) => (
				<motion.div
					key={seller.name}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.1 }}
					className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
				>
					<span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
					<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
						{seller.name[0]}
					</div>
					<div className="flex-1">
						<h4 className="font-medium text-gray-900">{seller.name}</h4>
						<div className="flex items-center gap-2 text-sm text-gray-500">
							<span>{seller.sales.toLocaleString()} sales</span>
							<span>•</span>
							<span className="flex items-center gap-1">
								<FiStar className="w-3 h-3 text-amber-500" />
								{seller.rating}
							</span>
						</div>
					</div>
					<div className="text-right">
						<span className="font-bold text-emerald-600">${(seller.revenue / 1000).toFixed(1)}K</span>
					</div>
				</motion.div>
			))}
		</div>
	</motion.div>
);

// Top Products Card
const TopProductsCard = ({ products }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-6 border border-gray-100"
	>
		<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
			<FiTrendingUp className="w-5 h-5 text-emerald-500" />
			Best Selling Products
		</h3>
		<div className="space-y-3">
			{products.map((product, index) => (
				<motion.div
					key={product.name}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.1 }}
					className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
				>
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
							{index + 1}
						</div>
						<div>
							<h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
							<p className="text-xs text-gray-500">{product.sales.toLocaleString()} sold</p>
						</div>
					</div>
					<span className="font-semibold text-gray-900">${(product.revenue / 1000).toFixed(1)}K</span>
				</motion.div>
			))}
		</div>
	</motion.div>
);

// User Distribution Card
const UserDistributionCard = ({ users }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-6 border border-gray-100"
	>
		<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
			<FiUsers className="w-5 h-5 text-indigo-500" />
			User Distribution
		</h3>
		<div className="space-y-4">
			{users.byRole.map((item, index) => (
				<div key={item.role}>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-700">{item.role}</span>
						<span className="text-sm text-gray-500">{item.count.toLocaleString()} ({item.percentage}%)</span>
					</div>
					<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${item.percentage}%` }}
							transition={{ delay: index * 0.2, duration: 0.5 }}
							className={`h-full rounded-full ${
								item.role === 'Customers' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
								item.role === 'Sellers' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
								'bg-gradient-to-r from-purple-500 to-pink-500'
							}`}
						/>
					</div>
				</div>
			))}
		</div>
		<div className="mt-4 pt-4 border-t border-gray-100">
			<div className="flex items-center justify-between">
				<span className="text-sm text-gray-500">New this month</span>
				<span className="text-lg font-bold text-emerald-600">+{users.newThisMonth}</span>
			</div>
		</div>
	</motion.div>
);

// Recent Activity Card
const RecentActivityCard = ({ activities }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-6 border border-gray-100"
	>
		<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
			<FiCalendar className="w-5 h-5 text-indigo-500" />
			Recent Activity
		</h3>
		<div className="space-y-3">
			{activities.map((activity, index) => {
				const ActivityIcon = activity.icon;
				return (
					<motion.div
						key={index}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.1 }}
						className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
					>
						<div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
							activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
							activity.type === 'user' ? 'bg-emerald-100 text-emerald-600' :
							activity.type === 'product' ? 'bg-amber-100 text-amber-600' :
							'bg-purple-100 text-purple-600'
						}`}>
							<ActivityIcon className="w-4 h-4" />
						</div>
						<div className="flex-1">
							<p className="text-sm text-gray-700">{activity.message}</p>
							<p className="text-xs text-gray-400">{activity.time}</p>
						</div>
					</motion.div>
				);
			})}
		</div>
	</motion.div>
);

// Main Analytics Page
const AnalyticsPage = () => {
	const [timeRange, setTimeRange] = useState('month');
	const isLoading = false;
	const analytics = mockAnalytics;

	return (
		<div className="space-y-6">
			{/* Page Header */}
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
					{/* Main Stats Grid */}
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

					{/* Secondary Stats */}
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

					{/* Lower Section - 3 columns */}
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
