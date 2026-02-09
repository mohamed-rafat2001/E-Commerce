import { AnimatePresence } from 'framer-motion';
import { Select, LoadingSpinner } from '../../../shared/ui/index.js';
import { FiSearch, FiPackage, FiActivity, FiEdit2, FiAlertCircle, FiBox } from 'react-icons/fi';
import useProductsPage from '../hooks/useProductsPage.js';
import { statusOptions } from '../components/products/productConstants.js';
import AdminStatCard from '../components/AdminStatCard.jsx';
import Pagination from '../components/Pagination.jsx';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProductDetailModal from '../components/products/ProductDetailModal.jsx';
import ProductRow from '../components/products/ProductRow.jsx';

const ProductsPage = () => {
  const {
    // State
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    viewingProduct,
    setViewingProduct,
    productToDelete,
    setProductToDelete,
    currentPage,
    setCurrentPage,

    // Data
    products,
    categories,
    filteredProducts,
    paginatedProducts,
    totalPages,
    stats,
    categoryOptions,

    // Loading states
    isLoading,
    isUpdating,
    isDeleting,

    // Functions
    handleUpdateField,
    handleConfirmDelete
  } = useProductsPage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading products..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage all products across your marketplace</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <AdminStatCard label="Total Products" value={stats.total} icon={FiPackage} color="bg-gray-900" />
        <AdminStatCard label="Active" value={stats.active} icon={FiActivity} color="bg-emerald-600" />
        <AdminStatCard label="Draft" value={stats.draft} icon={FiEdit2} color="bg-amber-500" />
        <AdminStatCard label="Low Stock" value={stats.lowStock} icon={FiAlertCircle} color="bg-orange-500" />
        <AdminStatCard label="Out of Stock" value={stats.outOfStock} icon={FiBox} color="bg-rose-500" />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-slate-100/50 overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all outline-none text-sm font-medium"
              />
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Select 
                containerClassName="min-w-[170px] flex-1 lg:flex-none" 
                label="Category" 
                value={categoryFilter} 
                onChange={setCategoryFilter} 
                options={[{ value: 'all', label: 'All Categories' }, ...categoryOptions]} 
              />
              <Select 
                containerClassName="min-w-[170px] flex-1 lg:flex-none" 
                label="Status" 
                value={statusFilter} 
                onChange={setStatusFilter} 
                options={[{ value: 'all', label: 'All Statuses' }, ...statusOptions]} 
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Product</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Brand</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Price</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Stock</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Category</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Rating</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400 uppercase text-[11px] tracking-wider whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginatedProducts.map(p => (
                      <ProductRow 
                        key={p._id} 
                        product={p} 
                        onView={setViewingProduct} 
                        onUpdateField={handleUpdateField} 
                        onDelete={setProductToDelete} 
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
              totalItems={filteredProducts.length}
              itemsPerPage={10}
              onPageChange={setCurrentPage}
              itemLabel="products"
            />
          </>
        ) : (
          <EmptyState
            icon={FiPackage}
            title={searchQuery ? 'No products found' : 'No products yet'}
            subtitle={searchQuery 
              ? `No products match "${searchQuery}". Try a different search term.` 
              : 'Products created by sellers will appear here.'}
            searchQuery={searchQuery}
            onClear={() => setSearchQuery('')}
          />
        )}
      </div>

      <ProductDetailModal 
        product={viewingProduct} 
        isOpen={!!viewingProduct} 
        onClose={() => setViewingProduct(null)} 
      />

      <DeleteConfirmModal 
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Delete Product"
        entityName={productToDelete?.name}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProductsPage;