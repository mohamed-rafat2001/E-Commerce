import express from "express";
import {
	resolveModel,
	getAll,
	getOne,
	createOne,
	updateOne,
	deleteOne,
	deleteAll,
	getDashboardStats,
	getAnalytics,
	getUserFullDetails,
} from "../controllers/adminController.js";
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Generic administrative CRUD operations for all models
 */

// All routes here are protected and restricted to SuperAdmin
router.use(Protect);
router.use(restrictTo("SuperAdmin", "Admin"));
router.get("/stats", getDashboardStats);
router.get("/analytics", getAnalytics);
router.get("/users/:id/full", getUserFullDetails);

router.param("model", resolveModel);

/**
 * @swagger
 * /api/v1/admin/{model}:
 *   get:
 *     summary: Get all documents for a specific model
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         description: Model name (e.g., users, products, categories, sellers, customers, orders, reviews, carts, wishlists)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of documents retrieved
 *   post:
 *     summary: Create a new document for a specific model
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Document created
 *   delete:
 *     summary: Delete all documents for a specific model
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: All documents deleted
 */
router.route("/:model").get(getAll).post(createOne).delete(deleteAll);

/**
 * @swagger
 * /api/v1/admin/{model}/{id}:
 *   get:
 *     summary: Get a single document by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document retrieved
 *   patch:
 *     summary: Update a document by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document updated
 *   delete:
 *     summary: Delete a document by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Document deleted
 */
router.route("/:model/:id").get(getOne).patch(updateOne).delete(deleteOne);

export default router;
