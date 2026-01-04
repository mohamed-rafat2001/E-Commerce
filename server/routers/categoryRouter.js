import express from "express";
const router = express.Router();
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
	createCategory,
	deleteAllCategories,
	deleteCategory,
	getAllCategories,
	updateCategory,
} from "../controllers/categoryController.js";

router.get("/", getAllCategories);

router.use(Protect, restrictTo("Admin", "SuperAdmin","Seller"));
router.route("/").post(createCategory).delete(deleteAllCategories);
router.route("/:id").delete(deleteCategory).patch(updateCategory);
export default router;
