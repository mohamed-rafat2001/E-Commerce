import { LoadingSpinner } from '../../../shared/ui/index.js';
import { useOrdersPage } from '../hooks/index.js';
import OrderDetailModal from '../components/orders/OrderDetailModal.jsx';
import OrdersStats from '../components/orders/OrdersStats.jsx';
import OrdersFilter from '../components/orders/OrdersFilter.jsx';
import OrdersTable from '../components/orders/OrdersTable.jsx';

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">Track and manage all customer orders</p>
      </div>

      {/* Stats */}
      <OrdersStats stats={stats} />

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-slate-100/50 overflow-hidden">
        <OrdersFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          paymentFilter={paymentFilter}
          setPaymentFilter={setPaymentFilter}
        />

        <OrdersTable 
          filteredOrders={filteredOrders}
          paginatedOrders={paginatedOrders}
          setViewingOrder={setViewingOrder}
          handleUpdateStatus={handleUpdateStatus}
          isUpdating={isUpdating}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

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
