/* Audit Findings:
 - Public product cards currently allow guest wishlist via localStorage.
 - New workflow requires auth prompt for wishlist intent, with post-login resume.
 - Cart add supports guest flow separately and remains available without forced redirect.
*/
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiStar, FiShoppingBag } from 'react-icons/fi';
import ProductCardGallery from '../../features/product/components/ProductCardGallery.jsx';
import AddToCartButton from './AddToCartButton.jsx';
import useWishlist from '../../features/wishList/hooks/useWishlist.js';
import useAuthGuard from '../../hooks/useAuthGuard.js';

const PublicProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { requireAuth, isAuthenticated } = useAuthGuard();

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

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            requireAuth({
                message: "Sign in to save items to your wishlist",
                redirectAfter: `/products/${productId}`,
                onSuccessCallback: "wishlist:add",
                callbackPayload: { productId }
            });
            return;
        }

        await toggleWishlist(productId);
    };

    const allImages = [
        product.coverImage?.secure_url,
        product.image?.secure_url,
        product.image,
        ...(Array.isArray(product.images) ? product.images.map(img => img?.secure_url || img) : [])
    ].filter(Boolean);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group flex flex-col h-full font-sans"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Area */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-gray-100 mb-6">
                <Link to={`/products/${productId}`} className="block w-full h-full">
                    <div data-card-image className="w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out will-change-transform">
                        <ProductCardGallery
                            images={allImages}
                            productName={product.name}
                            isHovered={isHovered}
                            autoSlide={true}
                            showThumbnails={false}
                        />
                    </div>
                </Link>

                {/* Badge */}
                {badge && (
                    <div className="absolute top-6 left-6 z-10">
                        <div className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                            {product.countInStock === 0 ? 'Out of Stock' : (hasDiscount ? `-${discountPercent}%` : 'New Arrival')}
                        </div>
                    </div>
                )}


                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                >
                    <FiHeart className={`w-4.5 h-4.5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
            </div>

            {/* Product Info Section */}
            <div className="px-1 flex flex-col flex-1">
                {/* Brand */}
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
                    {product.brandId?.name || product.brand?.name || 'Curated Design'}
                </span>

                {/* Title and Price */}
                <div className="flex justify-between items-start gap-4 mb-3">
                    <Link to={`/products/${productId}`} className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                    <span className="text-xl font-bold text-gray-900">
                        ${price.toFixed(0)}
                    </span>
                </div>

                {/* Rating & Actions */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-yellow-500">
                            <FiStar className="w-3.5 h-3.5 fill-current" />
                            <span className="ml-1 text-sm font-bold text-gray-900">{Number(product.ratingAverage || 0).toFixed(1)}</span>
                            <span className="ml-1 text-xs text-gray-500">({product.ratingCount || 0})</span>
                        </div>
                    </div>

                    <AddToCartButton
                        product={product}
                        variant="primary"
                        showText={true}
                        className="!rounded-full px-6 py-2.5 !bg-gray-900 !text-white !border-gray-900 text-[10px] uppercase font-black tracking-widest shadow-xl hover:bg-black transition-all active:scale-95"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default PublicProductCard;
