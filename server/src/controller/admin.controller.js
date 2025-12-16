import User from "../model/user.model.js";
import Booking from "../model/booking.model.js";
import Payment from "../model/payment.model.js";
import responseHandler from "../utils/responseHandler.js";

export const dashboardStats = async (req, res, next) => {
  const { page = 1, limit = 10, query, status } = req.query;
  const sanitizeQuery = query
    ? query.toLowerCase().replace(/[^\w\s]/gi, "")
    : "";
  try {
    const ordersCount = await Booking.countDocuments();
    const usersCount = await User.countDocuments();
    const paymentData = await Payment.find().lean();
    const paymentsTotal = paymentData.reduce((acc, cv) => acc + cv.amount, 0);
    //fetch recent users and payments as a single array data
    const users = await User.find().lean().sort({ createdAt: -1 });
    const getUsers = await User.find({
      $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
    }).lean();
    const matchUserIds = getUsers.map((user) => user._id);
    // const paymentsQuery = status ? { status } : {};
    const payments = await Payment.find({
      ...(sanitizeQuery && {
        $or: [{ userId: { $in: matchUserIds } }],
      }),
      ...(status && { status: status }),
    })
      .lean()
      .populate("bookingId", "serviceType time")
      .populate("userId", "fullname email phone")
      .sort({ createdAt: -1 });

    //combine data in a single array
    const recentActivities = [
      ...users.map((user) => ({ ...user, type: "user" })),
      ...payments.map((payment) => ({ ...payment, type: "payment" })),
    ];

    //sort data
    recentActivities.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    //paginate recentacvtivites data
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const total = recentActivities.length;
    const totalPages = Math.ceil(total / limitNum);

    const paginatedData = recentActivities.slice(skip, skip + limitNum);

    return responseHandler.successResponse(res, {
      ordersCount,
      usersCount,
      paymentsTotal,
      recentActivities: paginatedData,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasMore: pageNum < totalPages,
        hasLess: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  const { page = 1, limit = 10, query } = req.query;
  const sanitizeQuery = query
    ? query.toLowerCase().replace(/[^\w\s]/gi, "")
    : "";
  try {
    const users = await User.find({
      $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const total = await User.countDocuments({
      $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
    });
    const totalUsers = await User.countDocuments();

    //recent user stats
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const recentUsers = await User.find({
      createdAt: {
        $gte: startOfPreviousMonth,
        $lt: startOfCurrentMonth,
      },
      isEmailVerified: true,
    }).lean();
    return responseHandler.successResponse(res, {
      totalUsers,
      recentUsers: recentUsers.length,
      users,
      pagination: {
        currentPage: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
        hasMore: (page - 1) * limit + users.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    query,
    status,
    time,
    startDate,
    endDate,
  } = req.query;
  const sanitizeQuery = query
    ? query.toLowerCase().replace(/[^\w\s]/gi, "")
    : "";
  const sanitizeStartDate = startDate ? new Date(startDate) : null;
  const sanitizeEndDate = startDate ? new Date(endDate) : null;
  const getUsers = await User.find({
    $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
  }).lean();
  const matchUserIds = getUsers.map((user) => user._id);

  try {
    const orders = await Booking.find({
      ...(sanitizeQuery && {
        $or: [{ userId: { $in: matchUserIds } }],
      }),
      ...(status && { status: status }),
      ...(time && { "pickUp.time": time }),
      ...(sanitizeStartDate || sanitizeEndDate
        ? {
            "pickUp.date": {
              ...(sanitizeStartDate && {
                $gte: new Date(sanitizeStartDate.setHours(0, 0, 0, 0)),
              }),
              ...(sanitizeEndDate && {
                $lte: new Date(sanitizeEndDate.setHours(23, 59, 59, 999)),
              }),
            },
          }
        : {}),
    })
      .lean()
      .populate("userId", "fullname")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Booking.countDocuments({
      ...(sanitizeQuery && {
        $or: [{ userId: { $in: matchUserIds } }],
      }),
      ...(status && { status: status }),
      ...(time && { "pickUp.time": time }),
      ...(sanitizeStartDate || sanitizeEndDate
        ? {
            "pickUp.date": {
              ...(sanitizeStartDate && {
                $gte: new Date(sanitizeStartDate.setHours(0, 0, 0, 0)),
              }),
              ...(sanitizeEndDate && {
                $lte: new Date(sanitizeEndDate.setHours(23, 59, 59, 999)),
              }),
            },
          }
        : {}),
    });

    const activeOrders = await Booking.find({
      status: "active",
    });
    const inProgressOrders = await Booking.find({
      status: "in-progress",
    });
    const completedOrders = await Booking.find({
      status: "completed",
    });
    const canceledOrders = await Booking.find({
      status: "canceled",
    });
    return responseHandler.successResponse(res, {
      activeOrders: activeOrders.length,
      inProgressOrders: inProgressOrders.length,
      completedOrders: completedOrders.length,
      canceledOrders: canceledOrders.length,
      orders,
      pagination: {
        currentPage: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
        hasMore: (page - 1) * limit + orders.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderDelivery = async (req, res, next) => {
  const bookingId = req.params.bookingId;
  try {
    if (!bookingId) {
      return next(responseHandler.errorResponse("Booking Id is missing", 400));
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(responseHandler.notFoundResponse("Booking not found", 400));
    }
    //check if order is paid
    if (!booking.isPaid) {
      return next(
        responseHandler.errorResponse(
          "Please update payment status before completing delivery",
          400
        )
      );
    }
    // update order delivery status
    if (booking.isDelivered) {
      booking.isDelivered = false;
      booking.status = "in-progress";
    } else {
      booking.isDelivered = true;
      booking.status = "completed";
    }
    await booking.save();
    return responseHandler.successResponse(
      res,
      booking,
      `${booking.isDelivered ? "Delivery confirmed" : "Delvery not confirmed"}`
    );
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  const bookingId = req.params.bookingId;
  try {
    if (!bookingId) {
      return next(responseHandler.errorResponse("Booking Id is missing", 400));
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(responseHandler.notFoundResponse("Booking not found", 400));
    }
    //check if order is paid
    if (booking.isPaid) {
      return next(
        responseHandler.errorResponse(
          "Payment has already been made for this booking",
          400
        )
      );
    }
    // update payment status
    booking.isPaid = true;
    booking.status = "in-progress";
    await booking.save();
    return responseHandler.successResponse(res, booking, "Payment confirmed");
  } catch (error) {
    next(error);
  }
};

export const getOrdersRevenue = async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    query,
    paymentMethod,
    status,
    startDate,
    endDate,
  } = req.query;
  const sanitizeQuery = query
    ? query.toLowerCase().replace(/[^\w\s]/gi, "")
    : "";
  const sanitizeStartDate = startDate ? new Date(startDate) : null;
  const sanitizeEndDate = startDate ? new Date(endDate) : null;
  const getUsers = await User.find({
    $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
  }).lean();
  const matchUserIds = getUsers.map((user) => user._id);
  try {
    const [
      getPaidBookings,
      getTotalPayments,
      getPayOnDelivery,
      getPayWithPaystack,
      getPayments,
      getTotalPaymentCount,
    ] = await Promise.all([
      Booking.find({ isPaid: true }).lean(),
      Booking.find().lean(),
      Payment.find({ paymentMethod: "Pay on Delivery" }).lean(),
      Payment.find({ paymentMethod: "Pay with Paystack" }).lean(),
      Payment.find({
        ...(sanitizeQuery && {
          $or: [{ userId: { $in: matchUserIds } }],
        }),
        ...(status && { status: status }),
        ...(paymentMethod && { paymentMethod: paymentMethod }),
        ...(sanitizeStartDate || sanitizeEndDate
          ? {
              paidAt: {
                ...(sanitizeStartDate && {
                  $gte: new Date(sanitizeStartDate.setHours(0, 0, 0, 0)),
                }),
                ...(sanitizeEndDate && {
                  $lte: new Date(sanitizeEndDate.setHours(23, 59, 59, 999)),
                }),
              },
            }
          : {}),
      })
        .lean()
        .sort({ createdAt: -1 })
        .populate("userId", "fullname avatar")
        .skip((page - 1) * limit)
        .limit(limit),
      Payment.countDocuments({
        ...(sanitizeQuery && {
          $or: [{ userId: { $in: matchUserIds } }],
        }),
        ...(status && { status: status }),
        ...(paymentMethod && { paymentMethod: paymentMethod }),
        ...(sanitizeStartDate || sanitizeEndDate
          ? {
              paidAt: {
                ...(sanitizeStartDate && {
                  $gte: sanitizeStartDate.setHours(0, 0, 0, 0),
                }),
                ...(sanitizeEndDate && {
                  $lte: new Date(sanitizeEndDate.setHours(23, 59, 59, 999)),
                }),
              },
            }
          : {}),
      }),
    ]);
    const isPaidTotal = getPaidBookings.reduce((acc, cv) => acc + cv.total, 0);
    const totalRevenue = getTotalPayments.reduce(
      (acc, cv) => acc + cv.total,
      0
    );
    const getPayDelivery = getPayOnDelivery.reduce(
      (acc, cv) => acc + cv.amount,
      0
    );
    const getPayPaystack = getPayWithPaystack.reduce(
      (acc, cv) => acc + cv.amount,
      0
    );

    return responseHandler.successResponse(res, {
      isPaidTotal,
      totalRevenue,
      getPayDelivery,
      getPayPaystack,
      getPayments,
      pagination: {
        currentPage: Number(page),
        limit: Number(limit),
        total: getTotalPaymentCount,
        totalPages: Math.ceil(getTotalPaymentCount / Number(limit)),
        hasMore: (page - 1) * limit + getPayments.length < getTotalPaymentCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
