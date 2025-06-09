/*
 *  Document    : incomeController.js
 *  Author      : Ganapathy
 *  Description : Income controller for managing user incomes.
 */

const Income = require("../models/Income"); // Assuming you have an Income model defined
const xlsx = require("xlsx");

// Controller to add a new income entry
const addIncome = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is available in req.user
  const { icon, amount, source, date } = req.body;
  if (!amount || !source || !date) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    // Create a new icon entry
    const newIncome = new Income({
      userId,
      icon,
      amount,
      source,
      date: new Date(date), // Ensure date is stored as a Date object
    });

    await newIncome.save();

    res.status(201).json({ message: "Income added successfully", newIncome });
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to get all incomes for a user
const getIncomes = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is available in req.user
  try {
    // Fetch all incomes for the user
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    res.status(200).json(incomes);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to delete an income entry
const deleteIncome = async (req, res) => {
  //   const userId = req.user._id; // Assuming user ID is available in req.user
  const { id } = req.params;
  try {
    // Find and delete the income entry
    const deletedIncome = await Income.findOneAndDelete({ _id: id });
    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }
    res
      .status(200)
      .json({ message: "Income deleted successfully", deletedIncome });
  } catch (error) {
    console.error("Error deleting income:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to download incomes as an Excel file
const downloadIncomeExcel = async (req, res) => {
  // const userId = req.user._id; // Assuming user ID is available in req.user
  // try {
  //   // Fetch all incomes for the user
  //   const incomes = await Income.find({ userId }).sort({ date: -1 });
  //   if (!incomes || incomes.length === 0) {
  //     return res.status(404).json({ message: "No incomes found" });
  //   }
  //   // Prepare data for Excel
  //   const data = incomes.map((income) => ({
  //     Date: income.date, // Format date as YYYY-MM-DD
  //     Source: income.source,
  //     Amount: income.amount,
  //   }));

  //   // Create a new workbook and worksheet
  //   const wb = xlsx.utils.book_new();
  //   const ws = xlsx.utils.json_to_sheet(data);
  //   xlsx.utils.book_append_sheet(wb, ws, "Incomes");
  //   // Generate a buffer from the workbook
  //   xlsx.writeFile(wb, "incomes.xlsx");
  //   // Set headers for the response
  //   res.download("incomes.xlsx");
  // } catch (error) {
  //   console.error("Error downloading income Excel:", error);
  //   res.status(500).json({ message: "Internal server error" });
  // }

  const userId = req.user._id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    if (!incomes || incomes.length === 0) {
      return res.status(404).json({ message: "No incomes found" });
    }

    const data = incomes.map((expense) => ({
      Date: expense.date.toISOString().split("T")[0],
      Category: expense.category,
      Amount: expense.amount,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Incomes");

    // ✅ Create in-memory buffer instead of writing to file system
    const buffer = xlsx.write(wb, {
      bookType: "xlsx",
      type: "buffer",
    });

    // ✅ Set headers and stream the buffer
    res.setHeader("Content-Disposition", "attachment; filename=incomes.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error downloading income Excel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export the controller functions
module.exports = {
  addIncome,
  getIncomes,
  deleteIncome,
  downloadIncomeExcel,
};
