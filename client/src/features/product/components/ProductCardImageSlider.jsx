import React, { memo } from 'react';
import { FiImage } from 'react-icons/fi';
import useProductCardSlider from '../hooks/useProductCardSlider';

/**
 * ProductCardImageSlider - Vertical image gallery slider for product cards
 * 
 * @param {Object} props
 * @param {string[]} props.images - All product image URLs
 * @param {string} props.productName - Used as alt text
 * @param {boolean} props.isHovered - Whether the card is hovered
 */
const ProductCardImageSlider = memo(function ProductCardImageSlider({ 
  images = [], 
  productName = 'Product',
  isHovered = false 
}) {
  const {
    activeIndex,
    goToIndex,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    visibleDots,
    containerRef,
  } = useProductCardSlider({ images, isHovered });

  // Fallback: No images or invalid data
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
          <FiImage className="w-8 h-8 text-gray-300" />
        </div>
        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">No image</span>
      </div>
    );
  }

  // Single image - no slider behavior needed
  if (images.length === 1) {
    const imageUrl = images[0]?.secure_url || images[0];
    
    if (!imageUrl) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
            <FiImage className="w-8 h-8 text-gray-300" />
          </div>
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">No image</span>
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={productName}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        crossOrigin="anonymous"
      />
    );
  }

  // Multiple images - show slider with dots
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding image track */}
      <div
        style={{ transform: `translateY(-${activeIndex * 100}%)` }}
        className="flex flex-col transition-transform duration-[250ms] ease-out w-full h-full"
      >
        {images.map((imageObj, index) => {
          const imageUrl = imageObj?.secure_url || imageObj;
          
          if (!imageUrl) {
            return (
              <div
                key={index}
                className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex-shrink-0 flex items-center justify-center"
              >
                <FiImage className="w-12 h-12 text-gray-300" />
              </div>
            );
          }

          return (
            <img
              key={index}
              src={imageUrl}
              alt={`${productName} ${index + 1}`}
              className="w-full h-full object-cover flex-shrink-0"
              loading={index === 0 ? 'eager' : 'lazy'}
              crossOrigin="anonymous"
            />
          );
        })}
      </div>

      {/* Dot indicators — only if 2+ images */}
      <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-center gap-1">
        {visibleDots.map((dot) => (
          <button
            key={dot.index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToIndex(dot.index);
            }}
            className={`w-1.5 rounded-full transition-all duration-200 ${
              dot.isActive
                ? 'h-2.5 bg-white'
                : 'h-1.5 bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`View image ${dot.index + 1}`}
          />
        ))}
      </div>

      {/* Invisible overlay to capture mouse movements */}
      <div className="absolute inset-0 z-10" />
    </div>
  );
});

export default ProductCardImageSlider;
