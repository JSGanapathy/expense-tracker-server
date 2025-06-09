/*
 *  Document    : Expense.js
 *  Author      : Ganapathy
 *  Description : Model for Expense documents in MongoDB.
 */

// Import necessary modules
const mongoose = require("mongoose");
const { v4 } = require("uuid");

// Define the Expense schema
// This schema defines the structure of the Expense documents in MongoDB
const ExpenseSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    icon: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Export the Expense model
module.exports = mongoose.model("Expense", ExpenseSchema);
