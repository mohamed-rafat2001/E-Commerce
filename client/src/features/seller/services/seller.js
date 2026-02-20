import { addFunc, deleteFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// ===== PRODUCT SERVICES =====
// Get seller's own products
export const getSellerProducts = () => getFunc("products/myproducts");

// Add new product
export const addProduct = (product) => addFunc("products", product);

// Update product
export const updateProduct = (id, product) => updateFunc(`products/${id}`, product);

// Delete product
export const deleteProduct = (id) => deleteFunc(`products/${id}`);

// Delete all products
export const deleteAllProducts = () => deleteFunc("products");

// ===== ORDER SERVICES =====
// Get seller's orders (orders containing seller's products)
export const getSellerOrders = () => getFunc("orders/seller");

// Update order status from seller panel
export const updateSellerOrderStatus = (orderId, status) => 
	updateFunc(`sellers/orders/${orderId}/status`, { status });

// ===== SELLER PROFILE SERVICES =====
// Get seller profile
export const getSellerProfile = () => getFunc("sellers/profile");

// Update seller profile
export const updateSellerProfile = (data) => updateFunc("sellers", data);

// Add address to seller
export const addSellerAddress = (address) => updateFunc("sellers/addresses", { addresses: address });

// Add payout method
export const addPayoutMethod = (payoutMethod) => 
	updateFunc("sellers/payoutMethods", { payoutMethods: payoutMethod });

// ===== ANALYTICS SERVICES =====
// Get seller analytics/stats
export const getSellerAnalytics = () => getFunc("sellers/analytics");

// Get seller dashboard stats
export const getSellerDashboardStats = () => getFunc("sellers/dashboard-stats");
