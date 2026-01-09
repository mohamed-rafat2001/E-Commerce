import { addFunc, getFunc, updateFunc } from "./handlerFactory.js";

// add order
export const addOrder = (order) => addFunc("orders", order);

// get all orders for admin
export const getAllOrdersForAdmin = () => getFunc("orders");

// get orders for customer (owner)
export const getOrdersForCustomer = () => getFunc("orders/myorders");

// get order by id for customer (owner)
export const getOrderForCustomer = (id) => getFunc(`orders/myorders/${id}`);

// get order by id for admin
export const getOrderForAdmin = (id) => getFunc(`orders/${id}`);

// update order status by admin
export const updateOrderStatusByAdmin = (status, id) =>
	updateFunc(`orders/${id}/status`, status);
