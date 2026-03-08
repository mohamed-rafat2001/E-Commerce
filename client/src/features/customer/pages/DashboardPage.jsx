import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiClock, FiSettings } from 'react-icons/fi';
import { PageHeader, StatCard, Card, DataTable, Badge, Button, Skeleton } from '../../../shared/ui';
import useCurrentUser from '../../user/hooks/useCurrentUser';
import useOrderHistory from '../hooks/useOrderHistory'; // Assuming this exists or using mock

const CustomerDashboard = () => {
	const { user, userRole } = useCurrentUser();
	const { orders, isLoading } = useOrderHistory() || { orders: [], isLoading: false };

	const stats = [
		{ title: 'Total Orders', value: '12', icon: <FiShoppingBag />, color: 'primary', change: '+2 this month' },
		{ title: 'Wishlist Items', value: '8', icon: <FiHeart />, color: 'accent', change: 'Updated today' },
		{ title: 'Pending Orders', value: '2', icon: <FiClock />, color: 'warning', change: 'Expecting delivery' },
		{ title: 'Settings', value: 'Profile', icon: <FiSettings />, color: 'emerald', change: '100% Complete' }
	];

	const recentOrders = [
		{ id: 'ORD-7721', date: '2026-03-05', total: '$129.00', status: 'Shipped', statusColor: 'primary' },
		{ id: 'ORD-7604', date: '2026-02-28', total: '$85.50', status: 'Delivered', statusColor: 'success' },
		{ id: 'ORD-7590', date: '2026-02-20', total: '$210.00', status: 'Delivered', statusColor: 'success' },
	];

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
			render: () => <Button variant="ghost" size="sm">View</Button>
		}
	];

	return (
		<div className="space-y-8">
			<PageHeader
				title={`Welcome back, ${user?.firstName || 'User'}!`}
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
						<Button variant="ghost" size="sm">View All</Button>
					</div>
					<DataTable columns={orderColumns} data={recentOrders} />
				</Card>

				<Card className="flex flex-col">
					<h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
					<div className="space-y-3 flex-1">
						<Button variant="outline" fullWidth className="justify-start gap-3">
							<FiShoppingBag /> Continue Shopping
						</Button>
						<Button variant="outline" fullWidth className="justify-start gap-3">
							<FiHeart /> View Favorites
						</Button>
						<Button variant="outline" fullWidth className="justify-start gap-3">
							<FiSettings /> Account Settings
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default CustomerDashboard;
