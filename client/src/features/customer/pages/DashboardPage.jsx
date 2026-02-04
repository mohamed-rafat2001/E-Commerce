import WelcomeBanner from '../components/WelcomeBanner.jsx';
import DashboardStatCard from '../components/DashboardStatCard.jsx';
import RecentOrders from '../components/RecentOrders.jsx';
import WishlistPreview from '../components/WishlistPreview.jsx';
import {
	OrderIcon,
	HeartIcon,
	ShippingIcon,
} from '../../../shared/constants/icons.jsx';

const recentOrders = [
	{
		id: 'ORD-7821',
		date: 'Feb 3, 2026',
		items: 2,
		total: '$189.00',
		status: 'Delivered',
		statusColor: 'success',
	},
	{
		id: 'ORD-7820',
		date: 'Feb 1, 2026',
		items: 1,
		total: '$49.00',
		status: 'Shipped',
		statusColor: 'info',
	},
	{
		id: 'ORD-7819',
		date: 'Jan 28, 2026',
		items: 3,
		total: '$329.00',
		status: 'Processing',
		statusColor: 'warning',
	},
];

const wishlistItems = [
	{ id: 1, name: 'Sony WH-1000XM5', price: '$349.00', image: '🎧', discount: '-15%' },
	{ id: 2, name: 'Apple Watch Ultra', price: '$799.00', image: '⌚', discount: null },
	{ id: 3, name: 'Nike Air Max', price: '$159.00', image: '👟', discount: '-20%' },
];

const stats = [
	{ icon: OrderIcon, label: 'Total Orders', value: '24', color: 'from-blue-500 to-cyan-500' },
	{ icon: HeartIcon, label: 'Wishlist Items', value: '12', color: 'from-pink-500 to-rose-500' },
	{ icon: ShippingIcon, label: 'Saved Addresses', value: '3', color: 'from-emerald-500 to-teal-500' },
];

const CustomerDashboardPage = () => {
	return (
		<div className="space-y-8">
			{/* Welcome Banner */}
			<WelcomeBanner 
				title="Welcome back! 🛒"
				subtitle="Track your orders, manage your wishlist, and discover amazing deals waiting just for you."
			/>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{stats.map((stat, index) => (
					<DashboardStatCard key={stat.label} stat={stat} index={index} />
				))}
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recent Orders */}
				<RecentOrders orders={recentOrders} />

				{/* Wishlist Preview */}
				<WishlistPreview items={wishlistItems} />
			</div>
		</div>
	);
};

export default CustomerDashboardPage;
