import React from 'react';
import { FiStar, FiMapPin } from 'react-icons/fi';

const CustomerInformation = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {(user.loyaltyPoints !== undefined || user.loyaltyPoints !== null) && (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Loyalty Points</p>
        <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FiStar className="w-4 h-4 text-amber-500 shrink-0" />
          {user.loyaltyPoints || 0}
        </p>
      </div>
    )}
    {user.addresses && user.addresses.length > 0 && (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Addresses</p>
        <p className="text-sm font-semibold text-gray-800 flex items-start gap-2">
          <FiMapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>{user.addresses.length} address{user.addresses.length !== 1 ? 'es' : ''}</span>
        </p>
      </div>
    )}
  </div>
);

export default CustomerInformation;
