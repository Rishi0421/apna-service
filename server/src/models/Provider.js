import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    price: Number,

    image: {
      type: String, // 🔥 image path / url
      default: "",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const providerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    services: {
      type: [serviceSchema],
      default: [],
    },

    pincodes: [{ type: String }],
    experience: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    isVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Provider", providerSchema);
