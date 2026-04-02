import React, { useRef } from 'react';
import CategoryCard from './CategoryCard';
import { useCategories } from '../../hooks';
import { SectionTitle } from '../../../../shared/ui';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../../../utils/animations.js';

const CategoriesSection = () => {
    const { categories, isLoading } = useCategories();
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const gridRef = useRef(null);

    useGSAP(() => {
        if (prefersReducedMotion()) return;
        if (!sectionRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            if (headerRef.current) {
                const title = headerRef.current.querySelector('h2');
                const subtitle = headerRef.current.querySelector('p');
                if (title) {
                    gsap.fromTo(
                        title,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: headerRef.current,
                                start: 'top 80%',
                            },
                        }
                    );
                }
                if (subtitle) {
                    gsap.fromTo(
                        subtitle,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: headerRef.current,
                                start: 'top 80%',
                            },
                        }
                    );
                }
            }

            if (gridRef.current) {
                const cards = Array.from(gridRef.current.children);
                if (cards.length) {
                    gsap.fromTo(
                        cards,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: 'power2.out',
                            stagger: 0.12,
                            scrollTrigger: {
                                trigger: gridRef.current,
                                start: 'top 80%',
                            },
                        }
                    );
                }
            }
        }, sectionRef.current);

        return () => ctx.revert();
    }, []);

    if (isLoading || !categories.length) return null;

    return (
        <section ref={sectionRef} className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div ref={headerRef}>
                    <SectionTitle
                    title="Curated Collections"
                    subtitle="Explore our vast selection of categories, handpicked for your lifestyle."
                    align="left"
                    actionLabel="View All Categories"
                    actionLink="/categories/all"
                    className="mb-12"
                    />
                </div>

                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.slice(0, 8).map((category, idx) => (
                        <CategoryCard key={category._id} category={category} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
