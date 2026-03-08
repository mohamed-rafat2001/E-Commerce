import React from 'react';
import useFeaturedProducts from '../../hooks/useFeaturedProducts';
import { SectionTitle } from '../../../../shared/ui';
import FeaturedLargeCard from './FeaturedLargeCard';
import FeaturedSmallCard from './FeaturedSmallCard';

const FeaturedSection = () => {
    const { featuredProducts, isLoading } = useFeaturedProducts();

    if (isLoading || !featuredProducts.length) return null;

    // Use top 3 featured products as specified in instructions
    const [largeProduct, ...smallProducts] = featuredProducts.slice(0, 3);

    return (
        <section className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <SectionTitle
                        title="Featured Picks"
                        subtitle="A visually bold asymmetric layout showcasing our hand-picked hero products."
                        align="center"
                        className="mb-0"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10 grid-rows-1 md:grid-rows-2 auto-rows-fr h-auto">
                    {/* Large Card: Left side, spans 2 rows on desktop */}
                    <div className="h-full">
                        <FeaturedLargeCard product={largeProduct} />
                    </div>

                    {/* Smaller Cards: Stacked on the right */}
                    <div className="flex flex-col gap-8 md:gap-10 h-full">
                        {smallProducts.map((product, idx) => (
                            <div key={product._id} className="h-full">
                                <FeaturedSmallCard product={product} index={idx} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedSection;
