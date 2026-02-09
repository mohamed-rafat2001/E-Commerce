import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import TopProducts from '../components/TopProducts.jsx';
import PendingOrders from '../components/PendingOrders.jsx';
import {
	ProductIcon,
	OrderIcon,
	AnalyticsIcon,
	InventoryIcon,
} from '../../../shared/constants/icons.jsx';
import { LoadingSpinner, Button } from '../../../shared/ui/index.js';
import { FiPlus, FiArrowRight, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import { useSellerDashboardPage } from '../hooks/index.js';

// Quick Action Card
const QuickActionCard = ({ title, description, to, icon: Icon, gradient }) => (
	<Link to={to}>
		<motion.div
			whileHover={{ scale: 1.02, y: -2 }}
			whileTap={{ scale: 0.98 }}
			className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
		>
			<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
				<Icon className="w-6 h-6 text-white" />
			</div>
			<h3 className="font-bold text-gray-900 mb-1">{title}</h3>
			<p className="text-sm text-gray-500 mb-3">{description}</p>
			<div className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
				<span>Go to {title}</span>
				<FiArrowRight className="w-4 h-4" />
			</div>
		</motion.div>
	</Link>
);

// Alert Card
const AlertCard = ({ title, message, type = 'warning', action }) => {
	const typeStyles = {
		warning: 'bg-amber-50 border-amber-200 text-amber-800',
		danger: 'bg-rose-50 border-rose-200 text-rose-800',
		info: 'bg-blue-50 border-blue-200 text-blue-800',
	};

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			className={`p-4 rounded-xl border ${typeStyles[type]} flex items-start gap-3`}
		>
			<FiAlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
			<div className="flex-1">
				<h4 className="font-semibold">{title}</h4>
				<p className="text-sm opacity-80">{message}</p>
				{action && (
					<Link to={action.to} className="text-sm font-medium underline mt-1 inline-block hover:no-underline">
						{action.label}
					</Link>
				)}
			</div>
		</motion.div>
	);
};

// Icon mapping function
const getIconByName = (iconName) => {
	switch(iconName) {
		case 'ProductIcon':
			return ProductIcon;
		case 'OrderIcon':
			return OrderIcon;
		case 'InventoryIcon':
			return InventoryIcon;
		case 'AnalyticsIcon':
			return AnalyticsIcon;
		default:
			return ProductIcon; // fallback icon
	}
};

const SellerDashboardPage = () => {
	const {
		products,
		stats,
		topProducts,
		pendingOrders,
		alerts,
		isLoading,
		error
	} = useSellerDashboardPage();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-20">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<DashboardHeader 
					title="Store Dashboard 🏪"
					subtitle="Track your sales and manage your products."
				/>
				<Link to="products">
					<Button icon={<FiPlus className="w-5 h-5" />}>
						Add Product
					</Button>
				</Link>
			</div>

			{/* Alerts */}
			{alerts.length > 0 && (
				<div className="space-y-3">
					{alerts.map((alert, index) => (
						<AlertCard key={index} {...alert} />
					))}
				</div>
			)}

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => {
					const IconComponent = getIconByName(stat.icon);
					return (
						<StatCard 
							key={stat.id} 
							stat={{...stat, icon: IconComponent}} 
							index={index} 
						/>
					);
				})}
			</div>

			{/* Quick Actions */}
			<div>
				<h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<QuickActionCard
						title="Products"
						description="Manage your product listings"
						to="products"
						icon={ProductIcon}
						gradient="from-violet-500 to-purple-600"
					/>
					<QuickActionCard
						title="Inventory"
						description="Monitor stock levels"
						to="inventory"
						icon={InventoryIcon}
						gradient="from-emerald-500 to-teal-600"
					/>
					<QuickActionCard
						title="Orders"
						description="Process customer orders"
						to="orders"
						icon={OrderIcon}
						gradient="from-blue-500 to-indigo-600"
					/>
					<QuickActionCard
						title="Analytics"
						description="View sales performance"
						to="analytics"
						icon={AnalyticsIcon}
						gradient="from-orange-500 to-red-500"
					/>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Top Products */}
				{topProducts.length > 0 ? (
					<TopProducts products={topProducts} />
				) : (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="lg:col-span-2 bg-white rounded-2xl p-8 border border-gray-100 text-center"
					>
						<div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<ProductIcon className="w-8 h-8 text-indigo-500" />
						</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">No products yet</h3>
						<p className="text-gray-500 mb-4">Add your first product to start selling</p>
						<Link to="products">
							<Button size="sm" icon={<FiPlus className="w-4 h-4" />}>
								Add Product
							</Button>
						</Link>
					</motion.div>
				)}

				{/* Pending Orders */}
				<PendingOrders orders={pendingOrders} />
			</div>
		</div>
	);
};

export default SellerDashboardPage;