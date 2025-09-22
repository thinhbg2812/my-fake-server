const express = require("express");
const { login, register, getProfile } = require("./authController");
const { authenticateToken } = require("./authMiddleware");

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected routes
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
