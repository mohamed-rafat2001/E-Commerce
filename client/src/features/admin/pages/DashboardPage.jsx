import StatCard from '../components/StatCard.jsx';
import RecentOrders from '../components/RecentOrders.jsx';
import QuickActions from '../components/QuickActions.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import {
	UsersIcon,
	ProductIcon,
	OrderIcon,
	AnalyticsIcon,
} from '../../../shared/constants/icons.jsx';

const stats = [
	{
		id: 1,
		name: 'Total Users',
		value: '12,847',
		change: '+12.5%',
		changeType: 'positive',
		icon: UsersIcon,
		gradient: 'from-indigo-500 to-purple-600',
	},
	{
		id: 2,
		name: 'Total Products',
		value: '4,523',
		change: '+8.2%',
		changeType: 'positive',
		icon: ProductIcon,
		gradient: 'from-emerald-500 to-teal-600',
	},
	{
		id: 3,
		name: 'Total Orders',
		value: '34,182',
		change: '+23.1%',
		changeType: 'positive',
		icon: OrderIcon,
		gradient: 'from-orange-500 to-red-500',
	},
	{
		id: 4,
		name: 'Revenue',
		value: '$248.5K',
		change: '+18.7%',
		changeType: 'positive',
		icon: AnalyticsIcon,
		gradient: 'from-pink-500 to-rose-500',
	},
];

const recentOrders = [
	{
		id: 'ORD-001',
		customer: 'John Smith',
		product: 'MacBook Pro 16"',
		amount: '$2,499.00',
		status: 'Completed',
		statusColor: 'success',
	},
	{
		id: 'ORD-002',
		customer: 'Sarah Johnson',
		product: 'iPhone 15 Pro Max',
		amount: '$1,199.00',
		status: 'Processing',
		statusColor: 'warning',
	},
	{
		id: 'ORD-003',
		customer: 'Mike Davis',
		product: 'AirPods Pro',
		amount: '$249.00',
		status: 'Shipped',
		statusColor: 'info',
	},
	{
		id: 'ORD-004',
		customer: 'Emily Wilson',
		product: 'iPad Air',
		amount: '$599.00',
		status: 'Pending',
		statusColor: 'secondary',
	},
];

const AdminDashboardPage = () => {
	return (
		<div className="space-y-8">
			{/* Page Header */}
			<DashboardHeader 
				title="Welcome back, Admin! 👋"
				subtitle="Here's what's happening with your store today."
				role="Super Admin"
			/>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => (
					<StatCard key={stat.id} stat={stat} index={index} />
				))}
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recent Orders */}
				<RecentOrders orders={recentOrders} />

				{/* Quick Actions */}
				<QuickActions />
			</div>
		</div>
	);
};

export default AdminDashboardPage;
