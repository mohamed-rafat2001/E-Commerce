import React from 'react';
import ProductCard from './ProductCard';
import { Skeleton } from '../../../../shared/ui';

const ProductGrid = ({ products, isLoading, onAddToCart }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <Skeleton variant="image" className="aspect-[4/5] h-auto" />
                        <Skeleton variant="text" className="w-1/2" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" className="w-1/3" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    index={idx}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
};

export default ProductGrid;
