import express from "express";
const router = express.Router();
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
	addAddressestoSeller,
	addPayoutMethodtoSeller,
	completeSellerDoc,
} from "../controllers/sellerController.js";

router.use(Protect, restrictTo("Seller"));
router.patch("/addresses", addAddressestoSeller);
router.patch("/", completeSellerDoc);
router.patch("/payoutMethod", addPayoutMethodtoSeller);
export default router;
