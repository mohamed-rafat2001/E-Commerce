import React from 'react';
import HeroSlide from './HeroSlide';
import { useHeroSlider } from '../../hooks';
import { useBananaAI } from '../../../../shared/hooks/useBananaAI';
import { Slider } from '../../../../shared/ui';

const slidesConfig = [
    {
        id: 1,
        prompt: "luxury fashion ecommerce hero, elegant woman shopping, cinematic lighting, high fashion editorial",
        title: "Elegant Collections",
        description: "Discover curated luxury fashion pieces from around the world.",
        badge: "Limited Edition"
    },
    {
        id: 2,
        prompt: "modern electronics store hero, sleek products on dark background, blue neon accent lights",
        title: "The Tech Revolution",
        description: "Upgrade your life with next-generation gadgets and electronics.",
        badge: "New Arrival"
    },
    {
        id: 3,
        prompt: "premium beauty products flat lay, pastel colors, soft lighting, luxury cosmetics",
        title: "Natural Radiance",
        description: "Experience premium beauty and skincare designed for you.",
        badge: "Hot Choice"
    },
    {
        id: 4,
        prompt: "sporty lifestyle hero, athletic person outdoor, vibrant colors, energetic composition",
        title: "Peak Performance",
        description: "Gear up for greatness with our professional athletic collections.",
        badge: "Active Wear"
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
