const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all books
async function getAllBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT id, title, author FROM Books";
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
    const query = "SELECT id, title, author FROM Books WHERE id = @id";
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

// Create new book
async function createBook(bookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "INSERT INTO Books (title, author) VALUES (@title, @author); SELECT SCOPE_IDENTITY() AS id;";
    const request = connection.request();
    request.input("title", bookData.title);
    request.input("author", bookData.author);
    const result = await request.query(query);

    const newBookId = result.recordset[0].id;
    return await getBookById(newBookId);
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

// update book
async function updateBook(id, updateBookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const sqlQuery = "UPDATE Books SET title = @title, author = @author WHERE id LIKE @id; SELECT SCOPE_IDENTITY() AS id;";
    const idQuery = "SELECT id, title, author FROM Books WHERE id = @id";
    const request = connection.request();
    request.input("id", id);

    request.input("title", updateBookData.title);
    request.input("author", updateBookData.author);
    const result = await request.query(sqlQuery);
    const idResult = await request.query(idQuery);

    const updatedBookId = result.recordset[0].id;
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
  createBook,
  updateBook
};