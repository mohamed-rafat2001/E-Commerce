import React from 'react';
import { FiTruck, FiShield } from 'react-icons/fi';

const TrustBadges = () => {
  return (
    <div className="space-y-6 pt-8 mt-8 border-t border-gray-100">
      <div className="flex gap-4 items-start group">
        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
          <FiTruck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm mb-1">Free Express Shipping</h4>
          <p className="text-gray-500 text-xs leading-relaxed">
            Estimated delivery: Oct 12 - Oct 14
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-start group">
        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
          <FiShield className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm mb-1">Curator's Authenticity Guarantee</h4>
          <p className="text-gray-500 text-xs leading-relaxed">
            Every item is verified by our specialist team for quality and authenticity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
