import { motion } from 'framer-motion';
import { Slider } from '../../../shared/ui/index.js';
import { FiCamera } from 'react-icons/fi';

const ProductGallery = ({ gallery, enableZoom = true }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group"
    >
      <Slider
        images={gallery}
        thumbnails
        navigation
        autoplay
        enableZoom={enableZoom}
        aspectClass="aspect-square"
        showCounter
      />
      
      {/* Floating Image Count Badge */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/50 shadow-lg shadow-black/5 flex items-center gap-2 group/badge hover:bg-white transition-all duration-300">
          <FiCamera className="w-3.5 h-3.5 text-indigo-600 group-hover/badge:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-900">
            {gallery.length} perspective{gallery.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Subtle Corner Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent blur-3xl pointer-events-none" />
    </motion.div>
  );
};

export default ProductGallery;

