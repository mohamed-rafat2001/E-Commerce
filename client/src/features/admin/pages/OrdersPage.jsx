import { PageHeader, Card, Skeleton, Badge, DataTable, EmptyState, Button } from '../../../shared/ui/index.js';
import { FiShoppingBag, FiEye, FiClock } from 'react-icons/fi';
import { useOrdersPage } from '../hooks/index.js';
import OrderDetailModal from '../components/orders/OrderDetailModal.jsx';
import OrdersStats from '../components/orders/OrdersStats.jsx';
import OrdersFilter from '../components/orders/OrdersFilter.jsx';

const OrdersPage = () => {
  const {
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
    filteredOrders,
    paginatedOrders,
    totalPages,
    stats,

    // Loading states
    isLoading,
    isUpdating,

    // Functions
    handleUpdateStatus
  } = useOrdersPage();

  const columns = [
    {
      header: 'Order',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 leading-none">#{row._id.substring(0, 8).toUpperCase()}</span>
          <span className="text-xs text-gray-400 mt-1">{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      header: 'Customer',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 leading-none">{row.userId?.firstName} {row.userId?.lastName}</span>
          <span className="text-xs text-gray-400 mt-1">{row.userId?.email}</span>
        </div>
      )
    },
    {
      header: 'Total Price',
      render: (row) => <span className="font-black text-gray-900">${row.totalPrice?.amount || 0}</span>
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={
          row.status === 'Delivered' ? 'success' :
            row.status === 'Cancelled' ? 'error' :
              row.status === 'Processing' ? 'info' : 'warning'
        }>
          {row.status.toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewingOrder(row)}
            icon={<FiEye />}
            className="hover:text-indigo-600"
          >
            View
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton variant="text" className="w-1/4 h-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton variant="card" count={4} />
        </div>
        <Skeleton variant="card" className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Order Management"
        subtitle="Track sales, monitor logistics, and manage customer fulfillment globally."
      />

      <OrdersStats stats={stats} />

      <Card padding="none" className="overflow-hidden">
        <OrdersFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          paymentFilter={paymentFilter}
          setPaymentFilter={setPaymentFilter}
        />

        {filteredOrders.length > 0 ? (
          <DataTable
            columns={columns}
            data={paginatedOrders}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            currentPage={currentPage}
          />
        ) : (
          <EmptyState
            icon={<FiShoppingBag className="w-12 h-12" />}
            title="No matching orders"
            message="Adjust your filters or search query to find the orders you're looking for."
          />
        )}
      </Card>

      <OrderDetailModal
        order={viewingOrder}
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default OrdersPage;
