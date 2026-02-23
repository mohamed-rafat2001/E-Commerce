import React from 'react';
import { Button, LoadingSpinner } from '../../../../../shared/ui/index.js';

const PurchaseHistory = ({ orders, purchasedProducts, isLoadingOrders, page, setPage, totalPages }) => {
  if (isLoadingOrders) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No orders found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-800 mb-3">Purchased Products (from current orders page)</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Product</th>
              <th className="py-3 px-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Price</th>
              <th className="py-3 px-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Quantity</th>
              <th className="py-3 px-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Order ID</th>
            </tr>
          </thead>
          <tbody>
            {purchasedProducts.map((product, idx) => (
              <tr key={`${product.id}-${idx}`} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-800">
                  <div className="flex items-center gap-2">
                    {product.image && <img src={product.image} alt="" className="w-8 h-8 rounded object-cover" />}
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm font-semibold">${product.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-sm">{product.quantity}</td>
                <td className="py-3 px-4 text-sm text-indigo-600 font-medium">
                  <span title={product.order}>{product.order.substring(0, 8)}...</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6">
        <h4 className="font-semibold text-gray-800 mb-3">Order History</h4>
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-800" title={order.id}>{order.id.substring(0, 8)}...</p>
                  <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">${order.total.toFixed(2)}</p>
                  <p className="text-xs font-semibold text-gray-500">{order.itemsCount} item{order.itemsCount !== 1 ? 's' : ''}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                    order.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
