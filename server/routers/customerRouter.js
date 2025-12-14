import express from "express";
const router = express.Router();
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import { addAddressestoCustomer } from "../controllers/customerController.js";

router.use(Protect, restrictTo("Customer"));
router.patch("/addresses", addAddressestoCustomer);

export default router;
