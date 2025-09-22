const {
  findUserByUsername,
  generateToken,
  saveUserToDb,
} = require("./authUtils");

// Login controller
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: "username and password are required",
      });
    }

    // Find user
    const user = findUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // Verify password (using plain text comparison for simplicity)
    if (password !== user.password) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return success response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Register controller
const register = async (req, res) => {
  try {
    const { username, password, name } = req.body;

    // Validate input
    if (!username || !password || !name) {
      return res.status(400).json({
        error: "Username, password, and name are required",
      });
    }

    // Check if user already exists
    const existingUser = findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        error: "User with this username already exists",
      });
    }

    // Create new user
    const newUser = {
      id: Date.now(), // Simple ID generation
      username,
      password: password, // Using plain text for simplicity
      name,
      role: "user",
    };

    // Save user to database
    saveUserToDb(newUser);

    // Generate token
    const token = generateToken(newUser);

    // Return success response
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Get user profile controller
const getProfile = (req, res) => {
  res.json({
    message: "Profile data",
    user: req.user,
  });
};

module.exports = {
  login,
  register,
  getProfile,
};
