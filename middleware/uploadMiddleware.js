/*
 *  Document    : uploadMiddleware.js
 *  Author      : Ganapathy
 *  Description : Middleware for handling file uploads.
 */

// Import necessary modules
const multer = require("multer");

// Config Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Unique filename
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."),
      false
    ); // Reject file
  }
};

const upload = multer({ storage, fileFilter });

// Export the upload middleware
module.exports = upload;
// This middleware can be used in routes to handle file uploads
