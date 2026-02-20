import express from "express";
const router = express.Router();
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
	addAddressestoSeller,
	addPayoutMethodtoSeller,
	completeSellerDoc,
	getSellerDashboardStats,
	getSellerAnalytics,
	getSellerProfile,
	updateSellerOrderStatus,
} from "../controllers/sellerController.js";

/**
 * @swagger
 * tags:
 *   name: Sellers
 *   description: Seller profile and business management API
 */

router.use(Protect, restrictTo("Seller"));

/**
 * @swagger
 * /api/v1/sellers/profile:
 *   get:
 *     summary: Get seller's own profile
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seller profile retrieved successfully
 */
router.get("/profile", getSellerProfile);

/**
 * @swagger
 * /api/v1/sellers/addresses:
 *   patch:
 *     summary: Add addresses to seller profile
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addresses:
 *                 type: object
 *                 properties:
 *                   label: { type: string }
 *                   line1: { type: string }
 *                   city: { type: string }
 *                   postalCode: { type: string }
 *                   country: { type: string }
 *     responses:
 *       200:
 *         description: Address added successfully
 */
router.patch("/addresses", addAddressestoSeller);

/**
 * @swagger
 * /api/v1/sellers:
 *   patch:
 *     summary: Complete or update seller document
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch("/", completeSellerDoc);

/**
 * @swagger
 * /api/v1/sellers/payoutMethods:
 *   patch:
 *     summary: Add payout method to seller
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payout method added
 */
router.patch("/payoutMethods", addPayoutMethodtoSeller);

/**
 * @swagger
 * /api/v1/sellers/dashboard-stats:
 *   get:
 *     summary: Get seller dashboard statistics
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
router.get("/dashboard-stats", getSellerDashboardStats);

/**
 * @swagger
 * /api/v1/sellers/analytics:
 *   get:
 *     summary: Get seller analytics data
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 */
router.get("/analytics", getSellerAnalytics);

/**
 * @swagger
 * /api/v1/sellers/orders/{orderId}/status:
 *   patch:
 *     summary: Update order status by seller
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
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
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.patch("/orders/:orderId/status", updateSellerOrderStatus);

export default router;
