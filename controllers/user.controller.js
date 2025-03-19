import { ApiError, catchAsync } from "../middleware/error.middleware.js";
import { uploadMedia } from "../utils/cloudinary.js";
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
export const logoutUser = catchAsync(async (_, res) => {
  res.clearCookie("token").json({
    sucess: true,
    message: "User logged out successfully",
  });
});
//Get User Profile
export const getUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.id).populate({
    path: "enrolledCourses.course",
    select: "title thumbnail description",
  });
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  res.status(200).json({
    success: true,
    data: {
      ...user.toJSON(),
      totalEnrolledCourses: user.totalEnrolledCourses,
    },
  });
});
//Update User Profile
export const updateUserProfile = catchAsync(async (req, res) => {
  const { name, email, bio } = req.body;
  const updateData = {
    name,
    email: email.toLowerCase(),
    bio,
  };
  const user = await User.findById(req.id);
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  if (req.file) {
    const avatarResult = await uploadMedia(req.file.path);
    updateData.avatar = avatarResult.secure_url;
    //deleting the old image from cloudinary

    if (user.avatar && user.avatar !== process.env.DEFAULT_AVATAR) {
      await delteMediaFromCLoudinary(user.avatar);
    }
  }
  const updatedUser = await User.findByIdAndUpdate(req.id, updateData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});
