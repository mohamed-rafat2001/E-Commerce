import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronUp, FiChevronDown, FiX, FiMaximize2 } from 'react-icons/fi';

const ProductGallery = ({ gallery }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Close lightbox on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowLightbox(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full relative">
      {/* Thumbnail Strip (Left Vertical) */}
      <div className="hidden md:flex flex-col gap-3 overflow-y-auto no-scrollbar h-[500px] shrink-0">
        {gallery.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-50 border-2 transition-all shrink-0 ${
              currentIndex === idx ? 'border-primary' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 relative group">
        <img
          src={gallery[currentIndex]}
          alt="Product Main"
          className="w-full h-full object-contain cursor-zoom-in"
          crossOrigin="anonymous"
          onClick={() => setShowLightbox(true)}
        />
        <button
          onClick={() => setShowLightbox(true)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
        >
          <FiMaximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Mobile Thumbnails */}
      <div className="flex md:hidden gap-3 overflow-x-auto no-scrollbar pb-2">
        {gallery.slice(0, 4).map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border-2 transition-all shrink-0 relative ${
              currentIndex === idx ? 'border-primary' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            {idx === 3 && gallery.length > 4 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-sm">
                    +{gallery.length - 4}
                </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <FiChevronUp className="-rotate-90 w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <FiChevronDown className="-rotate-90 w-6 h-6" />
                </button>
              </>
            )}

            {/* Lightbox Main Image */}
            <div className="w-full h-full max-w-5xl flex items-center justify-center">
              <img
                src={gallery[currentIndex]}
                alt="Product Full View"
                className="max-w-full max-h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>

            {/* Dot Indicators */}
            {gallery.length > 1 && (
              <div className="absolute bottom-4 md:bottom-8 flex items-center gap-2">
                {gallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentIndex === idx ? 'w-6 bg-primary' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGallery;
