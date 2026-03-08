import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useProductCardGallery - Hook for managing vertical thumbnail gallery in product cards
 * 
 * @param {Object} options
 * @param {string[]} options.images - Array of image URLs
 * @param {boolean} options.isHovered - Whether the card is currently hovered
 * @returns {Object} Gallery control methods and state
 */
export default function useProductCardGallery({ images = [], isHovered = false, autoSlide = true }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartY, setTouchStartY] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);
  
  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || !isHovered || images.length <= 1) return;
    
    // Clear any existing interval
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
    
    // Set up auto-slide interval (3 seconds)
    autoSlideIntervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev >= images.length - 1 ? 0 : prev + 1));
    }, 3000);
    
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [autoSlide, isHovered, images.length]);

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

  const setActiveIndexSafe = useCallback((index) => {
    setActiveIndex(Math.max(0, Math.min(index, images.length - 1)));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setActiveIndex(prev => (prev >= images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex(prev => (prev <= 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Debounced thumbnail hover handler (60ms) - also pauses auto-slide
  const handleThumbnailHover = useCallback((index) => {
    // Clear any pending debounce
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Pause auto-slide when user interacts
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }

    // Debounce by 60ms to avoid flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveIndexSafe(index);
    }, 60);
  }, [setActiveIndexSafe]);

  const handleThumbnailClick = useCallback((index) => {
    // Pause auto-slide on click
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }
    setActiveIndexSafe(index);
  }, [setActiveIndexSafe]);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(0);
  }, []);

  // Touch handlers for mobile swipe on main image
  const handleTouchStart = useCallback((e) => {
    setTouchStartY(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartY === null) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
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
    
    setTouchStartY(null);
  }, [touchStartY, goToNext, goToPrev]);

  // Early return if no images or single image (after all hooks)
  if (!images || images.length <= 1) {
    return {
      activeIndex: 0,
      setActiveIndex: () => {},
      goToNext: () => {},
      goToPrev: () => {},
      handleThumbnailHover: () => {},
      handleThumbnailClick: () => {},
      handleMouseLeave: () => {},
      handleTouchStart: () => {},
      handleTouchEnd: () => {},
    };
  }

  return {
    activeIndex,
    setActiveIndex: setActiveIndexSafe,
    goToNext,
    goToPrev,
    handleThumbnailHover,
    handleThumbnailClick,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  };
}
