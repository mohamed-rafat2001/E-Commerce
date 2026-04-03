/**
 * Centralized query key factory.
 * Never write raw string keys — always use this factory.
 * Ensures consistent cache invalidation and deduplication.
 */
export const queryKeys = {
    // Products
    products: {
        all: ['products'],
        lists: () => [...queryKeys.products.all, 'list'],
        list: (params) => [...queryKeys.products.lists(), params],
        publicList: (params) => [...queryKeys.products.all, 'public', params],
        details: () => [...queryKeys.products.all, 'detail'],
        detail: (id) => [...queryKeys.products.details(), id],
        byBrand: (brandId) => [...queryKeys.products.all, 'brand', brandId],
        byCategory: (categoryId) => [...queryKeys.products.all, 'category', categoryId],
        related: (productId, categoryId) => [...queryKeys.products.all, 'related', productId, categoryId],
        myProducts: (params) => [...queryKeys.products.all, 'my', params],
    },

    // Brands
    brands: {
        all: ['brands'],
        lists: () => [...queryKeys.brands.all, 'list'],
        list: (params) => [...queryKeys.brands.lists(), params],
        detail: (id) => [...queryKeys.brands.all, 'detail', id],
        products: (brandId, params) => [...queryKeys.brands.all, brandId, 'products', params],
        followers: (brandId) => [...queryKeys.brands.all, brandId, 'followers'],
        isFollowing: (brandId) => [...queryKeys.brands.all, brandId, 'isFollowing'],
    },

    // Categories 
    categories: {
        all: ['categories'],
        list: () => [...queryKeys.categories.all, 'list'],
        detail: (id) => [...queryKeys.categories.all, 'detail', id],
        subCategories: (categoryId) => ['subcategories', categoryId],
    },

    // Cart
    cart: {
        all: ['cart'],
        detail: () => [...queryKeys.cart.all, 'detail'],
        count: () => [...queryKeys.cart.all, 'count'],
    },

    // Wishlist
    wishlist: {
        all: ['wishlist'],
        detail: () => [...queryKeys.wishlist.all, 'detail'],
    },

    // User / Auth
    user: {
        all: ['user'],
        current: () => [...queryKeys.user.all, 'current'],
        profile: (userId) => [...queryKeys.user.all, 'profile', userId],
    },

    // Reviews
    reviews: {
        all: ['reviews'],
        byProduct: (productId) => [...queryKeys.reviews.all, 'product', productId],
    },

    // Orders
    orders: {
        all: ['orders'],
        list: (params) => [...queryKeys.orders.all, 'list', params],
        detail: (orderId) => [...queryKeys.orders.all, 'detail', orderId],
    },

    // Search
    search: {
        all: ['search'],
        results: (query, page) => [...queryKeys.search.all, query, page],
    },

    // Admin
    admin: {
        users: (params) => ['admin', 'users', params],
        analytics: () => ['admin', 'analytics'],
    },

    // Seller
    seller: {
        analytics: () => ['seller', 'analytics'],
    },
};
