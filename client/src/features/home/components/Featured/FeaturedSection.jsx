import React, { useRef } from 'react';
import useFeaturedProducts from '../../hooks/useFeaturedProducts';
import { SectionTitle } from '../../../../shared/ui';
import { PublicProductCard, PublicProductCardSkeleton } from '../../../../shared';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../../../utils/animations.js';

const FeaturedSection = () => {
    const { featuredProducts, isLoading } = useFeaturedProducts();
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const gridRef = useRef(null);

    useGSAP(() => {
        if (prefersReducedMotion()) return;
        if (!sectionRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            if (headerRef.current) {
                const h2 = headerRef.current.querySelector('h2');
                if (h2) {
                    const underline = document.createElement('span');
                    underline.className = 'block h-0.5 bg-indigo-600 mt-4 origin-left will-change-transform';
                    underline.style.transform = 'scaleX(0)';
                    h2.appendChild(underline);
                    gsap.to(underline, {
                        scaleX: 1,
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: headerRef.current,
                            start: 'top 80%',
                        },
                    });
                }
            }

            if (gridRef.current) {
                const items = Array.from(gridRef.current.children);
                if (items.length) {
                    gsap.fromTo(
                        items,
                        { opacity: 0, y: 60 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.55,
                            ease: 'power2.out',
                            stagger: 0.1,
                            scrollTrigger: {
                                trigger: gridRef.current,
                                start: 'top 80%',
                            },
                        }
                    );
                }

                const images = gridRef.current.querySelectorAll('[data-card-image]');
                images.forEach((el) => {
                    gsap.to(el, {
                        y: 20,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1,
                        },
                    });
                    gsap.from(el, {
                        y: -20,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1,
                        },
                    });
                });
            }
        }, sectionRef.current);

        return () => ctx.revert();
    }, []);

    if (!isLoading && (!featuredProducts || !featuredProducts.length)) return null;

    return (
        <section ref={sectionRef} className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div ref={headerRef} className="text-center mb-16">
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
                    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
