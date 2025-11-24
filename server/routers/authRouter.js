import express from "express";
import {
	login,
	logOut,
	signUp,
	forgotPassword,
	resetPassword,
	updatePassword,
	getMe,
} from "../controllers/authController.js";
import { Protect } from "../middelwares/authMiddelware.js";
const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.get("/logOut", logOut);
router.get("/me", Protect, getMe);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword", resetPassword);
router.patch("/updatePassword", Protect, updatePassword);
export default router;
