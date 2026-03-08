import React from 'react';
import { Badge } from '../../../../shared/ui';

const ProductStatusBadges = ({ status, visibility }) => {
    const statusColors = {
        active: 'bg-emerald-500 text-white',
        inactive: 'bg-gray-400 text-white',
        draft: 'bg-amber-400 text-white',
        archived: 'bg-rose-500 text-white'
    };

    const visibilityColors = {
        public: 'bg-indigo-500 text-white',
        private: 'bg-gray-400 text-white'
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Badge className={`${statusColors[status?.toLowerCase()] || statusColors.active} border-none font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-xl shadow-lg shadow-gray-200/50`}>
                {status || 'Active'}
            </Badge>
            <Badge className={`${visibilityColors[visibility?.toLowerCase()] || visibilityColors.public} border-none font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-xl shadow-lg shadow-gray-200/50`}>
                {visibility || 'Public'}
            </Badge>
        </div>
    );
};

export default ProductStatusBadges;
