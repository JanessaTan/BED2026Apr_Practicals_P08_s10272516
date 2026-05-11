const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());

app.listen(port, async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }

  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");

  await sql.close();
  console.log("Database connection closed");
  process.exit(0);
});


// --- GET Routes  ---

// GET all students
app.get("/students", async (req, res) => {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT student_id, name, address FROM Students`;
    const request = connection.request();
    const result = await request.query(sqlQuery);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error in GET /students:", error);
    res.status(500).send("Error retrieving students");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
});

// GET student by ID
app.get("/students/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);
  if (isNaN(studentId)) {
    return res.status(400).send("Invalid student ID");
  }

  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT student_id, name, address FROM Students WHERE student_id = @id`;
    const request = connection.request();
    request.input("student_id", studentId);
    const result = await request.query(sqlQuery);

    if (!result.recordset[0]) {
      return res.status(404).send("Student not found");
    }
    res.json(result.recordset[0]);
  } catch (error) {
    console.error(`Error in GET /students/${studentId}:`, error);
    res.status(500).send("Error retrieving student");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
});


// --- POST Route  ---

// POST create new student
app.post("/students", async (req, res) => {
  const newStudentData = req.body;

  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const sqlQuery = `INSERT INTO Students (name, address) VALUES (@name, @address); SELECT SCOPE_IDENTITY() AS student_id;`;
    const request = connection.request();

    request.input("name", newStudentData.name);
    request.input("address", newStudentData.address);
    const result = await request.query(sqlQuery);

    const newStudentId = result.recordset[0].id;

    const getNewStudentQuery = `SELECT student_id, name, address FROM Students WHERE student_id = @id`;
    const getNewStudentRequest = connection.request();
    getNewStudentRequest.input("student_id", newStudentId);
    const newStudentResult = await getNewStudentRequest.query(getNewStudentQuery);

    res.status(201).json(newStudentResult.recordset[0]);
  } catch (error) {
    console.error("Error in POST /students:", error);

    res.status(500).send("Error creating student");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
});


// --- PUT ROUTE ---

// PUT update student by ID
app.put("/students/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);
  if (isNaN(studentId)) {
    return res.status(400).send("Invalid student ID");
  }
  const updateStudentData = req.body
  
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const sqlQuery = `UPDATE Students SET name = @name, address = @address WHERE student_id LIKE @id; SELECT SCOPE_IDENTITY() AS student_id;`;
    const idQuery = `SELECT student_id, name, address FROM Students WHERE student_id = @id`;
    const request = connection.request();
    request.input("student_id", studentId);

    request.input("name", updateStudentData.name);
    request.input("address", updateStudentData.address);
    const result = await request.query(sqlQuery);
    const idResult = await request.query(idQuery);

    if (!idResult.recordset[0]) {
      return res.status(404).send("Student not found");
    }

    const updateStudentId = result.recordset[0].id;

    const getUpdateStudentQuery = `SELECT student_id, name, address FROM Students WHERE student_id = @id`;
    const getUpdateStudentRequest = connection.request();
    getUpdateStudentRequest.input("student_id", updateStudentId);
    const updateStudentResult = await getUpdateStudentRequest.query(getUpdateStudentQuery);

    res.status(200).json(idResult.recordset[0]);
  } catch (error) {
    console.error("Error in PUT /students:", error);

    res.status(500).send("Error updating student");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
});


// --- DELETE ROUTE ---

// DELETE delete student by ID
app.delete("/students/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);
  if (isNaN(studentId)) {
    return res.status(400).send("Invalid student ID");
  }
  
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE Students WHERE student_id = @id`;
    const idQuery = `SELECT student_id, name, address FROM Students WHERE student_id = @id`;
    const request = connection.request();
    request.input("student_id", studentId);
    const idResult = await request.query(idQuery);

    if (!idResult.recordset[0]) {
      return res.status(404).send("Student not found");
    }
    const result = await request.query(sqlQuery);
    res.status(204).send("Student deleted.");
  } catch (error) {
    console.error("Error in DELETE /students:", error);

    res.status(500).send("Error deleting student");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
});