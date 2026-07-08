const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

const bookController = require("./controllers/bookController");

const {
  registerUser,
} = require("./middlewares/userRegistration");
const {
  login,
} = require("./middlewares/userLogin");

const userController = require("./controllers/userController");

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/books", bookController.getAllBooks); // Get all books
app.get("/books/:bookId", bookController.getBookById);
app.put("/books/:bookId/availability", bookController.updateBook); // Update book availability (Librarians only)
app.post("/register", registerUser, userController.createUser); // User registration (DON'T IMPLEMENT YET)
// app.post("/login", userController.updateUser); // Login (DON'T IMPLEMENT YET)


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