const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const applicationSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },

  // 👤 References
  studentId: {
    type: String,
    ref: "User",
    required: true
  },

  internshipId: {
    type: String,
    ref: "Internship",
    required: true
  },

  // 📄 Resume
  resumeUrl: {
    type: String,
    required: true
  },

  // 📝 Cover Letter
  coverLetter: {
    type: String
  },

  // 🧠 Skills (snapshot at time of applying)
  skills: [{
    type: String
  }],

  // 🎓 Academic Details
  academicDetails: {
    university: String,
    degree: String,
    branch: String,
    year: Number,         // e.g., 3rd year
    cgpa: Number
  },

  // 🔗 Links / Portfolio
  links: {
    linkedin: String,
    github: String,
    portfolio: String,
    other: [String]
  },

  // 📞 Personal Info Snapshot (important!)
  personalInfo: {
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String
  },

  // 📊 Status Tracking
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  // 👨‍💼 Reviewed by Employee
  reviewedBy: {
    type: String,
    ref: "User"
  },

  reviewedAt: Date,

  // 📝 Feedback from Employer
  feedback: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);