import React from 'react';
import HeroSlide from './HeroSlide';
import { useHeroSlider } from '../../hooks';
import { useBananaAI } from '../../../../shared/hooks/useBananaAI';
import { Slider } from '../../../../shared/ui';

const slidesConfig = [
    {
        id: 1,
        image: "/assets/images/hero/tech.png",
        prompt: "luxury tech gadgets, modern workspace, cinematic lighting",
        title: "The Tech Revolution",
        description: "Upgrade your life with next-generation gadgets and high-performance electronics.",
        badge: "New Arrival"
    },
    {
        id: 2,
        image: "/assets/images/hero/fashion.png",
        prompt: "luxury fashion ecommerce hero, elegant handbag, white marble, cinematic lighting",
        title: "Elegant Collections",
        description: "Discover curated luxury fashion pieces and designer statement accessories.",
        badge: "Limited Edition"
    },
    {
        id: 3,
        image: "/assets/images/hero/home.png",
        prompt: "premium minimalist interior living room, modern furniture, soft lighting",
        title: "Modern Sanctuary",
        description: "Redefine your home with minimalist essentials and premium interior design.",
        badge: "Home Decor"
    }
];

const HeroSection = () => {
    return (
        <section className="relative h-[90vh] w-full bg-gray-900">
            <Slider
                effect="fade"
                speed={1000}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                pagination={{ clickable: true }}
                className="h-full w-full"
                swiperClassName="h-full w-full"
            >
                {slidesConfig.map(slide => (
                    <HeroSlide key={slide.id} slide={slide} />
                ))}
            </Slider>
        </section>
    );
};

export default HeroSection;
