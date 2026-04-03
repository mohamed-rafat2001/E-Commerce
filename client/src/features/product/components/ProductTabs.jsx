import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiMessageSquare, FiEdit3, FiGlobe } from 'react-icons/fi';
import useProductReviews from '../hooks/useProductReviews.js';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductTabs = ({ product }) => {
    const [activeTab, setActiveTab] = useState('details');
    const { reviews, totalCount, averageRating, ratingDistribution } = useProductReviews(product._id);
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        { id: 'details', label: 'Technical Specifications' },
        { id: 'description', label: 'Product Story' },
        { id: 'reviews', label: 'Curated Feedback' },
    ];

    return (
        <div className="mt-12 md:mt-20">


            {/* Tab Bar */}
            <div className="flex items-center justify-between border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
                <div className="flex">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-150 whitespace-nowrap relative ${
                                activeTab === tab.id
                                    ? 'text-primary border-b-2 border-primary -mb-px'
                                    : 'text-gray-400 hover:text-gray-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                {activeTab === 'reviews' && (
                    <button
                        onClick={() => navigate('/login?redirect=' + location.pathname)}
                        className="hidden md:flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest hover:text-primary-dark transition-colors"
                    >
                        Write a review <FiEdit3 className="w-4 h-4" />
                    </button>
                )}
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
                            className="w-full"
                        >
                            <div className="flex flex-col lg:flex-row gap-10">
                                {/* Tech Specs (Left, 65%) */}
                                <div className="lg:w-[65%]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        {/* Render product.specifications array if available */}
                                        {Array.isArray(product.specifications) && product.specifications.length > 0 ? (
                                            product.specifications.map((spec, idx) => (
                                                <SpecItem key={idx} label={spec.key || spec.label} value={spec.value} />
                                            ))
                                        ) : (
                                            <>
                                                <SpecItem label="CATEGORY" value={product.primaryCategory?.name || 'N/A'} />
                                                <SpecItem label="BRAND" value={product.brandId?.name || product.brand?.name || 'N/A'} />
                                                {product.weight && <SpecItem label="WEIGHT" value={product.weight} />}
                                                {product.dimensions && <SpecItem label="DIMENSIONS" value={product.dimensions} />}
                                                {product.materials && <SpecItem label="MATERIALS" value={product.materials} />}
                                                {product.sku && <SpecItem label="SKU" value={product.sku} />}
                                                <SpecItem label="AVAILABILITY" value={product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'} />
                                                <SpecItem label="CONDITION" value={product.condition || 'New'} />
                                                {product.variants?.colors?.length > 0 && (
                                                    <SpecItem label="COLORS" value={product.variants.colors.map(c => typeof c === 'object' ? c.name : c).join(', ')} />
                                                )}
                                                {product.variants?.sizes?.length > 0 && (
                                                    <SpecItem label="SIZES" value={product.variants.sizes.map(s => typeof s === 'object' ? s.name || s.label : s).join(', ')} />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Product Highlights (Right, 35%) */}
                                <div className="lg:w-[35%] bg-primary rounded-2xl p-8 text-white relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <FiGlobe className="w-8 h-8 mb-6" />
                                        <h3 className="text-xl font-bold mb-3">Product Highlights</h3>
                                        <p className="text-sm text-primary-100 leading-relaxed opacity-90">
                                            {product.highlights || product.shortDescription || product.description?.slice(0, 150) || 'A premium quality product curated for you. Designed with care and attention to detail.'}
                                        </p>
                                    </div>
                                    {/* Decorative pattern */}
                                    <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                                </div>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reviews.length === 0 ? (
                                    <div className="col-span-full py-20 text-center flex flex-col items-center">
                                        <FiMessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-800">No reviews yet</h3>
                                        <p className="text-sm text-gray-500 mb-6">Be the first to review this product</p>
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review._id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                                                        {(review.userId?.name || 'A').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{review.userId?.name || 'Anonymous User'}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Verified Buyer · {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-yellow-400 gap-0.5 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed italic">
                                                "{review.title || review.comment}"
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

const SpecItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{label}</span>
        <span className="text-sm text-gray-600 font-medium">{value}</span>
    </div>
);

const SpecRow = ({ label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-gray-800">{value}</span>
    </div>
);

export default ProductTabs;
