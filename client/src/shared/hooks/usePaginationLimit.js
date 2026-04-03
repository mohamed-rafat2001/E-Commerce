import { useSearchParams } from 'react-router-dom';

export const APP_LIMITS = {
    // Public pagination defaults
    PUBLIC_PRODUCTS: 12,
    PUBLIC_BRANDS: 12,
    PUBLIC_CATEGORIES: 12,
    PUBLIC_REVIEWS: 5,
    PUBLIC_RELATED: 6,
    
    // Panel (Admin/Seller) pagination defaults
    PANEL_BRANDS: 10,
    PANEL_CATEGORIES: 10,
    PANEL_PRODUCTS: 10,
    PANEL_ORDERS: 10,
    PANEL_USERS: 10,
    
    // Fallback limit
    DEFAULT: 12
};

/**
 * A central hook to manage pagination limits across the application.
 * Unifies the control over limits to make UI more professional.
 * It reads the 'limit' parameter from current URL, but defaults to
 * a specific list type constant defined in the APP_LIMITS config.
 * 
 * @param {string} listKey - The key defined inside APP_LIMITS (e.g. 'PUBLIC_PRODUCTS')
 * @returns {number} The active limit for the pagination context
 */
export default function usePaginationLimit(listKey = 'DEFAULT') {
    const [searchParams] = useSearchParams();
    const urlLimit = parseInt(searchParams.get('limit'));
    
    const defaultLimit = APP_LIMITS[listKey] || APP_LIMITS.DEFAULT;
    
    return urlLimit && !isNaN(urlLimit) && urlLimit > 0 ? urlLimit : defaultLimit;
}
