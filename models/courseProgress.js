import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: [true, "Please provide a lecture"],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  watchTime: {
    type: Number,
    default: 0,
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now,
  },
});

const courseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course"],
    },
    lectureProgress: [lectureProgressSchema],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: [0, "Completion percentage cannot be less than 0"],
      max: [100, "Completion percentage cannot be more than 100"],
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseProgressSchema.pre("save", async function (next) {
  if (this.lectureProgress.length > 0) {
    const completedLectures = this.lectureProgress.filter(
      (lecture) => lecture.isCompleted
    ).length;
    this.completionPercentage = Math.round(
      (completedLectures / this.lectureProgress.length) * 100
    );
  }
  next();
});
//update last accessed
courseProgressSchema.method.updateLastAccessed = async function () {
  this.lastAccessedAt = Date.now();
  await this.save({ validateBeforeSave: false });
};
export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
