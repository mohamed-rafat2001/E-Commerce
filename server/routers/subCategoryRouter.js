import express from "express";
const router = express.Router();
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
	getAllSubCategories,
	getSubCategory,
	createSubCategory,
	updateSubCategory,
	deleteSubCategory,
	getSubCategoriesByCategory,
	getSubCategoryDetails,
} from "../controllers/subCategoryController.js";

/**
 * @swagger
 * tags:
 *   name: SubCategories
 *   description: Subcategory management API
 */

/**
 * @swagger
 * /api/v1/subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [SubCategories]
 *     responses:
 *       200:
 *         description: List of subcategories
 *   post:
 *     summary: Create a new subcategory
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: object
 *                 properties:
 *                   public_id:
 *                     type: string
 *                   secure_url:
 *                     type: string
 *               categoryId:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 */
router.route("/")
	.get(getAllSubCategories)
	.post(Protect, restrictTo("Admin", "SuperAdmin"), createSubCategory);

/**
 * @swagger
 * /api/v1/categories/{categoryId}/subcategories:
 *   get:
 *     summary: Get subcategories by category ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of subcategories for the category
 */
router.get("/categories/:categoryId/subcategories", getSubCategoriesByCategory);

/**
 * @swagger
 * /api/v1/subcategories/{id}:
 *   get:
 *     summary: Get subcategory by ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory details
 *   patch:
 *     summary: Update subcategory
 *     tags: [SubCategories]
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
 *               name:
 *                 type: string
 *               image:
 *                 type: object
 *               categoryId:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *   delete:
 *     summary: Delete subcategory
 *     tags: [SubCategories]
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
 *         description: Subcategory deleted successfully
 */
router.route("/:id")
	.get(getSubCategory)
	.patch(Protect, restrictTo("Admin", "SuperAdmin"), updateSubCategory)
	.delete(Protect, restrictTo("Admin", "SuperAdmin"), deleteSubCategory);

/**
 * @swagger
 * /api/v1/subcategories/{id}/details:
 *   get:
 *     summary: Get detailed subcategory info
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed subcategory information
 */
router.get("/:id/details", getSubCategoryDetails);

export default router;