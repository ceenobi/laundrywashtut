import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  globalErrorHandler,
  catchNotFoundRoute,
} from "./src/middleware/errorHandler.js";
import { rateLimiter } from "./src/middleware/rateLimit.js";

//import api routes
import userRoutes from "./src/routes/user.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

//initialize express
const app = express();
const httpServer = createServer(app);

//middlewares - functions that have access to the req, and res object, they can perform any task specified before the output is sent to the client.
//1 - request is received by the server
//2 - req is passed through the middleware specified
//3 - route handler processes the request
//4 - responses is sent back through the middleware
//5 - response is finally sent to the client
app.use(
  cors({
    origin: [
      "http://localhost:3800",
      "https://laundrywashtut-client.vercel.app",
    ],
    credentials: true, // allows cookies to be sent to client
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], //permitted http methods
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser()); //initialize cookies in app
app.use(express.json({ limit: "25mb" })); //parses our response body in a max size no greater than  25mb
app.use(express.urlencoded({ extended: true, limit: "25mb" })); //useful for getting large form submission in encoded format such as base64 strings
app.use(rateLimiter(100));
app.disable("x-powered-by"); //disables tech stack used when sending response to the client
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //morgan is used to log http requests to the terminal
}

//get request time when server is running
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//test api route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Server is running",
    environment: process.env.NODE_ENV,
    time: req.requestTime,
  });
});

//assemble api routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);

//handle app errors
app.use((req, res, next) => {
  return next(catchNotFoundRoute(req, res));
});
app.use((err, req, res, next) => {
  return next(globalErrorHandler(err, req, res));
});

//database connection
const connectOptions = {
  dbName: "LaundryWash",
  serverSelectionTimeoutMs:
    process.env.NODE_ENV === "development" ? 45000 : 10000, //max time to wait for server to be selected (45sec in dev or 10s in prod). If no server selection, a server timeoutn error is thrown
  socketTimeoutMs: 30000, //time before socket timeout due to inactivity, useful to avoid hanging connections
  retryWrites: true, //enables automatic retry of some write operations like insert or update a document
  retryReads: true, //enables automatic retry of read operations
  maxPoolSize: 100, //max num of connections in mongodb connection pool, it helps to manage concurrent requests
  minPoolSize: 1, // minimum num of connections maintained by mongodb pool
};
const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, connectOptions);
    console.log(`MongoDb Connected: ${conn.connection.host}`);
    //connection event handlers
    mongoose.connection.on("error", (err) => {
      console.error("MongoDb connection error", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDb disconnected");
    });
    //handle graceful shutdown
    const gracefulShutdown = async () => {
      await mongoose.connection.close();
      console.log("Mongodb connection closed via app termination");
      process.exit(0); //exit the node process
    };
    process.on("SIGINT", gracefulShutdown); //signal interruption ctrl + c
    process.on("SIGTERM", gracefulShutdown); //signal term
    return conn;
  } catch (error) {
    console.error("Mongodb connection failed", error.message);
    process.exit(1); //exit the process, 1 usually indicates error/failure
  }
};

//handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION, shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

//server configuration
const PORT = process.env.PORT || 3500;

const startServer = async () => {
  try {
    await connectToDb();
    const server = httpServer.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
    //handle promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION! shutting down...");
      console.error(err.name, err.message);
      //close server gracefully
      server.close(() => {
        console.log("Process terminated due to unhandled rejection");
      });
    });
    //handle graceful server shutdown
    const shutdown = async () => {
      console.log("Receiving shutdown signal. Closing server...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    };
    //handle termination signals
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

//start server
startServer();
