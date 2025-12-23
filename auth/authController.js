const {
  findUserByUsername,
  generateToken,
  saveUserToDb,
  getAllUsers,
  findUserById,
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

    // Hardcoded credentials - only accept these 2 accounts
    const validCredentials = {
      admin: {
        id: 1,
        username: "admin",
        name: "Admin User",
        role: "admin",
        senders: null,
      },
      user: {
        id: 2,
        username: "user",
        name: "Regular User",
        role: "user",
        senders: null,
      },
    };

    // Check if credentials match hardcoded accounts
    if (username === "admin" && password === "123123") {
      const user = validCredentials.admin;
      const token = generateToken(user);

      return res.json({
        message: "Login successful",
        jwt: token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: "ADMIN",
          senders: user.senders,
          createdAt: new Date().toISOString(),
        },
        payload: {
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            senders: user.senders,
          },
          token: token,
          expiresIn: "24h",
        },
      });
    } else if (username === "user" && password === "123123") {
      const user = validCredentials.user;
      const token = generateToken(user);

      return res.json({
        message: "Login successful",
        jwt: token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: "USER",
          senders: user.senders,
          createdAt: new Date().toISOString(),
        },
        payload: {
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            senders: user.senders,
          },
          token: token,
          expiresIn: "24h",
        },
      });
    } else {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }
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

