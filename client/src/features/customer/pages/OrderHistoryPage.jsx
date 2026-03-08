import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader, Card, Badge, DataTable, Button, EmptyState } from '../../../shared/ui';
import { OrderIcon } from '../../../shared/constants/icons.jsx';

const ordersData = [
	{
		id: 'ORD-2024-001',
		date: 'Feb 4, 2026',
		itemsCount: 2,
		total: '$378.00',
		status: 'Processing',
		statusColor: 'warning',
	},
	{
		id: 'ORD-2024-002',
		date: 'Jan 28, 2026',
		itemsCount: 1,
		total: '$399.00',
		status: 'Shipped',
		statusColor: 'primary',
	},
	{
		id: 'ORD-2024-003',
		date: 'Jan 15, 2026',
		itemsCount: 3,
		total: '$217.00',
		status: 'Delivered',
		statusColor: 'success',
	},
];

const OrderHistoryPage = () => {
	const [activeTab, setActiveTab] = useState('All');
	const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

	const filteredOrders = activeTab === 'All'
		? ordersData
		: ordersData.filter(order => order.status === activeTab);

	const columns = [
		{
			header: 'Order ID',
			render: (row) => <span className="font-bold text-gray-900">{row.id}</span>
		},
		{ header: 'Date', key: 'date' },
		{
			header: 'Items',
			render: (row) => <span className="text-gray-500 font-medium">{row.itemsCount} Items</span>
		},
		{
			header: 'Status',
			render: (row) => <Badge variant={row.statusColor}>{row.status}</Badge>
		},
		{
			header: 'Total',
			render: (row) => <span className="font-black text-gray-900">{row.total}</span>
		},
		{
			header: 'Actions',
			render: (row) => (
				<div className="flex gap-2">
					<Button variant="outline" size="sm">Track</Button>
					<Button variant="ghost" size="sm">Details</Button>
				</div>
			)
		}
	];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Order History"
				subtitle="Manage your recent orders and track their delivery status."
			/>

			<div className="flex gap-2 p-1 bg-gray-100 w-fit rounded-xl overflow-x-auto">
				{tabs.map(tab => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === tab
								? 'bg-white text-indigo-600 shadow-sm'
								: 'text-gray-500 hover:text-gray-700'
							}`}
					>
						{tab}
					</button>
				))}
			</div>

			<Card padding="none" className="overflow-hidden">
				{filteredOrders.length > 0 ? (
					<DataTable
						columns={columns}
						data={filteredOrders}
					/>
				) : (
					<EmptyState
						icon={<OrderIcon className="w-12 h-12" />}
						title="No orders found"
						message={`There are no orders in the "${activeTab}" category.`}
						action={{
							label: "Shop Now",
							onClick: () => window.location.href = '/'
						}}
					/>
				)}
			</Card>
		</div>
	);
};

export default OrderHistoryPage;
