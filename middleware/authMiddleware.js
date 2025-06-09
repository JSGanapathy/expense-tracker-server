/*
 *  Document    : authMiddleware.js
 *  Author      : Ganapathy
 *  Description : Middleware for protecting routes and verifying JWT tokens.
 */

// Import necessary modules
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes and verify JWT tokens
exports.protect = async (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];

  // Check if the token is in the Authorization header
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
