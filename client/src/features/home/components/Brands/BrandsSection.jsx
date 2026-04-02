import React, { useRef } from 'react';
import BrandCard from './BrandCard';
import { useBrands } from '../../hooks';
import { SectionTitle } from '../../../../shared/ui';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../../../utils/animations.js';

const BrandsSection = () => {
    const { brands, isLoading } = useBrands();
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    useGSAP(() => {
        if (prefersReducedMotion()) return;
        if (!sectionRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            if (sectionRef.current) {
                gsap.fromTo(
                    sectionRef.current,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.5,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 90%',
                        },
                    }
                );
            }

            if (gridRef.current) {
                const cards = Array.from(gridRef.current.children);
                if (cards.length) {
                    gsap.fromTo(
                        cards,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            ease: 'power2.out',
                            stagger: 0.08,
                            scrollTrigger: {
                                trigger: gridRef.current,
                                start: 'top 85%',
                            },
                        }
                    );
                }
            }
        }, sectionRef.current);

        return () => {
            ctx.revert();
        };
    }, []);

    if (isLoading || !brands.length) return null;

    return (
        <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <SectionTitle
                    title="Global Brand Partners"
                    subtitle="Collaborating with the world's most innovative brands to bring you premium quality."
                    align="center"
                    actionLabel="View All Brands"
                    actionLink="/brands/all"
                    className="mb-16"
                />
                <div
                    ref={gridRef}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                    {brands.slice(0, 10).map((brand, idx) => (
                        <BrandCard key={`${brand._id || brand.id || idx}`} brand={brand} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandsSection;
