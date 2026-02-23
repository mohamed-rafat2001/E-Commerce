import { getFunc, addFunc, updateFunc, deleteFunc } from "../../../shared/services/handlerFactory.js";

// ===== BRAND SERVICES =====
// Get seller's brands
export const getSellerBrands = () => getFunc("brands?sort=-createdAt&limit=1000");

// Add brand
export const addBrand = (brand) => addFunc("brands", brand);

// Update brand
export const updateBrand = (id, brand) => updateFunc(`brands/${id}`, brand);

// Delete brand
export const deleteBrand = (id) => deleteFunc(`brands/${id}`);

// Update brand logo
export const updateBrandLogo = (id, formData) => updateFunc(`brands/${id}/logo`, formData);
