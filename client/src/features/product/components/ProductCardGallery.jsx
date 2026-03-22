import React, { memo } from 'react';
import { FiImage } from 'react-icons/fi';
import useProductCardGallery from '../hooks/useProductCardGallery';

/**
 * ProductCardGallery - Vertical thumbnail gallery component for product cards
 * 
 * @param {Object} props
 * @param {string[]} props.images - All product image URLs
 * @param {string} props.productName - Used as alt text
 * @param {boolean} props.isHovered - Whether the card is hovered
 * @param {boolean} props.autoSlide - Enable automatic sliding (default: true)
 */
const ProductCardGallery = memo(function ProductCardGallery({
  images = [],
  productName = 'Product',
  isHovered = false,
  autoSlide = true,
  showThumbnails = true
}) {
  const {
    activeIndex,
    handleThumbnailHover,
    handleThumbnailClick,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  } = useProductCardGallery({ images, isHovered, autoSlide });

  // Fallback: No images or invalid data
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center">
        <FiImage className="w-12 h-12 text-gray-300" />
      </div>
    );
  }

  // Single image or thumbnails hidden - show full width main image
  if (images.length === 1 || !showThumbnails) {
    const imageUrl = images[activeIndex]?.secure_url || images[activeIndex];

    if (!imageUrl) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center">
          <FiImage className="w-12 h-12 text-gray-300" />
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={productName}
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
      />
    );
  }

  // Multiple images with thumbnails - show gallery with thumbnails
  return (
    <div className="flex gap-1 w-full h-full">
      {/* LEFT — Vertical thumbnail strip */}
      <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar w-14 flex-shrink-0">
        {images.map((imageObj, index) => {
          const imageUrl = imageObj?.secure_url || imageObj;

          if (!imageUrl) {
            return (
              <div
                key={index}
                className="w-14 h-14 flex-shrink-0 rounded-lg bg-gray-100 border-2 border-transparent flex items-center justify-center"
              >
                <FiImage className="w-6 h-6 text-gray-300" />
              </div>
            );
          }

          return (
            <button
              key={index}
              onMouseEnter={() => handleThumbnailHover(index)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleThumbnailClick(index);
              }}
              className={`w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-150 ${activeIndex === index
                  ? 'border-gray-900 opacity-100'
                  : 'border-transparent opacity-70 hover:opacity-100'
                }`}
            >
              <img
                src={imageUrl}
                alt={`${productName} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* RIGHT — Main image */}
      <div
        className="flex-1 relative overflow-hidden"
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={activeIndex}
          src={images[activeIndex]?.secure_url || images[activeIndex]}
          alt={productName}
          className="w-full h-full object-cover transition-opacity duration-200"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
});

export default ProductCardGallery;
