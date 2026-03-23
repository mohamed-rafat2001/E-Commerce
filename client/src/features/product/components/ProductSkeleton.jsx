import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link skeleton */}
        <div className="h-4 w-40 bg-gray-100 rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Gallery */}
          <div className="space-y-6">
            <div className="aspect-square w-full bg-gray-100 rounded-2xl" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div className="h-6 w-32 bg-gray-100 rounded-full" />
              <div className="h-6 w-40 bg-gray-100 rounded" />
            </div>
            <div className="h-10 w-3/4 bg-gray-100 rounded" />
            <div className="h-6 w-1/4 bg-gray-100 rounded" />
            <div className="h-12 w-1/3 bg-gray-100 rounded mt-6" />

            <div className="space-y-4">
              <div className="h-4 w-48 bg-gray-100 rounded" />
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-100" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-4 w-24 bg-gray-100 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <div className="h-14 flex-1 bg-gray-100 rounded-full" />
              <div className="h-14 w-32 bg-gray-100 rounded-full" />
            </div>

            <div className="space-y-4 pt-6">
              <div className="h-12 w-full bg-gray-50 rounded-xl" />
              <div className="h-12 w-full bg-gray-50 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
