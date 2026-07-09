const sql = require("mssql");
const dbConfig = require("../dbConfig");

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

// User Registration (persists a pre-hashed password; hashing happens in the controller)
async function registerUser(userData) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = "INSERT INTO UsersTable (username, password, role) VALUES (@username, @password, @role); SELECT SCOPE_IDENTITY() AS user_id;";
        const request = connection.request();
        request.input("username", userData.username);
        request.input("password", userData.password);
        request.input("role", userData.role);
        await request.query(query);

        // FIXED: fetch the newly created user directly by username instead of
        // trying to read a non-existent second row from the recordset
        return await getUserByUsername(userData.username);
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

module.exports = {
    getAllUsers,
    getUserByUsername,
    registerUser
};