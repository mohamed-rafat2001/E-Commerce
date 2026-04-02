import { PageHeader, Pagination, DataTable, Badge, Card, Button, Skeleton } from '../../../shared/ui/index.js';
import { useSellerOrdersPage } from '../hooks/index.js';
import OrdersStats from '../components/orders/OrdersStats.jsx';
import { FiEye } from 'react-icons/fi';

const OrdersPage = () => {
	const {
		orders,
		total,
		totalPages,
		orderStats,
		error,
		isLoading
	} = useSellerOrdersPage();

	const columns = [
		{
			header: 'Order ID',
			render: (row) => <span className="font-bold text-gray-900">{row._id.substring(0, 8).toUpperCase()}</span>
		},
		{
			header: 'Customer',
			render: (row) => (
				<div className="flex flex-col">
					<span className="font-bold text-gray-900">{row.userId?.firstName} {row.userId?.lastName}</span>
					<span className="text-xs text-gray-400">{row.userId?.email}</span>
				</div>
			)
		},
		{
			header: 'Status',
			render: (row) => (
				<Badge variant={
					row.status === 'Delivered' ? 'success' :
						row.status === 'Cancelled' ? 'error' :
							row.status === 'Shipped' ? 'primary' : 'warning'
				}>
					{row.status}
				</Badge>
			)
		},
		{
			header: 'Total',
			render: (row) => <span className="font-black text-gray-900">${row.totalPrice?.amount || 0}</span>
		},
		{
			header: 'Date',
			render: (row) => <span className="text-gray-500 font-medium">{new Date(row.createdAt).toLocaleDateString()}</span>
		},
		{
			header: 'Actions',
			render: () => (
				<Button variant="ghost" size="sm" icon={<FiEye />} className="hover:text-indigo-600">
					Details
				</Button>
			)
		}
	];

	if (error) {
		return (
			<Card className="text-center py-20 border-rose-100 bg-rose-50">
				<h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Something went wrong</h3>
				<p className="text-rose-600 font-medium mb-6">We couldn't load your orders. This might be a temporary issue.</p>
				<Button variant="danger" onClick={() => window.location.reload()}>Try Again</Button>
			</Card>
		);
	}

	return (
		<div className="space-y-8 pb-10">
			<PageHeader
				title="Customer Orders"
				subtitle={`Managing ${total || 0} orders across your store.`}
			/>

			<OrdersStats orderStats={orderStats} />

			<Card padding="none" className="overflow-hidden">
				<div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
					<h3 className="text-lg font-bold text-gray-900 font-display">Recent Transactions</h3>
					<div className="flex gap-2">
						{/* Filters could go here if implemented as sub-components */}
					</div>
				</div>
				{isLoading ? (
					<div className="p-6">
						<Skeleton variant="table-row" count={5} />
					</div>
				) : (
					<DataTable
						columns={columns}
						data={orders || []}
						totalPages={totalPages}
						emptyMessage="No orders found matching your criteria."
					/>
				)}
			</Card>
		</div>
	);
};

export default OrdersPage;
