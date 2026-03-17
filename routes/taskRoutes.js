const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// 👨‍💼 assign task
router.post(
  "/assign/:enrolledInternId/:employeeId",
  taskController.assignTask
);

// 🎓 submit task
router.post(
  "/submit/:enrolledInternId/:taskId/:studentId",
  taskController.submitTask
);

// 👨‍💼 review task
router.put(
  "/review/:enrolledInternId/:taskId/:studentId/:employeeId",
  taskController.reviewTask
);

module.exports = router;