import React from 'react';
import useFeaturedProducts from '../../hooks/useFeaturedProducts';
import { SectionTitle } from '../../../../shared/ui';
import { PublicProductCard, PublicProductCardSkeleton } from '../../../../shared';

const FeaturedSection = () => {
    const { featuredProducts, isLoading } = useFeaturedProducts();

    if (!isLoading && (!featuredProducts || !featuredProducts.length)) return null;

    return (
        <section className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <SectionTitle
                        title="Featured Picks"
                        subtitle="Our hand-picked most impressive hero products for this week."
                        align="center"
                        className="mb-0"
                    />
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <PublicProductCardSkeleton key={`skeleton-${i}`} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {featuredProducts.slice(0, 8).map((product) => (
                            <PublicProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedSection;
