const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all students
async function getAllStudents() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT student_id, name, address FROM Students";
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

// Get student by ID
async function getStudentById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT student_id, name, address FROM Students WHERE student_id = @id";
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // Student not found
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

// Create new student
async function createStudent(studentData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "INSERT INTO Students (name, address) VALUES (@name, @address); SELECT SCOPE_IDENTITY() AS student_id;";
    const request = connection.request();
    request.input("name", studentData.name);
    request.input("address", studentData.address);
    const result = await request.query(query);

    const newStudentId = result.recordset[0].student_id;
    return await getStudentById(newStudentId);
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

// Update student
async function updateStudent(id, updateStudentData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "UPDATE Students SET name = @name, address = @address WHERE student_id LIKE @id; SELECT SCOPE_IDENTITY() AS student_id;";
    const idQuery = "SELECT student_id, name, address FROM Students WHERE student_id = @id";
    const request = connection.request();
    request.input("id", id);
    request.input("name", updateStudentData.name);
    request.input("address", updateStudentData.address);
    const result = await request.query(query);
    const idResult = await request.query(idQuery);

    if (idResult.recordset.length === 0) {
      return null; // Student not found
    }

    return await getStudentById(id);
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

// Delete student
async function deleteStudent(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "DELETE Students WHERE student_id = @id";
    const idQuery = "SELECT student_id, name, address FROM Students WHERE student_id = @id";
    const request = connection.request();
    request.input("id", id);
    const idResult = await request.query(idQuery);
    const result = await request.query(query);
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
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};