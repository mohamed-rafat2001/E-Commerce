import React from 'react';
import { Link } from 'react-router-dom';

const BrandCard = ({ brand }) => {
    const brandId = brand._id || brand.id;
    const logoUrl = brand.logo?.secure_url || brand.logo?.url || brand.logo;

    return (
        <Link
            to={`/brands/${brandId}`}
            className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 group cursor-pointer"
        >
            {logoUrl ? (
                <img
                    src={logoUrl}
                    alt={brand.name}
                    className="h-8 w-8 rounded-full object-cover border border-gray-100"
                    crossOrigin="anonymous"
                />
            ) : (
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500">
                    {(brand.name || 'BR').slice(0, 2).toUpperCase()}
                </div>
            )}
            <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-700 transition-colors duration-300 line-clamp-1">
                {brand.name}
            </span>
        </Link>
    );
};

export default BrandCard;
