import WelcomeBanner from '../components/WelcomeBanner.jsx';
import DashboardStatCard from '../components/DashboardStatCard.jsx';
import RecentOrders from '../components/RecentOrders.jsx';
import WishlistPreview from '../components/WishlistPreview.jsx';
import useOrderHistory from '../hooks/useOrderHistory.js';
import useWishlist from '../../wishList/hooks/useWishlist.js';
import useCustomerProfile from '../hooks/useCustomerProfile.js';
import {
	OrderIcon,
	HeartIcon,
	ShippingIcon,
} from '../../../shared/constants/icons.jsx';

const CustomerDashboardPage = () => {
	const { orders, isLoading: ordersLoading } = useOrderHistory();
	const { wishlist, isLoading: wishlistLoading } = useWishlist();
	const { addresses, isLoading: profileLoading } = useCustomerProfile();

	const stats = [
		{ 
			icon: OrderIcon, 
			label: 'Total Orders', 
			value: ordersLoading ? '...' : orders.length.toString(), 
			color: 'from-blue-500 to-cyan-500' 
		},
		{ 
			icon: HeartIcon, 
			label: 'Wishlist Items', 
			value: wishlistLoading ? '...' : (wishlist?.items?.length || 0).toString(), 
			color: 'from-pink-500 to-rose-500' 
		},
		{ 
			icon: ShippingIcon, 
			label: 'Saved Addresses', 
			value: profileLoading ? '...' : addresses.length.toString(), 
			color: 'from-emerald-500 to-teal-500' 
		},
	];

	// Prepare recent orders (last 3)
	const recentOrders = orders.slice(0, 3).map(order => ({
		id: order._id.substring(order._id.length - 8).toUpperCase(),
		date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
		items: order.items.length,
		total: `$${order.totalPrice?.amount || 0}`,
		status: order.status,
		statusColor: order.status === 'Delivered' ? 'success' : order.status === 'Processing' ? 'warning' : 'info'
	}));

	// Prepare wishlist items (last 3)
	const wishlistPreviewItems = (wishlist?.items || []).slice(0, 3).map(item => ({
		id: item.itemId._id,
		name: item.itemId.name,
		price: `$${item.itemId.price}`,
		image: item.itemId.image?.secure_url || '📦',
		discount: null // Could be calculated if needed
	}));

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
				<WishlistPreview items={wishlistPreviewItems} />
			</div>
		</div>
	);
};

export default CustomerDashboardPage;
