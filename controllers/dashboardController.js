/*
 *  Document    : dashboardController.js
 *  Author      : Ganapathy
 *  Description : Dashboard controller for save, remove and fetching user-specific data.
 */

// import necessary modules
const Income = require("../models/Income");
const Expense = require("../models/Expense");

// Dashboard data controller
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user

    // Fetch total income
    const totalIncome = await Income.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Fetch total expenses
    const totalExpenses = await Expense.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    //    Get income transaction in the last 60 days
    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total income for last 60 days
    const incomesLast30days = last60DaysIncomeTransactions.reduce(
      (acc, income) => acc + income.amount,
      0
    );

    // Get expance transaction in the last 60 days
    const last60DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const expensesLast30days = last60DaysExpenseTransactions.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );

    // Fetch the last 5 transaction (incomes and expenses)
    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({ ...txn.toObject(), type: "income" })
      ),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({ ...txn.toObject(), type: "expense" })
      ),
    ].sort((a, b) => b.date - a.date); // Sort latest first

    // return the response
    res.status(200).json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      last30DaysExpenses: {
        total: expensesLast30days,
        transactions: last60DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomesLast30days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    // Log the error and send a response
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export the controller
module.exports = {
  getDashboardData,
};
