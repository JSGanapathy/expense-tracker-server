/*
 *  Document    : incomeRoutes.js
 *  Author      : Ganapathy
 *  Description : Routes for income management.
 */

// Import necessary modules
const express = require("express");
const router = express.Router();

// Import the controller for income management
const {
  addIncome,
  getIncomes,
  deleteIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");

// Import middleware for authentication
const { protect } = require("../middleware/authMiddleware");

// Define routes for income management
router.post("/add", protect, addIncome);
router.get("/get", protect, getIncomes);
router.delete("/:id", protect, deleteIncome);
router.get("/download", protect, downloadIncomeExcel);

// Export the router to be used in the main app
module.exports = router;
