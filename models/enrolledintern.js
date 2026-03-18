const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const enrolledInternSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },

  // 🔗 Internship Reference
  internshipId: {
    type: String,
    ref: "Internship",
    required: true
  },

  // 👥 All enrolled students
  students: [
    {
      studentId: {
        type: String,
        ref: "User"
      },

      applicationId: {
        type: String,
        ref: "Application"
      },

      joinedAt: {
        type: Date,
        default: Date.now
      },

      // 📊 Progress tracking per student
      progress: {
        completedTasks: {
          type: Number,
          default: 0
        },
        totalTasks: {
          type: Number,
          default: 0
        },
        pendingTasks: {
          type: Number,
          default: 0
        }
      },

      // 🎓 Completion status
      status: {
        type: String,
        enum: ["active", "completed", "dropped"],
        default: "active"
      }
    }
  ],

  // 📌 Tasks (same for all students)
  tasks: [
    {
      taskId: {
        type: String,
        default: uuidv4
      },

      title: {
        type: String,
        required: true
      },

      description: String,

      dueDate: Date,

      // 📊 Task tracking per student
      submissions: [
        {
          studentId: {
            type: String,
            ref: "User"
          },

          submissionUrl: String, // git repo or file link

          submittedAt: Date,

          status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
          },
          statusDoneBy: {
            type: String,
            ref: "User"//employee who approved/rejected
          },
          marks: Number,
          feedback: String
        }
      ]
    }
  ]

}, { timestamps: true });

module.exports = mongoose.models.EnrolledIntern || mongoose.model("EnrolledIntern", enrolledInternSchema);