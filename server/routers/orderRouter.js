import express from "express";
import {
	getMyOrder,
	getMyOrders,
	updateOrderStatus,
} from "../controllers/orderController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(Protect);

router.route("/myorders").get(getMyOrders);
router.route("/myorders/:id").get(getMyOrder);
router.route("/:id/status").patch(updateOrderStatus);

export default router;
