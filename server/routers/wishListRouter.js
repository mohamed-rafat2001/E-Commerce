import express from "express";
import { Protect } from "../middlewares/authMiddleware.js";
import {
	addToWishList,
	deleteFromWishList,
	deleteWishList,
	showWishList,
} from "../controllers/wishListController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Personal wishlist management API
 */

router.use(Protect);

// Get user's wishlist
router.get("/user", showWishList);

/**
 * @swagger
 * /api/v1/wishlist/user:
 *   get:
 *     summary: Get current user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's wishlist retrieved successfully
 */
/**
 * @swagger
 * /api/v1/wishlist/{id}:
 *   post:
 *     summary: Add an item to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to add
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item added to wishlist
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the wishlist
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist details retrieved
 *   patch:
 *     summary: Remove an item from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from wishlist
 *   delete:
 *     summary: Delete whole wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the wishlist to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist deleted
 */
router
	.route("/:id")
	.delete(deleteWishList)
	.patch(deleteFromWishList)
	.post(addToWishList)
	.get(showWishList);

export default router;
