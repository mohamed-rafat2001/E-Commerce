import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

const ProductGallery = ({ gallery, enableZoom = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="relative group w-full bg-[#f8f9fa] h-full min-h-[500px] lg:min-h-[700px] flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 mix-blend-multiply opacity-50" />

      {/* Main Image Container */}
      <div
        className={`relative w-full max-w-2xl aspect-square cursor-${isZoomed ? 'zoom-out' : 'zoom-in'} z-10`}
        onClick={() => enableZoom && setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full h-full rounded-2xl overflow-hidden ${isZoomed ? '' : 'shadow-2xl shadow-gray-200/50 mix-blend-multiply'}`}
          >
            <img
              src={gallery[currentIndex]}
              alt="Product"
              className="w-full h-full object-contain transition-transform duration-200 ease-out"
              style={{
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
              }}
              crossOrigin="anonymous"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {gallery.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-white flex items-center justify-center text-gray-900 shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all z-20 hover:scale-110 hover:bg-white"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-white flex items-center justify-center text-gray-900 shadow-xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all z-20 hover:scale-110 hover:bg-white"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 bg-white/70 backdrop-blur-xl p-2.5 rounded-3xl border border-white/50 shadow-lg">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`relative w-14 h-14 rounded-2xl overflow-hidden transition-all ${currentIndex === idx ? 'ring-2 ring-indigo-600 ring-offset-2 scale-110 bg-white' : 'hover:scale-105 opacity-60 hover:opacity-100 bg-white/50'
                }`}
            >
              <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover mix-blend-multiply" crossOrigin="anonymous" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Hint */}
      {enableZoom && (
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {isZoomed ? <FiMinimize2 className="w-3.5 h-3.5 text-gray-600" /> : <FiMaximize2 className="w-3.5 h-3.5 text-gray-600" />}
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">
            {isZoomed ? 'Zoom Out' : 'Zoom In'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
