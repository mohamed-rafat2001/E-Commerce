import { getFunc } from "../../../shared/services/handlerFactory.js";

export const getBrands = (params = {}) => getFunc("brands/public", { params });

export const getBrandById = (brandId) =>
	getFunc("brands/public", {
		params: { _id: brandId, limit: 1 },
	});

export const getBrandProducts = (params = {}) => getFunc("products", { params });

export const getCategories = (params = {}) =>
	getFunc("categories", {
		params: { populate: "subCategories", ...params },
	});

export const getCategoryById = (categoryId) =>
	getFunc(`categories/${categoryId}`, {
		params: { populate: "subCategories" },
	});
