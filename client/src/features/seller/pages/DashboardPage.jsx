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
			whileTap={{ scale: 0.98 }}
			className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-indigo-100 
				transition-all duration-300 relative overflow-hidden group"
		>
			<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
				<Icon className="w-6 h-6 text-white" />
			</div>
			<h4 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h4>
			<p className="text-sm text-gray-500 leading-relaxed">{description}</p>
			<div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 
				flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
				<FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 
					group-hover:translate-x-0.5 transition-all duration-200" />
			</div>
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
		refetch,
		isError
	} = useSellerDashboardPage();

	return (
		<div className="space-y-8 pb-12">
			{/* Welcome Header */}
			<motion.div 
				initial={{ opacity: 0, y: -20 }} 
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-white to-gray-50 rounded-3xl p-6 border border-gray-100 shadow-sm"
			>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
					<div>
						<h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back 👋</h1>
						<p className="text-gray-600 font-medium">Here's what's happening with your store today</p>
					</div>
					<Link 
						to="/seller/analytics"
						className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 
							text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 
							hover:scale-105 transition-all duration-200 group"
					>
						<FiBarChart2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
						View Analytics
					</Link>
				</div>
			</motion.div>

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
					{alerts && alerts.length > 0 && (
						<div className="space-y-3">
							{alerts.map((alert, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.1 }}
									className={`flex items-start gap-3 p-4 rounded-2xl border ${
										alert.type === 'warning' 
											? 'bg-amber-50 border-amber-200 text-amber-800' 
											: alert.type === 'error'
												? 'bg-rose-50 border-rose-200 text-rose-800'
												: 'bg-blue-50 border-blue-200 text-blue-800'
									}`}
								>
									<div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
										alert.type === 'warning' 
											? 'bg-amber-100 text-amber-600' 
											: alert.type === 'error'
												? 'bg-rose-100 text-rose-600'
												: 'bg-blue-100 text-blue-600'
									}`}>
										<FiAlertTriangle className="w-4 h-4" />
									</div>
									<div className="flex-1">
										<span className="text-sm font-semibold">{alert.title || 'Alert'}</span>
										<p className="text-sm mt-1">{alert.message}</p>
										{alert.action && (
											<Link 
												to={alert.action.to}
												className={`inline-block mt-2 text-sm font-medium ${
													alert.type === 'warning' 
														? 'text-amber-700 hover:text-amber-800' 
														: alert.type === 'error'
															? 'text-rose-700 hover:text-rose-800'
															: 'text-blue-700 hover:text-blue-800'
												}`}
											>
												{alert.action.label} →
											</Link>
										)}
									</div>
								</motion.div>
							))}
						</div>
					)}

					{/* Main Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{statsArray && statsArray.length > 0 ? (
							statsArray.map((stat, index) => (
								<StatCard 
									key={stat.id}
									stat={stat}
									index={index}
								/>
							))
						) : (
							<div className="col-span-4">
								<Card variant="elevated" className="text-center py-12">
									<div className="text-gray-400">
										<FiPackage className="w-12 h-12 mx-auto mb-4 opacity-50" />
										<p className="font-medium">No stats available</p>
										<p className="text-sm mt-1">Loading dashboard data...</p>
									</div>
								</Card>
							</div>
						)}
					</div>

					{/* Middle Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<PendingOrders orders={stats?.recentOrders || []} />
						<TopProducts products={products || stats?.topProducts || []} />
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