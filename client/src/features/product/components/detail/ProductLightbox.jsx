import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductLightbox = ({
    isOpen,
    onClose,
    images,
    activeIndex,
    onNext,
    onPrev
}) => {
    // Disable scrolling when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10"
                    >
                        <FiX className="w-8 h-8" />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center">
                        <motion.img
                            key={activeIndex}
                            src={images[activeIndex]}
                            alt="Lightbox"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="max-w-full max-h-full object-contain"
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={onPrev}
                                    className="absolute left-0 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                >
                                    <FiChevronLeft className="w-10 h-10" />
                                </button>
                                <button
                                    onClick={onNext}
                                    className="absolute right-0 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                >
                                    <FiChevronRight className="w-10 h-10" />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/70 text-xs font-black tracking-widest uppercase">
                        {activeIndex + 1} / {images.length}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProductLightbox;
