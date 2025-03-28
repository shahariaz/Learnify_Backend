import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import healtCheckRoute from "./routes/health.route.js";
import dbConnection from "./database/db.js";
const app = express();

const PORT = process.env.PORT;

//Global Rate Limiting
const Limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again in 15 minutes",
});
//Security Middleware
app.use("/api", Limiter);
app.use(helmet());
app.use(hpp());

app.get("/", (req, res) => {
  res.send("Welcome to the home page");
});

//Loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Body Parser Middleware
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());
//Global Error Handler
app.use((err, _, res, __) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});
//Cors Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "X-HTTP-Method-Override",
      "device-remember-token",
      "Access-Control-Allow-Origin",
    ],
  })
);

//API Routes
app.use("/api/v1", healtCheckRoute);
app.use("/api/v1", userRoute);

// 404 Handler
app.use((_, res) => {
  res.status(404).json({
    status: "error",
    message: "The requested resource was not found",
  });
});
app.listen(PORT, () => {
  dbConnection();
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
