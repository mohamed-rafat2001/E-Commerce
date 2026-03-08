import express from "express";
import { Protect } from "../middlewares/authMiddleware.js";
import {
	getCart,
	addToCart,
	updateItemQuantity,
	removeFromCart,
	clearCart,
	mergeGuestCart,
	validateCart,
} from "../controllers/cartController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management API
 */

router.use(Protect);

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get the current user's cart (enriched with live product data)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 */
router.route("/").get(getCart);

/**
 * @swagger
 * /api/v1/cart:
 *   post:
 *     summary: Add item to cart or update quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemId]
 *             properties:
 *               itemId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 default: 1
 *     responses:
 *       200:
 *         description: Item added/updated in cart
 */
router.route("/").post(addToCart);

/**
 * @swagger
 * /api/v1/cart/merge:
 *   post:
 *     summary: Merge guest cart items into authenticated user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guest_items]
 *             properties:
 *               guest_items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       200:
 *         description: Guest cart merged successfully
 */
router.route("/merge").post(mergeGuestCart);

/**
 * @swagger
 * /api/v1/cart/validate:
 *   get:
 *     summary: Validate cart for checkout readiness
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart validation result
 */
router.route("/validate").get(validateCart);

/**
 * @swagger
 * /api/v1/cart/clear:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.route("/clear").delete(clearCart);

/**
 * @swagger
 * /api/v1/cart/user:
 *   get:
 *     summary: Get cart for the current user (legacy endpoint)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details retrieved
 */
router.route("/user").get(getCart);

/**
 * @swagger
 * /api/v1/cart/{id}:
 *   patch:
 *     summary: Update item quantity in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item quantity updated
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Item removed from cart
 */
router.route("/:id").patch(updateItemQuantity).delete(removeFromCart);

export default router;
