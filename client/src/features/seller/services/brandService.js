import { getFunc, addFunc, updateFunc, deleteFunc } from "../../../shared/services/handlerFactory.js";

// ===== BRAND SERVICES =====
// Get seller's brands
export const getSellerBrands = (params) => getFunc("brands", { params });

// Get single brand
export const getBrand = (id) => getFunc(`brands/${id}`);

// Add brand
export const addBrand = (brand) => addFunc("brands", brand);

// Update brand
export const updateBrand = (id, brand) => updateFunc(`brands/${id}`, brand);

// Delete brand
export const deleteBrand = (id) => deleteFunc(`brands/${id}`);

// Update brand logo
export const updateBrandLogo = (id, formData) => updateFunc(`brands/${id}/logo`, formData);
