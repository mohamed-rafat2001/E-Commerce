import DiscountModel from "../models/DiscountModel.js";
import ProductModel from "../models/ProductModel.js";
import appError from "../utils/appError.js";

/**
 * Build a query filter for discounts that are currently active.
 */
const activeDiscountFilter = () => {
	const now = new Date();
	return {
		isActive: true,
		isCoupon: { $ne: true },
		startDate: { $lte: now },
		endDate: { $gt: now },
		$or: [
			{ usageLimit: null },
			{ $expr: { $lt: ["$usageCount", "$usageLimit"] } },
		],
	};
};

/**
 * Find ALL active discounts that apply to a specific product.
 * Checks all four scopes: all_products, category, seller_all, single_product.
 *
 * @param {Object} product — A populated product document (needs primaryCategory, userId)
 * @returns {Array} — Sorted array of matching discounts (highest priority first)
 */
export const findDiscountsForProduct = async (product) => {
	const productId = product._id?.toString();
	const categoryId =
		product.primaryCategory?._id?.toString() ||
		product.primaryCategory?.toString();
	const sellerUserId = product.userId?.toString();

	const filter = {
		...activeDiscountFilter(),
		$or: [
			{ scope: "all_products" },
			{ scope: "single_product", targetIds: productId },
			...(categoryId
				? [{ scope: "category", targetIds: categoryId }]
				: []),
			...(sellerUserId
				? [{ scope: "seller_all", targetIds: sellerUserId }]
				: []),
		],
	};

	const discounts = await DiscountModel.find(filter)
		.sort({ priority: -1, value: -1 })
		.lean();

	return discounts;
};

/**
 * Resolve the BEST single discount for a product.
 * Uses priority first, then picks the one producing the largest savings.
 *
 * @param {Object} product — A product document
 * @returns {Object|null} — { discount, discountedPrice, savings, badge } or null
 */
export const resolveBestDiscount = async (product) => {
	const discounts = await findDiscountsForProduct(product);

	if (!discounts.length) return null;

	const originalPrice =
		typeof product.price === "object"
			? product.price.amount
			: product.price || 0;

	let bestResult = null;

	for (const discount of discounts) {
		const result = calculateDiscountedPrice(originalPrice, discount);

		if (
			!bestResult ||
			discount.priority > bestResult.discount.priority ||
			(discount.priority === bestResult.discount.priority &&
				result.savings > bestResult.savings)
		) {
			bestResult = {
				discount,
				discountedPrice: result.discountedPrice,
				savings: result.savings,
				badge: formatBadge(discount),
			};
		}
	}

	return bestResult;
};

/**
 * Calculate the discounted price given an original price and a discount document.
 */
export const calculateDiscountedPrice = (originalPrice, discount) => {
	let savings = 0;

	switch (discount.type) {
		case "percentage": {
			savings = (originalPrice * discount.value) / 100;
			// Apply max discount cap
			if (
				discount.maxDiscountAmount !== null &&
				discount.maxDiscountAmount !== undefined &&
				savings > discount.maxDiscountAmount
			) {
				savings = discount.maxDiscountAmount;
			}
			break;
		}
		case "fixed_amount": {
			savings = Math.min(discount.value, originalPrice);
			break;
		}
		case "free_shipping":
		case "shipping_discount":
			// These don't affect product price directly
			savings = 0;
			break;
		default:
			savings = 0;
	}

	const discountedPrice = Math.max(0, originalPrice - savings);
	return {
		discountedPrice: Math.round(discountedPrice * 100) / 100,
		savings: Math.round(savings * 100) / 100,
	};
};

/**
 * Resolve shipping discounts for a set of products.
 * Returns the best shipping discount applicable.
 *
 * @param {Array} products — Array of product documents
 * @param {Number} orderSubtotal — Total order value
 * @returns {Object|null} — { discount, shippingSavings }
 */
