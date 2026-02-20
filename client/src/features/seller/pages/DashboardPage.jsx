import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, LoadingSpinner } from '../../../shared/ui/index.js';
import { 
	FiDollarSign, FiShoppingBag, FiPackage, FiAlertTriangle,
	FiArrowRight, FiTrendingUp, FiTrendingDown, FiBox,
	FiBarChart2, FiSettings, FiPlus, FiArchive
} from 'react-icons/fi';
import StatCard from '../components/StatCard.jsx';
import PendingOrders from '../components/PendingOrders.jsx';
import TopProducts from '../components/TopProducts.jsx';
import { useSellerDashboardPage } from '../hooks/index.js';

const QuickActionCard = ({ icon: Icon, title, to, gradient, description }) => (
	<Link to={to} className="group">
		<motion.div 
			whileHover={{ y: -4, scale: 1.02 }}
			className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
		>
			<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg`}>
				<Icon className="w-6 h-6 text-white" />
			</div>
			<h4 className="font-bold text-gray-900 mb-1">{title}</h4>
			<p className="text-sm text-gray-500">{description}</p>
			<FiArrowRight className="absolute top-5 right-5 w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
		</motion.div>
	</Link>
);

const DashboardPage = () => {
	const {
		stats,
		statsArray,
		products,
		alerts,
		isLoading,
		error,
	} = useSellerDashboardPage();

	return (
		<div className="space-y-6 pb-10">
			{/* Welcome Header */}
			<motion.div 
				initial={{ opacity: 0, y: -20 }} 
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
			>
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back 👋</h1>
					<p className="text-gray-500 font-medium mt-1">Here's what's happening with your store today</p>
				</div>
				<Link 
					to="/seller/analytics"
					className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all"
				>
					<FiBarChart2 className="w-5 h-5" />
					View Analytics
				</Link>
			</motion.div>

			{/* Stats/Quick Overview */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
					<LoadingSpinner size="lg" color="indigo" />
					<p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Loading Dashboard...</p>
				</div>
			) : (
				<>
					{/* Alerts Banner */}
					{alerts && alerts.length > 0 && (
						<div className="space-y-3">
							{alerts.map((alert, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.1 }}
									className={`flex items-center gap-3 p-4 rounded-xl border ${
										alert.type === 'warning' 
											? 'bg-amber-50 border-amber-200 text-amber-800' 
											: alert.type === 'error'
												? 'bg-rose-50 border-rose-200 text-rose-800'
												: 'bg-blue-50 border-blue-200 text-blue-800'
									}`}
								>
									<FiAlertTriangle className="w-5 h-5 flex-shrink-0" />
									<span className="text-sm font-medium">{alert.message}</span>
								</motion.div>
							))}
						</div>
					)}

					{/* Main Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{(statsArray && statsArray.length > 0 ? statsArray : [
							{
								title: 'Total Revenue',
								value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
								change: stats?.revenueChange || '+0%',
								icon: <FiDollarSign className="w-5 h-5 text-white" />,
								gradient: 'from-emerald-500 to-teal-600',
							},
							{
								title: 'Total Orders',
								value: stats?.totalOrders || 0,
								change: stats?.ordersChange || '+0%',
								icon: <FiShoppingBag className="w-5 h-5 text-white" />,
								gradient: 'from-blue-500 to-indigo-600',
							},
							{
								title: 'Total Products',
								value: stats?.totalProducts || 0,
								change: stats?.productsChange || '+0',
								icon: <FiBox className="w-5 h-5 text-white" />,
								gradient: 'from-violet-500 to-purple-600',
							},
							{
								title: 'Low Stock',
								value: stats?.lowStockCount || 0,
								change: 'Needs attention',
								icon: <FiAlertTriangle className="w-5 h-5 text-white" />,
								gradient: 'from-rose-500 to-red-600',
							},
						]).map((stat, index) => (
							<motion.div
								key={stat.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
							>
								<div className="flex items-center justify-between mb-3">
									<div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
										{stat.icon}
									</div>
									<span className={`text-xs font-bold px-2 py-1 rounded-lg ${
										String(stat.change).startsWith('+') || String(stat.change).startsWith('$') 
											? 'bg-emerald-50 text-emerald-700' 
											: String(stat.change).includes('attention')
												? 'bg-rose-50 text-rose-700'
												: 'bg-gray-50 text-gray-600'
									}`}>
										{stat.change}
									</span>
								</div>
								<h4 className="text-2xl font-black text-gray-900">{stat.value}</h4>
								<p className="text-sm text-gray-500 font-medium">{stat.title}</p>
							</motion.div>
						))}
					</div>

					{/* Middle Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<PendingOrders orders={stats?.recentOrders} />
						<TopProducts products={products || stats?.topProducts} />
					</div>

					{/* Quick Actions */}
					<div>
						<h3 className="text-xl font-black text-gray-900 mb-4">Quick Actions ⚡</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<QuickActionCard
								icon={FiPlus}
								title="Add Product"
								to="/seller/products"
								gradient="from-indigo-500 to-purple-600"
								description="Create a new product listing"
							/>
							<QuickActionCard
								icon={FiShoppingBag}
								title="View Orders"
								to="/seller/orders"
								gradient="from-blue-500 to-indigo-600"
								description="Manage customer orders"
							/>
							<QuickActionCard
								icon={FiArchive}
								title="Inventory"
								to="/seller/inventory"
								gradient="from-emerald-500 to-teal-600"
								description="Update stock levels"
							/>
							<QuickActionCard
								icon={FiSettings}
								title="Store Settings"
								to="/seller/settings"
								gradient="from-violet-500 to-purple-600"
								description="Configure your brand"
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default DashboardPage;