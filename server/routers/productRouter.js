import express from "express";
const router = express.Router();
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
	addProduct,
	deleteAllProducts,
	deleteProduct,
	getAllProducts,
	getProductsByOwner,
	getSingleProduct,
	updateProduct,
	getProductsByBrand,
} from "../controllers/productController.js";
import { uploadProductImages, setCloudinaryBody } from "../middlewares/uploadImagesMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get("/", getAllProducts);

// Protected route for seller's own products (must be before /:id to avoid route conflict)
router.get("/myproducts", Protect, restrictTo("Seller"), getProductsByOwner);

// Route to get products by brand
router.get("/brand/:brandId", Protect, restrictTo("Seller", "Admin", "SuperAdmin"), getProductsByBrand);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details retrieved
 */
router.get("/:id", getSingleProduct);

// add protect to all routes below
router.use(Protect, restrictTo("Seller"));

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Add a new product (Sellers only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: ["name", "price[amount]", "category", "description"]
 *             properties:
 *               name:
 *                 type: string
 *               price[amount]:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created
 */
router.route("/").post(uploadProductImages, setCloudinaryBody, addProduct).delete(deleteAllProducts);
router.route("/:id").delete(deleteProduct).patch(uploadProductImages, setCloudinaryBody, updateProduct);
export default router;
