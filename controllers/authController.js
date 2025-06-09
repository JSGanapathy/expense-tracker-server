/*
 *  Document    : authController.js
 *  Author      : Ganapathy
 *  Description : Authentication controller for user registration and login.
 */

const User = require("../models/User"); // Assuming you have a User model defined
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

// Rigester User
const registerUser = async (req, res) => {
  const { fullname, email, password, profileImageUrl } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      fullname,
      email,
      password,
      profileImageUrl,
    });

    await newUser.save();

    // Generate a token
    const token = generateToken(newUser._id);

    res.status(201).json({ token: token, id: newUser._id, newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a token
    const token = generateToken(user._id);
    res.status(200).json({ token: token, id: user._id, user });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get User Info
const getUserInfo = async (req, res) => {
  const userId = req.user.id; // Assuming you have middleware to set req.user

  try {
    // Find user by ID
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Exporting the controller functions
module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  generateToken,
};
// Note: The above functions are placeholders and need to be implemented with actual logic for user registration, login, and fetching user information.
// The generateToken function is used to create a JWT token for the user after successful registration or login.
// The JWT_SECRET should be defined in your environment variables for security.
// Ensure to handle errors and validations in the actual implementation of these functions.
