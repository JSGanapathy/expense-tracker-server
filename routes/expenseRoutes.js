/*
 *  Document    : expenseRoutes.js
 *  Author      : Ganapathy
 *  Description : Routes for expense management.
 */

// Import necessary modules
const express = require("express");
const router = express.Router();

// Import the controller for expense management
// This controller handles adding, retrieving, deleting, and downloading expenses
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
} = require("../controllers/expenseController");

// Import middleware for authentication
// This middleware protects routes by ensuring the user is authenticated
const { protect } = require("../middleware/authMiddleware");

// Define routes for expense management
router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.delete("/:id", protect, deleteExpense);
router.get("/download", protect, downloadExpenseExcel);

// Export the router to be used in the main app
module.exports = router;
