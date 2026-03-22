import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiZap, FiArrowRight } from 'react-icons/fi';
import { Slider } from '../../../../shared/ui';
import useFlashSale from '../../hooks/useFlashSale';
import CountdownTimer from './CountdownTimer';
import FlashSaleCard from './FlashSaleCard';
import { PublicProductCard, PublicProductCardSkeleton } from '../../../../shared';
import useAddToCart from '../../../cart/hooks/useAddToCart';

const FlashSaleSection = () => {
    const { products, isLoading, endTime } = useFlashSale();
    const { addToCart } = useAddToCart();

    if (!isLoading && products.length === 0) return null;

    return (
        <section className="py-24 bg-gray-900 border-y border-white/5 relative overflow-hidden">
            {/* Background Light Glow Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -ml-32 -mb-32" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                {/* Header: Title + Countdown + Link */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 px-2">
                    <div className="text-center md:text-left space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                            <div className="p-3 bg-red-500 rounded-2xl shadow-xl shadow-red-500/20 text-white transform -rotate-12 animate-pulse">
                                <FiZap className="w-6 h-6" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                                Flash Sale
                            </h2>
                        </div>
                        <p className="text-gray-400 font-medium text-sm md:text-base tracking-wide flex items-center justify-center md:justify-start gap-2">
                            🔥 Limited time offer. <span className="text-white font-bold underline decoration-red-500">Only while stocks last!</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-3 order-first md:order-last">
                        <CountdownTimer endTime={endTime} />
                        <Link to="/products?sale=true" className="group text-red-500 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all duration-300">
                            See All Deals <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Products Slider */}
                <div className="relative group/slider-container">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(4)].map((_, i) => (
                                <PublicProductCardSkeleton key={`skeleton-${i}`} />
                            ))}
                        </div>
                    ) : (
                        <Slider
                            images={[]}
                            slidesPerView={1}
                            spaceBetween={24}
                            loop={false}
                            autoplay={false}
                            navigation={true}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                                1280: { slidesPerView: 4 }
                            }}
                            className="flash-sale-slider !overflow-visible"
                        >
                            {products.map((product, index) => (
                                <div key={product._id} className="pb-8 h-full">
                                    <FlashSaleCard
                                        product={product}
                                        index={index}
                                        onAddToCart={() => addToCart(product)}
                                    />
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>
            </div>

            <style>{`
                .flash-sale-slider .custom-swiper-next,
                .flash-sale-slider .custom-swiper-prev {
                    background: #111827;
                    color: white;
                    border: 1px solid rgba(255,255,255,0.1);
                    top: 50%;
                }
                .flash-sale-slider .custom-swiper-next:hover,
                .flash-sale-slider .custom-swiper-prev:hover {
                    background: #ef4444; /* red-500 */
                }
            `}</style>
        </section>
    );
};

export default FlashSaleSection;
