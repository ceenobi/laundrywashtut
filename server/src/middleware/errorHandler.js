import responseHandler from "../utils/responseHandler.js";

//error handler for dev environment
const sendErrorDev = (err, res) => {
  const errResponse = {
    status: err.status || "error",
    message: err.message,
    stack: err.stack,
    error: {
      name: err.name,
      statusCode: err.statusCode,
      isOperational: err.isOperational,
    },
  };
  console.error("ERROR", err);
  res.status(err.statusCode || 500).json(errResponse);
};

//send error prod environment
const sendErrorProd = (err, res) => {
  //if isOperational is true, we send msg to client
  if (err.isOperational) {
    const errResponse = {
      status: err.status || "error",
      message: err.message,
    };
    return res.status(err.statusCode || 500).json(errResponse);
  }
  //programiing errors/unknown errors - dont send to client
  console.error("ERROR", err);
  return res.status(err.statusCode).json({
    status: "error",
    message: "Something went wrong",
  });
};

//handle jwt errors
const handleJWTError = () => {
  return responseHandler.unauthorizedResponse(
    "Invalid token. Please try again"
  );
};
const handleJWTExpiredError = () => {
  return responseHandler.unauthorizedResponse(
    "Your token has expired! Please log in to gain access"
  );
};

//global error middleware
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message, name: err.name };
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};

//catch 404 error routes
export const catchNotFoundRoute = (req, res) => {
  return responseHandler.notFoundResponse(
    `Cannot find ${req.originalUrl} on this server`
  );
};
