/**
 * Guest Order Persistence - Handles saving recent guest orders to localStorage
 */

const STORAGE_KEY = 'guest_orders';

/**
 * Get all saved guest orders
 */
export const getSavedGuestOrders = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
};

/**
 * Save a new guest order to local history
 * @param {string} orderId 
 * @param {string} email 
 * @param {string} orderNumber 
 */
export const saveGuestOrder = (orderId, email, orderNumber) => {
    const orders = getSavedGuestOrders();
    
    // Avoid duplicates
    if (orders.find(o => o.orderId === orderId)) return;

    const newOrder = {
        orderId,
        email,
        orderNumber,
        timestamp: new Date().toISOString()
    };

    // Keep only last 10 orders for history
    const updatedOrders = [newOrder, ...orders].slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
};

/**
 * Get the most recently used guest email
 */
export const getLatestGuestEmail = () => {
    const orders = getSavedGuestOrders();
    return orders[0]?.email || localStorage.getItem('guest_email') || '';
};

/**
 * Save the guest email for future use
 */
export const saveGuestEmail = (email) => {
    localStorage.setItem('guest_email', email);
};
