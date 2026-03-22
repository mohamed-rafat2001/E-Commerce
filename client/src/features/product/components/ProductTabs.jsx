import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiMessageSquare } from 'react-icons/fi';
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
        <div className="mt-12 md:mt-20">
            {/* Tab Bar */}
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-4 text-sm font-semibold transition-all duration-150 whitespace-nowrap relative ${
                            activeTab === tab.id
                                ? 'text-primary border-b-2 border-primary -mb-px'
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        {tab.label}
                        {tab.id === 'reviews' && (
                            <span className="ml-2 text-xs text-gray-400 font-normal">
                                ({totalCount || product.ratingCount || 0})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                    {/* Description Tab */}
                    {activeTab === 'description' && (
                        <motion.div
                            key="description"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="max-w-4xl text-gray-600 leading-relaxed text-sm md:text-base prose prose-sm md:prose-base"
                        >
                            {product.description || (
                                <p className="italic text-gray-400">No description provided for this product.</p>
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
                            <div className="space-y-0">
                                <SpecRow label="Category" value={product.primaryCategory?.name || 'Uncategorized'} />
                                <SpecRow label="Subcategory" value={product.subCategory?.name || 'N/A'} />
                                <SpecRow label="Brand" value={product.brandId?.name || 'Generic'} />
                                <SpecRow label="SKU / ID" value={product._id?.slice(-8).toUpperCase()} />
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
                            <div className="flex flex-col md:flex-row gap-10 items-center p-8 bg-gray-50 rounded-2xl mb-10 border border-gray-100">
                                <div className="flex flex-col items-center justify-center shrink-0">
                                    <div className="text-5xl font-bold text-gray-900 mb-2">
                                        {product.ratingAverage || averageRating || "0.0"}
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar key={i} className={`w-5 h-5 ${i < Math.round(product.ratingAverage || averageRating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">{totalCount || product.ratingCount || 0} reviews</p>
                                </div>

                                <div className="flex-1 w-full space-y-3">
                                    {ratingDistribution.map((dist) => (
                                        <div key={dist.star} className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-700 w-6">{dist.star}★</span>
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${dist.percentage}%` }}></div>
                                            </div>
                                            <span className="text-sm text-gray-400 w-10 text-right">{dist.percentage}%</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="shrink-0 flex items-center justify-center">
                                    <button
                                        onClick={() => navigate('/login?redirect=' + location.pathname)}
                                        className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-primary transition-all duration-200"
                                    >
                                        Review Product
                                    </button>
                                </div>
                            </div>

                            {/* Review List */}
                            <div className="space-y-0">
                                {reviews.length === 0 ? (
                                    <div className="py-20 text-center flex flex-col items-center">
                                        <FiMessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-800">No reviews yet</h3>
                                        <p className="text-sm text-gray-500 mb-6">Be the first to review this product</p>
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review._id} className="py-6 border-b border-gray-100 last:border-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                                                        {(review.userId?.name || 'A').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{review.userId?.name || 'Anonymous User'}</p>
                                                        <div className="flex items-center text-yellow-400 gap-0.5 mt-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FiStar key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed mt-4 pl-13">
                                                {review.title}
                                            </p>
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
    <div className="grid grid-cols-2 py-3 border-b border-gray-100 last:border-0">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
);

export default ProductTabs;
