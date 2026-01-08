import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import responseHandler from "../utils/responseHandler.js";
import { sendToken } from "../utils/token.js";
import mailService from "./mail.controller.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const registerUser = async (req, res, next) => {
  //req.body handles form collection passed from the client
  const { fullname, email, password, phone } = req.body;
  try {
    //check if email already exists
    const [emailExists, phoneExists] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ phone }),
    ]);
    if (emailExists)
      return next(responseHandler.errorResponse("Email already exists", 400));
    if (phoneExists)
      return next(responseHandler.errorResponse("Phone already exists", 400));
    //if user email is new, proceed to creating user
    //handle verification token generation
    const verifyToken = crypto.randomBytes(16).toString("hex"); //generate unique random 16 digit numbers
    const verifyTokenExpires = new Date(Date.now() + 3600000); //1hr
    //handle passsword encryption
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    //save the user to database
    const user = await User.create({
      fullname,
      email,
      password: hashPassword,
      verifyToken,
      verifyTokenExpires,
      phone,
    });
    //generate access and refresh token
    const { accessToken, refreshToken, cookieOptions } = sendToken(user);
    //process.nextTick - this allows not block synchronous operations-  the api response wont wait for the eamil to be sent
    const verifcationLink = `${process.env.CLIENT_URL}/verify-email/${user._id}/${verifyToken}`;
    process.nextTick(() => {
      mailService.sendRegistrationMail(user, verifcationLink);
    });
    res.cookie("refreshToken", refreshToken, cookieOptions);
    //return json resposne
    return responseHandler.successResponse(
      res,
      accessToken,
      "Registration successfull, please check your email for verfication",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //find user in db via the email
    const user = await User.findOne({ email }).select("+password"); //select will include the password field, it is hidden by default
    if (!user) {
      return next(responseHandler.notFoundResponse("Account not found"));
    }
    //handle password decryption
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(responseHandler.unauthorizedResponse("Incorrect password"));
    }
    //generate access and refresh token
    const { accessToken, refreshToken, cookieOptions } = sendToken(user);
    //send the cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);
    //return json resposne
    return responseHandler.successResponse(
      res,
      accessToken,
      "Login successful",
      200
    );
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(responseHandler.notFoundResponse("Account not found"));
    }
    //generate resetlink
    const passwordToken = crypto.randomBytes(16).toString("hex");
    const passwordTokenExpires = new Date(Date.now() + 900000); //15mins
    const resetPasswordLink = `${process.env.CLIENT_URL}/auth/reset-password?userId=${user._id}&token=${passwordToken}`;
    //update user details
    user.passwordToken = passwordToken;
    user.passwordTokenExpires = passwordTokenExpires;
    await user.save();
    process.nextTick(() => {
      mailService.sendPasswordMail(user, resetPasswordLink);
    });
    return responseHandler.successResponse(
      res,
      null,
      "Reset password link has been sent to your email"
    );
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  //get user and token from query params
  const userId = req.query.userId;
  const token = req.query.token;
  const { newPassword, confirmPassword } = req.body;
  try {
    if (newPassword !== confirmPassword) {
      return next(responseHandler.errorResponse("Passwords do not match", 400));
    }
    //find user via the user Id
    const user = await User.findById(userId).select(
      "+passwordToken +passwordTokenExpires"
    );
    if (!user) {
      return next(responseHandler.notFoundResponse("Account not found"));
    }
    //verify password link
    if (user.passwordToken !== token) {
      return next(responseHandler.errorResponse("Password token invalid", 400));
    }
    //check token expiry
    if (user.passwordTokenExpires < new Date()) {
      user.passwordToken = undefined;
      user.passwordTokenExpires = undefined;
      await user.save();
      return next(
        responseHandler.errorResponse(
          "Password token has expired, please request a new one",
          400
        )
      );
    }
    //encrypt new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    user.passwordToken = undefined;
    user.passwordTokenExpires = undefined;
    await user.save();
    return responseHandler.successResponse(
      res,
      null,
      "Password reset successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return responseHandler.successResponse(res, null, "Logout successful", 200);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).lean();
    return responseHandler.successResponse(res, user, "user found", 200);
  } catch (error) {
    next(error);
  }
};

