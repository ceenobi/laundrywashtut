import { Router } from "express";
import { authenticate, authorizedRoles } from "../middleware/authenticate.js";
import {
  dashboardStats,
  getAllUsers,
  getAdminOrders,
  updateOrderDelivery,
  updatePaymentStatus,
  getOrdersRevenue,
} from "../controller/admin.controller.js";

const router = Router();

router.get("/stats", authenticate, authorizedRoles("admin"), dashboardStats);
router.get("/get_users", authenticate, authorizedRoles("admin"), getAllUsers);
router.get(
  "/get_orders",
  authenticate,
  authorizedRoles("admin"),
  getAdminOrders
);
router.patch(
  "/update_delivery_status/:bookingId",
  authenticate,
  authorizedRoles("admin"),
  updateOrderDelivery
);
router.patch(
  "/update_payment_status/:bookingId",
  authenticate,
  authorizedRoles("admin"),
  updatePaymentStatus
);
router.get(
  "/revenue_stats",
  authenticate,
  authorizedRoles("admin"),
  getOrdersRevenue
);

export default router;
