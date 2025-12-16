//classes are like templates for creating javascript objects. They inherit the existing properies and are initialized with a constructor.
//a constructor is a method for creating and initializing an object instance of a class, while super keyword is used to call and invoke the parent class which then gives access to its properties and methods

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message); //invoke message to be passed
    this.statusCode = statusCode; //reference statusCode received from the error constuctor
    const statusCodeString = statusCode.toString();
    this.status = statusCodeString.startsWith("4") ? "fail" : "error";
    this.success = false; //this will always be false cos we are handling error response
    this.isOperational = true; //distinguish btw error types - such as server shutdown, or connection, validation, authentication  errors. These are are operational errors. But programmers such as bugs, syntax errors, or type errors should not be sent to the client.
  }
}

class ApiResponse {
  constructor(statusCode, data, message = "success") {
    this.statusCode = statusCode; //status code to be sent
    this.data = data; //api data containing response to be sent
    this.message = message; //message to be sent, default is success
    this.success = statusCode < 400; //auto sets success to boolean true if statuscode is less than 400
  }
}

const sendResponse = (res, statusCode, data = null, message = null) => {
  const response = new ApiResponse(statusCode, data, message);
  return res.status(statusCode).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
};

const successResponse = (
  res,
  data,
  message = "Request successful",
  statusCode = 200
) => {
  return sendResponse(res, statusCode, data, message);
};

const errorResponse = (message, statusCode = 500, data = null) => {
  return new AppError(message, statusCode, data);
};

const notFoundResponse = (message = "Resource not found") => {
  return errorResponse(message, 404);
};

const unauthorizedResponse = (message = "Unauthorized") => {
  return errorResponse(message, 401);
};

const forbiddenResponse = (message = "Forbidden") => {
  return errorResponse(message, 403);
};

export default {
  ApiResponse,
  sendResponse,
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
};
