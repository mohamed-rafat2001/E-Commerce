import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import useProductReviews from '../hooks/useProductReviews.js';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductTabs = ({ product }) => {
    const [activeTab, setActiveTab] = useState('description');
    const { reviews, totalCount, averageRating, ratingDistribution } = useProductReviews(product._id);
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'details', label: 'Details' },
        { id: 'reviews', label: 'Reviews' },
    ];

    return (
        <div className="mt-20">
            {/* Tab Bar */}
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-8 py-4 text-base font-semibold transition-all duration-150 whitespace-nowrap ${activeTab === tab.id
                                ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-px'
                                : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="min-h-[200px]">
                <AnimatePresence mode="wait">
                    {/* Description Tab */}
                    {activeTab === 'description' && (
                        <motion.div
                            key="description"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="max-w-4xl text-gray-600 leading-relaxed text-sm md:text-base"
                        >
                            {product.description || (
                                <p className="italic text-gray-400">No description provided.</p>
                            )}
                        </motion.div>
                    )}

                    {/* Details / Specs Tab */}
                    {activeTab === 'details' && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="max-w-3xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
                                <SpecRow label="Brand" value={product.brandId?.name || 'Generic'} />
                                <SpecRow label="Category" value={product.primaryCategory?.name || 'Uncategorized'} />
                                <SpecRow label="Sub-Category" value={product.subCategory?.name || 'N/A'} />
                                <SpecRow label="Product ID (SKU)" value={product._id?.slice(-8).toUpperCase()} />
                                <SpecRow label="Availability" value={product.countInStock > 0 ? 'In Stock' : 'Out of Stock'} />
                                <SpecRow label="Condition" value="New" />
                            </div>
                        </motion.div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <motion.div
                            key="reviews"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="max-w-5xl"
                        >
                            {/* Rating Summary */}
                            <div className="flex flex-col md:flex-row gap-8 items-center p-8 bg-gray-50 rounded-3xl mb-10 border border-gray-100">
                                <div className="flex flex-col items-center justify-center shrink-0 min-w-[200px]">
                                    <div className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-2">
                                        {product.ratingAverage || averageRating || "0.0"}
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar key={i} className={`w-5 h-5 ${i < Math.round(product.ratingAverage || averageRating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{product.ratingCount || totalCount || 0} Reviews</p>
                                </div>

                                <div className="flex-1 w-full space-y-3">
                                    {ratingDistribution.map((dist) => (
                                        <div key={dist.star} className="flex items-center gap-4">
                                            <span className="text-sm font-bold text-gray-700 w-6">{dist.star}★</span>
                                            <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${dist.percentage}%` }}></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-400 w-12 text-right">{dist.percentage}%</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="shrink-0 flex items-center justify-center h-full">
                                    <button
                                        onClick={() => navigate('/login?redirect=' + location.pathname)}
                                        className="h-12 px-8 bg-gray-900 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-xl shadow-gray-200"
                                    >
                                        Write Review
                                    </button>
                                </div>
                            </div>

                            {/* Review List */}
                            <div className="space-y-0">
                                {reviews.length === 0 ? (
                                    <div className="py-16 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                            <FiStar className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">No reviews yet</h3>
                                        <p className="text-sm text-gray-500">Be the first to review this product and help others.</p>
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review._id} className="py-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors rounded-xl px-4 -mx-4 group">
                                            <div className="flex justify-between items-start mb-3 border-none pb-0">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm uppercase shadow-inner border border-white">
                                                        {review.userId?.name?.charAt(0) || 'A'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900">{review.userId?.name || 'Anonymous'}</p>
                                                        <p className="text-[11px] uppercase tracking-[0.1em] text-gray-400 font-medium">
                                                            {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-yellow-400 gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-[15px] text-gray-600 leading-relaxed font-medium mt-4 pl-16">"{review.title}"</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const SpecRow = ({ label, value }) => (
    <div className="grid grid-cols-2 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 px-3 -mx-3 rounded-lg transition-colors">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <span className="text-sm font-semibold text-gray-900 text-right md:text-left">{value}</span>
    </div>
);

export default ProductTabs;
