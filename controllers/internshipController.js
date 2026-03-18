const Internship = require("../models/internship");
const EnrolledIntern = require("../models/enrolledintern");
const Application = require("../models/application");


exports.createInternship = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const {
      title,
      description,
      mode,
      location,
      startDate,
      registerEndDate,
      endDate,
      stipend,
      skillsRequired,
      eligibility,
      maxApplicants
    } = req.body;

    // 1️⃣ Create internship FIRST
    const internship = await Internship.create({
      title,
      description,
      mode,
      location,
      startDate,
      registerEndDate,
      endDate,
      stipend,
      skillsRequired,
      eligibility,
      maxApplicants,
      postedBy: employeeId,
      status: "open"
    });

    // 2️⃣ Create enrolledIntern with valid internshipId
    const enrolledIntern = await EnrolledIntern.create({
      internshipId: internship._id,
      students: [],
      tasks: []
    });

    // 3️⃣ Update internship with enrolledInternId
    internship.enrolledInternId = enrolledIntern._id;
    await internship.save();

    res.status(201).json({
      message: "Internship created successfully",
      internship,
      enrolledIntern
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ APPLY INTERNSHIP
exports.applyInternship = async (req, res) => {
  try {
    const { internshipId, studentId } = req.params;

    const {
      resumeUrl,
      coverLetter,
      skills,
      academicDetails,
      links,
      personalInfo
    } = req.body;

    const existing = await Application.findOne({
      internshipId,
      studentId
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      studentId,
      internshipId,
      resumeUrl,
      coverLetter,
      skills,
      academicDetails,
      links,
      personalInfo
    });

    await Internship.findByIdAndUpdate(internshipId, {
      $inc: { applicantsCount: 1 },
      $push: {
        applications: {
          applicantId: application._id,
          isApproved: false
        }
      }
    });

    res.status(201).json({
      message: "Applied successfully",
      application
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ APPROVE APPLICATION + ENROLL
exports.approveApplication = async (req, res) => {
  try {
    const { applicationId, employeeId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status === "approved") {
      return res.status(400).json({ message: "Already approved" });
    }

    // 1️⃣ update application
    application.status = "approved";
    application.reviewedBy = employeeId;
    application.reviewedAt = new Date();
    await application.save();

    // 2️⃣ update internship
    const internship = await Internship.findById(application.internshipId);

    const appIndex = internship.applications.findIndex(
      (a) => a.applicantId.toString() === applicationId
    );

    if (appIndex !== -1) {
      internship.applications[appIndex].isApproved = true;
    }

    await internship.save();

    // 3️⃣ enroll student
    const enrolledIntern = await EnrolledIntern.findById(
      internship.enrolledInternId
    );

    const alreadyEnrolled = enrolledIntern.students.find(
      (s) => s.studentId.toString() === application.studentId.toString()
    );

    if (!alreadyEnrolled) {
      enrolledIntern.students.push({
        studentId: application.studentId,
        applicationId: application._id,
        progress: {
          completedTasks: 0,
          totalTasks: enrolledIntern.tasks.length,
          pendingTasks: enrolledIntern.tasks.length
        }
      });

      await enrolledIntern.save();
    }

    res.status(200).json({
      message: "Approved & Enrolled",
      application
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all internships (admin)
exports.listInternships = async (req, res) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    res.status(200).json({ internships });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List internships posted by an employer
exports.listByEmployer = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const internships = await Internship.find({ postedBy: employeeId }).sort({ createdAt: -1 });
    res.status(200).json({ internships });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single internship
exports.getInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findById(id);
    if (!internship) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ internship });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update internship
exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Internship.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ internship: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete internship
exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Internship.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    // Optionally remove enrolledIntern and applications here
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};