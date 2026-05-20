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
// --- Add other general middleware here (e.g., logging, security headers) ---

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