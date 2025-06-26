import express from "express";
const router = express.Router();
import { Protect, restrictTo } from "../middelwares/authMiddelware.js";
import {
	addProduct,
	deleteAllProducts,
	deleteProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
} from "../controllers/productController.js";

// add protect to all routes
router.use(Protect);
router
	.route("/")
	.post(restrictTo("admin"), addProduct)
	.get(getAllProducts)
	.delete(restrictTo("admin"), deleteAllProducts);
router
	.route("/:id")
	.get(getSingleProduct)
	.delete(restrictTo("admin"), deleteProduct)
	.patch(restrictTo("admin"), updateProduct);
export default router;
