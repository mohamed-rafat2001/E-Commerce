import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Input, Select, LoadingSpinner } from '../../../shared/ui/index.js';
import {
  FiLayers,
  FiStar,
  FiSave,
  FiGlobe,
  FiHeart,
  FiShare2,
  FiShoppingBag,
  FiActivity,
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
import { useLocation, useNavigate } from 'react-router-dom';

const ProductInfo = ({
  product
}) => {
  const { addToCart, isLoading: isAddingToCart } = useAddToCart();
  const { addToWishlist, isLoading: isAddingToWishlist } = useAddToWishlist();
  const { deleteFromWishlist, isLoading: isRemovingFromWishlist } = useDeleteFromWishlist();
  const { isInWishlist } = useWishlist();

  const { reviews, totalCount, averageRating, ratingDistribution, page, setPage, totalPages } = useProductReviews(product._id);
  const location = useLocation();
  const navigate = useNavigate();

  const productId = product._id;
  const isWishlisted = isInWishlist(productId);
  const isWishlistLoading = isAddingToWishlist || isRemovingFromWishlist;
  const isOutOfStock = product.countInStock === 0;

  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleAddToCart = () => {
    if (!isOutOfStock) addToCart(product, quantity);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      deleteFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-white shadow-2xl shadow-gray-200/50 flex flex-col h-full"
    >
      {/* Category & Rating */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Badge className="bg-indigo-50 text-indigo-700 border-none font-black px-4 py-2 uppercase tracking-widest text-[9px] rounded-full">
            {product.brandId?.name}
          </Badge>
          <span className="text-gray-300">•</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            {product.primaryCategory?.name}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
          <FiStar className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span className="text-xs font-black text-amber-700">{product.ratingAverage || "5.0"}</span>
          <span className="text-[10px] font-bold text-amber-500/70">({product.ratingCount || 0})</span>
        </div>
      </div>

      {/* Title & Price */}
      <div className="mb-10 space-y-6">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
          {product.name}
        </h1>

        <div className="flex items-end gap-4">
          <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
            ${product.price?.amount?.toFixed(2)}
          </span>
          {product.price?.oldAmount && (
            <span className="text-xl font-bold text-gray-400 line-through decoration-rose-500/30 pb-1">
              ${product.price.oldAmount.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Selection Options (Colors & Sizes) */}
      <div className="space-y-8 mb-10">
        {product.colors?.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Color Palette</span>
              {selectedColor && <span className="text-[10px] font-bold text-gray-900 uppercase">{selectedColor}</span>}
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedColor === color ? 'scale-110 shadow-xl' : 'hover:scale-105'
                    }`}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  <div className={`absolute inset-0 rounded-full border-2 ${selectedColor === color ? 'border-indigo-600 scale-[1.15]' : 'border-transparent'}`} />
                  {selectedColor === color && <FiCheck className="w-5 h-5 text-white mix-blend-difference drop-shadow-md" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.sizes?.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Size</span>
              <button className="text-[10px] font-bold text-indigo-600 uppercase hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-[4rem] h-12 px-4 rounded-xl text-sm font-black transition-all border-2 ${selectedSize === s
                    ? 'bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-900/20'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 py-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              <FiMinus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-sm font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity(prev => Math.min(product.countInStock || 10, prev + 1))}
              disabled={quantity >= (product.countInStock || 10) || isOutOfStock}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              <FiPlus className="w-3 h-3" />
            </button>
          </div>
          {product.countInStock > 0 && product.countInStock <= 5 && (
            <span className="text-xs font-bold text-orange-500 whitespace-nowrap hidden sm:block">Only {product.countInStock} remaining!</span>
          )}
        </div>
      </div>

      <div className="mt-auto space-y-6">
        {/* Delivery Info Strip */}
        <div className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
            <div className="w-8 h-8 rounded-full bg-blue-50/50 flex items-center justify-center text-blue-500 shrink-0"><FiTruck className="w-4 h-4" /></div>
            Free delivery on orders over $50
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
            <div className="w-8 h-8 rounded-full bg-emerald-50/50 flex items-center justify-center text-emerald-500 shrink-0"><FiRefreshCw className="w-4 h-4" /></div>
            Easy 30-day returns
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
            <div className="w-8 h-8 rounded-full bg-amber-50/50 flex items-center justify-center text-amber-500 shrink-0"><FiShield className="w-4 h-4" /></div>
            Secure checkout
          </div>
        </div>

        {/* Share Button */}
        <div className="flex justify-end">
          <button onClick={handleCopyLink} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-gray-900 transition-colors">
            {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-500" /> : <FiShare2 className="w-3.5 h-3.5" />}
            {copied ? <span className="text-emerald-500">Link Copied!</span> : 'Share Product'}
          </button>
        </div>
        <div className="flex items-stretch gap-4">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-1 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {isAddingToCart ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <FiShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            <span className="uppercase tracking-widest text-sm">
              {isOutOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Bag'}
            </span>
          </button>
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`w-16 h-[60px] rounded-2xl border flex items-center justify-center transition-all disabled:opacity-60 disabled:cursor-not-allowed ${isWishlisted
              ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600'
              : 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white'
              }`}
          >
            {isWishlistLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <FiHeart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Spec = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-black text-gray-900">{value}</p>
  </div>
);

export default ProductInfo;
