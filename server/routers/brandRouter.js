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
	getAllActiveBrands,
} from "../controllers/brandController.js";
import {
	toggleFollowBrand,
	getFollowStatus,
	getFollowersCount,
	getFollowedBrands,
} from "../controllers/brandFollowerController.js";
import { uploadBrandImages, uploadSingleImage, setCloudinaryBody } from "../middlewares/uploadImagesMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management API for sellers
 */

// Public routes (no auth required) - for landing page display
router.get("/public", getAllActiveBrands); // Public brand list for home page

// Public route - get followers count for a brand
router.get("/:brandId/followers/count", getFollowersCount);

// Protected routes for follow functionality (any authenticated user)
router.post("/:brandId/follow", Protect, toggleFollowBrand);
router.get("/:brandId/follow/status", Protect, getFollowStatus);
router.get("/following/me", Protect, getFollowedBrands);

// Protected routes (Seller only)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
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
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Brand created successfully
 */
router.route("/")
	.get(getMyBrands)
	.post(uploadBrandImages, setCloudinaryBody, createBrand);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
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
 *         multipart/form-data:
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
 *               logo:
 *                 type: string
 *                 format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
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
	.patch(uploadBrandImages, setCloudinaryBody, updateBrand)
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
	.patch(uploadSingleImage("logo"), setCloudinaryBody, updateBrandLogo)
	.delete(deleteBrandLogo);

export default router;