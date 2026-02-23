import { FiTag, FiExternalLink, FiUser } from 'react-icons/fi';
import { LoadingSpinner } from '../../../../shared/ui/index.js';
import Pagination from '../Pagination.jsx';

const BrandsTable = ({ brands, loading, total, page, totalPages, handlePageChange }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Brand Details</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Seller</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Status</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center">
                  <LoadingSpinner size="sm" />
                </td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <FiTag className="w-12 h-12 mb-3 text-gray-200" />
                    <p className="text-lg font-medium text-gray-900">No brands found</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                  </div>
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {brand.logo?.secure_url ? (
                        <img src={brand.logo.secure_url} alt={brand.name} className="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-100 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400 shrink-0">
                          <FiTag className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate" title={brand.name}>{brand.name}</p>
                        {brand.website ? (
                          <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center gap-1 mt-0.5 truncate">
                            Visit Website <FiExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <p className="text-xs text-gray-400 mt-0.5 italic">No website</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {brand.sellerId ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold border border-purple-100 shrink-0">
                          {brand.sellerId.userId?.firstName?.[0] || <FiUser />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {brand.sellerId.userId ? `${brand.sellerId.userId.firstName} ${brand.sellerId.userId.lastName}` : 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate" title={brand.sellerId.businessEmail || brand.sellerId.userId?.email}>
                            {brand.sellerId.businessEmail || brand.sellerId.userId?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 text-xs font-medium">
                        <FiUser className="w-3 h-3" /> Unassigned
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      brand.isActive 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${brand.isActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {brand.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(brand.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {total > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/30">
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default BrandsTable;
