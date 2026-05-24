const path = require("path");

const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

const studentController = require("./controllers/studentController");
const {
  validateStudent,
  validateStudentId,
} = require("./middlewares/studentValidation"); // import Student Validation Middleware

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware (Parsing request bodies)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// --- Serve static files from the 'public' directory ---
// When a request comes in for a static file (like /index.html, /styles.css, /script.js),
// Express will look for it in the 'public' folder relative to the project root.
app.use(express.static(path.join(__dirname, "public")));

// Routes for studentss
// Link specific URL paths to the corresponding controller functions
// Apply middleware *before* the controller function for routes that need it
app.get("/students", studentController.getAllStudents);
app.get("/students/:id", validateStudentId, studentController.getStudentById); // Use validateStudentId middleware
app.post("/students", validateStudent, studentController.createStudent); // Use validateStudent middleware

app.put("/students/:id", validateStudentId, studentController.updateStudent);
app.delete("/students/:id", validateStudentId, studentController.deleteStudent)


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