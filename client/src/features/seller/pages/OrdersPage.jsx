import { OrderIcon } from '../../../shared/constants/icons.jsx';
import { useSellerOrdersPage } from '../hooks/index.js';
import OrdersHeader from '../components/orders/OrdersHeader.jsx';
import OrdersStats from '../components/orders/OrdersStats.jsx';
import OrdersFilter from '../components/orders/OrdersFilter.jsx';
import OrdersList from '../components/orders/OrdersList.jsx';

const OrdersPage = () => {
	const {
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		orders,
		orderStats,
		error,
		isLoading,
		isUpdating,
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
			<OrdersHeader isUpdating={isUpdating} />

			{/* Stats Grid */}
			<OrdersStats orderStats={orderStats} />

			{/* Search & Filter */}
			<OrdersFilter 
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
			/>

			{/* Orders List */}
			<OrdersList 
				isLoading={isLoading}
				orders={orders}
				searchQuery={searchQuery}
				statusFilter={statusFilter}
				onUpdateStatus={handleUpdateStatus}
			/>
		</div>
	);
};

export default OrdersPage;
