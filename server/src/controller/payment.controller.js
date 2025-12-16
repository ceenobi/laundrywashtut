import Payment from "../model/payment.model.js";
import Booking from "../model/booking.model.js";
import responseHandler from "../utils/responseHandler.js";

export const createPayment = async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.id;
  const { amount, reference, paymentMethod } = req.body;
  try {
    if (!amount || !reference || !paymentMethod) {
      return next(
        responseHandler.errorResponse(
          "Amount, reference, or paymentMethod is required",
          400
        )
      );
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(responseHandler.notFoundResponse("Booking not found"));
    }
    if (paymentMethod === "Pay with Paystack") {
      const payment = await Payment.create({
        userId,
        bookingId: bookingId,
        amount,
        status: "confirmed",
        reference,
        paidAt: Date.now(),
        paymentMethod,
      });
      booking.status = "in-progress";
      booking.isPaid = true;
      await booking.save();
      return responseHandler.successResponse(
        res,
        payment,
        "Payment has been made successfully",
        201
      );
    } else {
      booking.status = "in-progress";
      await booking.save();
      const payment = await Payment.create({
        userId,
        bookingId: bookingId,
        amount,
        reference,
        paymentMethod,
      });
      return responseHandler.successResponse(
        res,
        payment,
        "Payment to be made upon delivery",
        201
      );
    }
  } catch (error) {
    next(error);
  }
};

export const userPayments = async (req, res, next) => {
  const userId = req.user.id;
  const { page = 1, limit = 2, status = "pending" } = req.query;
  try {
    const payments = await Payment.find({
      userId: userId,
      ...(status && { status: status }),
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .populate("bookingId", "serviceType");
    const total = await Payment.countDocuments({
      userId: userId,
      ...(status && { status: status }),
    });
    return responseHandler.successResponse(res, {
      payments,
      pagination: {
        currentPage: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
        hasMore: (page - 1) * limit + payments.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};
