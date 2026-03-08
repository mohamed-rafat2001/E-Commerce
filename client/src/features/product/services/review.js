import { addFunc, deleteFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// add category
export const addReview = (review, id) => addFunc(`reviews/${id}`, review);

// get reviews for a product
export const getReview = (id, config = {}) => getFunc(`reviews/${id}`, config);

// delete category
export const deleteReview = (id) => deleteFunc(`reviews/${id}`);

// update category
export const updateReview = (review, id) => updateFunc(`reviews/${id}`, review);
