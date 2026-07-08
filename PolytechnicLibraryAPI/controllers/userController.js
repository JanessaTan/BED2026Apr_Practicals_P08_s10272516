const userModel = require("../models/user");

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

async function registerUser(req, res) {
    try {
    const register = await userModel.registerUser();
    res.json(register);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error registering user" });
  }
}

async function login(req, res) {
    try {
    const login = await userModel.login();
    res.json(login);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error logging in user" });
  }
}

module.exports = {
    getAllUsers,
    getUserByUsername,
    registerUser,
    login
};