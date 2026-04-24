import express from "express";
import {
	checkout,
	guestCheckout,
	getMyOrders,
	getMyOrder,
	cancelOrder,
	getSellerOrders,
	updateOrderStatusBySeller,
	getAllOrders,
	updateOrderStatusByAdmin,
} from "../controllers/orderController.js";
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management API
 */

// ========== PUBLIC ROUTES (no auth required) ==========

/**
 * @swagger
 * /api/v1/orders/guest-checkout:
 *   post:
 *     summary: Guest checkout — create orders from provided cart items (no auth)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentMethod, shippingAddress, cartItems, guestEmail]
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, paypal, bank_transfer, cash_on_delivery, wallet]
 *               shippingAddress:
 *                 type: object
 *               cartItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               guestEmail:
 *                 type: string
 *               guestName:
 *                 type: string
 *               guestPhone:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Guest orders created successfully
 */
router.route("/guest-checkout").post(guestCheckout);

// ========== PROTECTED ROUTES (auth required) ==========
router.use(Protect);

// ========== CUSTOMER ROUTES ==========

/**
 * @swagger
 * /api/v1/orders/checkout:
 *   post:
 *     summary: Checkout — create orders from cart (one per seller)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentMethod, shippingAddress]
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, paypal, bank_transfer, cash_on_delivery, wallet]
 *               shippingAddress:
 *                 type: object
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Orders created successfully
 */
router.route("/checkout").post(checkout);

/**
 * @swagger
 * /api/v1/orders/myorders:
 *   get:
 *     summary: Get all orders for the current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Processing, Shipped, Delivered, Cancelled]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user's orders
 */
router.route("/myorders").get(getMyOrders);

/**
 * @swagger
 * /api/v1/orders/myorders/{id}:
 *   get:
 *     summary: Get a specific order by ID (customer)
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
router.route("/myorders/:id").get(getMyOrder);

/**
 * @swagger
 * /api/v1/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order (customer, pending only)
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order cancelled and inventory restored
 */
router.route("/:id/cancel").patch(cancelOrder);

// ========== SELLER ROUTES ==========

/**
 * @swagger
 * /api/v1/orders/seller:
 *   get:
 *     summary: Get all orders for the current seller's products
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
 * /api/v1/orders/{id}/seller-status:
 *   patch:
 *     summary: Update order status by seller (Pending→Processing, Processing→Shipped)
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
 *                 enum: [Processing, Shipped]
 *               tracking_number:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated
 */
router
	.route("/:id/seller-status")
	.patch(restrictTo("Seller"), updateOrderStatusBySeller);

// ========== ADMIN ROUTES ==========

/**
 * @swagger
 * /api/v1/orders/admin/all:
 *   get:
 *     summary: Get all orders (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved
 */
router
	.route("/admin/all")
	.get(restrictTo("Admin", "SuperAdmin"), getAllOrders);

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   patch:
 *     summary: Force update any order's status (Admin only)
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
 *                 enum: [Pending, Processing, Shipped, Delivered, Cancelled]
 *               tracking_number:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated
 */
router
	.route("/:id/status")
	.patch(restrictTo("Admin", "SuperAdmin"), updateOrderStatusByAdmin);

export default router;
