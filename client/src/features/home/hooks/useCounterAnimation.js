import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * Hook to animate a numeric value from 0 to target when in view
 * @param {number} targetValue 
 * @param {number} duration In milliseconds
 */
export const useCounterAnimation = (targetValue, duration = 3000) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out quad
            const easedProgress = 1 - (1 - progress) * (1 - progress);

            setCount(Math.floor(easedProgress * targetValue));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isInView, targetValue, duration]);

    return {
        displayValue: count,
        ref
    };
};

export default useCounterAnimation;
