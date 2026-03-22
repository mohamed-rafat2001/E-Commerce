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
    <div className="flex flex-col h-full bg-white">
      {/* Brand + Category */}
      <div className="text-sm text-gray-400 mb-1 flex items-center gap-2">
        <span className="hover:text-primary transition-colors cursor-pointer">{product.brandId?.name || 'Brand'}</span>
        <span className="text-gray-300">·</span>
        <span className="hover:text-primary transition-colors cursor-pointer">{product.primaryCategory?.name || 'Category'}</span>
      </div>

      {/* Product Name */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-display leading-tight mt-1">
        {product.name}
      </h1>

      {/* Rating Row */}
      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center text-yellow-400 text-lg">
          {[...Array(5)].map((_, i) => (
            <FiStar key={i} className={`w-4 h-4 ${i < Math.round(averageRating || product.ratingAverage || 5) ? 'fill-current' : 'text-gray-200 fill-gray-100'}`} />
          ))}
        </div>
        <span className="text-sm font-bold text-gray-800">{averageRating || product.ratingAverage || '5.0'}</span>
        <button
          onClick={scrollToReviews}
          className="text-sm text-gray-400 underline hover:text-primary transition-colors"
        >
          ({totalCount || product.ratingCount || 0} reviews)
        </button>
      </div>

      {/* Price Section */}
      <div className="mt-6">
        {hasDiscount ? (
          <div className="flex items-center flex-wrap">
            <span className="text-3xl font-bold text-primary">${price.toFixed(2)}</span>
            <span className="text-lg text-gray-400 line-through ml-3">${oldPrice.toFixed(2)}</span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg ml-3">-{discountPercent}%</span>
          </div>
        ) : (
          <span className="text-3xl font-bold text-gray-900">${price.toFixed(2)}</span>
        )}
      </div>

      {/* Stock Indicator */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        {isOutOfStock ? (
          <div className="flex items-center gap-2 text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-medium">Out of Stock</span>
          </div>
        ) : product.countInStock <= 5 ? (
          <div className="flex items-center gap-2 text-orange-500">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-medium">Only {product.countInStock} left in stock!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-500">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-medium">In Stock</span>
          </div>
        )}
      </div>

      {/* Color Variants */}
      {product.colors?.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Select Finish</p>
          <div className="flex flex-wrap gap-3">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`relative w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-transparent hover:border-gray-300'
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
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Select Size</p>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedSize === size
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="mt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Quantity</span>
          <div className="flex items-center w-fit bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary transition-all disabled:opacity-50"
            >
              <FiMinus className="w-3.5 h-3.5" />
            </button>
            <div className="w-10 text-center text-sm font-bold text-gray-900">
              {quantity}
            </div>
            <button
              onClick={() => setQuantity(prev => Math.min(product.countInStock || 10, prev + 1))}
              disabled={quantity >= (product.countInStock || 10) || isOutOfStock}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary transition-all disabled:opacity-50"
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="w-full py-4 rounded-xl text-base font-bold bg-primary text-white hover:bg-primary-dark transition-all duration-200"
          >
            Buy Now
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart}
            className={`w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-3 transition-all duration-200 ${isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : addSuccess
                  ? 'bg-green-500 text-white'
                  : 'bg-accent text-primary-950 hover:bg-accent-dark'
              }`}
          >
            {isAddingToCart ? (
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            ) : addSuccess ? (
              <>
                <FiCheck className="w-5 h-5" />
                <span>Added to Cart ✓</span>
              </>
            ) : (
              <>
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className={`flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 ${isWishlisted
              ? 'text-primary'
              : 'text-gray-500 hover:text-primary'
            }`}
        >
          {isWishlistLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <>
              <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              {isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </>
          )}
        </button>
      </div>

      {/* Delivery Info Strip */}
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-6">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-600">
          <FiTruck className="w-4 h-4" />
          <span>Free Shipping</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-600">
          <FiShield className="w-4 h-4" />
          <span>2 Year Warranty</span>
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={handleCopyLink}
        className="mt-6 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors w-fit group"
      >
        <FiShare2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        {copied ? 'Link copied!' : 'Share this product'}
      </button>
    </div>
  );
};

export default ProductInfo;
