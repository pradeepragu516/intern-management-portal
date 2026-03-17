const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Admin
router.post("/admin/create", userController.createAdmin);

// Auth
router.post("/signup", userController.signup);

// Admin actions
router.put("/approve/:userId", userController.approveUser);
router.get("/pending", userController.getPendingUsers);

module.exports = router;