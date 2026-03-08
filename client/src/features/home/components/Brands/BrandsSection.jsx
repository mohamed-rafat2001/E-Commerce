import React from 'react';
import BrandCard from './BrandCard';
import { useBrands } from '../../hooks';
import { ScrollReveal, SectionTitle } from '../../../../shared/ui';

const BrandsSection = () => {
    const { brands, isLoading } = useBrands();

    if (isLoading || !brands.length) return null;

    const mid = Math.ceil(brands.length / 2);
    const row1 = brands.slice(0, mid);
    const row2 = brands.slice(mid);

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <SectionTitle
                    title="Global Brand Partners"
                    subtitle="Collaborating with the world's most innovative brands to bring you premium quality."
                    align="center"
                    className="mb-16"
                />
            </div>

            <div className="flex flex-col gap-8">
                {/* Row 1: Left to Right */}
                <div className="animate-scroll-left hover:pause">
                    <div className="flex gap-8 px-4">
                        {row1.map((brand, idx) => (
                            <BrandCard key={`r1-${idx}`} brand={brand} />
                        ))}
                    </div>
                </div>

                {/* Row 2: Right to Left */}
                <div className="animate-scroll-right hover:pause">
                    <div className="flex gap-8 px-4">
                        {row2.map((brand, idx) => (
                            <BrandCard key={`r2-${idx}`} brand={brand} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandsSection;
