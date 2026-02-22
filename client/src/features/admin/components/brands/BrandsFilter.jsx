import { FiSearch } from 'react-icons/fi';

const BrandsFilter = ({ searchTerm, setSearchTerm, handleSearch, handleClearSearch }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
      <form onSubmit={handleSearch} className="flex-1 relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search brands by name..." 
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
             type="button"
             onClick={handleClearSearch}
             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        )}
      </form>
    </div>
  );
};

export default BrandsFilter;
