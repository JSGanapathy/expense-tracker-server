/*
 *  Document    : expenseController.js
 *  Author      : Ganapathy
 *  Description : Expense controller for managing user expenses.
 */

// Import necessary modules
const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Controller to add a new expense entry
const addExpense = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is available in req.user
  const { icon, amount, category, date } = req.body;
  if (!amount || !category || !date) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    // Create a new expense entry
    const newExpense = new Expense({
      userId,
      icon,
      amount,
      category,
      date: new Date(date), // Ensure date is stored as a Date object
    });

    await newExpense.save();

    res.status(201).json({ message: "Expense added successfully", newExpense });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Controller to get all expenses for a user
const getAllExpense = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is available in req.user
  try {
    // Fetch all expenses for the user
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to delete an expense entry
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    // Find and delete the expense entry
    const deletedExpense = await Expense.findOneAndDelete({ _id: id });
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res
      .status(200)
      .json({ message: "Expense deleted successfully", deletedExpense });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to download expenses as an Excel file
const downloadExpenseExcel = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is available in req.user
  try {
    // Fetch all expenses for the user
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found" });
    }
    // Prepare data for Excel
    const data = expenses.map((expense) => ({
      Date: expense.date, // Format date as YYYY-MM-DD
      Category: expense.category,
      Amount: expense.amount,
    }));

    // Create a new workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");
    // Generate a buffer from the workbook
    xlsx.writeFile(wb, "expenses.xlsx");
    // Set headers for the response
    res.download("expenses.xlsx");
  } catch (error) {
    console.error("Error downloading expense Excel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export the controller functions
module.exports = {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
};
