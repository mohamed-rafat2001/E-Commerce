import ReviewsModel from "../models/ReviewsModel.js";
import {
	createDoc,
	updateByOwner,
	getAll,
	deleteOneByOwner,
} from "./handlerFactory.js";

//  @desc   add new review
// @Route  POST /api/v1/reviews
// @access private/user
export const addReview = createDoc(ReviewsModel, ["rating", "comment"]);

//  @desc   update review by owner
//  @Route  PATCH /api/v1/reviews/:id
//  @access private/user
export const updateReview = updateByOwner(
	ReviewsModel,

	["rating", "comment"],
);

//  @desc   get reviews for a product or seller
// @Route  GET /api/v1/reviews/:id
// @access Public
export const getSingleReview = getAll(ReviewsModel);

//  @desc   delete single review by owner
//  @Route  GET /api/v1/reviews/:id
//  @access private/user || admin
export const deleteReview = deleteOneByOwner(ReviewsModel);
