const Certificate = require("../models/certificate");
const EnrolledIntern = require("../models/enrolledintern");

// 🔢 Calculate marks
const calculateMarks = (enrolledIntern, studentId) => {
  let totalMarks = 0;
  let count = 0;

  enrolledIntern.tasks.forEach(task => {
    task.submissions.forEach(sub => {
      if (
        sub.studentId.toString() === studentId &&
        sub.status === "approved" &&
        sub.marks !== undefined
      ) {
        totalMarks += sub.marks;
        count++;
      }
    });
  });

  return {
    totalMarks,
    averageMarks: count === 0 ? 0 : Math.round(totalMarks / count)
  };
};


// ✅ Generate Certificate (UPDATED WITH MARKS)
exports.generateCertificate = async (req, res) => {
  try {
    const { studentId, issuedBy, internshipId, enrolledInternId, remarks } = req.body;

    const enrolled = await EnrolledIntern.findById(enrolledInternId);

    if (!enrolled) {
      return res.status(404).json({ message: "Enrolled internship not found" });
    }

    const studentData = enrolled.students.find(
      (s) => s.studentId === studentId
    );

    if (!studentData) {
      return res.status(404).json({ message: "Student not enrolled" });
    }

    // 🎯 CHECK IF ALL TASKS APPROVED
    let approvedCount = 0;
    let totalTasks = enrolled.tasks.length;

    enrolled.tasks.forEach(task => {
      const submission = task.submissions.find(
        (s) => s.studentId.toString() === studentId && s.status === "approved"
      );

      if (submission) approvedCount++;
    });

    // 🔥 AUTO UPDATE STATUS
    if (approvedCount === totalTasks && totalTasks > 0) {
      studentData.status = "completed";
      studentData.progress.completedTasks = approvedCount;
      studentData.progress.totalTasks = totalTasks;
      studentData.progress.pendingTasks = 0;

      await enrolled.save();
    }

    // ❌ still not completed
    if (studentData.status !== "completed") {
      return res.status(400).json({
        message: "Complete all tasks before generating certificate"
      });
    }

    // 📊 Completion %
    const completionPercentage =
      totalTasks === 0 ? 0 : Math.round((approvedCount / totalTasks) * 100);

    // 🎯 MARKS
    const { totalMarks, averageMarks } = calculateMarks(enrolled, studentId);

    // 🚫 Prevent duplicate
    const existing = await Certificate.findOne({
      studentId,
      internshipId
    });

    if (existing) {
      return res.status(400).json({
        message: "Certificate already issued"
      });
    }

    // 🧾 Create certificate
    const certificate = new Certificate({
      studentId,
      issuedBy,
      internshipId,
      enrolledInternId,
      completionDetails: {
        totalTasks,
        completedTasks: approvedCount,
        completionPercentage,
        totalMarks,
        averageMarks
      },
      status: "issued",
      issuedAt: new Date(),
      remarks
    });

    await certificate.save();

    res.status(201).json({
      message: "Certificate generated successfully",
      certificate
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ View Certificates by Student
exports.getCertificatesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const certificates = await Certificate.find({ studentId })
      .populate("internshipId")
      .populate("issuedBy", "name email");

    res.status(200).json({
      count: certificates.length,
      certificates
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ View Certificates by EnrolledIntern
exports.getCertificatesByEnrolledId = async (req, res) => {
  try {
    const { enrolledInternId } = req.params;

    const certificates = await Certificate.find({ enrolledInternId })
      .populate("studentId", "name email")
      .populate("issuedBy", "name email");

    res.status(200).json({
      count: certificates.length,
      certificates
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};