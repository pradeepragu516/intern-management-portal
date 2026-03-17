const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const certificateSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },

  studentId: {
    type: String,
    ref: "User",
    required: true
  },

  issuedBy: {
    type: String,
    ref: "User",
    required: true
  },

  internshipId: {
    type: String,
    ref: "Internship",
    required: true
  },

  enrolledInternId: {
    type: String,
    ref: "EnrolledIntern",
    required: true
  },

  // 📊 UPDATED Completion Snapshot
  completionDetails: {
    totalTasks: Number,
    completedTasks: Number,
    completionPercentage: Number,

    totalMarks: Number,        // ⭐ NEW
    averageMarks: Number       // ⭐ NEW
  },

  certificateUrl: String,

  status: {
    type: String,
    enum: ["pending", "issued", "revoked"],
    default: "pending"
  },

  issuedAt: Date,
  validTill: Date,
  remarks: String

}, { timestamps: true });

module.exports = mongoose.model("Certificate", certificateSchema);