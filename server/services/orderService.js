import mongoose from "mongoose";
import CartModel from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";
import OrderModel from "../models/OrderModel.js";
import OrderItemsModel from "../models/OrderItemsModel.js";
import SellerModel from "../models/SellerModel.js";
import appError from "../utils/appError.js";
import { validateCartForCheckout } from "./cartService.js";
import { enrichProductsWithDiscounts, resolveShippingDiscount, incrementUsage, validateCouponForCart } from "./discountService.js";

// Shipping fee thresholds
const SHIPPING_FREE_THRESHOLD = 500;
const SHIPPING_REDUCED_THRESHOLD = 200;
const SHIPPING_STANDARD_FEE = 25;
const SHIPPING_REDUCED_FEE = 10;

/**
 * Calculate shipping fee based on subtotal.
 */
const calculateShippingFee = (subtotal) => {
    if (subtotal >= SHIPPING_FREE_THRESHOLD) return 0;
    if (subtotal >= SHIPPING_REDUCED_THRESHOLD) return SHIPPING_REDUCED_FEE;
    return SHIPPING_STANDARD_FEE;
};

/**
 * Generate a human-readable, unique order number.
 * Format: ORD-YYYYMMDD-XXXXXX (timestamp + random)
 */
const generateOrderNumber = () => {
    const now = new Date();
    const datePart =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0");
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${datePart}-${randomPart}`;
};

/**
 * Shared Helper: Process validated items, handle atomic inventory decrement, grouping by seller, and order creation.
 */
const processOrderCreation = async ({
    validatedItems,
    shippingAddress,
    paymentMethod,
    session,
    userId,
    guestEmail,
    guestName,
    guestPhone,
    couponCode,
}) => {
    // Step 3 — Atomic inventory decrement
    const stockErrors = [];
    const productDataMap = {};

    for (const { item, quantity } of validatedItems) {
        const productId = item._id ? item._id.toString() : item.toString();

        const updatedProduct = await ProductModel.findOneAndUpdate(
            {
                _id: productId,
                countInStock: { $gte: quantity },
            },
            {
                $inc: { countInStock: -quantity },
            },
            { new: true, session }
        ).lean();

        if (!updatedProduct) {
            stockErrors.push(
                `Insufficient stock for product "${productId}" (requested: ${quantity})`
            );
        } else {
            productDataMap[productId] = updatedProduct;
        }
    }

    if (stockErrors.length > 0) {
        await session.abortTransaction();
        throw new appError(stockErrors.join("; "), 400);
    }

    // Enrich all locked products with live discount info
    const enrichedProductArr = await enrichProductsWithDiscounts(Object.values(productDataMap));
    enrichedProductArr.forEach(p => {
        productDataMap[p._id.toString()] = p;
    });

    // Validate coupon if provided
    let appliedCouponData = null;
    if (couponCode) {
        const itemsForValidation = validatedItems.map(cartItem => {
            const productId = cartItem.item._id ? cartItem.item._id.toString() : cartItem.item.toString();
            return {
                ...cartItem,
                productObj: productDataMap[productId]
            };
        });
        // This will throw if invalid
        appliedCouponData = await validateCouponForCart(couponCode, itemsForValidation);
    }

    // Step 4 — Group items by seller
    const itemsBySeller = {};

    for (const cartItem of validatedItems) {
        const productId = cartItem.item._id ? cartItem.item._id.toString() : cartItem.item.toString();
        const product = productDataMap[productId];

        // Get the product's owner (seller) userId
        const sellerUserId = product.userId?.toString();

        if (!sellerUserId) continue;

        if (!itemsBySeller[sellerUserId]) {
            itemsBySeller[sellerUserId] = [];
        }

        // Calculate unit price considering the active discount
        const originalUnitPrice = product.price?.amount || 0;
        const unitPrice = product.activeDiscount ? product.activeDiscount.discountedPrice : originalUnitPrice;
        let discountSavings = (originalUnitPrice - unitPrice) * cartItem.quantity;
        
        // Add coupon savings if any allocated to this item
        if (appliedCouponData && appliedCouponData.allocations && appliedCouponData.allocations[productId]) {
            discountSavings += appliedCouponData.allocations[productId];
        }
        
        itemsBySeller[sellerUserId].push({
            item: productId,
            quantity: cartItem.quantity,
            price: { amount: originalUnitPrice * cartItem.quantity, currency: product.price?.currency || "USD" },
            appliedUnitPrice: unitPrice,
            productOriginalPrice: originalUnitPrice,
            discountSavings,
            activeDiscount: product.activeDiscount,
            productObj: product,
            productName: product.name,
            productImage: product.coverImage,
        });
    }

    // Step 5 — Build and save each order
    const createdOrders = [];

    for (const [sellerUserId, items] of Object.entries(itemsBySeller)) {
        // Find the SellerModel document for this user (or fallback)
        const seller = await SellerModel.findOne({ userId: sellerUserId })
            .session(session)
            .lean();

        const sellerId = seller ? seller._id : sellerUserId;

        // Calculate subtotal from original item prices
        const currency = items[0]?.price?.currency || "USD";
        const totalOriginalPrice = items.reduce(
            (sum, item) => sum + (item.price?.amount || 0),
            0
        );

        // Gather total item savings and applied discount IDs
        let itemSavings = 0;
        const appliedDiscounts = new Set();
        
        items.forEach(item => {
            itemSavings += item.discountSavings || 0;
            if (item.activeDiscount?.discountId) {
                appliedDiscounts.add(item.activeDiscount.discountId.toString());
            }
        });

        if (appliedCouponData) {
            appliedDiscounts.add(appliedCouponData.couponId.toString());
        }

        const subtotal = totalOriginalPrice - itemSavings;

        // Resolve shipping discount for this seller's part of the order
        const productsInOrder = items.map(i => i.productObj);
        const resolvedShippingDiscount = await resolveShippingDiscount(productsInOrder, subtotal);
        
        let shippingFee = calculateShippingFee(subtotal);
        let shippingSavings = 0;

        if (resolvedShippingDiscount) {
            appliedDiscounts.add(resolvedShippingDiscount.discount._id.toString());
            if (resolvedShippingDiscount.type === "free_shipping") {
                shippingSavings = shippingFee;
                shippingFee = 0;
            } else if (resolvedShippingDiscount.type === "shipping_discount") {
                shippingSavings = Math.min(shippingFee, resolvedShippingDiscount.shippingSavings);
                shippingFee = Math.max(0, shippingFee - shippingSavings);
            }
        }

        const orderId = new mongoose.Types.ObjectId();

        // Register Usage for Discounts
        if (appliedDiscounts.size > 0) {
            for (const dId of appliedDiscounts) {
                // Background increment is fine here, or await it
                incrementUsage(dId).catch(console.error);
            }
        }

        const orderItemsDoc = await OrderItemsModel.create(
            [
                {
                    orderId,
                    sellerId,
                    items: items.map((item) => ({
                        item: item.item,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            ],
            { session }
        );

        const orderData = {
            _id: orderId,
            sellerIds: [sellerId],
            items: [orderItemsDoc[0]._id],
            shippingAddress,
            paymentMethod,
            shippingPrice: { amount: shippingFee, currency },
            taxPrice: { amount: 0, currency },
            itemsPrice: { amount: totalOriginalPrice, currency },
            discountAmount: { amount: itemSavings, currency },
            shippingDiscountAmount: { amount: shippingSavings, currency },
            appliedDiscounts: Array.from(appliedDiscounts),
            totalPrice: { amount: subtotal + shippingFee, currency },
            status: "Pending",
            isPaid: false,
            isDelivered: false,
        };

        if (userId) orderData.userId = userId;
        if (guestEmail) orderData.guestEmail = guestEmail;
        if (guestName) orderData.guestName = guestName;
        if (guestPhone) orderData.guestPhone = guestPhone;
        if (couponCode) orderData.couponCode = couponCode;

        const [order] = await OrderModel.create([orderData], { session });
        createdOrders.push(order);
    }

    return createdOrders;
};

/**
 * Create orders from the user's cart — the core checkout function.
 * All-or-nothing MongoDB transaction.
 */
export const createOrdersFromCart = async (
    userId,
    { shippingAddress, paymentMethod, notes }
) => {
    // Step 1 — Validate cart
    const { valid, errors, cart } = await validateCartForCheckout(userId);
    if (!valid) {
        throw new appError(errors.join("; "), 400);
    }

    // Step 2 — Open MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const createdOrders = await processOrderCreation({
            validatedItems: cart.items,
            shippingAddress,
            paymentMethod,
            session,
            userId,
        });

        // Step 6 — Clear the cart inside the same transaction
        await CartModel.updateOne(
            { _id: cart._id },
            {
                $set: {
                    items: [],
                    totalPrice: { amount: 0, currency: "USD" },
                },
            },
            { session }
        );

        // Step 7 — Commit transaction
        await session.commitTransaction();

        return createdOrders;
    } catch (error) {
        // Rollback on any error
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Create orders from guest cart items — no userId required.
 * Uses the same seller-grouping and transaction logic as authenticated checkout.
 * 
 * @param {Object} params
 * @param {Array} params.cartItems - Array of { product_id, quantity }
 * @param {Object} params.shippingAddress
 * @param {string} params.paymentMethod
 * @param {string} params.notes
 * @param {string} params.guestEmail
 * @param {string} params.guestName
 * @param {string} params.guestPhone
 */
export const createOrdersFromGuestCart = async ({
    cartItems,
    shippingAddress,
    paymentMethod,
    notes,
    guestEmail,
    guestName,
    guestPhone,
}) => {
    // Step 1 — Validate all cart items exist and are in stock
    const errors = [];
    const validatedItems = [];

    for (const cartItem of cartItems) {
        const productId = cartItem.product_id || cartItem.productId || cartItem._id;
        const quantity = Number(cartItem.quantity) || 1;

        const product = await ProductModel.findById(productId).lean();

        if (!product) {
            errors.push(`Product "${productId}" not found`);
            continue;
        }
        if (product.status !== "active") {
            errors.push(`Product "${product.name}" is no longer available`);
            continue;
        }
        if (product.countInStock <= 0) {
            errors.push(`Product "${product.name}" is out of stock`);
            continue;
        }
        if (quantity > product.countInStock) {
            errors.push(
                `Product "${product.name}" — requested ${quantity} but only ${product.countInStock} available`
            );
            continue;
        }

        validatedItems.push({ item: productId, quantity, product });
    }

    if (errors.length > 0) {
        throw new appError(errors.join("; "), 400);
    }
    if (validatedItems.length === 0) {
        throw new appError("No valid items to checkout", 400);
    }

    // Step 2 — Open MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const createdOrders = await processOrderCreation({
            validatedItems,
            shippingAddress,
            paymentMethod,
            session,
            guestEmail,
            guestName,
            guestPhone,
        });

        // Step 6 — Commit transaction (no cart to clear for guests)
        await session.commitTransaction();

        return createdOrders;
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Cancel an order (customer only — pending orders only).
 * Restores inventory inside a transaction.
 */
export const cancelOrder = async (orderId, userId, reason) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await OrderModel.findOne({
            _id: orderId,
            userId,
        }).session(session);

        if (!order) {
            throw new appError("Order not found", 404);
        }

        if (order.status !== "Pending") {
            throw new appError(
                `Cannot cancel order with status "${order.status}". Only pending orders can be cancelled.`,
                400
            );
        }

        // Restore inventory — fetch order items to get per-item details
        const orderItemsDocs = await OrderItemsModel.find({
            orderId: order._id,
        }).session(session);

        for (const orderItemsDoc of orderItemsDocs) {
            for (const item of orderItemsDoc.items) {
                await ProductModel.findByIdAndUpdate(
                    item.item,
                    { $inc: { countInStock: item.quantity } },
                    { session }
                );
            }
        }

        // Update order status
        order.status = "Cancelled";
        await order.save({ session });

        await session.commitTransaction();
        return order;
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Seller updates order status (only allowed: Pending→Processing, Processing→Shipped).
 */
export const updateOrderStatusBySeller = async (
    orderId,
    sellerUserId,
    newStatus,
    { tracking_number, note } = {}
) => {
    // Find seller model
    const seller = await SellerModel.findOne({ userId: sellerUserId });
    if (!seller) {
        throw new appError("Seller profile not found", 404);
    }

    // Find the order items doc that belongs to this seller for this order
    const orderItemsDoc = await OrderItemsModel.findOne({
        orderId,
        sellerId: seller._id,
    });

    if (!orderItemsDoc) {
        throw new appError("Order not found or does not belong to you", 404);
    }

    // Find the actual order
    const order = await OrderModel.findById(orderId);
    if (!order) {
        throw new appError("Order not found", 404);
    }

    // Validate allowed transitions
    const allowedTransitions = {
        Pending: "Processing",
        Processing: "Shipped",
    };

    if (allowedTransitions[order.status] !== newStatus) {
        throw new appError(
            `Cannot transition order from "${order.status}" to "${newStatus}". Sellers can only: Pending → Processing, Processing → Shipped.`,
            400
        );
    }

    // Update order
    order.status = newStatus;

    if (newStatus === "Processing") {
        order.isPaid = true;
        order.paidAt = new Date();
    }

    await order.save();
    return order;
};

/**
 * Admin force-updates order status (any transition allowed).
 * Handles inventory restoration for cancellation.
 */
export const updateOrderStatusByAdmin = async (
    orderId,
    adminId,
    newStatus,
    { note, tracking_number } = {}
) => {
    const order = await OrderModel.findById(orderId);
    if (!order) {
        throw new appError("Order not found", 404);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (newStatus === "Delivered") {
            order.isDelivered = true;
            order.deliveredAt = new Date();
        }

        // If cancelling and not already cancelled, restore inventory
        if (newStatus === "Cancelled" && order.status !== "Cancelled") {
            const orderItemsDocs = await OrderItemsModel.find({
                orderId: order._id,
            }).session(session);

            for (const orderItemsDoc of orderItemsDocs) {
                for (const item of orderItemsDoc.items) {
                    await ProductModel.findByIdAndUpdate(
                        item.item,
                        { $inc: { countInStock: item.quantity } },
                        { session }
                    );
                }
            }
        }

        order.status = newStatus;

        if (newStatus === "Processing") {
            order.isPaid = true;
            order.paidAt = new Date();
        }

        await order.save({ session });
        await session.commitTransaction();

        return order;
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;
    } finally {
        session.endSession();
    }
};
