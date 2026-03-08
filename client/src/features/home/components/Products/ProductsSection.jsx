import React from 'react';
import ProductGrid from './ProductGrid';
import { useProducts } from '../../hooks';
import { SectionTitle } from '../../../../shared/ui';

const ProductsSection = () => {
    const { products, isLoading, handleAddToCart } = useProducts();

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <SectionTitle
                    title="New Arrivals"
                    subtitle="Be the first to get your hands on our latest premium products."
                    align="center"
                    actionLabel="View All Products"
                    actionLink="/products"
                    className="mb-16"
                />

                <ProductGrid
                    products={products}
                    isLoading={isLoading}
                    onAddToCart={handleAddToCart}
                />
            </div>
        </section>
    );
};

export default ProductsSection;
