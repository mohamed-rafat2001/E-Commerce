import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useOrderHistory from '../hooks/useOrderHistory';
import { PageHeader, Card, Badge, DataTable, Button, EmptyState, Skeleton } from '../../../shared/ui';
import { OrderIcon } from '../../../shared/constants/icons.jsx';

const ITEMS_PER_PAGE = 10;

const OrderHistoryPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('status') || 'All';
    const page = parseInt(searchParams.get('page')) || 1;

	const { orders, total, totalPages, isLoading } = useOrderHistory({
        status: activeTab === 'All' ? undefined : activeTab,
        page,
        limit: ITEMS_PER_PAGE
    });

	const tabs = ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

	const columns = [
		{
			header: 'Order ID',
			render: (row) => <span className="font-bold text-gray-900 truncate max-w-[120px] block">ORD-{row._id.substring(row._id.length - 8)}</span>
		},
		{
			header: 'Date',
			render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>
		},
		{
			header: 'Items',
			render: (row) => <span className="text-gray-500 font-medium">{row.orderItems?.length || 0} Items</span>
		},
		{
			header: 'Status',
			render: (row) => (
				<Badge
					variant={
						row.status === 'delivered' ? 'success' :
							row.status === 'cancelled' ? 'danger' :
								(row.status === 'pending' || row.status === 'processing') ? 'warning' : 'primary'
					}
				>
					{row.status}
				</Badge>
			)
		},
		{
			header: 'Total',
			render: (row) => <span className="font-black text-gray-900">${row.totalPrice?.amount || 0}</span>
		},
		{
			header: 'Actions',
			render: () => (
				<div className="flex gap-2">
					<Button variant="outline" size="sm">Track</Button>
					<Button variant="ghost" size="sm">Details</Button>
				</div>
			)
		}
	];

    const handleTabChange = (tab) => {
        const newParams = new URLSearchParams(searchParams);
        if (tab === 'All') newParams.delete('status');
        else newParams.set('status', tab);
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage.toString());
        setSearchParams(newParams);
    };

	if (isLoading) {
		return (
			<div className="space-y-6">
				<Skeleton variant="text" className="w-1/4 h-10" />
				<div className="space-y-4">
					<Skeleton variant="image" className="h-20 rounded-2xl" count={3} />
				</div>
			</div>
		);
	}

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
						onClick={() => handleTabChange(tab)}
						className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all capitalize ${activeTab === tab
							? 'bg-white text-indigo-600 shadow-sm'
							: 'text-gray-500 hover:text-gray-700'
							}`}
					>
						{tab}
					</button>
				))}
			</div>

			<Card padding="none" className="overflow-hidden">
				{orders.length > 0 ? (
					<DataTable
						columns={columns}
						data={orders}
                        totalPages={totalPages}
                        currentPage={page}
                        onPageChange={handlePageChange}
					/>
				) : (
					<div className="py-12">
						<EmptyState
							icon={<OrderIcon className="w-12 h-12" />}
							title="No orders found"
							message={activeTab === 'All'
								? "You haven't placed any orders yet."
								: `There are no orders in the "${activeTab}" category.`}
							action={{
								label: "Shop Now",
								onClick: () => window.location.href = '/'
							}}
						/>
					</div>
				)}
			</Card>
		</div>
	);
};

export default OrderHistoryPage;
