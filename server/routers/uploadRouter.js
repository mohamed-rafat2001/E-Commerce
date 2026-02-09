import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { upload } from "../utils/cloudinary.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(Protect);

// POST /api/v1/upload
router.post("/", upload.single("image"), uploadImage);

export default router;
