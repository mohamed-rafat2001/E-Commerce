import express from "express";
const router = express.Router();
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
	addAddressestoSeller,
	addPayoutMethodtoSeller,
	completeSellerDoc,
} from "../controllers/sellerController.js";

/**
 * @swagger
 * tags:
 *   name: Sellers
 *   description: Seller profile and business management API
 */

router.use(Protect, restrictTo("Seller"));

/**
 * @swagger
 * /api/v1/sellers/addresses:
 *   patch:
 *     summary: Add addresses to seller profile
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addresses:
 *                 type: object
 *                 properties:
 *                   label: { type: string }
 *                   line1: { type: string }
 *                   city: { type: string }
 *                   postalCode: { type: string }
 *                   country: { type: string }
 *     responses:
 *       200:
 *         description: Address added successfully
 */
router.patch("/addresses", addAddressestoSeller);

/**
 * @swagger
 * /api/v1/sellers:
 *   patch:
 *     summary: Complete or update seller document
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch("/", completeSellerDoc);

/**
 * @swagger
 * /api/v1/sellers/payoutMethods:
 *   patch:
 *     summary: Add payout method to seller
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payout method added
 */
router.patch("/payoutMethods", addPayoutMethodtoSeller);
export default router;
