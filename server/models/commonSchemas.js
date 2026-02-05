import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema(
	{
		label: {
			type: String,
			trim: true,
		},
		recipientName: {
			type: String,
			trim: true,
		},
		phone: {
			type: String,
			trim: true,
		},
		line1: {
			type: String,
			required: true,
			trim: true,
		},
		line2: {
			type: String,
			trim: true,
		},
		city: {
			type: String,
			required: true,
			trim: true,
		},
		state: {
			type: String,
			trim: true,
		},
		postalCode: {
			type: String,
			required: true,
			trim: true,
		},
		country: {
			type: String,
			required: true,
			trim: true,
		},
		coordinates: {
			latitude: Number,
			longitude: Number,
		},
		isDefault: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: true }
);

export const moneySchema = new mongoose.Schema(
	{
		amount: {
			type: Number,
			required: true,
			min: 0,
		},
		currency: {
			type: String,
			required: false,
			trim: true,
			uppercase: true,
			default: "USD",
		},
	},
	{ _id: false }
);
