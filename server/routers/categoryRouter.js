import express from "express";
const router = express.Router();

import {
	getAllCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
} from "../controllers/categoryController.js";
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import { uploadSingleImage, setCloudinaryBody } from "../middlewares/uploadImagesMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management API
 */

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details retrieved successfully
 */
router.get("/:id", getCategory);
router.use(Protect, restrictTo("Admin", "SuperAdmin"));
router.route("/").post(uploadSingleImage("coverImage"), setCloudinaryBody, createCategory);
router.route("/:id").patch(uploadSingleImage("coverImage"), setCloudinaryBody, updateCategory).delete(deleteCategory);
export default router;
