import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
const app = express();
const PORT = process.env.PORT;

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

//Global Error Handler
app.use((err, _, res, __) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

//API Routes

// 404 Handler
app.use((_, res) => {
  res.status(404).json({
    status: "error",
    message: "The requested resource was not found",
  });
});
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
