const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "24h";

// Read users from db.json
const getUsersDb = () => {
  const dbPath = path.join(__dirname, "../db.json");
  const dbData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  return dbData.users || [];
};

// Helper function to find user by username
const findUserByUsername = (username) => {
  const users = getUsersDb();
  return users.find((user) => user.username === username);
};

// Helper function to generate JWT token
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Helper function to save user to database
const saveUserToDb = (newUser) => {
  const dbPath = path.join(__dirname, "../db.json");
  const dbData = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  // Add user to database
  dbData.users.push(newUser);
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

  return newUser;
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  getUsersDb,
  findUserByUsername,
  generateToken,
  saveUserToDb,
};
