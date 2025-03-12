import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please provide a description"],
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    videoUrl: {
      type: String,
      required: [true, "Please provide a video URL"],
    },
    duration: {
      type: String,
      default: 0,
    },
    publicId: {
      type: String,
      required: [true, "Please provide a public ID"],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: [true, "Please provide an order"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
lectureSchema.pre("save", async function (next) {
  if (this.duration) {
    this.duration = Math.round(this.duration * 100) / 100;
  }
});

export const Lecture = mongoose.model("Lecture", lectureSchema);
