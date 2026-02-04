import { addFunc, deleteFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// add category
export const addReview = (review, id) => addFunc(`reviews/${id}`, review);

// get review
export const getReview = (id) => getFunc(`reviews/${id}`);

// delete category
export const deleteReview = (id) => deleteFunc(`reviews/${id}`);

// update category
export const updateReview = (review, id) => updateFunc(`reviews/${id}`, review);
