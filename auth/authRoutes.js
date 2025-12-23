const express = require("express");
const {
  login,
  register,
  getProfile,
  getUserInfo,
  updateAdminUser,
  getUsers,
  getUserById,
  createUser,
  createSender,
  changePassword,
  addSender,
  getSendersByDomain,
  searchDomains,
  getDomainById,
  getMails,
} = require("./authController");
const { authenticateToken, requireAnyRole } = require("./authMiddleware");

const router = express.Router();

// Public routes
router.post("/user/login", login);
router.post("/register", register);

// Protected routes
router.get("/profile", authenticateToken, getProfile);
router.get("/user/info", authenticateToken, getUserInfo);

// Admin update user
router.put(
  "/admin/user",
  authenticateToken,
  requireAnyRole(["admin", "ADMIN"]),
  updateAdminUser
);

// Admin create global sender
router.post(
  "/admin/sender",
  authenticateToken,
  requireAnyRole(["admin", "ADMIN"]),
  createSender
);

// Admin routes
router.get("/admin/user", getUsers);
router.post("/admin/user", createUser);
router.get("/admin/user/:id", getUserById);
router.put("/admin/user/change-password", changePassword);
router.post("/admin/user/add-sender", addSender);
router.get("/admin/sender/byDomain", getSendersByDomain);
router.get("/admin/domain/search", searchDomains);
router.get("/admin/domain/:id", getDomainById);
router.get("/mail", getMails);

module.exports = router;
