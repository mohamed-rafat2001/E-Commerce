import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import TestimonialCard from './TestimonialCard';
import { SectionTitle } from '../../../../shared/ui';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
    { id: 1, name: "Sarah Johnson", comment: "The best e-commerce experience I've ever had. Logistics are incredibly fast and products are premium.", avatar: null },
    { id: 2, name: "Michael Chen", comment: "As a seller, the analytics dashboard changed my business. I can finally see what's driving my sales.", avatar: null },
    { id: 3, name: "Emma Wilson", comment: "Customer support is top-notch. They handled my return in minutes. Highly recommended platform!", avatar: null },
    { id: 4, name: "David Roberts", comment: "The product selection is curated perfectly. I always find something unique here.", avatar: null }
];

const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <SectionTitle
                    title="What Our Community Says"
                    subtitle="Join thousands of happy shoppers and sellers who found their home in our marketplace."
                    align="center"
                    className="mb-16"
                />

                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{ delay: 5000 }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
                    className="pb-16"
                >
                    {testimonials.map(item => (
                        <SwiperSlide key={item.id}>
                            <TestimonialCard reviewer={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default TestimonialsSection;
