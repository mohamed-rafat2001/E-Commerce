import mongoose from "mongoose";
import CartModel from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";
import appError from "../utils/appError.js";

/**
 * Get the user's cart, enriched with live product availability data.
 */
export const getCart = async (userId) => {
    const cart = await CartModel.findOne({ userId, active: true });

    if (!cart || cart.items.length === 0) {
        return {
            items: [],
            totalPrice: { amount: 0, currency: "USD" },
        };
    }

    // Enrich each item with live product data
    const enrichedItems = cart.items.map((cartItem) => {
        const product = cartItem.item; // populated by pre-find hook
        const itemObj = cartItem.toObject ? cartItem.toObject() : { ...cartItem };

        if (!product || !product._id) {
            // Product was deleted
            itemObj.isAvailable = false;
            itemObj.availabilityNote = "This product is no longer available";
            itemObj.livePrice = null;
            itemObj.maxQuantity = 0;
            itemObj.priceChanged = false;
            return itemObj;
        }

        const isActive = product.status === "active";
        const inStock = product.countInStock > 0;
        const isAvailable = isActive && inStock;

        // Check if the saved price differs from the current product price
        const savedUnitPrice = cartItem.price
            ? cartItem.price.amount / cartItem.quantity
            : 0;
        const currentPrice = product.price?.amount || 0;
        const priceChanged = Math.abs(savedUnitPrice - currentPrice) > 0.01;

        itemObj.isAvailable = isAvailable;
        itemObj.priceChanged = priceChanged;
        itemObj.livePrice = product.price;
        itemObj.maxQuantity = product.countInStock;

        if (!isActive) {
            itemObj.availabilityNote = "This product is no longer active";
        } else if (!inStock) {
            itemObj.availabilityNote = "This product is out of stock";
        } else if (cartItem.quantity > product.countInStock) {
            itemObj.availabilityNote = `Only ${product.countInStock} available in stock`;
        }

        return itemObj;
    });

    return {
        _id: cart._id,
        userId: cart.userId,
        items: enrichedItems,
        totalPrice: cart.totalPrice,
        active: cart.active,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
    };
};

/**
 * Add an item to the cart (or increment quantity if it already exists).
 */
export const addItem = async (userId, { product_id, quantity }) => {
    // Validate quantity
    const qty = Number(quantity) || 1;
    if (!Number.isInteger(qty) || qty < 1) {
        throw new appError("Quantity must be a positive integer", 400);
    }

    // Fetch the product (use lean to skip pre-find populate hooks for performance)
    const product = await ProductModel.findById(product_id).lean();
    if (!product) {
        throw new appError("Product not found", 404);
    }
    if (product.status !== "active") {
        throw new appError("Product is not available", 400);
    }
    if (product.countInStock <= 0) {
        throw new appError("Product is out of stock", 400);
    }

    // Find or create cart
    let cart = await CartModel.findOne({ userId, active: true });

    if (!cart) {
        // Create new cart — first item
        if (qty > product.countInStock) {
            throw new appError(
                `Requested quantity (${qty}) exceeds available stock (${product.countInStock})`,
                400
            );
        }

        cart = await CartModel.create({
            userId,
            items: [
                {
                    item: product_id,
                    quantity: qty,
                    price: {
                        amount: product.price.amount * qty,
                        currency: product.price.currency || "USD",
                    },
                },
            ],
        });
        return cart;
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
        (item) =>
            item.item?._id?.toString() === product_id.toString() ||
            item.item?.toString() === product_id.toString()
    );

    if (existingItem) {
        // Product already in cart — add quantities
        const newTotalQty = existingItem.quantity + qty;

        if (newTotalQty > product.countInStock) {
            throw new appError(
                `Cannot add ${qty} more. You already have ${existingItem.quantity} in your cart, and only ${product.countInStock} are available in stock.`,
                400
            );
        }

        existingItem.quantity = newTotalQty;
        // Refresh the price snapshot to current product price
        existingItem.price = {
            amount: product.price.amount * newTotalQty,
            currency: product.price.currency || "USD",
        };
    } else {
        // New product in cart
        if (qty > product.countInStock) {
            throw new appError(
                `Requested quantity (${qty}) exceeds available stock (${product.countInStock})`,
                400
            );
        }

        cart.items.push({
            item: product_id,
            quantity: qty,
            price: {
                amount: product.price.amount * qty,
                currency: product.price.currency || "USD",
            },
        });
    }

    cart.markModified("items");
    await cart.save();
    return cart;
};

