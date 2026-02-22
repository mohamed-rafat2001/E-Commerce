import { LoadingSpinner } from '../../../shared/ui/index.js';
import { useBrandsPage } from '../hooks/index.js';
import BrandsHeader from '../components/brands/BrandsHeader.jsx';
import BrandsFilter from '../components/brands/BrandsFilter.jsx';
import BrandsTable from '../components/brands/BrandsTable.jsx';

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

  if (loading && !brands.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <BrandsHeader />
       <BrandsFilter 
         searchTerm={searchTerm} 
         setSearchTerm={setSearchTerm} 
         handleSearch={handleSearch} 
         handleClearSearch={handleClearSearch} 
       />
       <BrandsTable 
         brands={brands} 
         loading={loading} 
         total={total} 
         page={page} 
         limit={limit} 
         totalPages={totalPages} 
         handlePageChange={handlePageChange} 
       />
    </div>
  );
};

export default BrandsPage;