// Get user info controller (returns specified public fields)
const getUserInfo = (req, res) => {
  try {
    const user = req.user || {};
    const { id, username, name, role } = user;

    // Try to get email from DB user record if present
    const dbUser = findUserById(id);
    const emailFromDb = dbUser && dbUser.email ? String(dbUser.email) : null;

    const email =
      emailFromDb || (username ? `${username}@example.com` : "");

    res.status(200).json({
      role: String(role ?? ""),
      id: String(id ?? ""),
      fullname: String(name ?? ""),
      email: String(email ?? ""),
      username: String(username ?? ""),
    });
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
// Admin get users controller with pagination
const getUsers = (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const index = (page - 1) * limit;

    // Get all users
    const allUsers = getAllUsers();

    // Apply pagination
    const users = allUsers.slice(index, index + limit);

    // Remove password from response for security
    const sanitizedUsersOrigin = users.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      senders: user.senders,
    }));
    const sanitizedUsers = sanitizedUsersOrigin
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin)
      .concat(sanitizedUsersOrigin);

    const total = sanitizedUsers.length;

    // Return paginated response
    res.json({
      page,
      index,
      total,
      users: sanitizedUsers,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

/**
 * @typedef {Object} Sender
 * @property {string} id
 * @property {string} createdAt
 * @property {string} senderMail
 * @property {boolean} status
 * @property {string} domain
 */

// Admin get user by ID controller
const getUserById = (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const user = findUserById(id);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Prepare senders array - normalize to Sender type
    /** @type {Sender[]} */
    const simplifiedSenders = (user.senders || []).map((sender) => ({
      id: String(sender.id ?? ""),
      createdAt: String(sender.createdAt ?? ""),
      senderMail: String(sender.senderMail ?? ""),
      status: Boolean(sender.status ?? false),
      domain: String(sender.domain ?? ""),
    }));

    // Return user data in the specified format
    res.json({
      id: user.id.toString(),
      role: user.role.toUpperCase(),
      username: user.username,
      senders: simplifiedSenders,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Admin create user controller
const createUser = (req, res) => {
  try {
    const { username, role, password } = req.body;

    // Validate required fields
    if (!username || !role || !password) {
      return res.status(400).json({
        error: "Username, role, and password are required",
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
      name: username, // Use username as name since name is not in payload
      role,
      senders: null,
    };

    // Save user to database
    saveUserToDb(newUser);

    // Return success response with specified format
    res.status(200).json({
      id: newUser.id.toString(),
      username: newUser.username,
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Admin change password controller
const changePassword = (req, res) => {
  try {
    const { userId, password } = req.body;

    // Validate required fields
    if (!userId || !password) {
      return res.status(400).json({
        error: "UserId and password are required",
      });
    }

    // Find user by ID
    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Update password in database
    const dbPath = require("path").join(__dirname, "../db.json");
    const fs = require("fs");
    const dbData = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    // Find and update the user
    const userIndex = dbData.users.findIndex((u) => u.id === parseInt(userId));
    if (userIndex !== -1) {
      dbData.users[userIndex].password = password;
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    }

    // Return success response
    res.status(200).json({
      status: true,
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Admin add sender to user controller
const addSender = (req, res) => {
  try {
    const { userId, senderId } = req.body;

    // Validate required fields
    if (!userId || !senderId) {
      return res.status(400).json({
        error: "UserId and senderId are required",
      });
    }

    // Find user by ID
    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Create new sender object with sample data
    const newSender = {
      id: senderId,
      senderMail: `${senderId}@example.com`,
      status: true,
      domain:
        "loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update user's senders in database
    const dbPath = require("path").join(__dirname, "../db.json");
    const fs = require("fs");
    const dbData = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    // Find and update the user
    const userIndex = dbData.users.findIndex((u) => u.id === parseInt(userId));
    if (userIndex !== -1) {
      // Initialize senders array if null
      if (!dbData.users[userIndex].senders) {
        dbData.users[userIndex].senders = [];
      }

      // Check if sender already exists
      const existingSender = dbData.users[userIndex].senders.find(
        (s) => s.id === senderId
      );
      if (existingSender) {
        return res.status(409).json({
          error: "Sender already exists for this user",
        });
      }

      // Add new sender
      dbData.users[userIndex].senders.push(newSender);
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    }

    // Get updated senders list
    const updatedUser = findUserById(userId);
    const senders = updatedUser.senders || [];

    // Return success response with specified format
    res.status(200).json({
      userId: userId,
      senders: senders.map((sender) => ({
        id: sender.id,
        senderMail: sender.senderMail,
        status: sender.status,
        domain: sender.domain,
      })),
    });
  } catch (error) {
    console.error("Add sender error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Admin update user controller (update role, fullname, email by id)
const updateAdminUser = (req, res) => {
  try {
    const { id, role, fullname, email } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const dbPath = require("path").join(__dirname, "../db.json");
    const fs = require("fs");
    const dbData = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    const userIndex = dbData.users.findIndex((u) => String(u.id) === String(id));
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update allowed fields
    if (typeof role !== "undefined") dbData.users[userIndex].role = role;
    if (typeof fullname !== "undefined") dbData.users[userIndex].name = fullname;
    if (typeof email !== "undefined") dbData.users[userIndex].email = email;

    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error("Update admin user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Admin create global sender controller
const createSender = (req, res) => {
  try {
    const { sender, status } = req.body;

    if (!sender) {
      return res.status(400).json({ error: "sender is required" });
    }

    const dbPath = require("path").join(__dirname, "../db.json");
    const fs = require("fs");
    const dbData = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    // Ensure senders array exists at top level
    if (!Array.isArray(dbData.senders)) {
      dbData.senders = [];
    }

    // Prevent duplicate sender id
    const existing = dbData.senders.find((s) => String(s.id) === String(sender));
    if (existing) {
      return res.status(409).json({ status: false, error: "Sender already exists" });
    }

    const newSender = {
      id: String(sender),
      senderMail: String(sender).includes("@") ? String(sender) : `${String(sender)}@example.com`,
      status: Boolean(status === true),
      domain: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbData.senders.push(newSender);
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    return res.status(200).json({ status: true });
  } catch (error) {
    console.error("Create sender error:", error);
    return res.status(500).json({ status: false, error: "Internal server error" });
  }
};

// Admin get senders by domain controller
const getSendersByDomain = (req, res) => {
  try {
    const { domainId, size = 10, index = 0 } = req.query;

    // Validate required fields
    if (!domainId) {
      return res.status(400).json({
        error: "domainId is required",
      });
    }

    // Get all users and collect senders
    const allUsers = getAllUsers();
    let allSenders = [];

    // Collect all senders from all users
    allUsers.forEach((user) => {
      if (user.senders && Array.isArray(user.senders)) {
        user.senders.forEach((sender) => {
          allSenders.push({
            id: sender.id,
            sender: sender.id, // Using sender.id as sender name
            domain: sender.domain,
            email: sender.senderMail,
          });
        });
      }
    });

    // Filter by domain
    const filteredSenders = allSenders.filter(
      (sender) => sender.domain === domainId
    );

    // Apply pagination
    const startIndex = parseInt(index);
    const pageSize = parseInt(size);
    const paginatedSenders = filteredSenders.slice(
      startIndex,
      startIndex + pageSize
    );

    // Return response in specified format
    res.status(200).json({
      index: startIndex,
      total: filteredSenders.length,
      senders: paginatedSenders,
    });
  } catch (error) {
    console.error("Get senders by domain error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Admin search domains controller
const searchDomains = (req, res) => {
  try {
    const { size = 10, index = 0 } = req.query;

    // Get all users and collect unique domains
    const allUsers = getAllUsers();
    const domainMap = new Map();

    // Collect all unique domains from all users' senders
    allUsers.forEach((user) => {
      if (user.senders && Array.isArray(user.senders)) {
        user.senders.forEach((sender) => {
          if (sender.domain) {
            if (!domainMap.has(sender.domain)) {
              domainMap.set(sender.domain, {
                id: sender.domain,
                domainName: sender.domain,
                status: sender.status || true, // Use sender status or default to true
              });
            }
          }
        });
      }
    });

    // Convert map to array
    const allDomains = Array.from(domainMap.values());

    // Apply pagination
    const startIndex = parseInt(index);
    const pageSize = parseInt(size);
    const paginatedDomains = allDomains.slice(
      startIndex,
      startIndex + pageSize
    );

    // Return response in specified format
    res.status(200).json({
      index: startIndex,
      size: pageSize,
      total: allDomains.length,
      domains: paginatedDomains,
    });
  } catch (error) {
    console.error("Search domains error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Admin get domain by ID controller
const getDomainById = (req, res) => {
  try {
    const { id } = req.params;

    // Validate required parameter
    if (!id) {
      return res.status(400).json({
        error: "Domain ID is required",
      });
    }

    // Get all users and find the domain
    const allUsers = getAllUsers();
    let foundDomain = null;

    // Search for the domain in all users' senders
    allUsers.forEach((user) => {
      if (user.senders && Array.isArray(user.senders)) {
        user.senders.forEach((sender) => {
          if (sender.domain === id) {
            foundDomain = {
              id: sender.domain,
              domainname: sender.domain,
              status: sender.status || true,
            };
          }
        });
      }
    });

    // Check if domain was found
    if (!foundDomain) {
      return res.status(404).json({
        error: "Domain not found",
      });
    }

    // Return response in specified format
    res.status(200).json(foundDomain);
  } catch (error) {
    console.error("Get domain by ID error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Get mails controller
const getMails = (req, res) => {
  try {
    const { size = 10, index = 0 } = req.query;

    const dbPath = require("path").join(__dirname, "../db.json");
    const fs = require("fs");
    const dbData = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    const comments = Array.isArray(dbData.comments) ? dbData.comments : [];

    const allMails = comments.map((c) => ({
      id: String(c.id),
      messageId: String(c.id),
      content: String(c.content ?? ""),
    }));

    const startIndex = parseInt(index);
    const pageSize = parseInt(size);
    const paginated = allMails.slice(startIndex, startIndex + pageSize);

    res.status(200).json({
      index: startIndex,
      total: allMails.length,
      mails: paginated,
    });
  } catch (error) {
    console.error("Get mails error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = {
  login,
  register,
  getProfile,
  getUserInfo,
  updateAdminUser,
  createSender,
  getUsers,
  getUserById,
  createUser,
  changePassword,
  addSender,
  getSendersByDomain,
  searchDomains,
  getDomainById,
  getMails,
};
