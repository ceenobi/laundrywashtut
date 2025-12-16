import mongoose, { Schema, model } from "mongoose";

const garmentItemSchema = new Schema(
  {
    qty: {
      type: Number,
      required: [true, "Item quantity is required"],
    },
  },
  { _id: false }
);

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    status: {
      type: String,
      enum: ["active", "in-progress", "completed", "canceled"],
      default: "active",
    },
    serviceType: {
      type: String,
      enum: ["Wash and fold", "Dry cleaning", "Ironing and pressing"],
      required: [true, "Service type is required"],
    },
    pickUp: {
      address: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
        minlength: [14, "Phone should not exceed 14 characters"],
      },
      date: {
        type: Date,
      },
      time: {
        type: String,
        enum: ["10:00 AM", "12:00 PM", "2:00 PM"],
      },
    },
    delivery: {
      address: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
        minlength: [14, "Phone should not exceed 14 characters"],
      },
    },
    items: {
      shirt: {
        type: garmentItemSchema,
      },
      trouser: {
        type: garmentItemSchema,
      },
      senator: {
        type: garmentItemSchema,
      },
      native: {
        type: garmentItemSchema,
      },
      duvet: {
        type: garmentItemSchema,
      },
      specialItem: {
        type: garmentItemSchema,
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ status: 1 });
bookingSchema.index({ isPaid: 1 });
bookingSchema.index({ "pickUp.date": 1, "pickUp.time": 1 });

export default mongoose.models.Booking || model("Booking", bookingSchema);
