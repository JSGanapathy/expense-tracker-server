/*
 *  Document    : Income.js
 *  Author      : Ganapathy
 *  Description : Model for Income documents in MongoDB.
 */

// Import necessary modules
const mongoose = require("mongoose");
const { v4 } = require("uuid");

// Define the Income schema
// This schema defines the structure of the Income documents in MongoDB
const IncomeSchema = new mongoose.Schema(
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
    source: {
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

// Export the Income model
module.exports = mongoose.model("Income", IncomeSchema);
