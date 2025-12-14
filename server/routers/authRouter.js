import express from "express";
import {
	login,
	logOut,
	signUp,
	forgotPassword,
	resetPassword,
	updatePassword,
	getMe,
	updatePersonalDetails,
	deleteMe,
} from "../controllers/authController.js";
import { Protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.get("/logOut", logOut);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword", resetPassword);

// add protect to all routes after this line
router.use(Protect);

router.route("/me").get(getMe).patch(updatePersonalDetails).delete(deleteMe);
router.patch("/updatePassword", updatePassword);

export default router;