/**
 * Update the quantity of a specific item in the cart.
 */
export const updateItemQuantity = async (userId, productId, quantity) => {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
        throw new appError("Quantity must be at least 1", 400);
    }

    const cart = await CartModel.findOne({ userId, active: true });
    if (!cart) {
        throw new appError("Cart not found", 404);
    }

    const cartItem = cart.items.find(
        (item) =>
            item.item?._id?.toString() === productId.toString() ||
            item.item?.toString() === productId.toString()
    );
    if (!cartItem) {
        throw new appError("Item not found in cart", 404);
    }

    // Fetch product to validate
    const product = await ProductModel.findById(productId).lean();
    if (!product || product.status !== "active") {
        throw new appError("Product is no longer available", 400);
    }
    if (qty > product.countInStock) {
        throw new appError(
            `Requested quantity (${qty}) exceeds available stock (${product.countInStock})`,
            400
        );
    }

    cartItem.quantity = qty;
    cartItem.price = {
        amount: product.price.amount * qty,
        currency: product.price.currency || "USD",
    };

    cart.markModified("items");
    await cart.save();
    return cart;
};

/**
 * Remove a specific item from the cart.
 */
export const removeItem = async (userId, productId) => {
    const cart = await CartModel.findOne({ userId, active: true });
    if (!cart) {
        throw new appError("Cart not found", 404);
    }

    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
        (item) =>
            item.item?._id?.toString() !== productId.toString() &&
            item.item?.toString() !== productId.toString()
    );

    if (cart.items.length === originalLength) {
        throw new appError("Item not found in cart", 404);
    }

    cart.markModified("items");
    await cart.save();
    return cart;
};

/**
 * Clear all items from the cart.
 */
export const clearCart = async (userId) => {
    const cart = await CartModel.findOne({ userId, active: true });
    if (!cart) {
        return { items: [], totalPrice: { amount: 0, currency: "USD" } };
    }

    cart.items = [];
    cart.totalPrice = { amount: 0, currency: "USD" };
    cart.markModified("items");
    await cart.save();
    return cart;
};

/**
 * Validate cart for checkout readiness.
 * Returns { valid: Boolean, errors: String[], cart }
 */
export const validateCartForCheckout = async (userId) => {
    const cart = await CartModel.findOne({ userId, active: true });

    if (!cart || cart.items.length === 0) {
        return { valid: false, errors: ["Cart is empty"], cart: null };
    }

    const errors = [];

    for (const cartItem of cart.items) {
        const productId =
            cartItem.item?._id?.toString() || cartItem.item?.toString();
        const product = await ProductModel.findById(productId).lean();

        if (!product) {
            errors.push(`Product "${productId}" is no longer available`);
            continue;
        }

        if (product.status !== "active") {
            errors.push(`Product "${product.name}" is no longer active`);
            continue;
        }

        if (product.countInStock <= 0) {
            errors.push(`Product "${product.name}" is out of stock`);
            continue;
        }

        if (cartItem.quantity > product.countInStock) {
            errors.push(
                `Product "${product.name}" — requested ${cartItem.quantity} but only ${product.countInStock} available`
            );
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        cart,
    };
};

/**
 * Merge guest cart items into the authenticated user's server-side cart.
 * Silently skips items that fail (out of stock, unavailable, etc.)
 */
export const mergeGuestCart = async (userId, guestItems) => {
    if (!Array.isArray(guestItems) || guestItems.length === 0) {
        return await getCart(userId);
    }

    for (const guestItem of guestItems) {
        try {
            await addItem(userId, {
                product_id: guestItem.product_id,
                quantity: guestItem.quantity || 1,
            });
        } catch (err) {
            // Silently skip items that fail
            console.log(
                `Merge skipped item ${guestItem.product_id}: ${err.message}`
            );
        }
    }

    return await getCart(userId);
};
