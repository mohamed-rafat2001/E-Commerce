import express from "express";
const router = express.Router();
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import { addAddressestoCustomer } from "../controllers/customerController.js";

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer profile management API
 */

router.use(Protect, restrictTo("Customer"));

/**
 * @swagger
 * /api/v1/customers/addresses:
 *   patch:
 *     summary: Add addresses to customer profile
 *     tags: [Customers]
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
 *                   recipientName: { type: string }
 *                   phone: { type: string }
 *                   line1: { type: string }
 *                   city: { type: string }
 *                   postalCode: { type: string }
 *                   country: { type: string }
 *     responses:
 *       200:
 *         description: Address added successfully
 */
router.patch("/addresses", addAddressestoCustomer);

export default router;