export const resendVerifyToken = async (req, res, next) => {
  const user = await User.findById(req.user.id).select(
    "+verifyToken +verifyTokenExpires"
  );
  try {
    if (!user) {
      return next(responseHandler.notFoundResponse("Account not found"));
    }
    //check if user is already verified
    if (user.isEmailVerified) {
      return next(responseHandler.errorResponse("Account already verified"));
    }
    //generate new verification Token
    const verifyToken = crypto.randomBytes(16).toString("hex");
    const verifyTokenExpires = new Date(Date.now() + 3600000); //1hr
    //update user data
    user.verifyToken = verifyToken;
    user.verifyTokenExpires = verifyTokenExpires;
    await user.save();
    const verifcationLink = `${process.env.CLIENT_URL}/verify-email/${user._id}/${verifyToken}`;
    process.nextTick(() => {
      mailService.sendRegistrationMail(user, verifcationLink);
    });
    return responseHandler.successResponse(
      res,
      null,
      "Verification token sent to your email"
    );
  } catch (error) {
    next(error);
  }
};

export const verifyAccount = async (req, res, next) => {
  const userId = req.params.userId;
  const verifyToken = req.params.verifyToken;
  try {
    if (!userId || !verifyToken) {
      return next(
        responseHandler.errorResponse(
          "UserId params or verifyToken params is missing",
          400
        )
      );
    }
    //find user
    const user = await User.findById(userId).select(
      "+verifyToken +verifyTokenExpires"
    );
    //check if token matches the same as received in mail
    if (user.verifyToken !== verifyToken) {
      return next(
        responseHandler.errorResponse("Invalid verification token", 400)
      );
    }
    //check token expiry
    if (user.verifyTokenExpires < new Date()) {
      user.verifyToken = undefined;
      user.verifyTokenExpires = undefined;
      await user.save();
      return next(
        responseHandler.errorResponse(
          "Verification token has expired, please request a new one",
          400
        )
      );
    }
    //verify user if token has not expired
    user.isEmailVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();
    return responseHandler.successResponse(
      res,
      null,
      "Email verified success",
      200
    );
  } catch (error) {
    next(error);
  }
};

export const updateUserDetails = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(responseHandler.notFoundResponse("Account not found"));
    }
    for (const [key, value] of Object.entries(req.body)) {
      if (value) {
        user[key] = value;
      }
    }
    const updatedUser = await user.save();
    return responseHandler.successResponse(res, updatedUser, "Profile updated");
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshedToken = req.cookies.refreshToken;
    if (!refreshedToken) {
      return next(responseHandler.errorResponse("Refresh token is required"));
    }
    const verifyToken = jwt.verify(
      refreshedToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    );
    if (!verifyToken) {
      throw new Error("Invalid refresh token");
    }
    //find user in db
    const user = await User.findById(verifyToken.id).lean();
    if (!user) {
      return next(responseHandler.notFoundResponse("User not found"));
    }
    const getNewToken = sendToken(user);
    if (!getNewToken) {
      throw new Error("Failed to create new token");
    }
    //destructure accesstoken, refreshToken and cookieOptions from new token
    const {
      accessToken,
      refreshToken: newRefreshToken,
      cookieOptions,
    } = getNewToken;
    // Set the new refreshToken cookie - this is critical for mobile devices
    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    return responseHandler.successResponse(
      res,
      accessToken,
      "accesstoken refreshed",
      200
    );
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user.id;
  try {
    if (!avatar) {
      return responseHandler.errorResponse("No file received", 400);
    }
    //check if user has an avatar already
    const user = await User.findById(userId);
    const currentAvatar = user.avatar;
    const currentAvatarId = user.avatarId;
    if (currentAvatar) {
      //if avatar exisits, then  we delete so we can replace it
      await deleteFromCloudinary(currentAvatarId);
    }
    //replace with new image
    const { url, public_id } = await uploadToCloudinary(avatar, {
      folder: "laundrywash/avatars",
      width: 200,
      height: 200,
      crop: "fit",
    });
    user.avatar = url || user.avatar;
    user.avatarId = public_id || user.avatarId;
    await user.save();
    return responseHandler.successResponse(
      res,
      user,
      "Avatar upload successfull"
    );
  } catch (error) {
    next(error);
  }
};
