import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiStar } from 'react-icons/fi';
import ProductCardGallery from '../../features/product/components/ProductCardGallery.jsx';
import AddToCartButton from './AddToCartButton.jsx';
import useWishlist from '../../features/wishList/hooks/useWishlist.js';
import useAddToWishlist from '../../features/wishList/hooks/useAddToWishlist.js';
import useDeleteFromWishlist from '../../features/wishList/hooks/useDeleteFromWishlist.js';

const PublicProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { isInWishlist } = useWishlist();
    const { addToWishlist } = useAddToWishlist();
    const { deleteFromWishlist } = useDeleteFromWishlist();

    const productId = product._id || product.id || product.product_id;
    const isWishlisted = isInWishlist(productId);

    const price = typeof product.price === 'object' ? product.price.amount : (product.price || 0);
    const oldPrice = typeof product.price?.oldAmount === 'number' ? product.price.oldAmount : (product.oldPrice?.amount || product.oldPrice);
    const hasDiscount = oldPrice > price;
    const discountPercent = hasDiscount ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

    // Badges priority: Sale > New > Hot > Featured
    let badge = null;
    if (product.countInStock === 0) {
        badge = <span className="bg-gray-800/80 text-white text-xs font-bold px-2 py-1 rounded-lg">Out of Stock</span>;
    } else if (hasDiscount) {
        badge = <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{discountPercent}%</span>;
    } else if (product.isNew) {
        badge = <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-lg">NEW</span>;
    } else if (product.isHot) {
        badge = <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">🔥 HOT</span>;
    } else if (product.isFeatured) {
        badge = <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-lg">⭐ Featured</span>;
    }

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            deleteFromWishlist(productId);
        } else {
            addToWishlist(product);
        }
    };

    const allImages = [
        product.coverImage?.secure_url,
        product.image?.secure_url,
        product.image,
        ...(Array.isArray(product.images) ? product.images.map(img => img?.secure_url || img) : [])
    ].filter(Boolean);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-gray-200 h-full flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Area */}
            <Link to={`/customer/products/${productId}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50">
                <motion.div
                    className="w-full h-full"
                    animate={{ scale: isHovered ? 1.02 : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <ProductCardGallery
                        images={allImages}
                        productName={product.name}
                        isHovered={isHovered}
                        autoSlide={true}
                    />
                </motion.div>

                {/* Badge Container */}
                {badge && (
                    <div className="absolute top-3 left-3 z-10">
                        {badge}
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                >
                    <FiHeart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-400'}`} />
                </button>
            </Link>

            {/* Product Info Section */}
            <div className="p-4 bg-white flex flex-col gap-2 flex-1">
                {/* Category + Rating */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide truncate pr-2">
                        {product.primaryCategory?.name || product.category?.name || 'Product'}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                        <FiStar className="text-yellow-400 text-sm fill-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">{product.ratingAverage || '5.0'}</span>
                        <span className="text-xs text-gray-400">({product.ratingCount || 0})</span>
                    </div>
                </div>

                {/* Name */}
                <Link to={`/customer/products/${productId}`} className="mt-1 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price Row */}
                <div className="mt-auto pt-1 mb-1">
                    {hasDiscount ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg font-bold text-indigo-600">${price.toFixed(2)}</span>
                            <span className="text-sm text-gray-400 line-through">${oldPrice.toFixed(2)}</span>
                            <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">-{discountPercent}%</span>
                        </div>
                    ) : (
                        <div className="text-lg font-bold text-indigo-600">${price.toFixed(2)}</div>
                    )}
                </div>

                {/* Always-Visible Add to Cart */}
                <div className="mt-1">
                    <AddToCartButton
                        product={product}
                        variant="primary"
                        fullWidth
                        className="py-2.5 rounded-xl text-sm font-semibold shadow-sm group-hover:brightness-105"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default PublicProductCard;
