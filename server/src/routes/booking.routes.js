import { Router } from "express";
import {
  createBooking,
  getBookings,
} from "../controller/booking.controller.js";
import { validateFormData } from "../middleware/validateFormData.js";
import { validateBookingSchema } from "../utils/formValidations.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post(
  "/create",
  authenticate,
  validateFormData(validateBookingSchema),
  createBooking
);

router.get("/get", authenticate, getBookings);

export default router;
