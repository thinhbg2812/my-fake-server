// Main auth module - exports all auth functionality
const authController = require("./authController");
const authMiddleware = require("./authMiddleware");
const authUtils = require("./authUtils");
const authRoutes = require("./authRoutes");

module.exports = {
  ...authController,
  ...authMiddleware,
  ...authUtils,
  authRoutes,
};