export const resolveShippingDiscount = async (products, orderSubtotal) => {
	const now = new Date();

	// Gather all unique category IDs and seller user IDs
	const categoryIds = [
		...new Set(
			products
				.map(
					(p) =>
						p.primaryCategory?._id?.toString() ||
						p.primaryCategory?.toString()
				)
				.filter(Boolean)
		),
	];
	const sellerUserIds = [
		...new Set(
			products.map((p) => p.userId?.toString()).filter(Boolean)
		),
	];
	const productIds = products.map((p) => p._id?.toString()).filter(Boolean);

	const shippingDiscounts = await DiscountModel.find({
		...activeDiscountFilter(),
		type: { $in: ["free_shipping", "shipping_discount"] },
		$or: [
			{ scope: "all_products" },
			{ scope: "category", targetIds: { $in: categoryIds } },
			{ scope: "seller_all", targetIds: { $in: sellerUserIds } },
			{ scope: "single_product", targetIds: { $in: productIds } },
		],
	})
		.sort({ priority: -1 })
		.lean();

	if (!shippingDiscounts.length) return null;

	// free_shipping always wins over shipping_discount
	const freeShipping = shippingDiscounts.find(
		(d) =>
			d.type === "free_shipping" &&
			(d.minOrderValue === 0 || orderSubtotal >= d.minOrderValue)
	);

	if (freeShipping) {
		return { discount: freeShipping, type: "free_shipping", shippingSavings: null };
	}

	// Fall back to best shipping_discount
	const shippingDisc = shippingDiscounts.find(
		(d) =>
			d.type === "shipping_discount" &&
			(d.minOrderValue === 0 || orderSubtotal >= d.minOrderValue)
	);

	if (shippingDisc) {
		return {
			discount: shippingDisc,
			type: "shipping_discount",
			shippingSavings: shippingDisc.value,
		};
	}

	return null;
};

/**
 * Increment the usage count of a discount atomically.
 */
export const incrementUsage = async (discountId) => {
	await DiscountModel.findByIdAndUpdate(discountId, {
		$inc: { usageCount: 1 },
	});
};

/**
 * Validate that a seller can only create discounts scoped to their own products.
 */
export const validateSellerScope = async (sellerId, scope, targetIds) => {
	if (scope === "all_products") {
		throw new appError(
			"Sellers cannot create platform-wide discounts. Use 'seller_all' to apply to all your products.",
			403
		);
	}

	if (scope === "category") {
		throw new appError(
			"Sellers cannot create category-wide discounts. Use 'seller_all' or 'single_product'.",
			403
		);
	}

	if (scope === "single_product" && targetIds?.length) {
		const products = await ProductModel.find({
			_id: { $in: targetIds },
			userId: sellerId,
		}).lean();

		if (products.length !== targetIds.length) {
			throw new appError(
				"You can only create discounts for your own products.",
				403
			);
		}
	}

	// seller_all: targetIds must contain only the seller's own userId
	if (scope === "seller_all") {
		// No extra validation needed — we force targetIds = [sellerId] in controller
	}
};

/**
 * Format a discount into a human-readable badge string.
 */
const formatBadge = (discount) => {
	switch (discount.type) {
		case "percentage":
			return `-${discount.value}%`;
		case "fixed_amount":
			return `-$${discount.value}`;
		case "free_shipping":
			return "FREE SHIPPING";
		case "shipping_discount":
			return `-$${discount.value} SHIPPING`;
		default:
			return "";
	}
};

/**
 * Enrich an array of products with their best active discount info.
 * Used by public product listing endpoints.
 *
 * @param {Array} products — Array of product documents (plain objects or lean)
 * @returns {Array} — Products with added discount fields
 */
export const enrichProductsWithDiscounts = async (products) => {
	if (!products?.length) return products;

	// Batch-fetch all active discounts once
	const allActiveDiscounts = await DiscountModel.find(activeDiscountFilter())
		.sort({ priority: -1, value: -1 })
		.lean();

	if (!allActiveDiscounts.length) return products;

	return products.map((product) => {
		const prod = product.toObject ? product.toObject() : { ...product };
		const originalPrice =
			typeof prod.price === "object"
				? prod.price.amount
				: prod.price || 0;

		const productId = prod._id?.toString();
		const categoryId =
			prod.primaryCategory?._id?.toString() ||
			prod.primaryCategory?.toString();
		const sellerUserId = prod.userId?.toString();

		// Find matching discounts for this product
		const matching = allActiveDiscounts.filter((d) => {
			if (d.scope === "all_products") return true;
			if (d.scope === "single_product")
				return d.targetIds?.some((t) => t.toString() === productId);
			if (d.scope === "category" && categoryId)
				return d.targetIds?.some((t) => t.toString() === categoryId);
			if (d.scope === "seller_all" && sellerUserId)
				return d.targetIds?.some(
					(t) => t.toString() === sellerUserId
				);
			return false;
		});

		if (!matching.length) return prod;

		// Pick the best one (already sorted by priority desc, value desc)
		let best = null;
		for (const discount of matching) {
			// Skip shipping-only discounts for price display
			if (
				discount.type === "free_shipping" ||
				discount.type === "shipping_discount"
			)
				continue;

			const result = calculateDiscountedPrice(originalPrice, discount);
			if (
				!best ||
				discount.priority > best.discount.priority ||
				(discount.priority === best.discount.priority &&
					result.savings > best.savings)
			) {
				best = {
					discount,
					discountedPrice: result.discountedPrice,
					savings: result.savings,
				};
			}
		}

		if (best) {
			prod.activeDiscount = {
				discountId: best.discount._id,
				name: best.discount.name,
				type: best.discount.type,
				value: best.discount.value,
				badge: formatBadge(best.discount),
				originalPrice,
				discountedPrice: best.discountedPrice,
				savings: best.savings,
				endsAt: best.discount.endDate,
			};
		}

		// Check for shipping discounts applicable to this product
		const shippingDiscount = matching.find(
			(d) =>
				d.type === "free_shipping" || d.type === "shipping_discount"
		);
		if (shippingDiscount) {
			prod.shippingDiscount = {
				discountId: shippingDiscount._id,
				type: shippingDiscount.type,
				value: shippingDiscount.value,
				badge: formatBadge(shippingDiscount),
			};
		}

		return prod;
	});
};

