const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "employee", "student"],
    required: true
  },
  university : {
    type: String,
    required: function() {
      return this.role === "student";
    }
  },
  internsEnrolled: [{
    type: String,
    ref: "EnrolledIntern"
  }],
  company: {
    type: String,
    required: function() {
      return this.role === "employee";
    }
  },
  approved: {
    type: Boolean,
    default: false // for employee approval by admin
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);