import { useState, useMemo } from 'react';

/**
 * Hook to manage product image slider state
 * @param {Array} images - Array of image objects or URLs
 */
export const useProductImageSlider = (images = []) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const gallery = useMemo(() => {
        if (!images || images.length === 0) return [];
        return images.map(img => img.secure_url || img);
    }, [images]);

    const activeImage = gallery[activeIndex] || null;

    const goToNext = () => {
        setActiveIndex((prev) => (prev + 1) % gallery.length);
    };

    const goToPrev = () => {
        setActiveIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    };

    const goToIndex = (index) => {
        if (index >= 0 && index < gallery.length) {
            setActiveIndex(index);
        }
    };

    const openLightbox = () => setIsLightboxOpen(true);
    const closeLightbox = () => setIsLightboxOpen(false);

    return {
        gallery,
        activeIndex,
        activeImage,
        goToNext,
        goToPrev,
        goToIndex,
        isLightboxOpen,
        openLightbox,
        closeLightbox
    };
};

export default useProductImageSlider;
