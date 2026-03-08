import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Skeleton, Badge, DataTable, EmptyState, Button } from '../../../shared/ui/index.js';
import { FiPackage, FiEye, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useProductsPage } from '../hooks/index.js';
import ProductsStats from '../components/products/ProductsStats.jsx';
import ProductsFilter from '../components/products/ProductsFilter.jsx';
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
    isDeleting,

    // Functions
    handleConfirmDelete
  } = useProductsPage();

  const navigate = useNavigate();

  const columns = [
    {
      header: 'Product',
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
            {row.coverImage?.secure_url ? (
              <img src={row.coverImage.secure_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <FiPackage />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-gray-900 truncate">{row.name}</span>
            <span className="text-xs text-gray-400 capitalize">{row.brandId?.name || 'No Brand'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Price',
      render: (row) => <span className="font-black text-gray-900">${row.price?.amount || 0}</span>
    },
    {
      header: 'Stock',
      render: (row) => (
        <div className="flex flex-col">
          <span className={`font-bold ${row.countInStock <= 5 ? 'text-red-500' : 'text-gray-900'}`}>{row.countInStock}</span>
          <span className="text-[10px] uppercase font-bold text-gray-400">Available</span>
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'warning'}>
          {row.status.toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/products/${row._id}`)} icon={<FiEye />} />
          <Button variant="ghost" size="sm" onClick={() => setProductToDelete(row)} icon={<FiTrash2 />} className="text-red-400 hover:text-red-600" />
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
        <Skeleton variant="card" className="h-[500px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Global Catalog"
        subtitle="High-level management of all products, stock levels, and marketplace listings."
      />

      <ProductsStats stats={stats} />

      <Card padding="none" className="overflow-hidden">
        <ProductsFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryOptions={categoryOptions}
        />

        {filteredProducts.length > 0 ? (
          <DataTable
            columns={columns}
            data={paginatedProducts}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            currentPage={currentPage}
          />
        ) : (
          <EmptyState
            icon={<FiPackage className="w-12 h-12" />}
            title="No products in catalog"
            message="We couldn't find any products matching your current filters."
          />
        )}
      </Card>

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
