const GUEST_CART_KEY = "guest_cart";

/**
 * Get guest cart from localStorage.
 * Returns { items: [], total: 0 } if empty or missing.
 */
export const getGuestCart = () => {
    try {
        const saved = localStorage.getItem(GUEST_CART_KEY);
        if (!saved) return { items: [], total: 0 };

        const parsed = JSON.parse(saved);
        if (!parsed || !Array.isArray(parsed.items)) {
            return { items: [], total: 0 };
        }

        return parsed;
    } catch {
        return { items: [], total: 0 };
    }
};

/**
 * Calculate the total from cart items.
 */
const recalculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

/**
 * Save guest cart to localStorage.
 */
const saveGuestCart = (cart) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

/**
 * Add a product to the guest cart.
 * If the product already exists, increment its quantity.
 *
 * @param {Object} product - The product to add (must have _id, name, price, coverImage, userId)
 * @param {number} quantity - Quantity to add (default 1)
 */
export const addToGuestCart = (product, quantity = 1) => {
    const cart = getGuestCart();

    const productId = product._id || product.id;
    const existingIndex = cart.items.findIndex(
        (item) => item.product_id === productId
    );

    if (existingIndex !== -1) {
        // Product already exists — increment quantity
        cart.items[existingIndex].quantity += quantity;
    } else {
        // New product — push to items
        cart.items.push({
            product_id: productId,
            name: product.name,
            price: product.price?.amount || product.price || 0,
            image: product.coverImage?.secure_url || product.image || "",
            seller_id: product.userId || product.seller_id || "",
            quantity,
        });
    }

    cart.total = recalculateTotal(cart.items);
    saveGuestCart(cart);
    return cart;
};

/**
 * Remove a product from the guest cart.
 *
 * @param {string} productId - The product ID to remove
 */
export const removeFromGuestCart = (productId) => {
    const cart = getGuestCart();
    cart.items = cart.items.filter((item) => item.product_id !== productId);
    cart.total = recalculateTotal(cart.items);
    saveGuestCart(cart);
    return cart;
};

/**
 * Update the quantity of a product in the guest cart.
 *
 * @param {string} productId - The product ID to update
 * @param {number} quantity - New quantity (must be >= 1)
 */
export const updateGuestCartQty = (productId, quantity) => {
    if (quantity < 1) return getGuestCart();

    const cart = getGuestCart();
    const item = cart.items.find((item) => item.product_id === productId);

    if (item) {
        item.quantity = quantity;
        cart.total = recalculateTotal(cart.items);
        saveGuestCart(cart);
    }

    return cart;
};

/**
 * Clear the entire guest cart from localStorage.
 */
export const clearGuestCart = () => {
    localStorage.removeItem(GUEST_CART_KEY);
};

/**
 * Check if the guest cart has items.
 */
export const hasGuestCartItems = () => {
    const cart = getGuestCart();
    return cart.items.length > 0;
};
