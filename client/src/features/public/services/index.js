import { getFunc } from "../../../shared/services/handlerFactory.js";

export const getBrands = (params = {}) => getFunc("brands/public", { params });

export const getBrandById = (brandId) => getFunc(`brands/public/${brandId}`);

export const getCategories = (params = {}) =>
	getFunc("categories", {
		params: { populate: "subCategories", ...params },
	});

export const getCategoryById = (categoryId) =>
	getFunc(`categories/${categoryId}`, {
		params: { populate: "subCategories" },
	});
