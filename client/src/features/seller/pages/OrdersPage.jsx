import { useSearchParams } from 'react-router-dom';
import { OrderIcon } from '../../../shared/constants/icons.jsx';
import { DataHeader, Pagination } from '../../../shared/ui/index.js';
import { useSellerOrdersPage } from '../hooks/index.js';
import OrdersStats from '../components/orders/OrdersStats.jsx';
import OrdersList from '../components/orders/OrdersList.jsx';

const OrdersPage = () => {
	const [searchParams] = useSearchParams();
	const searchQuery = searchParams.get('search') || '';
	const statusFilter = searchParams.get('status') || 'all';

	const {
		orders,
		total,
		totalPages,
		orderStats,
		error,
		isLoading,
		handleUpdateStatus
	} = useSellerOrdersPage();

	if (error) {
		return (
			<div className="text-center py-20">
				<div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
					<OrderIcon className="w-10 h-10 text-rose-400" />
				</div>
				<h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Orders</h3>
				<p className="text-rose-600 font-medium mb-4">Unable to fetch your orders. Please try again.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			{/* Header */}
			<DataHeader 
				title="Customer Orders 📋"
				description={`${total || 0} total orders`}
				searchPlaceholder="Search orders..."
				filterOptions={[
					{
						key: 'status',
						label: 'All Status',
						options: [
							{ value: 'Pending', label: 'Pending' },
							{ value: 'Processing', label: 'Processing' },
							{ value: 'Shipped', label: 'Shipped' },
							{ value: 'Delivered', label: 'Delivered' },
							{ value: 'Cancelled', label: 'Cancelled' }
						]
					}
				]}
				sortOptions={[
					{ label: 'Newest First', value: '-createdAt' },
					{ label: 'Oldest First', value: 'createdAt' },
					{ label: 'Total: High to Low', value: '-totalPrice.amount' },
					{ label: 'Total: Low to High', value: 'totalPrice.amount' }
				]}
			/>

			{/* Stats Grid */}
			<OrdersStats orderStats={orderStats} />

			{/* Orders List */}
			<OrdersList 
				isLoading={isLoading}
				orders={orders}
				searchQuery={searchQuery}
				statusFilter={statusFilter}
				onUpdateStatus={handleUpdateStatus}
			/>

			<Pagination totalPages={totalPages} />
		</div>
	);
};

export default OrdersPage;
