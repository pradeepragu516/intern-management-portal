const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());

// =======================
// Routes
// =======================
const userRoutes = require("./routes/userRoutes");
const internRoutes = require("./routes/internRoutes");
const taskRoutes = require("./routes/taskRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

app.use("/api/users", userRoutes);
app.use("/api/interns", internRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/certificates", certificateRoutes);
// =======================
// Health Check Route
// =======================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// =======================
// MongoDB Connection
// =======================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // stop server if DB fails
});

// =======================
// Global Error Handler
// =======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message
  });
});

// =======================
// Server
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});