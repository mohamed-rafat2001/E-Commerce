import { addFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// add order
export const addOrder = (order) => addFunc("orders", order);

// ===== ADMIN SERVICES =====
// get all orders for admin
export const getAllOrdersForAdmin = () => getFunc("admin/orders");

// get order by id for admin
export const getOrderForAdmin = (id) => getFunc(`admin/orders/${id}`);

// update order status by admin
export const updateOrderStatusByAdmin = (status, id) =>
	updateFunc(`orders/${id}/status`, status);

// ===== CUSTOMER SERVICES =====
// get orders for customer (owner)
export const getOrdersForCustomer = () => getFunc("orders/myorders");

// get order by id for customer (owner)
export const getOrderForCustomer = (id) => getFunc(`orders/myorders/${id}`);

// update order status by customer (cancel)
export const updateCustomerOrderStatus = (id, status) => 
	updateFunc(`orders/${id}/status`, { status });

// ===== SELLER SERVICES =====
// Get seller's orders (orders containing seller's products)
export const getSellerOrders = () => getFunc("orders/seller");

// Update order status from seller panel
export const updateSellerOrderStatus = (orderId, status) => 
	updateFunc(`sellers/orders/${orderId}/status`, { status });
