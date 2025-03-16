import { ApiError, catchAsync } from "../middleware/error.middleware.js";
import { genarateToken } from "../utils/generateToken.js";
import { User } from "../models/user.model.js";
//Signup Function
export const createUserAccount = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
  });
  await user.updateLastActive();
  generateToken(res, user, "User created successfully");
});
//Login Function
export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError("Please provide email and password", 400);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError("Invalid credentials", 401);
  }
  await user.updateLastActive();
  generateToken(res, user, "User logged in successfully");
});
//Logout Function
export const logoutUser = catchAsync(async (req, res) => {
  res.clearCookie("token").json({
    sucess: true,
    message: "User logged out successfully",
  });
});
//Get User Profile
export const getUserProfile = catchAsync(async (req, res) => {});
