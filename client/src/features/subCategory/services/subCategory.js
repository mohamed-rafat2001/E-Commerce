import mainApi from "../../../api/mainApi.js";

export const getSubCategories = () => {
	return mainApi.get("/subcategories");
};

export const addSubCategory = (subCategoryData, onUploadProgress) => {
	return mainApi.post("/subcategories", subCategoryData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		onUploadProgress: (progressEvent) => {
			if (onUploadProgress) {
				const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
				onUploadProgress(percentCompleted);
			}
		},
	});
};

export const updateSubCategory = ({ id, data }, onUploadProgress) => {
	return mainApi.patch(`/subcategories/${id}`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		onUploadProgress: (progressEvent) => {
			if (onUploadProgress) {
				const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
				onUploadProgress(percentCompleted);
			}
		},
	});
};

export const deleteSubCategory = (id) => {
	return mainApi.delete(`/subcategories/${id}`);
};