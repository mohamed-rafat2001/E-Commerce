import express from "express";
import {
	resolveModel,
	getAll,
	getOne,
	createOne,
	updateOne,
	deleteOne,
	deleteAll,
} from "../controllers/adminController.js";
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes here are protected and restricted to SuperAdmin
router.use(Protect);
router.use(restrictTo("SuperAdmin"));

router.param("model", resolveModel);

router.route("/:model").get(getAll).post(createOne).delete(deleteAll);

router.route("/:model/:id").get(getOne).patch(updateOne).delete(deleteOne);

export default router;
