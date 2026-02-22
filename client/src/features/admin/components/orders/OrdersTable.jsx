import { AnimatePresence } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';
import OrderRow from './OrderRow.jsx';
import Pagination from '../Pagination.jsx';
import EmptyState from '../EmptyState.jsx';

const OrdersTable = ({ 
  filteredOrders, 
  paginatedOrders, 
  setViewingOrder, 
  handleUpdateStatus, 
  isUpdating, 
  currentPage, 
  totalPages, 
  setCurrentPage, 
  searchQuery, 
  setSearchQuery 
}) => {
  if (filteredOrders.length === 0) {
    return (
      <EmptyState
        icon={FiShoppingCart}
        title={searchQuery ? 'No orders found' : 'No orders yet'}
        subtitle={searchQuery 
          ? `No orders match "${searchQuery}". Try a different search.` 
          : 'Orders placed by customers will appear here.'}
        searchQuery={searchQuery}
        onClear={() => setSearchQuery('')}
      />
    );
  }

  return (
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
  );
};

export default OrdersTable;
