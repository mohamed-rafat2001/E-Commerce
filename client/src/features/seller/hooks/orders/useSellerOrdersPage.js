import { useMemo } from 'react';
import useSellerOrders from './useSellerOrders.js';
import useUpdateOrderStatus from './useUpdateOrderStatus.js';

const useSellerOrdersPage = () => {
	const { orders, total, totalPages, isLoading, error, refetch } = useSellerOrders();
	const { updateOrderStatus, isUpdating } = useUpdateOrderStatus();

	// Calculate order stats based on current page
    // TODO: Fetch real stats from backend
	const orderStats = useMemo(() => ({
		pending: orders.filter(o => o.status === 'Pending').length,
		processing: orders.filter(o => o.status === 'Processing').length,
		shipped: orders.filter(o => o.status === 'Shipped').length,
		delivered: orders.filter(o => o.status === 'Delivered').length,
	}), [orders]);

	const handleUpdateStatus = (orderId, newStatus) => {
		updateOrderStatus(
			{ orderId, status: newStatus },
			{ onSuccess: () => refetch() }
		);
	};

	return {
		orders,
        total,
        totalPages,
		orderStats,
		error,
		isLoading,
		isUpdating,
		handleUpdateStatus
	};
};

export default useSellerOrdersPage;