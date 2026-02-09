import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
	AnalyticsIcon,
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
	FiCalendar
} from 'react-icons/fi';
import { useSellerAnalyticsPage } from '../hooks/index.js';

// Mock analytics data
const mockAnalytics = {
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

// Mini Chart Component (simplified bar chart)
const MiniBarChart = ({ data, color = 'indigo' }) => {
	const max = Math.max(...data);
	const colorClasses = {
		indigo: 'from-indigo-500 to-purple-600',
		emerald: 'from-emerald-500 to-teal-600',
		amber: 'from-amber-500 to-orange-500',
		rose: 'from-rose-500 to-red-500',
	};

	return (
		<div className="flex items-end gap-1 h-16">
			{data.map((value, index) => (
				<motion.div
					key={index}
					initial={{ height: 0 }}
					animate={{ height: `${(value / max) * 100}%` }}
					transition={{ delay: index * 0.05 }}
					className={`flex-1 rounded-t bg-gradient-to-t ${colorClasses[color]} opacity-80 hover:opacity-100 transition-opacity`}
				/>
			))}
		</div>
	);
};

// Large Stat Card Component
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
						{isPositive ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
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
const SmallStatCard = ({ title, value, icon: Icon, gradient }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.9 }}
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
			</div>
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
			<FiStar className="w-5 h-5 text-amber-500" />
			Top Performing Products
		</h3>
		<div className="space-y-4">
			{products.map((product, index) => (
				<motion.div
					key={product.name}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.1 }}
					className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
				>
					<span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
					<span className="text-2xl">{product.image}</span>
					<div className="flex-1">
						<h4 className="font-medium text-gray-900">{product.name}</h4>
						<p className="text-sm text-gray-500">{product.sales} sales</p>
					</div>
					<div className="text-right">
						<span className="font-bold text-emerald-600">${product.revenue.toLocaleString()}</span>
					</div>
				</motion.div>
			))}
		</div>
	</motion.div>
);

// Recent Sales Card
const RecentSalesCard = ({ sales }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl p-6 border border-gray-100"
	>
		<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
			<FiCalendar className="w-5 h-5 text-indigo-500" />
			Recent Sales
		</h3>
		<div className="space-y-3">
			{sales.map((sale, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.1 }}
					className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
				>
					<div>
						<h4 className="font-medium text-gray-900">{sale.product}</h4>
						<p className="text-sm text-gray-500">{sale.date}</p>
					</div>
					<span className="font-bold text-gray-900">+${sale.amount.toFixed(2)}</span>
				</motion.div>
			))}
		</div>
	</motion.div>
);

// Rating Card
const RatingCard = ({ average, count }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.9 }}
		animate={{ opacity: 1, scale: 1 }}
		className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white"
	>
		<div className="flex items-center gap-4">
			<div className="text-5xl font-bold">{average}</div>
			<div>
				<div className="flex gap-1 mb-1">
					{[1, 2, 3, 4, 5].map((star) => (
						<FiStar
							key={star}
							className={`w-5 h-5 ${star <= Math.round(average) ? 'fill-white' : 'stroke-white/50'}`}
						/>
					))}
				</div>
				<p className="text-white/80 text-sm">{count} reviews</p>
			</div>
		</div>
	</motion.div>
);

// Main Analytics Page
const AnalyticsPage = () => {
	const {
		timeRange,
		setTimeRange,
		analytics,
		isLoading
	} = useSellerAnalyticsPage();

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Sales Analytics 📈</h1>
					<p className="text-gray-500 mt-1">Track your store performance and insights</p>
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
							value={analytics.revenue.total.toFixed(2)}
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
							title="Total Products"
							value={analytics.products.total}
							icon={ProductIcon}
							gradient="from-violet-500 to-purple-600"
						/>
						<SmallStatCard
							title="Active Listings"
							value={analytics.products.active}
							icon={FiShoppingBag}
							gradient="from-emerald-500 to-teal-600"
						/>
						<SmallStatCard
							title="Total Customers"
							value={analytics.customers.total}
							icon={FiUsers}
							gradient="from-blue-500 to-indigo-600"
						/>
						<SmallStatCard
							title="Returning Customers"
							value={analytics.customers.returning}
							icon={FiUsers}
							gradient="from-pink-500 to-rose-600"
						/>
					</div>

					{/* Lower Section */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Top Products - Takes 2 columns */}
						<div className="lg:col-span-2">
							<TopProductsCard products={analytics.topProducts} />
						</div>

						{/* Right Column */}
						<div className="space-y-6">
							<RatingCard average={analytics.rating.average} count={analytics.rating.count} />
							<RecentSalesCard sales={analytics.recentSales} />
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default AnalyticsPage;