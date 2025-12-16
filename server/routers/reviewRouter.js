import express from "express";
const router = express.Router();
import { Protect } from "../middlewares/authMiddleware.js";
import {
	addReview,
	deleteReviewByOwner,
	getSingleReview,
	updateReview,
} from "../controllers/reviewController.js";

//  add protect to all routes
router.use(Protect);

//  routes
router
	.route("/:id")
	.post(addReview)
	.patch(updateReview)
	.delete(deleteReviewByOwner)
	.get(getSingleReview);
export default router;
