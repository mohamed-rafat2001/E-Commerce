import express from "express";
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
	// Admin
	adminCreateDiscount,
	adminUpdateDiscount,
	adminDeleteDiscount,
	adminGetAllDiscounts,
	adminGetDiscount,
	adminToggleDiscount,
	// Seller
	sellerCreateDiscount,
	sellerUpdateDiscount,
	sellerDeleteDiscount,
	sellerGetAllDiscounts,
	sellerGetDiscount,
	sellerToggleDiscount,
	// Public
	getActiveDiscounts,
	getProductDiscount,
} from "../controllers/discountController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Discounts
 *   description: Discount and promotion management API
 */

// ── Public Routes ─────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/discounts/active:
 *   get:
 *     summary: Get all currently active discounts
 *     tags: [Discounts]
 *     parameters:
 *       - in: query
 *         name: scope
 *         schema: { type: string }
 *         description: Filter by scope (all_products, category, seller_all, single_product)
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *         description: Filter by type (percentage, fixed_amount, free_shipping, shipping_discount)
 *     responses:
 *       200:
 *         description: Active discounts retrieved
 */
router.get("/active", getActiveDiscounts);

/**
 * @swagger
 * /api/v1/discounts/product/{productId}:
 *   get:
 *     summary: Get the best discount for a specific product
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Best discount for product
 *       404:
 *         description: Product not found
 */
router.get("/product/:productId", getProductDiscount);

// ── Authenticated Routes ──────────────────────────────────────────────
router.use(Protect);

// ── Admin Routes ──────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/discounts/admin:
 *   get:
 *     summary: Get all discounts (admin view)
 *     tags: [Discounts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: All discounts retrieved
 *   post:
 *     summary: Create a new discount (admin — any scope)
 *     tags: [Discounts]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type, scope, startDate, endDate]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               type: { type: string, enum: [percentage, fixed_amount, free_shipping, shipping_discount] }
 *               value: { type: number }
 *               maxDiscountAmount: { type: number }
 *               minOrderValue: { type: number }
 *               scope: { type: string, enum: [all_products, category, seller_all, single_product] }
 *               targetIds: { type: array, items: { type: string } }
 *               priority: { type: number }
 *               startDate: { type: string, format: date-time }
 *               endDate: { type: string, format: date-time }
 *               isActive: { type: boolean }
 *               usageLimit: { type: number }
 *     responses:
 *       201:
 *         description: Discount created
 */
router
	.route("/admin")
	.get(restrictTo("SuperAdmin", "Admin"), adminGetAllDiscounts)
	.post(restrictTo("SuperAdmin", "Admin"), adminCreateDiscount);

/**
 * @swagger
 * /api/v1/discounts/admin/{id}:
 *   get:
 *     summary: Get a single discount by ID (admin)
 *     tags: [Discounts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Discount retrieved
 *   patch:
 *     summary: Update a discount (admin)
 *     tags: [Discounts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Discount updated
 *   delete:
 *     summary: Delete a discount (admin)
 *     tags: [Discounts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Discount deleted
 */
router
	.route("/admin/:id")
	.get(restrictTo("SuperAdmin", "Admin"), adminGetDiscount)
	.patch(restrictTo("SuperAdmin", "Admin"), adminUpdateDiscount)
	.delete(restrictTo("SuperAdmin", "Admin"), adminDeleteDiscount);

/**
 * @swagger
 * /api/v1/discounts/admin/{id}/toggle:
 *   patch:
 *     summary: Toggle discount active/inactive (admin)
 *     tags: [Discounts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Discount toggled
 */
router.patch(
	"/admin/:id/toggle",
	restrictTo("SuperAdmin", "Admin"),
	adminToggleDiscount
);

// ── Seller Routes ─────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/discounts/seller:
 *   get:
 *     summary: Get seller's own discounts
 *     tags: [Discounts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Seller discounts retrieved
 *   post:
 *     summary: Create a discount (seller — seller_all or single_product only)
 *     tags: [Discounts]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type, scope, startDate, endDate]
 *             properties:
 *               name: { type: string }
 *               type: { type: string, enum: [percentage, fixed_amount, free_shipping, shipping_discount] }
 *               value: { type: number }
 *               scope: { type: string, enum: [seller_all, single_product] }
 *               targetIds: { type: array, items: { type: string } }
 *               startDate: { type: string, format: date-time }
 *               endDate: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Discount created
 */
router
	.route("/seller")
	.get(restrictTo("Seller"), sellerGetAllDiscounts)
	.post(restrictTo("Seller"), sellerCreateDiscount);

/**
 * @swagger
 * /api/v1/discounts/seller/{id}:
 *   get:
 *     summary: Get a single own discount by ID (seller)
 *     tags: [Discounts]
 *   patch:
 *     summary: Update own discount (seller)
 *     tags: [Discounts]
 *   delete:
 *     summary: Delete own discount (seller)
 *     tags: [Discounts]
 */
router
	.route("/seller/:id")
	.get(restrictTo("Seller"), sellerGetDiscount)
	.patch(restrictTo("Seller"), sellerUpdateDiscount)
	.delete(restrictTo("Seller"), sellerDeleteDiscount);

/**
 * @swagger
 * /api/v1/discounts/seller/{id}/toggle:
 *   patch:
 *     summary: Toggle own discount active/inactive (seller)
 *     tags: [Discounts]
 */
router.patch(
	"/seller/:id/toggle",
	restrictTo("Seller"),
	sellerToggleDiscount
);

export default router;
