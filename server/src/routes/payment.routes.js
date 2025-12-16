import { Router } from "express";
import {
  createPayment,
  userPayments,
} from "../controller/payment.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post("/create/:bookingId", authenticate, createPayment);
router.get("/get", authenticate, userPayments);

export default router;
