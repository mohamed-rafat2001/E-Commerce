import React from 'react';
import FeaturedCard from './FeaturedCard';
import { useFeaturedProducts } from '../../hooks';
import { SectionTitle } from '../../../../shared/ui';

const FeaturedSection = () => {
    const { featuredProducts, isLoading } = useFeaturedProducts();

    if (isLoading || !featuredProducts.length) return null;

    return (
        <section className="py-24 bg-gray-900 border-y border-white/5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -ml-64 -mb-64" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-white mb-16">
                    <SectionTitle
                        title="Premium Spotlight"
                        subtitle="The absolute best of the season, selected by our experts for your discerning taste."
                        align="left"
                        className="[&_h2]:text-white! [&_p]:text-gray-400!"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredProducts.map((product, idx) => (
                        <FeaturedCard
                            key={product._id}
                            product={product}
                            isLarge={idx === 0}
                            index={idx}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedSection;
