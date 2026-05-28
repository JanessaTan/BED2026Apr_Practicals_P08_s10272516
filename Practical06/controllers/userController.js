const userModel = require("../models/userModel");

async function getUsersWithBooks(req, res) {
  try {
    const users = await userModel.getUsersWithBooks();
    res.json(users);
  } catch (error) {
    console.error("Controller error in getUsersWithBooks:", error);
    res.status(500).json({ message: "Error fetching users with books" });
  }
}

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
async function getUserById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving user" });
  }
}

// Create new user
async function createUser(req, res) {
  try {
    const newUser = await userModel.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
}

// Update user
async function updateUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const updateUserData = req.body

    const updatedUser = await userModel.updateUser(id, req.body);
    res.status(200).json(updateUserData);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating user" });
  } 
}

// Delete user
async function deleteUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    const userId = await userModel.getUserById(id);
    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await userModel.deleteUser(id);
    res.status(204).send("User deleted.");
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
}

async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    const users = await userModel.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error("Controller error in searchUsers:", error);
    res.status(500).json({ message: "Error searching users" });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  getUsersWithBooks
};