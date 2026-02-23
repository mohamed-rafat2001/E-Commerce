import { useState, useMemo } from 'react';
import useSellerOrders from './useSellerOrders.js';
import useUpdateOrderStatus from './useUpdateOrderStatus.js';

const useSellerOrdersPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');

	const { orders, isLoading: ordersLoading, error, refetch } = useSellerOrders();
	const { updateOrderStatus, isUpdating } = useUpdateOrderStatus();

	// Calculate order stats
	const orderStats = useMemo(() => ({
		pending: orders.filter(o => o.status === 'Pending').length,
		processing: orders.filter(o => o.status === 'Processing').length,
		shipped: orders.filter(o => o.status === 'Shipped').length,
		delivered: orders.filter(o => o.status === 'Delivered').length,
	}), [orders]);

	// Filter orders
	const filteredOrders = useMemo(() => {
		if (!orders) return [];
		return orders.filter(order => {
			const matchesSearch = 
				order.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
				order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [orders, searchQuery, statusFilter]);

	const handleUpdateStatus = (orderId, newStatus) => {
		updateOrderStatus(
			{ orderId, status: newStatus },
			{ onSuccess: () => refetch() }
		);
	};

	return {
		// State
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,

		// Data
		orders: filteredOrders,
		allOrders: orders,
		orderStats,
		error,
		isLoading: ordersLoading,
		isUpdating,

		// Handlers
		handleUpdateStatus
	};
};

export default useSellerOrdersPage;