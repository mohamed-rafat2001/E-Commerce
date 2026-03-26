import mongoose from "mongoose";

const BrandFollowerSchema = new mongoose.Schema(
    {
        brandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BrandModel",
            required: [true, "Brand ID is required"],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
            required: [true, "User ID is required"],
        },
    },
    {
        timestamps: true,
    }
);

// Ensure a user can only follow a brand once
BrandFollowerSchema.index({ brandId: 1, userId: 1 }, { unique: true });

// Index for efficient count queries
BrandFollowerSchema.index({ brandId: 1 });

// Index for getting all brands a user follows
BrandFollowerSchema.index({ userId: 1 });

export default mongoose.model("BrandFollowerModel", BrandFollowerSchema);
