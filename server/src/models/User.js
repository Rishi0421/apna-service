import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
    },
    pincode: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    avatar: {
  type: String,
  default: "",
},
    resetOtp: String,
    resetOtpExpire: Date,
  },
  
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
