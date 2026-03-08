import { useState, useCallback, useEffect } from 'react';

const useHeroSlider = (slidesCount, autoplayInterval = 5000) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const goToSlide = useCallback((index) => {
        setActiveIndex(index);
    }, []);

    const goToNext = useCallback(() => {
        setActiveIndex((current) => (current + 1) % slidesCount);
    }, [slidesCount]);

    const goToPrev = useCallback(() => {
        setActiveIndex((current) => (current - 1 + slidesCount) % slidesCount);
    }, [slidesCount]);

    const pauseAutoplay = useCallback(() => setIsPaused(true), []);
    const resumeAutoplay = useCallback(() => setIsPaused(false), []);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(goToNext, autoplayInterval);
        return () => clearInterval(interval);
    }, [isPaused, goToNext, autoplayInterval]);

    return {
        activeIndex,
        goToNext,
        goToPrev,
        goToSlide,
        pauseAutoplay,
        resumeAutoplay
    };
};

export default useHeroSlider;
