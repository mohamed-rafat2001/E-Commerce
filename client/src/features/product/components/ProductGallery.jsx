import { useEffect, useState } from 'react';
import { FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import useWishlist from '../../wishList/hooks/useWishlist.js';

const ProductGallery = ({ images = [], productName = "Product", productId }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    await toggleWishlist({
      _id: productId,
      name: productName,
      coverImage: { secure_url: images[0] }
    });
  };

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (activeIndex >= images.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, images.length]);

  const mainImage = images[activeIndex] || 'https://placehold.co/600x600?text=No+Image';

  return (
    <div className="space-y-6">
      {/* Main Image Container */}
      <div className="relative aspect-square rounded-[2.5rem] bg-gray-50 overflow-hidden group shadow-sm border border-gray-100">
        <img
          src={mainImage}
          alt={productName}
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
          key={activeIndex} // Force re-mount for opacity transition effect
        />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-10"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart
            className={`w-6 h-6 transition-colors duration-300 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
          />
        </button>

        {/* Navigation Arrows (Optional, but good for UX) */}
        {images.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button type="button" onClick={prevImage} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center pointer-events-auto hover:bg-white transition-colors">
              <FiChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <button type="button" onClick={nextImage} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center pointer-events-auto hover:bg-white transition-colors">
              <FiChevronRight className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
          {images.slice(0, 4).map((img, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                type="button"
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 border-2 ${isActive ? 'border-blue-600 shadow-lg scale-105' : 'border-transparent hover:border-gray-200'
                  }`}
                aria-label={`View image ${idx + 1} of ${images.length}`}
              >
                <img src={img} alt={`${productName} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            );
          })}

          {/* More images indicator */}
          {images.length > 4 && (
            <button
              type="button"
              onClick={() => setActiveIndex(4)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeIndex >= 4 ? 'border-blue-600' : 'border-transparent'
                }`}
            >
              <img src={images[4]} alt="More images" className="w-full h-full object-cover blur-[2px]" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-black text-lg">+{images.length - 4}</span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
