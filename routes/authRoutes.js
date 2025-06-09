/*
 *  Document    : authRoutes.js
 *  Author      : Ganapathy
 *  Description : Routes for user login and registration.
 */

// Import necessary modules
const express = require("express");
const router = express.Router();

// import middleware for authentication
const { protect } = require("../middleware/authMiddleware");

// Import the upload middleware for handling file uploads
const upload = require("../middleware/uploadMiddleware");

// Import the controller for user login and registration
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");

// Define routes for user login and registration
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// Define the route for uploading user profile images
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ imageUrl });
});

// Export the router to be used in the main app
module.exports = router;
