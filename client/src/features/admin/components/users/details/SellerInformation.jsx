import React from 'react';
import { FiInfo, FiMail, FiPhone, FiUserCheck, FiCreditCard, FiStar, FiDollarSign, FiTag } from 'react-icons/fi';
import { Button, LoadingSpinner } from '../../../../../shared/ui/index.js';

const SellerInformation = ({ user, brands, total, totalPages, loadingBrands, page, setPage }) => {
  const seller = user.seller || {};
  
  if (!user.seller && user.role === 'Seller') {
    return (
      <div className="p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
        <div className="flex items-center gap-2 font-semibold">
          <FiInfo className="w-5 h-5" />
          Seller Profile Missing
        </div>
        <p className="mt-1 text-sm">
          This user has the 'Seller' role but no associated seller profile was found in the database.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Company</p>
          <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <FiInfo className="w-4 h-4 text-indigo-500 shrink-0" />
            {seller.brand || user.companyName || '—'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Business Email</p>
          <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <FiMail className="w-4 h-4 text-emerald-500 shrink-0" />
            {seller.businessEmail || user.businessEmail || user.email}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Business Phone</p>
          <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <FiPhone className="w-4 h-4 text-purple-500 shrink-0" />
            {seller.businessPhone || user.businessPhone || user.phoneNumber || '—'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</p>
          <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <FiUserCheck className="w-4 h-4 text-blue-500 shrink-0" />
            {seller.status || user.status || '—'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Verification</p>
          <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <FiCreditCard className="w-4 h-4 text-green-500 shrink-0" />
            {seller.verificationStatus || user.verificationStatus || '—'}
          </p>
        </div>
        {(seller.ratingAverage !== undefined || user.ratingAverage !== undefined) && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Rating</p>
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <FiStar className="w-4 h-4 text-amber-500 shrink-0" />
              {(seller.ratingAverage || user.ratingAverage || 0).toFixed(1)} ({(seller.ratingCount || user.ratingCount || 0)} reviews)
            </p>
          </div>
        )}
        {(seller.balance || user.balance) && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Balance</p>
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <FiDollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
              ${(seller.balance?.amount || user.balance?.amount || 0).toFixed(2)} {(seller.balance?.currency || user.balance?.currency || 'USD')}
            </p>
          </div>
        )}
      </div>

      {/* Brands Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
         <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
           <FiTag className="w-4 h-4 text-indigo-500" />
           Managed Brands ({total || 0})
         </h4>
         
         {loadingBrands ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="sm" />
            </div>
         ) : (!brands || brands.length === 0) ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <FiTag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No brands found for this seller.</p>
            </div>
         ) : (
           <>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {brands.map(brand => (
                 <div key={brand._id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                   {brand.logo?.secure_url ? (
                     <img src={brand.logo.secure_url} alt={brand.name} className="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-100" />
                   ) : (
                     <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400 shrink-0">
                       <FiTag className="w-6 h-6" />
                     </div>
                   )}
                   <div className="min-w-0">
                     <h5 className="font-bold text-gray-900 truncate" title={brand.name}>{brand.name}</h5>
                     <div className="flex items-center gap-2 mt-1">
                       <span className={`inline-block w-2 h-2 rounded-full ${brand.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                       <p className="text-xs text-gray-500 truncate">
                         {brand.isActive ? 'Active' : 'Inactive'}
                       </p>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
             
             {/* Pagination Controls */}
             {totalPages > 1 && (
               <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
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
           </>
         )}
      </div>
    </div>
  );
};

export default SellerInformation;
