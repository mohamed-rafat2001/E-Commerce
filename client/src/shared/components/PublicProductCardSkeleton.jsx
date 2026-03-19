import React from 'react';

const PublicProductCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
            {/* Image Area */}
            <div className="relative aspect-[4/5] bg-gray-200 animate-pulse rounded-none w-full" />

            {/* Product Info Section */}
            <div className="p-4 bg-white flex flex-col gap-2 flex-1">
                {/* Category Row */}
                <div className="flex items-center justify-between mb-1">
                    <div className="h-3 w-16 bg-gray-200 animate-pulse rounded" />
                    <div className="h-3 w-8 bg-gray-200 animate-pulse rounded" />
                </div>

                {/* Name */}
                <div className="mt-1 flex flex-col gap-2 min-h-[2.5rem]">
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
                </div>

                {/* Price Row */}
                <div className="mt-auto pt-1 mb-1">
                    <div className="h-5 w-20 bg-gray-200 animate-pulse rounded" />
                </div>

                {/* Button */}
                <div className="mt-1">
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default PublicProductCardSkeleton;
