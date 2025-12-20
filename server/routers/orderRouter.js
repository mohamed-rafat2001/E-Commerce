import express from "express";
import {
	createOrder,
	getAllOrders,
	getMyOrders,
	getOrderById,
	updateOrderToDelivered,
	updateOrderToPaid,
} from "../controllers/orderController.js";
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(Protect);

router
	.route("/")
	.post(createOrder)
	.get(restrictTo("Admin", "SuperAdmin"), getAllOrders);

router.route("/myorders").get(getMyOrders);

router.route("/:id").get(getOrderById);

router.route("/:id/pay").patch(updateOrderToPaid);

router
	.route("/:id/deliver")
	.patch(restrictTo("Admin", "SuperAdmin"), updateOrderToDelivered);

export default router;
