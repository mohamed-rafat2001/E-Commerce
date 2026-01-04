import express from "express";
import { Protect } from "../middlewares/authMiddleware.js";
import {
	addToCart,
	deleteCart,
	deleteFromCart,
	showCart,
} from "../controllers/cartController.js";
const router = express.Router();

router.use(Protect);
router.route("/").patch(addToCart);
router.route("/:id").delete(deleteCart).patch(deleteFromCart).get(showCart);
export default router;
