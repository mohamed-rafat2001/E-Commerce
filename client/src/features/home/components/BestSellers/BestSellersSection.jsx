import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBestSellers, useCategories } from '../../hooks';
import ProductCard from '../Products/ProductCard';
import { SectionTitle } from '../../../../shared/ui';

const BestSellersSection = () => {
    const { categories, isLoading: categoriesLoading } = useCategories();
    const { filteredProducts, isLoading: productsLoading, activeTab, setActiveTab } = useBestSellers();

    const tabs = ["All", ...categories.map(c => c.name)];
    const isLoading = productsLoading || categoriesLoading;

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 mb-16 px-1">
                    <div className="flex-1">
                        <SectionTitle
                            title="Best Sellers"
                            subtitle="The most loved products from our entire collection, proven by thousands of verified reviews."
                            align="left"
                            className="!mb-0"
                        />
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-6 w-full lg:w-auto shrink-0">
                        <Link to="/best-sellers" className="text-indigo-600 font-black text-[11px] uppercase tracking-[0.2em] hover:text-black transition-all flex items-center gap-2 group">
                            View All Picks <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>

                        {/* Tabs Navigation */}
                        <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100/50 w-full lg:w-auto overflow-x-auto no-scrollbar shadow-sm">
                            {categoriesLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <div key={i} className="h-10 w-24 bg-gray-200 animate-pulse rounded-xl" />
                                ))
                            ) : (
                                tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${activeTab === tab
                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                            : 'text-gray-400 hover:text-gray-700 hover:bg-white'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Products Grid with AnimatePresence */}
                <div className="relative min-h-[400px]">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-gray-50 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
                            >
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product, idx) => (
                                        <div key={product._id} className="relative group">
                                            <ProductCard
                                                product={product}
                                                index={idx}
                                                onAddToCart={() => console.log('Add', product)}
                                            />
                                            {/* Best Seller Gold Badge Overlay */}
                                            <div className="absolute top-4 left-4 z-20 pointer-events-none">
                                                <div className="flex items-center gap-1.5 bg-amber-400 text-black px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg transform -rotate-1 shadow-amber-400/20">
                                                    🏆 Best Seller
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center">
                                        <p className="text-gray-400 font-medium text-lg">No best sellers found in "{activeTab}" category yet.</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BestSellersSection;
