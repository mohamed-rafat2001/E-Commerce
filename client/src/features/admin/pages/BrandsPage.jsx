import { PageHeader, Card, Skeleton, EmptyState, DataTable } from '../../../shared/ui/index.js';
import { useBrandsPage } from '../hooks/index.js';
import BrandsHeader from '../components/brands/BrandsHeader.jsx';
import BrandsFilter from '../components/brands/BrandsFilter.jsx';
import { FiTag } from 'react-icons/fi';

const BrandsPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    brands,
    total,
    loading,
    page,
    limit,
    totalPages,
    handleSearch,
    handlePageChange,
    handleClearSearch
  } = useBrandsPage();

  const columns = [
    {
      header: 'Brand',
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center p-1">
            {row.logo?.secure_url ? (
              <img src={row.logo.secure_url} alt="" className="max-w-full max-h-full object-contain" />
            ) : (
              <FiTag className="text-gray-300" />
            )}
          </div>
          <span className="font-bold text-gray-900">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Product Count',
      render: (row) => <span className="font-medium text-gray-500">{row.productsCount || 0} Products</span>
    },
    {
      header: 'Status',
      render: (row) => (
        <div className={`w-2 h-2 rounded-full ${row.active ? 'bg-emerald-500' : 'bg-gray-300'}`} />
      )
    }
  ];

  if (loading && !brands.length) {
    return (
      <div className="space-y-8">
        <Skeleton variant="text" className="w-1/4 h-10" />
        <Skeleton variant="card" className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Brand Portfolio"
        subtitle="Manage the manufacturers and labels featured in your marketplace."
      />

      <Card padding="none" className="overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900 font-display">Active Partners</h3>
        </div>

        <BrandsFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          handleClearSearch={handleClearSearch}
        />

        {brands.length > 0 ? (
          <DataTable
            columns={columns}
            data={brands}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : (
          <EmptyState
            icon={<FiTag className="w-12 h-12" />}
            title="No brands found"
            message="Your search criteria didn't match any brands in our database."
          />
        )}
      </Card>
    </div>
  );
};

export default BrandsPage;
