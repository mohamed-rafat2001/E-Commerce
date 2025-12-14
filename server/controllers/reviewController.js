import productReviewsModel from "../models/productReviewsModel.js";
import {
	createDoc,
	updateDoc,
	deleteDocByOwner,
	getSingDoc,
} from "./handlerFactory.js";

//  @desc   add new review
// @Route  POST /api/v1/reviews
// @access private/user
export const addReview = createDoc(productReviewsModel, "ProductReviewsModel", [
	"rating",
	"comment",
]);

//  @desc   update review by owner
//  @Route  PATCH /api/v1/reviews/:id
//  @access private/user
export const updateReview = updateDoc(
	productReviewsModel,
	"ProductReviewsModel",
	["rating", "comment"]
);

//  @desc   get single review
//  @Route  GET /api/v1/reviews/:id
//  @access Public
export const getSingleReview = getSingDoc(productReviewsModel);

//  @desc   delete single review by owner
//  @Route  GET /api/v1/reviews/:id
//  @access private/user
export const deleteReviewByOwner = deleteDocByOwner(productReviewsModel);
