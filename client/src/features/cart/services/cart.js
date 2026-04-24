/* Audit Findings:
 - Cart backend expects authenticated access for all cart endpoints.
 - Merge endpoint currently accepts guest_items array.
 - Frontend callers may pass guestItems naming from workflow layer.
*/
import { addFunc, deleteFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// get cart (enriched with live product data)
export const showCart = () => getFunc("cart");

// add product to cart
export const addToCart = (product) => addFunc("cart", product);

// update item quantity in cart
export const updateCartItemQuantity = (productId, quantity) =>
    updateFunc(`cart/${productId}`, { quantity });

// delete product from cart
export const deleteFromCart = (productId) => deleteFunc(`cart/${productId}`);

// clear entire cart
export const clearCart = () => deleteFunc("cart/clear");

// alias for backward compatibility
export const deleteCart = clearCart;

// validate cart for checkout
export const validateCart = () => getFunc("cart/validate");

// merge guest cart after login
export const mergeGuestCart = (guestItems) =>
    addFunc("cart/merge", { guest_items: guestItems, guestItems });

// checkout — create orders from cart
export const checkout = (orderData) => addFunc("orders/checkout", orderData);

// validate promo code
export const validatePromoCode = (data) => addFunc("discounts/validate-coupon", data);

// cancel order
export const cancelOrder = (orderId, reason) =>
    updateFunc(`orders/${orderId}/cancel`, { reason });
