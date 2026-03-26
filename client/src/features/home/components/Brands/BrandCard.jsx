import React from 'react';
import { Link } from 'react-router-dom';

const BrandCard = ({ brand }) => {
    return (
        <Link
            to={`/brands/${brand._id || brand.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer min-w-[120px] justify-center"
        >
            {brand.logo ? (
                <img
                    src={brand.logo.secure_url}
                    alt={brand.name}
                    className="h-6 w-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                />
            ) : (
                <span className="text-base font-bold text-gray-300 group-hover:text-indigo-600 transition-colors duration-500">
                    {brand.name}
                </span>
            )}
        </Link>
    );
};

export default BrandCard;
