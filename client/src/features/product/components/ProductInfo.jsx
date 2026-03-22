import { useState } from 'react';
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

const ProductInfo = ({ product }) => {
  const { addToCart, isLoading: isAddingToCart } = useAddToCart();
  const { addToWishlist, isLoading: isAddingToWishlist } = useAddToWishlist();
  const { deleteFromWishlist, isLoading: isRemovingFromWishlist } = useDeleteFromWishlist();
  const { isInWishlist } = useWishlist();

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
        // Simulating tab click to reviews if possible would be better,
        // but this is a quick fix based on current structure.
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
            <FiStar key={i} className={`w-4 h-4 ${i < Math.round(product.ratingAverage || 5) ? 'fill-current' : 'text-gray-200 fill-gray-100'}`} />
          ))}
        </div>
        <span className="text-sm font-bold text-gray-800">{product.ratingAverage || '5.0'}</span>
        <button
          onClick={scrollToReviews}
          className="text-sm text-gray-400 underline hover:text-primary transition-colors"
        >
          ({product.ratingCount || 0} reviews)
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
          <p className="text-sm font-semibold text-gray-700 mb-3">Color:</p>
          <div className="flex flex-wrap gap-3">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color
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
          <p className="text-sm font-semibold text-gray-700 mb-3">Size:</p>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20'
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
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700">Qty:</span>
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="w-10 h-10 rounded-l-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-all disabled:opacity-50"
            >
              <FiMinus className="w-3.5 h-3.5" />
            </button>
            <div className="w-12 h-10 border-y border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-900">
              {quantity}
            </div>
            <button
              onClick={() => setQuantity(prev => Math.min(product.countInStock || 10, prev + 1))}
              disabled={quantity >= (product.countInStock || 10) || isOutOfStock}
              className="w-10 h-10 rounded-r-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-all disabled:opacity-50"
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className={`w-full py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-3 transition-all duration-200 shadow-sm ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : addSuccess
              ? 'bg-green-500 text-white shadow-green-200 shadow-lg'
              : 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20'
          }`}
        >
          {isAddingToCart ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : addSuccess ? (
            <>
              <FiCheck className="w-5 h-5" />
              <span>Added to Cart ✓</span>
            </>
          ) : (
            <>
              <FiShoppingBag className="w-5 h-5" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </>
          )}
        </button>

        <button
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border-2 transition-all duration-200 ${
            isWishlisted
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
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
      <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-3.5">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <FiTruck className="w-5 h-5 text-gray-400" />
          <span>Free delivery on orders over $50</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <FiRefreshCw className="w-5 h-5 text-gray-400" />
          <span>Easy 30-day returns</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <FiShield className="w-5 h-5 text-gray-400" />
          <span>Secure checkout</span>
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
