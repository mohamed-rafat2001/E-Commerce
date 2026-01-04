import express from "express";
import {
	createOrder,
	getAllOrders,
	getMyOrder,
	getMyOrders,
	getOrderById,
	updateOrderStatus,
} from "../controllers/orderController.js";
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(Protect);

router.route("/").post(createOrder).get(restrictTo("Admin"), getAllOrders);

router.route("/myorders").get(getMyOrders);
router.route("/myorders/:id").get(getMyOrder);
router.route("/:id").get(restrictTo("Admin"), getOrderById);

router.route("/:id/status").patch(updateOrderStatus);

export default router;
