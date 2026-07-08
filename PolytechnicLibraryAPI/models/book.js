const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all books
async function getAllBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT * FROM BooksTable";
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

// Get book by ID
async function getBookById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT * FROM BooksTable WHERE book_id = @id";
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // Book not found
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

// Update book
async function updateBook(id, updateBookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "UPDATE BooksTable SET availability = @availability WHERE book_id LIKE @id; SELECT SCOPE_IDENTITY() AS book_id;";
    const idQuery = "SELECT * FROM BooksTable WHERE book_id = @id";
    const request = connection.request();
    request.input("id", id);
    request.input("availability", updateBookData.availability);
    const result = await request.query(query);
    const idResult = await request.query(idQuery);

    if (idResult.recordset.length === 0) {
      return null; // Book not found
    }

    return await getBookById(id);
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
  getAllBooks,
  getBookById,
  updateBook
};