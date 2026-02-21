import mainApi from "../../../api/mainApi.js";

export const getSubCategories = () => {
	return mainApi.get("/subcategories");
};

export const addSubCategory = (subCategoryData) => {
	return mainApi.post("/subcategories", subCategoryData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

export const updateSubCategory = ({ id, data }) => {
	return mainApi.patch(`/subcategories/${id}`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

export const deleteSubCategory = (id) => {
	return mainApi.delete(`/subcategories/${id}`);
};