import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { Protect } from "../middlewares/authMiddleware.js";
import { uploadSingleImage } from "../middlewares/uploadImagesMiddleware.js";

const router = express.Router();

router.use(Protect);

// POST /api/v1/upload
router.post("/", uploadSingleImage("image"), uploadImage);

export default router;
