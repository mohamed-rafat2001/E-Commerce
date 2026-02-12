import express from "express";
import {
	createOrder,
	getOrderById,
	getMyOrder,
	getMyOrders,
	getSellerOrders,
	updateOrderStatus,
} from "../controllers/orderController.js";
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management API
 */

router.use(Protect);

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, paymentMethod, shippingAddress]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     item: { type: string }
 *                     quantity: { type: number }
 *               paymentMethod: { type: string }
 *               shippingAddress: { type: object }
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.route("/").post(createOrder);

/**
 * @swagger
 * /api/v1/orders/myorders:
 *   get:
 *     summary: Get all orders for the current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 */
router.route("/myorders").get(getMyOrders);

router.route("/myorders/:id").get(getMyOrder);

/**
 * @swagger
 * /api/v1/orders/seller:
 *   get:
 *     summary: Get all orders for the current seller
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of seller's orders
 */
router.route("/seller").get(restrictTo("Seller"), getSellerOrders);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details retrieved
 */
router.route("/:id").get(getOrderById);

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin/SuperAdmin or Owner for Cancellation)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Processing, Shipped, Delivered, Cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.route("/:id/status").patch(updateOrderStatus);

export default router;
