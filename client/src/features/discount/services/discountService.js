import { getFunc, addFunc, updateFunc, deleteFunc } from "../../../shared/services/handlerFactory.js";

// ===== DISCOUNT API SERVICES =====

// ── Public ─────────────────────────────────────────────────────────────
export const getActiveDiscounts = (params) =>
	getFunc("discounts/active", { params });

export const getProductDiscount = (productId) =>
	getFunc(`discounts/product/${productId}`);

// ── Seller ─────────────────────────────────────────────────────────────
export const getSellerDiscounts = (params) =>
	getFunc("discounts/seller", { params });

export const getSellerDiscount = (id) =>
	getFunc(`discounts/seller/${id}`);

export const createSellerDiscount = (data) =>
	addFunc("discounts/seller", data);

export const updateSellerDiscount = (id, data) =>
	updateFunc(`discounts/seller/${id}`, data);

export const deleteSellerDiscount = (id) =>
	deleteFunc(`discounts/seller/${id}`);

export const toggleSellerDiscount = (id) =>
	updateFunc(`discounts/seller/${id}/toggle`);

// ── Admin ──────────────────────────────────────────────────────────────
export const getAdminDiscounts = (params) =>
	getFunc("discounts/admin", { params });

export const getAdminDiscount = (id) =>
	getFunc(`discounts/admin/${id}`);

export const createAdminDiscount = (data) =>
	addFunc("discounts/admin", data);

export const updateAdminDiscount = (id, data) =>
	updateFunc(`discounts/admin/${id}`, data);

export const deleteAdminDiscount = (id) =>
	deleteFunc(`discounts/admin/${id}`);

export const toggleAdminDiscount = (id) =>
	updateFunc(`discounts/admin/${id}/toggle`);
