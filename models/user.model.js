import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      maxLength: [30, "Your name cannot exceed 30 characters"],
      trim: true,
      minLength: [5, "Your name should have at least 5 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: [6, "Your password should be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["student", "instructor", "admin"],
        message: "Please select a valid role",
      },
      default: "student",
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/df9jsefb9/image/upload/v1620166476/default-user-image.png",
    },
    bio: {
      type: String,
      maxLength: [200, "Your bio cannot exceed 200 characters"],
    },
    enrolledCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
