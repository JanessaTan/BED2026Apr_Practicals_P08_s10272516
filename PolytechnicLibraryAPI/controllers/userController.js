const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving users" });
  }
}

// Get user by ID
async function getUserByUsername(req, res) {
  try {
    const username = req.params.username;
    const user = await userModel.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving user" });
  }
}

// User Registration and Password Hashing
async function registerUser(req, res) {
  const { username, password, role } = req.body;
    // Basic validation
    if (!username || !password ||!role) {
      return res.status(400).json({ message: "Username, password and role are required" });
    }

    // Validate role
    if (role !== "member" && role !== "librarian") {
      return res.status(400).json({ message: "Role must be either 'member' or 'librarian'" });
    }

    // Password strength
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
  
    try {
      // Check for existing username
      const existingUser = await userModel.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create user in database (FIXED: pass the hashed password, not the plaintext one)
      const newUser = await userModel.registerUser({
        username,
        password: hashedPassword,
        role,
      });

      return res.status(201).json({
        message: "User created successfully",
        user: { username: newUser.username, role: newUser.role },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
}

// JWT Token Generation during Login
async function login(req, res) {
  const { username, password } = req.body;
    
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"})
    }
  
    try {
      // Retrieve user from DB (FIXED: call the model function, not the local
      // controller handler of the same name, which expects (req, res) params)
      const user = await userModel.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Compare password with hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const payload = {
        id: user.user_id, // FIXED: DB column is user_id, not id
        role: user.role,
      };
      const token = jwt.sign(payload, "your_secret_key", { expiresIn: "3600s" }); // Expires in 1 hour
  
      return res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getAllUsers,
    getUserByUsername,
    registerUser,
    login
};