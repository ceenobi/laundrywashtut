import mongoose, { model, Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking Id is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Pay on Delivery", "Pay with Paystack"],
      required: [true, "Payment method is required"],
    },
    paidAt: {
      type: Date,
    },
    reference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({
  userId: 1,
  status: 1,
  paymentMethod: 1,
});

const Payment = mongoose.models.Payment || model("Payment", paymentSchema);

export default Payment;
