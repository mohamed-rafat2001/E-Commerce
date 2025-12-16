import express from "express";
const router = express.Router();
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
	addProduct,
	deleteAllProducts,
	deleteProduct,
	deleteProductByOwner,
	getAllProducts,
	getSingleProduct,
	updateProduct,
} from "../controllers/productController.js";

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
// add protect to all routes
router.use(Protect);
router
	.route("/")
	.post(restrictTo("Admin", "Seller", "SuperAdmin"), addProduct)
	.delete(restrictTo("SuperAdmin", "Customer"), deleteAllProducts);
router
	.route("/:id")
	.delete(restrictTo("Admin", "SuperAdmin", "Seller"), deleteProduct)
	.patch(restrictTo("Admin", "SuperAdmin", "Seller"), updateProduct);
router.delete("/seller/:id", restrictTo("Seller"), deleteProductByOwner);
export default router;
