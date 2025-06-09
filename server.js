/*
 *  Document    : server.js
 *  Author      : Ganapathy
 *  Description : Main server file for the Expense Tracker application.
 */

// import necessary modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// import database connection
const connectDB = require("./config/db");

// import routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

// configure CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
// Define the port
const PORT = process.env.PORT || 5000;
// connect to the database
connectDB();

app.get("/", (req, res) => {
  res
    .status(501)
    .send({ message: "Cannot get / path try again later by Ganapathy." });
});

// define routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
