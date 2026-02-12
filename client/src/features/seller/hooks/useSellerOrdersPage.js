import { useState, useMemo } from 'react';
import useSellerOrders from './useSellerOrders.js';

const useSellerOrdersPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');

	const { orders, error } = useSellerOrders();

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
				order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
				order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [orders, searchQuery, statusFilter]);

	const handleUpdateStatus = (orderId, newStatus) => {
		// TODO: Call API to update order status
		console.log(`Updating order ${orderId} to ${newStatus}`);
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

		// Handlers
		handleUpdateStatus
	};
};

export default useSellerOrdersPage;