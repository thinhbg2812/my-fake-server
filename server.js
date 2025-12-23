const jsonServer = require("json-server");
const authRoutes = require("./auth/authRoutes");
const { authenticateToken } = require("./auth/authMiddleware");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Middleware to add 2-second delay to all requests
const delayMiddleware = (req, res, next) => {
  setTimeout(() => {
    next();
  }, 500); // 2 seconds delay
};

// Middleware to parse JSON bodies
server.use(jsonServer.bodyParser);
server.use(middlewares);
server.use(delayMiddleware);

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
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server is running on http://localhost:${PORT}`);
});
