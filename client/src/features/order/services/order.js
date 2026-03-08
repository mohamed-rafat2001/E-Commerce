import { addFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// ===== CUSTOMER SERVICES =====
// Checkout — create orders from cart
export const checkoutOrder = (orderData) => addFunc("orders/checkout", orderData);

// Get orders for customer (owner)
export const getOrdersForCustomer = (params) =>
	getFunc("orders/myorders", { params });

// Get order by id for customer (owner)
export const getOrderForCustomer = (id) => getFunc(`orders/myorders/${id}`);

// Cancel order (customer, pending only)
export const cancelOrder = (id, reason) =>
	updateFunc(`orders/${id}/cancel`, { reason });

// Backward compatibility alias
export const updateCustomerOrderStatus = (id, status) =>
	updateFunc(`orders/${id}/status`, { status });

// ===== SELLER SERVICES =====
// Get seller's orders (orders containing seller's products)
export const getSellerOrders = (params) => getFunc("orders/seller", { params });

// Update order status from seller panel
export const updateSellerOrderStatus = (orderId, statusData) =>
	updateFunc(`orders/${orderId}/seller-status`, statusData);

// ===== ADMIN SERVICES =====
// Get all orders for admin
export const getAllOrdersForAdmin = (params) =>
	getFunc("orders/admin/all", { params });

// Get order by id for admin
export const getOrderForAdmin = (id) => getFunc(`admin/orders/${id}`);

// Update order status by admin (force any transition)
export const updateOrderStatusByAdmin = (id, statusData) =>
	updateFunc(`orders/${id}/status`, statusData);
