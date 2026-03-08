const GUEST_WISHLIST_KEY = "guest_wishlist";

/**
 * Get guest wishlist from localStorage.
 * Returns { items: [] } if empty or missing.
 */
export const getGuestWishlist = () => {
    try {
        const saved = localStorage.getItem(GUEST_WISHLIST_KEY);
        if (!saved) return { items: [] };

        const parsed = JSON.parse(saved);
        if (!parsed || !Array.isArray(parsed.items)) {
            return { items: [] };
        }

        return parsed;
    } catch {
        return { items: [] };
    }
};

/**
 * Save guest wishlist to localStorage.
 */
const saveGuestWishlist = (wishlist) => {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlist));
};

/**
 * Add a product to the guest wishlist.
 * If the product already exists, skip (no duplicates).
 *
 * @param {Object} product - The product to add (must have _id, name, price, image)
 */
export const addToGuestWishlist = (product) => {
    const wishlist = getGuestWishlist();
    
    const productId = product._id || product.id;
    const existingIndex = wishlist.items.findIndex(
        (item) => item.product_id === productId
    );

    if (existingIndex !== -1) {
        // Product already exists - skip
        return wishlist;
    }

    // New product - push to items
    wishlist.items.push({
        product_id: productId,
        name: product.name,
        price: product.price?.amount || product.price || 0,
        image: product.coverImage?.secure_url || product.image || "",
    });

    saveGuestWishlist(wishlist);
    return wishlist;
};

/**
 * Remove a product from the guest wishlist.
 *
 * @param {string} productId - The product ID to remove
 */
export const removeFromGuestWishlist = (productId) => {
    const wishlist = getGuestWishlist();
    wishlist.items = wishlist.items.filter((item) => item.product_id !== productId);
    saveGuestWishlist(wishlist);
    return wishlist;
};

/**
 * Clear the entire guest wishlist from localStorage.
 */
export const clearGuestWishlist = () => {
    localStorage.removeItem(GUEST_WISHLIST_KEY);
};

/**
 * Check if the guest wishlist has items.
 */
export const hasGuestWishlistItems = () => {
    const wishlist = getGuestWishlist();
    return wishlist.items.length > 0;
};

/**
 * Check if a product is in the guest wishlist.
 *
 * @param {string} productId - The product ID to check
 */
export const isInGuestWishlist = (productId) => {
    const wishlist = getGuestWishlist();
    return wishlist.items.some((item) => item.product_id === productId);
};
