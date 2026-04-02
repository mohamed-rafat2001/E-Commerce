import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from '../../../../shared/ui';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../../../../utils/animations.js';

const HeroSlide = ({ slide }) => {
    const imageUrl = slide.image;
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const ctaRef = useRef(null);

    useGSAP(() => {
        if (prefersReducedMotion()) return;
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            if (bgRef.current) {
                gsap.fromTo(
                    bgRef.current,
                    { scale: 1 },
                    { scale: 1.08, duration: 8, ease: "power1.out" }
                );
            }

            if (titleRef.current) {
                const text = titleRef.current.textContent || "";
                const words = text.split(" ").map(word => `<span class="inline-block will-change-transform opacity-0 translate-y-10">${word}</span>`);
                titleRef.current.innerHTML = words.join(" ");
                const wordSpans = titleRef.current.querySelectorAll("span");
                gsap.to(wordSpans, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    stagger: 0.08
                });
            }

            if (descRef.current) {
                gsap.fromTo(
                    descRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.6 }
                );
            }

            if (ctaRef.current) {
                gsap.fromTo(
                    ctaRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.9 }
                );
            }
        }, containerRef.current);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative h-full w-full flex items-center">
            {/* Background Image Container */}
            <div
                ref={bgRef}
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat will-change-transform"
                style={{ backgroundImage: `url("${imageUrl}")` }}
            >
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="max-w-2xl text-white">
                        <Badge variant="featured" className="mb-6 uppercase tracking-wider">
                            {slide.badge}
                        </Badge>

                        <h1
                            ref={titleRef}
                            className="text-5xl md:text-7xl font-black font-display mb-6 leading-[1.1]"
                        >
                            {slide.title}
                        </h1>

                        <p
                            ref={descRef}
                            className="text-xl text-gray-200 mb-10 leading-relaxed font-body"
                        >
                            {slide.description}
                        </p>

                        <div
                            ref={ctaRef}
                            className="flex flex-wrap gap-4"
                        >
                            <Button onClick={() => navigate('/products')} variant="premium" size="lg" className="px-10">
                                Shop Now
                            </Button>
                            <Button onClick={() => navigate('/register')} variant="outline" size="lg" className="px-10">
                                Sell With Us
                            </Button>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSlide;
