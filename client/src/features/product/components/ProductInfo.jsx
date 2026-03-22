import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiStar,
  FiHeart,
  FiShare2,
  FiShoppingBag,
  FiCheck,
  FiMinus,
  FiPlus,
  FiTruck,
  FiRefreshCw,
  FiShield
} from 'react-icons/fi';
import useAddToCart from '../../cart/hooks/useAddToCart.js';
import useAddToWishlist from '../../wishList/hooks/useAddToWishlist.js';
import useWishlist from '../../wishList/hooks/useWishlist.js';
import useDeleteFromWishlist from '../../wishList/hooks/useDeleteFromWishlist.js';
import useProductReviews from '../hooks/useProductReviews.js';

const ProductInfo = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, isLoading: isAddingToCart } = useAddToCart();
  const { addToWishlist, isLoading: isAddingToWishlist } = useAddToWishlist();
  const { deleteFromWishlist, isLoading: isRemovingFromWishlist } = useDeleteFromWishlist();
  const { isInWishlist } = useWishlist();

  const { totalCount, averageRating } = useProductReviews(product._id);

  const productId = product._id;
  const isWishlisted = isInWishlist(productId);
  const isWishlistLoading = isAddingToWishlist || isRemovingFromWishlist;
  const isOutOfStock = product.countInStock === 0;

  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const price = product.price?.amount || 0;
  const oldPrice = product.price?.oldAmount || 0;
  const hasDiscount = oldPrice > price;
  const discountPercent = hasDiscount ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      deleteFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  const scrollToReviews = () => {
    const tabs = document.querySelector('.flex.border-b.border-gray-200.mb-8');
    if (tabs) {
      tabs.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Brand & Badges */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
          {product.brand?.name || 'Exclusive Design'}
        </span>
        <div className="flex items-center gap-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
              -{discountPercent}%
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4 leading-tight">
        {product.name}
      </h1>

      {/* Rating & Short Info */}
      <div className="flex items-center gap-6 mb-8">
        <button onClick={scrollToReviews} className="flex items-center gap-1.5 group">
          <div className="flex items-center text-amber-500">
            <FiStar className="w-4 h-4 fill-current" />
            <span className="text-lg font-black text-gray-900 ml-1.5">{averageRating || product.ratingAverage || '4.8'}</span>
          </div>
          <span className="text-sm text-gray-400 font-medium group-hover:text-gray-900 transition-colors">
            ({totalCount || 0} Reviews)
          </span>
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <span className="text-sm text-emerald-600 font-bold uppercase tracking-widest">In Stock ({product.countInStock})</span>
      </div>

      {/* Price Section */}
      <div className="flex items-baseline gap-4 mb-10">
        <span className="text-4xl font-black text-gray-900 tracking-tighter">${price.toFixed(0)}</span>
        {hasDiscount && (
          <span className="text-xl text-gray-300 line-through font-medium">${oldPrice.toFixed(0)}</span>
        )}
      </div>

      {/* Color Variants */}
      {product.colors?.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Select Finish</p>
          <div className="flex flex-wrap gap-3">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`relative w-8 h-8 rounded-full border transition-all ${selectedColor === color
                  ? 'ring-2 ring-offset-2 ring-gray-900 border-gray-900 scale-110'
                  : 'border-transparent hover:scale-105'
                  }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Variants */}
      {product.sizes?.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Select Size</p>
          <div className="flex flex-wrap gap-2.5">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-2.5 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all ${selectedSize === size
                  ? 'bg-gray-900 border-gray-900 text-white shadow-lg'
                  : 'border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Call to Actions */}
      <div className="mt-auto space-y-4">
        <div className="flex gap-4">
          <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-all"
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-black text-gray-900">{quantity.toString().padStart(2, '0')}</span>
            <button
              onClick={() => setQuantity(prev => Math.min(product.countInStock || 10, prev + 1))}
              disabled={quantity >= (product.countInStock || 10) || isOutOfStock}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-all"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex-1 py-4 bg-gray-900 text-white rounded-full text-sm font-black uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-2xl shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart}
            className={`flex-1 py-4 border-2 rounded-full text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${addSuccess
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-gray-100 bg-white text-gray-900 hover:border-gray-900'
              }`}
          >
            {isAddingToCart ? (
              <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            ) : addSuccess ? (
              <><FiCheck className="w-5 h-5" /> Added to Cart</>
            ) : (
              <><FiShoppingBag className="w-5 h-5" /> Add to Cart</>
            )}
          </button>

          <button
            onClick={handleWishlistToggle}
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${isWishlisted
                ? 'bg-rose-50 border-rose-100 text-rose-500'
                : 'border-gray-100 text-gray-300 hover:border-rose-100 hover:text-rose-500'
              }`}
          >
            <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleCopyLink}
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${copied
                ? 'bg-blue-50 border-blue-100 text-blue-500'
                : 'border-gray-100 text-gray-300 hover:border-blue-100 hover:text-blue-500'
              }`}
          >
            <FiShare2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900">
            <FiTruck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Fast Shipping</p>
            <p className="text-[10px] text-gray-400 font-medium">Free over $500</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900">
            <FiRefreshCw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">30-Day Return</p>
            <p className="text-[10px] text-gray-400 font-medium">Hassle-free service</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900">
            <FiShield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Secure Payment</p>
            <p className="text-[10px] text-gray-400 font-medium">Certified safety</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
