import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useProductCardSlider - Hook for managing vertical image slider in product cards
 * 
 * @param {Object} options
 * @param {string[]} options.images - Array of image URLs
 * @param {boolean} options.isHovered - Whether the card is currently hovered
 * @returns {Object} Slider control methods and state
 */
export default function useProductCardSlider({ images = [], isHovered = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const containerRef = useRef(null);
  
  // Early return if no images or single image
  if (!images || images.length <= 1) {
    return {
      activeIndex: 0,
      goToIndex: () => {},
      goToNext: () => {},
      goToPrev: () => {},
      handleMouseMove: () => {},
      handleMouseLeave: () => {},
      handleTouchStart: () => {},
      handleTouchEnd: () => {},
      visibleDots: [],
      isSliderActive: false,
    };
  }

  // Reset to first image when hover ends
  useEffect(() => {
    if (!isHovered) {
      setActiveIndex(0);
    }
  }, [isHovered]);

  // Preload all images on mount
  useEffect(() => {
    images.forEach((src, index) => {
      if (index === 0) return; // Skip first image as it's already loaded
      
      const img = new Image();
      img.src = src;
      img.loading = 'lazy';
    });
  }, [images]);

  const goToIndex = useCallback((index) => {
    setActiveIndex(Math.max(0, Math.min(index, images.length - 1)));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setActiveIndex(prev => (prev >= images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex(prev => (prev <= 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Debounced mouse move handler
  const debounceTimeout = useRef(null);
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;

    // Clear any pending debounce
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Debounce by 80ms
    debounceTimeout.current = setTimeout(() => {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const relativeY = mouseY / rect.height;

      // Top 40% → previous image
      // Middle 20% → stay
      // Bottom 40% → next image
      if (relativeY < 0.4) {
        goToPrev();
      } else if (relativeY > 0.6) {
        goToNext();
      }
    }, 80);
  }, [goToNext, goToPrev]);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(0);
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = useCallback((e) => {
    setTouchStart(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStart === null) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStart - touchEndY;
    
    // Only trigger if swipe distance > 40px
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe up → next image
        goToNext();
      } else {
        // Swipe down → previous image
        goToPrev();
      }
    }
    
    setTouchStart(null);
  }, [touchStart, goToNext, goToPrev]);

  // Return max 5 dots with their active state
  const visibleDots = images.slice(0, 5).map((_, index) => ({
    index,
    isActive: index === activeIndex,
  }));

  return {
    activeIndex,
    goToIndex,
    goToNext,
    goToPrev,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    visibleDots,
    isSliderActive: true,
    containerRef,
  };
}
