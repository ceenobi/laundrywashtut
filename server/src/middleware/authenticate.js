import responseHandler from "../utils/responseHandler.js";
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  let token;
  try {
    //check if token exists via req.headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    //return error if token does not exists
    if (!token) {
      return next(
        responseHandler.unauthorizedResponse(
          "Unauthorized, login to gain access"
        )
      );
    }
    try {
      //verify the token
      const verifyToken = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET_KEY
      );
      req.user = verifyToken;
      return next();
    } catch (error) {
      return next(
        responseHandler.unauthorizedResponse(
          "Unable to authenticate, log in to gain access"
        )
      );
    }
  } catch (error) {
    return next(error);
  }
};

//check user role

export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        responseHandler.forbiddenResponse(
          "You do not have required role to perform this action"
        )
      );
    }
    next(); //carry on with the task
  };
};
