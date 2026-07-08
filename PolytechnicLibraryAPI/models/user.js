const sql = require("mssql");
const dbConfig = require("../dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Get all users
async function getAllUsers() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT * FROM UsersTable";
    const result = await connection.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Get user by ID
async function getUserByUsername(username) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT * FROM UsersTable WHERE username = @username";
    const request = connection.request();
    request.input("username", username);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // User not found
    }

    return result.recordset[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// User Registration and Password Hashing
async function registerUser(userData) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = "INSERT INTO UsersTable (username, password, role) VALUES (@username, @password, @role); SELECT SCOPE_IDENTITY() AS user_id;";
        const request = connection.request();
        request.input("username", userData.username);
        request.input("password", userData.password);
        request.input("role", userData.role);
        const result = await request.query(query);
    
        const newUsername = result.recordset[1];
        return await getUserByUsername(newUsername);
    } catch (error) {
        console.error("Database error:", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing connection:", err);
            }
        }
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
    // Retrieve user from DB
    const user = await getUserByUsername(username);
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
      id: user.id,
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