import express from "express";
const router = express.Router();

import {
	getAllCategories,
	getCategory,
} from "../controllers/categoryController.js";

router.get("/", getAllCategories);

router.get("/:id", getCategory);
export default router;
