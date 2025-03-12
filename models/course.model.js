import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    subtitle: {
      type: String,
      maxLength: [200, "Subtitle cannot exceed 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: {
        values: [
          "Web Development",
          "Mobile Development",
          "Data Science",
          "Machine Learning",
          "Artificial Intelligence",
          "Blockchain",
          "Cloud Computing",
          "Cyber Security",
        ],
        message: "Please select a valid category",
      },
    },
    level: {
      type: String,
      required: [true, "Please provide a level"],
      enum: {
        values: ["Beginner", "Intermediate", "Advanced"],
        message: "Please select a valid level",
      },
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: [0, "Price cannot be less than 0"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      required: [true, "Please provide a thumbnail"],
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
courseSchema.virtual("averageRating").get(function () {
  return this.ratings / this.enrolledStudents.length;
});

courseSchema.pre("save", async function (next) {
  if (this.lectures) {
    this.totalLectures = this.lectures.length;
  }
});

export const Course = mongoose.model("Course", courseSchema);
