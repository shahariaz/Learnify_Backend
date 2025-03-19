import jwt from "jsonwebtoken";
import { catchAsync } from "./error.middleware.js";

export const isAuthenticated = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new ApiError("Please login to access this resource", 401);
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (error) {
    throw new ApiError("Invalid token. Please login again", 401);
  }
});

z.vnfv;
