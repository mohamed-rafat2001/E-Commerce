import express from "express";
const router = express.Router();
import { Protect } from "../middelwares/authMiddelware.js";
import {
	addReview,
	deleteReviewByOwner,
	getSingleReview,
	updateReview,
} from "../controllers/reviewscontroller.js";

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
