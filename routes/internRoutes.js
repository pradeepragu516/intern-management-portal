const express = require("express");
const router = express.Router();

const internshipController = require("../controllers/internshipController");

// create internship
router.post("/internship/:employeeId", internshipController.createInternship);

// apply
router.post(
  "/apply/:internshipId/:studentId",
  internshipController.applyInternship
);

// approve
router.put(
  "/approve/:applicationId/:employeeId",
  internshipController.approveApplication
);

module.exports = router;