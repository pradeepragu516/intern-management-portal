const EnrolledIntern = require("../models/enrolledintern");
const Internship = require("../models/internship");


// ✅ 1. ASSIGN TASK (EMPLOYEE)
exports.assignTask = async (req, res) => {
  try {
    const { enrolledInternId, employeeId } = req.params;
    const { title, description, dueDate } = req.body;

    const enrolledIntern = await EnrolledIntern.findById(enrolledInternId);
    if (!enrolledIntern) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🔐 check employee owns internship
    const internship = await Internship.findById(enrolledIntern.internshipId);

    if (internship.postedBy.toString() !== employeeId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ➕ add task
    enrolledIntern.tasks.push({
      title,
      description,
      dueDate
    });

    // 📊 update all students progress
    enrolledIntern.students.forEach((student) => {
      student.progress.totalTasks += 1;
      student.progress.pendingTasks += 1;
    });

    await enrolledIntern.save();

    res.status(200).json({
      message: "Task assigned",
      tasks: enrolledIntern.tasks
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ 2. SUBMIT TASK (STUDENT)
exports.submitTask = async (req, res) => {
  try {
    const { enrolledInternId, taskId, studentId } = req.params;
    const { submissionUrl } = req.body;

    const enrolledIntern = await EnrolledIntern.findById(enrolledInternId);
    if (!enrolledIntern) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🔍 find task
    const task = enrolledIntern.tasks.find(
      (t) => t.taskId === taskId
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔐 check student enrolled
    const student = enrolledIntern.students.find(
      (s) => s.studentId.toString() === studentId
    );

    if (!student) {
      return res.status(403).json({ message: "Not enrolled" });
    }

    // 🚫 prevent duplicate submission
    const alreadySubmitted = task.submissions.find(
      (s) => s.studentId.toString() === studentId
    );

    if (alreadySubmitted) {
      return res.status(400).json({ message: "Already submitted" });
    }

    // ➕ add submission
    task.submissions.push({
      studentId,
      submissionUrl,
      submittedAt: new Date()
    });

    await enrolledIntern.save();

    res.status(200).json({
      message: "Task submitted"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.reviewTask = async (req, res) => {
  try {
    const { enrolledInternId, taskId, studentId, employeeId } = req.params;
    const { status, feedback, marks } = req.body; // 👈 ADD marks

    const enrolledIntern = await EnrolledIntern.findById(enrolledInternId);
    if (!enrolledIntern) {
      return res.status(404).json({ message: "Not found" });
    }

    const internship = await Internship.findById(enrolledIntern.internshipId);

    if (internship.postedBy.toString() !== employeeId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const task = enrolledIntern.tasks.find(
      (t) => t.taskId === taskId
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const submission = task.submissions.find(
      (s) => s.studentId.toString() === studentId
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // ✅ update submission
    submission.status = status;
    submission.statusDoneBy = employeeId;
    submission.feedback = feedback;
    submission.marks = marks; // ⭐ NEW

    // 📊 update progress
    const student = enrolledIntern.students.find(
      (s) => s.studentId.toString() === studentId
    );

    if (status === "approved") {
      student.progress.completedTasks += 1;
      student.progress.pendingTasks -= 1;
    }

    await enrolledIntern.save();

    res.status(200).json({
      message: "Task reviewed",
      submission
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};