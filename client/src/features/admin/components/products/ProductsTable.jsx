import { AnimatePresence } from 'framer-motion';
import { FiPackage } from 'react-icons/fi';
import ProductRow from './ProductRow.jsx';
import Pagination from '../Pagination.jsx';
import EmptyState from '../EmptyState.jsx';

const ProductsTable = ({ 
  filteredProducts, 
  paginatedProducts, 
  setViewingProduct, 
  handleUpdateField, 
  setProductToDelete, 
  isUpdating, 
  currentPage, 
  totalPages, 
  setCurrentPage, 
  searchQuery, 
  setSearchQuery 
}) => {
  if (filteredProducts.length === 0) {
    return (
      <EmptyState
        icon={FiPackage}
        title={searchQuery ? 'No products found' : 'No products yet'}
        subtitle={searchQuery 
          ? `No products match "${searchQuery}". Try a different search term.` 
          : 'Products created by sellers will appear here.'}
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
  );
};

export default ProductsTable;
