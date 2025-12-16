import Booking from "../model/booking.model.js";
import User from "../model/user.model.js";
import responseHandler from "../utils/responseHandler.js";
import mailService from "./mail.controller.js";

const GARMENT_KEYS = [
  "shirt",
  "trouser",
  "senator",
  "native",
  "duvet",
  "specialItem",
];

const itemsPerCost = {
  shirt: 900,
  trouser: 700,
  senator: 1200,
  native: 900,
  duvet: 1500,
  specialItem: 2000,
};

const calculateItemsTotal = (items = {}) => {
  return GARMENT_KEYS.reduce((sum, key) => {
    const entry = items[key];
    if (!entry) return sum;
    const qty =
      typeof entry === "object" && entry !== null
        ? Number(entry.qty) || 0
        : Number(entry) || 0;

    const unitPrice = itemsPerCost[key] || 0;

    return sum + unitPrice * qty;
  }, 0);
};

export const createBooking = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).lean();
    if (!user.isEmailVerified) {
      return next(
        responseHandler.errorResponse(
          "Please verify your email before booking a service"
        )
      );
    }
    const items = {
      shirt: { qty: req.body.shirt },
      trouser: { qty: req.body.trouser },
      native: { qty: req.body.native },
      senator: { qty: req.body.senator },
      duvet: { qty: req.body.duvet },
      specialItem: { qty: req.body.specialItem },
    };
    const total = calculateItemsTotal(items);

    const booking = await Booking.create({
      userId,
      serviceType: req.body.serviceType,
      pickUp: {
        address: req.body.pickUpAddress,
        phone: req.body.pickUpPhone,
        date: req.body.date,
        time: req.body.time,
      },
      delivery: {
        address: req.body.deliveryAddress,
        phone: req.body.deliveryPhone,
      },
      items,
      total,
    });
    process.nextTick(() => {
      mailService.sendBookingConfirmation(user, booking);
    });
    return responseHandler.successResponse(
      res,
      booking,
      "Booking created successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  const userId = req.user.id;
  const { page = 1, limit = 2, status = "active" } = req.query;
  try {
    const bookings = await Booking.find({
      userId: userId,
      ...(status && { status: status }),
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const total = await Booking.countDocuments({
      userId: userId,
      ...(status && { status: status }),
    });
    return responseHandler.successResponse(res, {
      bookings,
      pagination: {
        currentPage: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
        hasMore: (page - 1) * limit + bookings.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};
