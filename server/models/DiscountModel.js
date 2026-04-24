import mongoose from "mongoose";
import { moneySchema } from "./commonSchemas.js";

/**
 * DiscountModel — Promotion / Discount schema.
 *
 * Supports:
 *   - Percentage off, Fixed amount off, Free shipping, Shipping discount
 *   - Scoped to: all products, category, seller-wide, single product
 *   - Created by Admin (platform-wide) or Seller (own products)
 *   - Scheduling via startDate / endDate
 *   - Usage limits (global cap)
 *   - Priority-based conflict resolution
 *   - Max discount cap (prevents 99% off $5000 items)
 *   - Minimum order value threshold
 */
const discountSchema = new mongoose.Schema(
	{
		// ── Identity ──────────────────────────────────────────────────
		name: {
			type: String,
			required: [true, "Discount name is required"],
			trim: true,
			maxlength: [100, "Discount name cannot exceed 100 characters"],
		},
		description: {
			type: String,
			trim: true,
			maxlength: [500, "Description cannot exceed 500 characters"],
		},

		// ── Discount Mechanics ────────────────────────────────────────
		type: {
			type: String,
			enum: {
				values: ["percentage", "fixed_amount", "free_shipping", "shipping_discount"],
				message: "Type must be percentage, fixed_amount, free_shipping, or shipping_discount",
			},
			required: [true, "Discount type is required"],
		},
		value: {
			type: Number,
			default: 0,
			min: [0, "Discount value cannot be negative"],
			validate: {
				validator: function (v) {
					if (this.type === "percentage" && v > 100) return false;
					return true;
				},
				message: "Percentage discount cannot exceed 100%",
			},
		},
		maxDiscountAmount: {
			type: Number,
			default: null, // null = no cap
			min: [0, "Max discount amount cannot be negative"],
		},
		minOrderValue: {
			type: Number,
			default: 0,
			min: [0, "Minimum order value cannot be negative"],
		},

		// ── Scope — What does it apply to? ────────────────────────────
		scope: {
			type: String,
			enum: {
				values: ["all_products", "category", "seller_all", "single_product"],
				message: "Scope must be all_products, category, seller_all, or single_product",
			},
			required: [true, "Discount scope is required"],
		},
		targetIds: [
			{
				type: mongoose.Schema.Types.ObjectId,
				// Polymorphic: CategoryId, ProductId, or SellerId depending on scope
			},
		],

		// ── Ownership ─────────────────────────────────────────────────
		creatorRole: {
			type: String,
			enum: ["Admin", "Seller"],
			required: [true, "Creator role is required"],
		},
		creatorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserModel",
			required: [true, "Creator ID is required"],
		},

		// ── Priority & Conflict Resolution ────────────────────────────
		priority: {
			type: Number,
			default: 50,
			min: 0,
			max: 1000,
		},

		// ── Scheduling ────────────────────────────────────────────────
		startDate: {
			type: Date,
			required: [true, "Start date is required"],
		},
		endDate: {
			type: Date,
			required: [true, "End date is required"],
			validate: {
				validator: function (v) {
					return v > this.startDate;
				},
				message: "End date must be after start date",
			},
		},
		isActive: {
			type: Boolean,
			default: true,
		},

		// ── Usage Tracking ────────────────────────────────────────────
		usageLimit: {
			type: Number,
			default: null, // null = unlimited
			min: [0, "Usage limit cannot be negative"],
		},
		usageCount: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		id: false,
	}
);

// ── Virtuals ──────────────────────────────────────────────────────────
discountSchema.virtual("isExpired").get(function () {
	return this.endDate < new Date();
});

discountSchema.virtual("isCurrentlyActive").get(function () {
	const now = new Date();
	return (
		this.isActive &&
		this.startDate <= now &&
		this.endDate > now &&
		(this.usageLimit === null || this.usageCount < this.usageLimit)
	);
});

discountSchema.virtual("hasUsageRemaining").get(function () {
	if (this.usageLimit === null) return true;
	return this.usageCount < this.usageLimit;
});

// ── Indexes for fast queries ──────────────────────────────────────────
discountSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
discountSchema.index({ scope: 1, targetIds: 1 });
discountSchema.index({ creatorId: 1, creatorRole: 1 });
discountSchema.index({ endDate: 1 }); // For expiration cleanup queries

export default mongoose.model("DiscountModel", discountSchema);
