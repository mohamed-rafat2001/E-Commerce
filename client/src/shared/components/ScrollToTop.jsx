import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Automatically scrolls the window to the top on every route change.
 * This ensures that when a user navigates from one page to another, 
 * they don't stay at the previous scroll position.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // We use window.scrollTo(0, 0) but if a smooth scroll library like Lenis is present,
        // it usually intercepts this or we might need to manually trigger it.
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // 'instant' instead of 'smooth' to avoid jarring halfway scrolls
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
