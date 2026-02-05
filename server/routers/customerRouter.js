import express from "express";
const router = express.Router();
import { Protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
	addAddressestoCustomer,
	getCustomerProfile,
	deleteAddressFromCustomer,
	setDefaultAddress,
	updateAddress,
	addPaymentMethod,
	deletePaymentMethod,
	setDefaultPaymentMethod,
	updatePaymentMethod,
} from "../controllers/customerController.js";

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer profile management API
 */

router.use(Protect, restrictTo("Customer"));

/**
 * @swagger
 * /api/v1/customers/profile:
 *   get:
 *     summary: Get customer profile
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer profile retrieved successfully
 */
router.get("/profile", getCustomerProfile);

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

/**
 * @swagger
 * /api/v1/customers/addresses/{addressId}:
 *   patch:
 *     summary: Update address
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label: { type: string }
 *               recipientName: { type: string }
 *               phone: { type: string }
 *               line1: { type: string }
 *               city: { type: string }
 *               postalCode: { type: string }
 *               country: { type: string }
 *     responses:
 *       200:
 *         description: Address updated successfully
 */
router.patch("/addresses/:addressId", updateAddress);

/**
 * @swagger
 * /api/v1/customers/addresses/{addressId}:
 *   delete:
 *     summary: Delete address from customer profile
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 */
router.delete("/addresses/:addressId", deleteAddressFromCustomer);

/**
 * @swagger
 * /api/v1/customers/addresses/{addressId}/default:
 *   patch:
 *     summary: Set default address
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Default address set successfully
 */
router.patch("/addresses/:addressId/default", setDefaultAddress);

/**
 * @swagger
 * /api/v1/customers/payment-methods:
 *   patch:
 *     summary: Add payment method to customer profile
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
 *               paymentMethod:
 *                 type: object
 *                 properties:
 *                   type: { type: string, enum: [Visa, Mastercard, PayPal, Apple Pay, Google Pay] }
 *                   last4: { type: string }
 *                   expiry: { type: string }
 *                   holder: { type: string }
 *                   isDefault: { type: boolean }
 *                   providerId: { type: string }
 *     responses:
 *       201:
 *         description: Payment method added successfully
 */
router.patch("/payment-methods", addPaymentMethod);

/**
 * @swagger
 * /api/v1/customers/payment-methods/{paymentMethodId}:
 *   delete:
 *     summary: Delete payment method from customer profile
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: paymentMethodId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment method deleted successfully
 */
router.delete("/payment-methods/:paymentMethodId", deletePaymentMethod);

/**
 * @swagger
 * /api/v1/customers/payment-methods/{paymentMethodId}:
 *   patch:
 *     summary: Update payment method
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: paymentMethodId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type: { type: string, enum: [Visa, Mastercard, PayPal, Apple Pay, Google Pay] }
 *               last4: { type: string }
 *               expiry: { type: string }
 *               holder: { type: string }
 *               isDefault: { type: boolean }
 *               providerId: { type: string }
 *     responses:
 *       200:
 *         description: Payment method updated successfully
 */
router.patch("/payment-methods/:paymentMethodId", updatePaymentMethod);

/**
 * @swagger
 * /api/v1/customers/payment-methods/{paymentMethodId}/default:
 *   patch:
 *     summary: Set default payment method
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: paymentMethodId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Default payment method set successfully
 */
router.patch("/payment-methods/:paymentMethodId/default", setDefaultPaymentMethod);

export default router;

