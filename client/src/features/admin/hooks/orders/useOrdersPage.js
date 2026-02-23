import { useState, useMemo } from 'react';
import useAdminOrders from './useAdminOrders.js';
import { useUpdateOrder } from './useOrderMutations.js';
import { ITEMS_PER_PAGE } from '../../components/orders/orderConstants.js';

const useOrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { orders: allOrders, isLoading } = useAdminOrders();
  const { updateOrder, isUpdating } = useUpdateOrder();
  const orders = allOrders || [];

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = o._id?.toLowerCase().includes(query) || 
        `${o.userId?.firstName} ${o.userId?.lastName}`.toLowerCase().includes(query) ||
        o.userId?.email?.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || 
        (paymentFilter === 'paid' && o.isPaid) || 
        (paymentFilter === 'unpaid' && !o.isPaid);
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  useMemo(() => { setCurrentPage(1); }, [searchQuery, statusFilter, paymentFilter]);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    totalRevenue: orders.filter(o => o.isPaid).reduce((sum, o) => sum + (o.totalPrice?.amount || 0), 0),
  }), [orders]);

  const handleUpdateStatus = (id, newStatus) => {
    updateOrder({ id, data: { status: newStatus } });
  };

  return {
    // State
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    viewingOrder,
    setViewingOrder,
    currentPage,
    setCurrentPage,

    // Data
    orders,
    filteredOrders,
    paginatedOrders,
    totalPages,
    stats,

    // Loading states
    isLoading,
    isUpdating,

    // Functions
    handleUpdateStatus
  };
};

export default useOrdersPage;