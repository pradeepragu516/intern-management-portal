const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const internshipSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },

  enrolledInternId: {
    type: String,
    ref: "EnrolledIntern"
  },
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: String,

  // 🧑‍💼 Mode
  mode: {
    type: String,
    enum: ["online", "offline", "hybrid"],
    default: "online"
  },

  // 📍 Location
  location: {
    address: String,
    city: String,
    state: String,
    country: String
  },

  // 📅 Dates
  startDate: { type: Date, required: true },
  registerEndDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  // 💰 Stipend
  stipend: {
    type: Number,
    default: 0
  },

  // 🧠 Skills
  skillsRequired: [String],

  // 🎓 Eligibility
  eligibility: String,

  // 👥 Limits
  maxApplicants: Number,

  // 📊 COUNTERS (🔥 important)
  applicantsCount: {
    type: Number,
    default: 0
  },

  viewsCount: {
    type: Number,
    default: 0
  },

  // 📎 Optional: store application IDs (light reference only)
  applications: [{
    applicantId :{
    type: String,
    ref: "Application"
  },
  isApproved: {
    type: Boolean,
    default: false
  }

}],

  // 🔓 Visibility
  isActive: {
    type: Boolean,
    default: true
  },

  // 🔄 Status
  status: {
    type: String,
    enum: ["draft", "open", "closed", "completed"],
    default: "draft"
  },

  // 🏢 Owner
  postedBy: {
    type: String,
    ref: "User",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Internship", internshipSchema);