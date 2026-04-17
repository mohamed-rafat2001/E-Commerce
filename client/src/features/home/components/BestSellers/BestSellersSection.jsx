import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBestSellers } from '../../hooks';
import { PublicProductCard, PublicProductCardSkeleton } from '../../../../shared';
import { SectionTitle, Slider } from '../../../../shared/ui';

const BestSellersSection = () => {
    const { products, isLoading, error } = useBestSellers();

    return (
        <section className="py-16 md:py-20 xl:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-14 px-1">
                    <div className="flex-1">
                        <SectionTitle
                            title="Best Sellers"
                            subtitle="The most loved products from our entire collection, proven by thousands of verified reviews."
                            align="left"
                            className="!mb-0 max-w-3xl"
                        />
                    </div>
                    <Link to="/products?sort=-sold" className="text-indigo-600 font-black text-[11px] uppercase tracking-[0.2em] hover:text-gray-900 transition-all flex items-center gap-2 group shrink-0">
                        View All Picks <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="relative">
                    {isLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 min-h-[300px]">
                            {[...Array(4)].map((_, i) => (
                                <div key={`skeleton-${i}`} className="rounded-3xl border border-gray-100 bg-white/70 p-3">
                                    <PublicProductCardSkeleton />
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && products.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.45, ease: 'easeOut' }}
                            className="rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 bg-white/70 dark:bg-gray-900/60 p-3 md:p-4 shadow-sm"
                        >
                            <Slider
                                navigation={true}
                                pagination={{ clickable: true, dynamicBullets: true }}
                                autoplay={true}
                                autoplayDelay={3600}
                                loop={products.length > 3}
                                speed={700}
                                slidesPerView={1.12}
                                spaceBetween={14}
                                breakpoints={{
                                    480: { slidesPerView: 1.35, spaceBetween: 16 },
                                    640: { slidesPerView: 1.8, spaceBetween: 16 },
                                    768: { slidesPerView: 2.2, spaceBetween: 18 },
                                    1024: { slidesPerView: 2.8, spaceBetween: 20 },
                                    1280: { slidesPerView: 3.4, spaceBetween: 22 },
                                }}
                                swiperClassName="!pb-12"
                            >
                                {products.map((product) => (
                                    <div key={product._id} className="relative h-full">
                                        <div className="h-full rounded-[1.75rem] border border-gray-100 bg-white dark:bg-gray-900 p-3 md:p-4">
                                            <PublicProductCard product={product} />
                                        </div>
                                        <div className="absolute top-6 left-6 z-20 pointer-events-none">
                                            <div className="flex items-center gap-1.5 bg-amber-400 text-black px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-400/20">
                                                🏆 Best Seller
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </motion.div>
                    )}

                    {!isLoading && (error || products.length === 0) && (
                        <div className="py-14 text-center rounded-3xl border border-gray-100 bg-white/70 dark:bg-gray-900/60">
                            <p className="text-gray-500 font-medium text-base md:text-lg">No best sellers are available right now.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BestSellersSection;
