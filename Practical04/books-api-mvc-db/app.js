const path = require("path");

const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");

dotenv.config(); // Loads environment variables from your .env file, making sensitive configuration available via process.env.

const bookController = require("./controllers/bookController");
const {
  validateBook,
  validateBookId,
} = require("./middlewares/bookValidation"); // import Book Validation Middleware

const userController = require("./controllers/userController"); // Note: Changed to userController for consistency

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware (Parsing request bodies)
// Middleware is applied using app.use() to handle incoming request bodies (express.json, express.urlencoded).
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// --- Serve static files from the 'public' directory ---
// When a request comes in for a static file (like /index.html, /styles.css, /script.js),
// Express will look for it in the 'public' folder relative to the project root.
app.use(express.static(path.join(__dirname, "public")));

// Routes for books
// Routes are defined using app.get, app.post, etc., mapping specific URL paths to the corresponding functions in the bookController.
// Apply middleware *before* the controller function for routes that need it
app.get("/books", bookController.getAllBooks);
app.get("/books/:id", validateBookId, bookController.getBookById); // Use validateBookId middleware
app.post("/books", validateBook, bookController.createBook); // Use validateBook middleware
// Add routes for PUT/DELETE if implemented, applying appropriate middleware
app.put("/books/:id", validateBookId, bookController.updateBook);
app.delete("/books/:id", validateBookId, bookController.deleteBook)

// Routes for users
app.get("/users", userController.getAllUsers); // Get all users
app.get("/users/:id", userController.getUserById); // Get user by ID
app.post("/users", userController.createUser); // Create user
app.put("/users/:id", userController.updateUser); // Update user
app.delete("/users/:id", userController.deleteUser); // Delete user

// Start web server on the configured port
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