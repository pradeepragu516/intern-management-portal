const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");

// Generate certificate
router.post("/generate", certificateController.generateCertificate);

// Get certificates by student
router.get("/student/:studentId", certificateController.getCertificatesByStudentId);

// Get certificates by enrolled intern
router.get("/enrolled/:enrolledInternId", certificateController.getCertificatesByEnrolledId);

module.exports = router;