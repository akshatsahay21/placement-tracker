const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    jobRole: { type: String, required: true },
    description: { type: String },
    ctc: { type: Number, required: true },
    location: { type: String },
    deadline: { type: Date, required: true },
    eligibility: {
      minCgpa: { type: Number, default: 0 },
      allowedBranches: { type: [String], default: [] },
      maxBacklogs: { type: Number, default: 0 },
    },
    rounds: { type: [String], default: ["Aptitude", "Technical", "HR"] },
    status: {
      type: String,
      enum: ["upcoming", "active", "closed"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drive", driveSchema);