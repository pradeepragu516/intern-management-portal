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

// list all internships (admin)
router.get("/", internshipController.listInternships);

// list by employer
router.get("/employee/:employeeId", internshipController.listByEmployer);

// single
router.get("/:id", internshipController.getInternship);

// update
router.put("/:id", internshipController.updateInternship);

// delete
router.delete("/:id", internshipController.deleteInternship);

module.exports = router;