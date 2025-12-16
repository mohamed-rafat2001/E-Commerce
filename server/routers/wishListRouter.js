import express from "express";
import { Protect } from "../middlewares/authMiddleware.js";
import {
	addToWishList,
	deleteFromWishList,
	deleteWishList,
	showWishList,
} from "../controllers/wishListController.js";
const router = express.Router();

router.use(Protect);
router.route("/").get(showWishList);
router
	.route("/:id")
	.delete(deleteWishList)
	.patch(deleteFromWishList)
	.post(addToWishList);

export default router;
