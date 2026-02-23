import { Select } from '../../../../shared/ui/index.js';
import { FiSearch } from 'react-icons/fi';
import { statusOptions } from './productConstants.js';

const ProductsFilter = ({ 
  searchQuery, 
  setSearchQuery, 
  categoryFilter, 
  setCategoryFilter, 
  statusFilter, 
  setStatusFilter, 
  categoryOptions 
}) => {
  return (
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
  );
};

export default ProductsFilter;
