import { motion, AnimatePresence } from 'framer-motion';
import { Select, LoadingSpinner } from '../../../shared/ui/index.js';
import { FiSearch, FiShoppingCart, FiClock, FiPackage, FiTruck, FiCheck, FiXCircle, FiDollarSign } from 'react-icons/fi';
import useOrdersPage from '../hooks/useOrdersPage.js';
import { statusOptions } from '../components/orders/orderConstants.js';
import AdminStatCard from '../components/AdminStatCard.jsx';
import Pagination from '../components/Pagination.jsx';
import EmptyState from '../components/EmptyState.jsx';
import OrderDetailModal from '../components/orders/OrderDetailModal.jsx';
import OrderRow from '../components/orders/OrderRow.jsx';

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Total Orders" value={stats.total} icon={FiShoppingCart} color="bg-gray-900" />
        <AdminStatCard label="Pending" value={stats.pending} icon={FiClock} color="bg-gray-500" />
        <AdminStatCard label="Processing" value={stats.processing} icon={FiPackage} color="bg-blue-600" />
        <AdminStatCard label="Shipped" value={stats.shipped} icon={FiTruck} color="bg-amber-500" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminStatCard label="Delivered" value={stats.delivered} icon={FiCheck} color="bg-emerald-600" />
        <AdminStatCard label="Cancelled" value={stats.cancelled} icon={FiXCircle} color="bg-rose-500" />
        <div className="col-span-2 lg:col-span-1">
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-lg shadow-slate-100/50 flex items-center justify-between h-full"
          >
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Revenue (Paid)</p>
              <h3 className="text-2xl font-extrabold text-indigo-600 tabular-nums">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <FiDollarSign className="w-6 h-6" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-slate-100/50 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all outline-none text-sm font-medium"
              />
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Select 
                containerClassName="min-w-[160px] flex-1 lg:flex-none" 
                label="Status" 
                value={statusFilter} 
                onChange={setStatusFilter} 
                options={[{ value: 'all', label: 'All Statuses' }, ...statusOptions]} 
              />
              <Select 
                containerClassName="min-w-[150px] flex-1 lg:flex-none" 
                label="Payment" 
                value={paymentFilter} 
                onChange={setPaymentFilter} 
                options={[{ value: 'all', label: 'All Payments' }, { value: 'paid', label: 'Paid' }, { value: 'unpaid', label: 'Unpaid' }]} 
              />
            </div>
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Order ID</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Customer</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap text-center">Items</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Total</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Payment</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Date</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginatedOrders.map(o => (
                      <OrderRow 
                        key={o._id} 
                        order={o} 
                        onView={setViewingOrder} 
                        onUpdateStatus={handleUpdateStatus}
                        isUpdating={isUpdating}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              itemsPerPage={10}
              onPageChange={setCurrentPage}
              itemLabel="orders"
            />
          </>
        ) : (
          <EmptyState
            icon={FiShoppingCart}
            title={searchQuery ? 'No orders found' : 'No orders yet'}
            subtitle={searchQuery 
              ? `No orders match "${searchQuery}". Try a different search.` 
              : 'Orders placed by customers will appear here.'}
            searchQuery={searchQuery}
            onClear={() => setSearchQuery('')}
          />
        )}
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