const User = require("../models/user");
const bcrypt = require("bcryptjs");

// CREATE ADMIN
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      approved: true
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SIGNUP (student / employee)
// NOTE: signup is handled by authController.register to avoid duplication

// APPROVE USER
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin cannot be approved" });
    }

    user.approved = true;
    await user.save();

    res.status(200).json({
      message: "User approved successfully",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET PENDING USERS
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      approved: false,
      role: { $in: ["student", "employer"] }
    });

    res.status(200).json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};