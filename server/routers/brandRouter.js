import express from "express";
const router = express.Router();
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
	getMyBrands,
	getBrand,
	createBrand,
	updateBrand,
	deleteBrand,
	updateBrandLogo,
	deleteBrandLogo,
} from "../controllers/brandController.js";

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management API for sellers
 */

router.use(Protect, restrictTo("Seller"));

/**
 * @swagger
 * /api/v1/brands:
 *   get:
 *     summary: Get all brands for current seller
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of brands retrieved successfully
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               website:
 *                 type: string
 *               primaryCategory:
 *                 type: string
 *               subCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Brand created successfully
 */
router.route("/")
	.get(getMyBrands)
	.post(createBrand);

/**
 * @swagger
 * /api/v1/brands/{id}:
 *   get:
 *     summary: Get a single brand by ID
 *     tags: [Brands]
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
 *         description: Brand retrieved successfully
 *   patch:
 *     summary: Update a brand
 *     tags: [Brands]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               website:
 *                 type: string
 *               primaryCategory:
 *                 type: string
 *               subCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *   delete:
 *     summary: Delete a brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Brand deleted successfully
 */
router.route("/:id")
	.get(getBrand)
	.patch(updateBrand)
	.delete(deleteBrand);

/**
 * @swagger
 * /api/v1/brands/{id}/logo:
 *   patch:
 *     summary: Update brand logo
 *     tags: [Brands]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Logo updated successfully
 *   delete:
 *     summary: Delete brand logo
 *     tags: [Brands]
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
 *         description: Logo deleted successfully
 */
router.route("/:id/logo")
	.patch(updateBrandLogo)
	.delete(deleteBrandLogo);

export default router;