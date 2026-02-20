import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
	ProductIcon
} from '../../../shared/constants/icons.jsx';
import { LoadingSpinner, Select } from '../../../shared/ui/index.js';
import { 
	FiTrendingUp, 
	FiTrendingDown, 
	FiDollarSign, 
	FiShoppingBag,
	FiUsers,
	FiStar,
	FiCalendar,
	FiAlertTriangle,
	FiPackage,
	FiTruck,
	FiCheck,
	FiClock
} from 'react-icons/fi';
import { useSellerAnalyticsPage } from '../hooks/index.js';

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

// Mini Chart Component
const MiniBarChart = ({ data, color = 'indigo' }) => {
	if (!data || data.length === 0) {
		return (
			<div className="flex items-end gap-1 h-16 opacity-30">
				{[...Array(12)].map((_, i) => (
					<div key={i} className="flex-1 h-2 rounded-t bg-gray-200" />
				))}
			</div>
		);
	}
	
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
					className={`flex-1 rounded-t bg-gradient-to-t ${colorClasses[color]} opacity-80 hover:opacity-100 transition-opacity min-h-[2px]`}
				/>
			))}
		</div>
	);
};

// Large Stat Card
const LargeStatCard = ({ title, value, change, icon: Icon, chartData, color, prefix = '' }) => {
	const isPositive = Number(change) >= 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
		>
			<div className="flex items-start justify-between mb-4">
				<div>
					<p className="text-gray-500 text-sm font-medium">{title}</p>
					<h3 className="text-3xl font-black text-gray-900 mt-1">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</h3>
					<div className={`flex items-center gap-1 mt-2 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
						{isPositive ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
						<span>{isPositive ? '+' : ''}{change}% from last month</span>
					</div>
				</div>
				<div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
					color === 'emerald' ? 'from-emerald-500 to-teal-600' :
					color === 'indigo' ? 'from-indigo-500 to-purple-600' :
					color === 'amber' ? 'from-amber-500 to-orange-500' :
					'from-rose-500 to-red-500'
				}`}>
					{Icon && <Icon className="w-6 h-6 text-white" />}
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
				{Icon && <Icon className="w-6 h-6 text-white" />}
			</div>
			<div>
				<h4 className="text-2xl font-bold text-gray-900">{value}</h4>
				<p className="text-sm text-gray-500">{title}</p>
			</div>
		</div>
	</motion.div>
);

// Order Status Breakdown
const StatusBreakdownCard = ({ statusBreakdown }) => {
	const total = Object.values(statusBreakdown).reduce((a, b) => a + b, 0) || 1;
	const statusConfig = [
		{ key: 'Pending', color: 'bg-amber-500', icon: FiClock, label: 'Pending' },
		{ key: 'Processing', color: 'bg-blue-500', icon: FiPackage, label: 'Processing' },
		{ key: 'Shipped', color: 'bg-purple-500', icon: FiTruck, label: 'Shipped' },
		{ key: 'Delivered', color: 'bg-emerald-500', icon: FiCheck, label: 'Delivered' },
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white rounded-2xl p-6 border border-gray-100"
		>
			<h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
				<FiShoppingBag className="w-5 h-5 text-indigo-500" />
				Order Breakdown
			</h3>
			<div className="space-y-4">
				{statusConfig.map(({ key, color, icon: Icon, label }) => {
					const count = statusBreakdown[key] || 0;
					const percentage = ((count / total) * 100).toFixed(0);

					return (
						<div key={key} className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<Icon className="w-4 h-4 text-gray-400" />
									<span className="font-medium text-gray-700">{label}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="font-bold text-gray-900">{count}</span>
									<span className="text-gray-400 text-xs">({percentage}%)</span>
								</div>
							</div>
							<div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
								<motion.div
									className={`${color} h-full rounded-full`}
									initial={{ width: 0 }}
									animate={{ width: `${percentage}%` }}
									transition={{ delay: 0.3, duration: 0.8 }}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</motion.div>
	);
};

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
					{product.image?.startsWith('http') ? (
						<img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" crossOrigin="anonymous" />
					) : (
						<span className="text-2xl w-10 h-10 flex items-center justify-center">{product.image}</span>
					)}
					<div className="flex-1">
						<h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
						<p className="text-sm text-gray-500">{product.sales} sales</p>
					</div>
					<div className="text-right">
						<span className="font-bold text-emerald-600">${product.revenue.toLocaleString()}</span>
					</div>
				</motion.div>
			))}
			{products.length === 0 && (
				<div className="text-center py-6 text-gray-400">
					<ProductIcon className="w-10 h-10 mx-auto mb-2" />
					<p className="text-sm">No product data available yet</p>
				</div>
			)}
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
			{sales.length === 0 && (
				<div className="text-center py-6 text-gray-400">
					<p className="text-sm">No recent sales data</p>
				</div>
			)}
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
			<div className="text-5xl font-black">{average?.toFixed(1) || '0.0'}</div>
			<div>
				<div className="flex gap-1 mb-1">
					{[1, 2, 3, 4, 5].map((star) => (
						<FiStar
							key={star}
							className={`w-5 h-5 ${star <= Math.round(average || 0) ? 'fill-white' : 'stroke-white/50'}`}
						/>
					))}
				</div>
				<p className="text-white/80 text-sm">{count || 0} reviews</p>
			</div>
		</div>
	</motion.div>
);

// Main Analytics Page
const AnalyticsPage = () => {
	const [timeRange, setTimeRange] = useState('month');
	const {
		analytics,
		isLoading
	} = useSellerAnalyticsPage(timeRange);

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