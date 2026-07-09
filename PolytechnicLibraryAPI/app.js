const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

const bookController = require("./controllers/bookController");

const {
  verifyJWT,
} = require("./middlewares/auth");

const userController = require("./controllers/userController");

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/books", verifyJWT, bookController.getAllBooks); // Get all books (members & librarians)
app.get("/books/:bookId", bookController.getBookById); // Get book by id
app.get("/users", userController.getAllUsers); // Get all users
app.get("/users/:username", userController.getUserByUsername); // Get user by id
app.put("/books/:bookId/availability", verifyJWT, bookController.updateBook); // Update book availability (Librarians only)
app.post("/register", userController.registerUser); // User registration
app.post("/login", userController.login); // Login (FIXED: must be public - this is what issues the JWT, so it can't require one)


// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
// Listen for termination signals (like Ctrl+C)
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Close any open connections
  await sql.close();
  console.log("Database connections closed");
  process.exit(0); // Exit the process
});