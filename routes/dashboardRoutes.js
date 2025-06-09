/*
 *  Document    : dashboardRoutes.js
 *  Author      : Ganapathy
 *  Description : Routes for user dashboardD.
 */

// import necessary modules
const express = require("express");
const router = express.Router();
// import middleware for authentication
const { protect } = require("../middleware/authMiddleware");
// import the controller for dashboard data
const { getDashboardData } = require("../controllers/dashboardController");

// Define the route for getting dashboard data
router.get("/", protect, getDashboardData);
// Export the router to be used in the main app
module.exports = router;
