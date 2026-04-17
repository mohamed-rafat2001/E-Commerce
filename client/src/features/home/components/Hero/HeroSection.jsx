import React from 'react';
import HeroSlide from './HeroSlide';
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
        <section className="relative h-dvh min-h-dvh w-full bg-gray-900">
            <Slider
                effect="fade"
                speed={700}
                autoplay={{ delay: 6000, disableOnInteraction: true, pauseOnMouseEnter: true }}
                loop={slidesConfig?.length > 1}
                pagination={{ clickable: true }}
                className="h-full w-full"
                swiperClassName="h-full w-full"
            >
                {slidesConfig.map((slide, index) => (
                    <HeroSlide key={slide.id} slide={slide} priority={index === 0} />
                ))}
            </Slider>
        </section>
    );
};

export default HeroSection;
