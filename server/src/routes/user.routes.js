import { Router } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  getUser,
  resendVerifyToken,
  verifyAccount,
  updateUserDetails,
  refreshToken,
  uploadAvatar,
} from "../controller/user.controller.js";
import { validateFormData } from "../middleware/validateFormData.js";
import {
  validateRegisterUserSchema,
  validateLoginUserSchema,
  validateResetPasswordSchema,
  validateForgotPasswordSchema,
  validateUpdateUserSchema,
} from "../utils/formValidations.js";
import { rateLimiter } from "../middleware/rateLimit.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

//invoke controllers api via the endpoints
router.post(
  "/create",
  rateLimiter(10),
  validateFormData(validateRegisterUserSchema),
  registerUser
);

router.post(
  "/login",
  rateLimiter(5),
  validateFormData(validateLoginUserSchema),
  loginUser
);

router.post(
  "/forgot-password",
  rateLimiter(5),
  validateFormData(validateForgotPasswordSchema),
  forgotPassword
);

router.patch(
  "/reset-password",
  rateLimiter(5),
  validateFormData(validateResetPasswordSchema),
  resetPassword
);

router.post("/logout", authenticate, logoutUser);

router.get("/get", authenticate, getUser);

router.post("/resend-token", rateLimiter(5), authenticate, resendVerifyToken);

router.patch(
  "/verify/:userId/:verifyToken",
  rateLimiter(5),
  authenticate,
  verifyAccount
);

router.patch(
  "/update-user",
  rateLimiter(5),
  authenticate,
  validateFormData(validateUpdateUserSchema),
  updateUserDetails
);

router.post("/refresh-token", refreshToken);

router.patch("/upload-avatar", rateLimiter(5), authenticate, uploadAvatar);

export default router;
