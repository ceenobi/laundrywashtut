import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: true,
      maxlength: [30, "Fullname should not exceed 30 characters"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, //prevents password field from being read and sent
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
      minlength: [14, "Phone should not exceed 14 characters"],
      required: true,
      unique: [true, "Phone number should be new"],
    },
    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
    verifyToken: {
      type: String,
      select: false,
    },
    verifyTokenExpires: {
      type: Date,
      select: false,
    },
    passwordToken: {
      type: String,
      select: false,
    },
    passwordTokenExpires: {
      type: Date,
      select: false,
    },
    avatar: {
      type: String,
    },
    avatarId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ fullname: 1 });

export default mongoose.models.User || model("User", userSchema);
