import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiClock, FiSettings } from 'react-icons/fi';
import { PageHeader, StatCard, Card, DataTable, Badge, Button } from '../../../shared/ui';
import useCurrentUser from '../../user/hooks/useCurrentUser';
import useOrderHistory from '../hooks/useOrderHistory.js';
import useWishlist from '../../wishList/hooks/useWishlist.js';

const CustomerDashboard = () => {
	const navigate = useNavigate();
	const { user } = useCurrentUser();
	const { orders } = useOrderHistory();
	const { wishlistItems } = useWishlist();

	const ordersList = orders || [];
	const pendingStatuses = new Set(['pending', 'processing']);

	const stats = [
		{
			title: 'Total Orders',
			value: ordersList.length.toString(),
			icon: <FiShoppingBag />,
			color: 'primary',
			change: '+2 this month'
		},
		{
			title: 'Wishlist Items',
			value: (wishlistItems?.length || 0).toString(),
			icon: <FiHeart />,
			color: 'accent',
			change: 'Updated today'
		},
		{
			title: 'Pending Orders',
			value: ordersList.filter((o) => pendingStatuses.has(String(o.status || '').toLowerCase())).length.toString(),
			icon: <FiClock />,
			color: 'warning',
			change: 'Expecting delivery'
		},
		{
			title: 'Settings',
			value: 'Profile',
			icon: <FiSettings />,
			color: 'emerald',
			change: '100% Complete'
		}
	];

	const recentOrders = ordersList.slice(0, 5).map(o => ({
		id: `ORD-${o._id.substring(o._id.length - 4)}`,
		date: new Date(o.createdAt).toLocaleDateString(),
		total: `$${o.totalPrice?.amount || 0}`,
		status: o.status,
		statusColor: String(o.status || '').toLowerCase() === 'delivered' ? 'success' : String(o.status || '').toLowerCase() === 'cancelled' ? 'danger' : 'warning',
		orderId: o._id
	}));

	const orderColumns = [
		{ header: 'Order ID', key: 'id' },
		{ header: 'Date', key: 'date' },
		{ header: 'Amount', key: 'total' },
		{
			header: 'Status',
			render: (row) => <Badge variant={row.statusColor}>{row.status}</Badge>
		},
		{
			header: '',
			render: (row) => (
				<Button variant="ghost" size="sm" onClick={() => navigate(`/customer/orderHistory?order=${row.orderId}`)}>
					View
				</Button>
			)
		}
	];

	return (
		<div className="space-y-8">
			<PageHeader
				title={`Welcome back, ${user?.firstName || user?.userId?.firstName || 'User'}!`}
				subtitle="Here's a quick overview of your account activity and recent purchases."
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, i) => (
					<StatCard key={i} {...stat} />
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<Card padding="none" className="lg:col-span-2 overflow-hidden">
					<div className="p-6 border-b border-gray-100 flex items-center justify-between">
						<h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
						<Button variant="ghost" size="sm" onClick={() => navigate('/customer/orderHistory')}>View All</Button>
					</div>
					<DataTable columns={orderColumns} data={recentOrders} />
				</Card>

				<Card className="flex flex-col">
					<h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
					<div className="space-y-3 flex-1">
						<Button variant="outline" fullWidth className="justify-start gap-3" onClick={() => navigate('/products')}>
							<FiShoppingBag /> Continue Shopping
						</Button>
						<Button variant="outline" fullWidth className="justify-start gap-3" onClick={() => navigate('/customer/wishlist')}>
							<FiHeart /> View Favorites
						</Button>
						<Button variant="outline" fullWidth className="justify-start gap-3" onClick={() => navigate('/customer/settings')}>
							<FiSettings /> Account Settings
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default CustomerDashboard;
