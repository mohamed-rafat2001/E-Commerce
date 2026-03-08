import { useState, useEffect } from 'react';

/**
 * Hook to manage the announcement bar state
 */
export const useAnnouncementBar = () => {
    const messages = [
        "🚚 Free shipping on all orders over $50",
        "🔥 Flash Sale live now — up to 70% off",
        "🎁 New members get 10% off their first order",
        "📦 Easy 30-day returns on all products"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(() => {
        if (typeof window === 'undefined') return true;
        return !localStorage.getItem('announcement_closed');
    });

    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % messages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isVisible, messages.length]);

    const close = () => {
        setIsVisible(false);
        localStorage.setItem('announcement_closed', 'true');
    };

    return {
        currentMessage: messages[currentIndex],
        isVisible,
        close
    };
};

export default useAnnouncementBar;
