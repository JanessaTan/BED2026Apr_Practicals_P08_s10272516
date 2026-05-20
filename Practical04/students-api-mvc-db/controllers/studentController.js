const studentModel = require("../models/studentModel");

// Get all students
async function getAllStudents(req, res) {
  try {
    const students = await studentModel.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving students" });
  }
}

// Get student by ID
async function getStudentById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const student = await studentModel.getStudentById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving student" });
  }
}

// Create new student
async function createStudent(req, res) {
  try {
    const newStudentData = req.body
    const newStudent = await studentModel.createStudent(req.body);
    res.status(201).json(newStudentData);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating student" });
  }
}

// Update student
async function updateStudent(req, res) {
  try {
    const id = parseInt(req.params.id);
    const student = await studentModel.getStudentById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const updateStudentData = req.body

    const updatedStudent = await studentModel.updateStudent(id, req.body);
    res.status(200).json(updateStudentData);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating student" });
  } 
}

// Delete student
async function deleteStudent(req, res) {
  try {
    const id = parseInt(req.params.id);
    const studentId = await studentModel.getStudentById(id);
    if (!studentId) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = await studentModel.deleteStudent(id);
    res.status(204).send("Student deleted.");
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting student" });
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};