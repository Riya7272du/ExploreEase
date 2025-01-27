const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./Controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "https://checkout.razorpay.com"],
//       connectSrc: ["'self'", "ws://127.0.0.1:*"],
//       fontSrc: ["'self'", "https://fonts.gstatic.com"],
//       styleSrc: ["'self'", "https://fonts.googleapis.com"],
//     },
//   })
// );

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const tourRouter = require("./Routes/tours");
const userRouter = require("./Routes/users");
const reviewRouter = require("./Routes/review");
const bookingRouter = require("./Routes/booking");
const viewRouter = require("./Routes/views");

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP.Please try agian after some time",
});
app.use("/api", limiter);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/", viewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
