const jsonServer = require("json-server");
const authRoutes = require("./auth/authRoutes");
const { authenticateToken } = require("./auth/authMiddleware");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Middleware to parse JSON bodies
server.use(jsonServer.bodyParser);
server.use(middlewares);

// Use authentication routes
server.use("/", authRoutes);

// Protected route example - moved from auth routes for demonstration
server.get("/auth/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Profile data",
    user: req.user,
  });
});

// Apply authentication middleware to specific routes (optional)
// Uncomment these lines if you want to protect these routes
// server.use("/api/posts", authenticateToken);
// server.use("/api/comments", authenticateToken);

// Use json-server router for other routes
server.use("/api", router);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server is running on http://localhost:${PORT}`);
  console.log("📋 Available routes:");
  console.log("  POST /login          - Login with username/password");
  console.log("  POST /register       - Register new user");
  console.log("  GET  /auth/profile   - Get user profile (requires token)");
  console.log("  GET  /api/users      - Get all users");
  console.log("  GET  /api/posts      - Get all posts");
  console.log("  GET  /api/comments   - Get all comments");
  console.log("");
  console.log("💡 Test credentials:");
  console.log("  Username: admin");
  console.log("  Password: 123123");
  console.log("  Username: user");
  console.log("  Password: 123123");
  console.log("");
  console.log("📁 Authentication files:");
  console.log("  auth/authController.js - Login/Register handlers");
  console.log("  auth/authMiddleware.js - JWT verification middleware");
  console.log("  auth/authUtils.js      - Helper functions");
  console.log("  auth/authRoutes.js     - Route definitions");
});
