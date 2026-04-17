/* Audit Findings:
 - Product page previously dispatched local Redux cart only, bypassing authenticated cart API.
 - Unified add-to-cart must route through auth-aware hook for server/guest consistency.
 - Cart payload supports itemId/quantity; guest payload preserves selected color and size.
*/
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingBag } from 'react-icons/fi';
import { Button } from '../../../shared/ui/index.js';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import TrustBadges from './TrustBadges';
import toast from 'react-hot-toast';
import useAddToCart from '../../cart/hooks/useAddToCart.js';

const ProductInfo = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, isLoading: isAdding } = useAddToCart();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Derived values
  const currentPrice = useMemo(() => {
    return typeof product.price === 'object' ? product.price.amount : (product.price || 0);
  }, [product.price]);

  const originalPrice = useMemo(() => {
    if (typeof product.price === 'object' && product.price.oldAmount) return product.price.oldAmount;
    return typeof product.oldPrice === 'object' ? product.oldPrice.amount : (product.oldPrice || currentPrice);
  }, [product.price, product.oldPrice, currentPrice]);

  const hasDiscount = originalPrice > currentPrice;

  const isOutOfStock = useMemo(() => {
    if (product.countInStock === 0) return true;
    if (product.variants?.sizes?.length > 0) {
      return !product.variants.sizes.some(s => typeof s === 'object' ? s.available : true);
    }
    return false;
  }, [product]);

  const canAddToCart = useMemo(() => {
    const colorRequired = product.variants?.colors?.length > 0;
    const sizeRequired = product.variants?.sizes?.length > 0;

    if (colorRequired && !selectedColor) return false;
    if (sizeRequired && !selectedSize) return false;
    return true;
  }, [product, selectedColor, selectedSize]);

  const handleAddToCart = async () => {
    if (!canAddToCart) {
      toast.error('Please select a color and size');
      return;
    }

    try {
      await addToCart({
        itemId: product._id,
        productId: product._id,
        name: product.name,
        price: currentPrice,
        imageUrl: product.coverImage?.secure_url || product.image?.secure_url,
        color: selectedColor,
        size: selectedSize,
        quantity: 1,
        brand: product.brandId?.name || product.brand?.name
      }, 1);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to update cart');
    }
  };

  const handleBuyNow = async () => {
    if (!canAddToCart) {
      toast.error('Please select a color and size');
      return;
    }
    await handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Row: Badge & Rating */}
      <div className="flex justify-between items-center mb-6">
        <span className="px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          {product.badge || 'New Arrival'}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-yellow-400">
            <FiStar className="fill-current w-4 h-4" />
            <span className="ml-1 text-sm font-black text-gray-900">{Number(product.ratingAverage || 0).toFixed(1)}</span>
          </div>
          <span className="text-gray-400 text-xs font-bold">({product.ratingCount || product.numReviews || 0} reviews)</span>
        </div>
      </div>

      {/* Title & Brand */}
      <div className="mb-8">
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3 leading-tight tracking-tight">
          {product.name}
        </h1>
        <p className="text-gray-500 font-bold">
          By <Link to={`/brands/${product.brandId?._id || product.brand?._id}`} className="text-blue-600 hover:underline">
            {product.brandId?.name || product.brand?.name || 'Curated Design'}
          </Link>
        </p>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-4 mb-10">
        <span className="text-4xl font-black text-blue-600">
          ${currentPrice.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="text-xl text-gray-400 line-through font-bold">
            ${originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* Selectors */}
      <div className="space-y-10 mb-12">
        <ColorSelector
          colors={product.variants?.colors}
          selectedColor={selectedColor}
          onSelect={setSelectedColor}
        />

        <SizeSelector
          sizes={product.variants?.sizes}
          selectedSize={selectedSize}
          onSelect={setSelectedSize}
          onOpenSizeGuide={() => toast('Size Guide coming soon!')}
        />
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        {isOutOfStock ? (
          <Button
            fullWidth
            variant="outline"
            size="lg"
            className="py-3"
          >
            Notify Me When Available
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={isAdding || !canAddToCart}
              isLoading={isAdding}
              title={!canAddToCart ? "Please select a color and size" : ""}
              className="flex-1"
              icon={<FiShoppingBag className="w-5 h-5" />}
            >
              Add to Cart
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleBuyNow}
              className="px-10"
            >
              Buy Now
            </Button>
          </>
        )}
      </div>

      {/* Trust Badges */}
      <TrustBadges />
    </div>
  );
};

export default ProductInfo;
