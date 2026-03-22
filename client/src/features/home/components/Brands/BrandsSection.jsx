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
    const trackRef = useRef(null);
    const tweenRef = useRef(null);

    useGSAP(() => {
        if (prefersReducedMotion()) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
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

            if (trackRef.current) {
                tweenRef.current = gsap.to(trackRef.current, {
                    xPercent: -50,
                    duration: 20,
                    ease: 'none',
                    repeat: -1,
                });
            }
        }, sectionRef);

        return () => {
            if (tweenRef.current) tweenRef.current.kill();
            ctx.revert();
        };
    }, []);

    if (isLoading || !brands.length) return null;

    const loopBrands = [...brands, ...brands];

    return (
        <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <SectionTitle
                    title="Global Brand Partners"
                    subtitle="Collaborating with the world's most innovative brands to bring you premium quality."
                    align="center"
                    className="mb-16"
                />
            </div>

            <div className="px-4">
                <div
                    ref={trackRef}
                    className="flex gap-8 w-[200%] will-change-transform"
                    onMouseEnter={() => tweenRef.current && tweenRef.current.pause()}
                    onMouseLeave={() => tweenRef.current && tweenRef.current.resume()}
                >
                    {loopBrands.map((brand, idx) => (
                        <BrandCard key={`brand-${idx}`} brand={brand} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandsSection;