/**
 * Filter for active coupons
 */
const activeCouponFilter = () => {
	const now = new Date();
	return {
		isActive: true,
		isCoupon: true,
		startDate: { $lte: now },
		endDate: { $gt: now },
		$or: [
			{ usageLimit: null },
			{ $expr: { $lt: ["$usageCount", "$usageLimit"] } },
		],
	};
};

/**
 * Validates a coupon code against a list of cart items.
 * Calculates overall coupon savings based on the matching products.
 */
export const validateCouponForCart = async (code, cartItems) => {
	const uppercaseCode = code.trim().toUpperCase();

	const coupon = await DiscountModel.findOne({
		code: uppercaseCode,
		...activeCouponFilter(),
	}).lean();

	if (!coupon) {
		throw new appError("Invalid, expired, or fully redeemed promo code", 400);
	}

	// Now check which items in the cart are eligible for this coupon
	let eligibleOriginalSubtotal = 0;
	let validItemsFound = false;

	// Build scope check variables
	for (const cartItem of cartItems) {
		const product = cartItem.productObj || cartItem.item;
		const quantity = cartItem.quantity || 1;
		const originalPrice = product.price?.amount || 0;

		const productId = product._id?.toString();
		const categoryId = product.primaryCategory?._id?.toString() || product.primaryCategory?.toString();
		const sellerUserId = product.userId?.toString();

		let isEligible = false;
		if (coupon.scope === "all_products") {
			isEligible = true;
		} else if (coupon.scope === "single_product") {
			isEligible = coupon.targetIds.some(t => t.toString() === productId);
		} else if (coupon.scope === "category" && categoryId) {
			isEligible = coupon.targetIds.some(t => t.toString() === categoryId);
		} else if (coupon.scope === "seller_all" && sellerUserId) {
			isEligible = coupon.targetIds.some(t => t.toString() === sellerUserId);
		}

		if (isEligible) {
			cartItem.__isEligible = true;
			validItemsFound = true;
			eligibleOriginalSubtotal += originalPrice * quantity;
		} else {
			cartItem.__isEligible = false;
		}
	}

	if (!validItemsFound) {
		throw new appError("This promo code does not apply to any items in your cart", 400);
	}

	if (coupon.minOrderValue > 0) {
		// Calculate full cart subtotal to check min limit
		const fullCartSubtotal = cartItems.reduce((acc, item) => {
			const product = item.productObj || item.item;
			return acc + (product.price?.amount || 0) * (item.quantity || 1);
		}, 0);

		if (fullCartSubtotal < coupon.minOrderValue) {
			throw new appError(`This promo code requires a minimum order value of $${coupon.minOrderValue}`, 400);
		}
	}

	// Output savings using calculateDiscountedPrice on the eligible total
	const { savings } = calculateDiscountedPrice(eligibleOriginalSubtotal, coupon);

	const allocations = {};
	if (savings > 0) {
		cartItems.forEach(cartItem => {
			if (cartItem.__isEligible) {
				const product = cartItem.productObj || cartItem.item;
				const itemTotal = (product.price?.amount || 0) * (cartItem.quantity || 1);
				allocations[product._id.toString()] = (itemTotal / eligibleOriginalSubtotal) * savings;
			}
		});
	}

	return {
		success: true,
		couponId: coupon._id,
		coupon,
		allocations,
		code: uppercaseCode,
		type: coupon.type,
		value: coupon.value,
		discountAmount: savings,
		message: `Promo code applied successfully!`
	};
};
