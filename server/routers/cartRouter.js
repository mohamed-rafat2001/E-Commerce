import express from "express";
import { Protect } from "../middlewares/authMiddleware.js";
import {
	addToCart,
	deleteCart,
	deleteFromCart,
	showCart,
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
 *   patch:
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
router.route("/").patch(addToCart);

/**
 * @swagger
 * /api/v1/cart/{id}:
 *   get:
 *     summary: Get user's active cart
 *     tags: [Cart]
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
 *         description: Cart details retrieved
 */
router.route("/:id").delete(deleteCart).patch(deleteFromCart).get(showCart);
export default router;
