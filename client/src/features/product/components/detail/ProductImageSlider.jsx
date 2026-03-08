import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMaximize2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import useProductImageSlider from '../../hooks/useProductImageSlider';
import ProductThumbnails from './ProductThumbnails';
import ProductLightbox from './ProductLightbox';

const ProductImageSlider = ({ images = [] }) => {
    const {
        gallery,
        activeIndex,
        activeImage,
        goToNext,
        goToPrev,
        goToIndex,
        isLightboxOpen,
        openLightbox,
        closeLightbox
    } = useProductImageSlider(images);

    if (gallery.length === 0) {
        return (
            <div className="aspect-square bg-white rounded-[3rem] flex flex-col items-center justify-center border border-dashed border-gray-100 shadow-inner">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6 font-black text-2xl">?</div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Visual Asset Not Found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="relative group aspect-square bg-white rounded-[3rem] overflow-hidden border border-blue-50/50 shadow-2xl shadow-indigo-500/5 transition-all duration-700">
                {/* Image Composition */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-full flex items-center justify-center p-12"
                    >
                        <img
                            src={activeImage}
                            alt="Product Composition"
                            className="w-full h-full object-contain cursor-zoom-in drop-shadow-2xl"
                            onClick={openLightbox}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Intelligent Navigation Controls */}
                {gallery.length > 1 && (
                    <>
                        <button
                            onClick={goToPrev}
                            className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 text-gray-900 shadow-2xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-white active:scale-90"
                        >
                            <FiChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 text-gray-900 shadow-2xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-white active:scale-90"
                        >
                            <FiChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Interaction Layers */}
                <button
                    onClick={openLightbox}
                    className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 text-gray-900 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white active:scale-90 shadow-xl"
                >
                    <FiMaximize2 className="w-5 h-5" />
                </button>

                {/* Subtle Progress Bar */}
                {gallery.length > 1 && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50">
                        <motion.div
                            className="h-full bg-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((activeIndex + 1) / gallery.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                )}
            </div>

            {/* Thumbnail Registry */}
            <ProductThumbnails
                gallery={gallery}
                activeIndex={activeIndex}
                onSelect={goToIndex}
            />

            {/* Lightbox Canvas */}
            <ProductLightbox
                isOpen={isLightboxOpen}
                onClose={closeLightbox}
                images={gallery}
                activeIndex={activeIndex}
                onNext={goToNext}
                onPrev={goToPrev}
            />
        </div>
    );
};

export default ProductImageSlider;
