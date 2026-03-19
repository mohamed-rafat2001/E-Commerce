import React from 'react';
import { PublicProductCard, PublicProductCardSkeleton } from '../../../../shared';

const ProductGrid = ({ products, isLoading, count = 8 }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(count)].map((_, i) => (
                    <PublicProductCardSkeleton key={`skeleton-${i}`} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
                <PublicProductCard
                    key={product._id}
                    product={product}
                />
            ))}
        </div>
    );
};

export default ProductGrid;
