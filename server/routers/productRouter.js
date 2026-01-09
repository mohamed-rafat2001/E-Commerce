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
} from "../controllers/productController.js";

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.get("/myproducts", getProductsByOwner);
// add protect to all routes
router.use(Protect, restrictTo("Seller"));
router.route("/").post(addProduct).delete(deleteAllProducts);
router.route("/:id").delete(deleteProduct).patch(updateProduct);
export default router;
