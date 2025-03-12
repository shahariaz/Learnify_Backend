const coursePurchaseSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Please provide a course"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user"],
  },
  amount: {
    type: Number,
    required: [true, "Please provide an amount"],
    min: [0, "Amount cannot be less than 0"],
  },
  currency: {
    type: String,
    required: [true, "Please provide a currency"],
    uppercase: true,
    default: "USD",
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "completed", "failed", "refunded"],
      message: "Please provide a valid status",
    },
    default: "pending",
  },
  paymentMethod: {
    type: String,
    required: [true, "Please provide a payment method"],
  },
  paymentId: {
    type: String,
    required: [true, "Please provide a payment ID"],
  },
  refundId: String,
  refundAmount: {
    type: Number,
    min: [0, "Amount cannot be less than 0"],
  },
  refundReason: {
    type: String,
    trim: true,
    maxLength: [200, "Refund reason cannot exceed 200 characters"],
  },
  metadata: {
    type: Map,
    of: String,
  },
});

coursePurchaseSchema.index({ user: 1, course: 1 }, { unique: true });
coursePurchaseSchema.index({ status: 1 });
coursePurchaseSchema.index({ createdAt: -1 });
coursePurchaseSchema.virtual("isRefundable").get(function () {
  if (this.status !== "completed") {
    return false;
  }
  const thirtyDaysAgo = new Date(Data.now() - 30 * 24 * 60 * 60 * 1000);
  return this.createdAt > thirtyDaysAgo;
});
//method to process refund
coursePurchaseSchema.methods.processRefund = async function (
  refundAmount,
  refundReason
) {
  this.status = "refunded";
  this.refundAmount = refundAmount;
  this.refundReason = refundReason;
  await this.save({ validateBeforeSave: false });
  return this;
};

export const CoursePurchase = mongoose.model(
  "CoursePurchase",
  coursePurchaseSchema
);
