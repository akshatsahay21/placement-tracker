const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "selected", "rejected"],
      default: "applied",
    },
    currentRound: { type: String, default: "Applied" },
    offerLetterUrl: { type: String },
  },
  { timestamps: true }
);

applicationSchema.index({ drive: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);