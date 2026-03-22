import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiStar, FiShoppingBag } from 'react-icons/fi';
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

    // Badges
    let badge = null;
    if (product.countInStock === 0) {
        badge = <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Out of Stock</span>;
    } else if (hasDiscount) {
        badge = <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">-{discountPercent}%</span>;
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="group bg-white rounded-2xl border border-gray-100 hover:border-primary/20 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Area (60-65% height) */}
            <Link to={`/products/${productId}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50">
                <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                    <ProductCardGallery
                        images={allImages}
                        productName={product.name}
                        isHovered={isHovered}
                        autoSlide={false}
                    />
                </div>

                {/* Badge Container */}
                {badge && (
                    <div className="absolute top-3 left-3 z-10">
                        {badge}
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group/wishlist"
                >
                    <FiHeart className={`w-4.5 h-4.5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/wishlist:text-red-500'}`} />
                </button>
            </Link>

            {/* Product Info Section (35-40% height) */}
            <div className="p-4 flex flex-col flex-1">
                {/* Category + Rating */}
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate max-w-[120px]">
                        {product.primaryCategory?.name || product.category?.name || 'Uncategorized'}
                    </span>
                    <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-400 text-xs fill-yellow-400" />
                        <span className="text-xs font-bold text-gray-700">{product.ratingAverage || '0'}</span>
                    </div>
                </div>

                {/* Name */}
                <Link to={`/products/${productId}`}>
                    <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 h-10 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price Row */}
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-base font-bold text-gray-900">${price.toFixed(2)}</span>
                    {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">${oldPrice.toFixed(2)}</span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <div className="mt-4">
                    <AddToCartButton
                        product={product}
                        variant="primary"
                        fullWidth
                        className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default PublicProductCard;
