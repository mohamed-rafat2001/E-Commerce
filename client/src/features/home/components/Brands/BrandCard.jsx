import React from 'react';

const BrandCard = ({ brand }) => {
    return (
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer min-w-[200px] justify-center">
            {brand.logo ? (
                <img
                    src={brand.logo.secure_url}
                    alt={brand.name}
                    className="h-8 w-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                />
            ) : (
                <span className="text-xl font-bold text-gray-300 group-hover:text-indigo-600 transition-colors duration-500">
                    {brand.name}
                </span>
            )}
        </div>
    );
};

export default BrandCard;
