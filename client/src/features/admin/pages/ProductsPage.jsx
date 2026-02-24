import { LoadingSpinner } from '../../../shared/ui/index.js';
import { useNavigate } from 'react-router-dom';
import { useProductsPage } from '../hooks/index.js';
import ProductsStats from '../components/products/ProductsStats.jsx';
import ProductsFilter from '../components/products/ProductsFilter.jsx';
import ProductsTable from '../components/products/ProductsTable.jsx';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';

const ProductsPage = () => {
  const {
    // State
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    productToDelete,
    setProductToDelete,
    currentPage,
    setCurrentPage,

    // Data
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

  const navigate = useNavigate();

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
      <ProductsStats stats={stats} />

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-slate-100/50 overflow-hidden">
        <ProductsFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryOptions={categoryOptions}
        />

      <ProductsTable 
          filteredProducts={filteredProducts}
          paginatedProducts={paginatedProducts}
        setViewingProduct={(p) => navigate(`/admin/products/${p._id}`)}
          handleUpdateField={handleUpdateField}
          setProductToDelete={setProductToDelete}
          isUpdating={isUpdating}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

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
