const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all books
async function getAllBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig); // Connects to the database.
    // Executes a simple SELECT * query to retrieve all book records.
    const query = "SELECT id, title, author FROM Books";
    const result = await connection.request().query(query);
    return result.recordset; // Returns the result as an array of book objects (result.recordset).
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    // Ensure the connection is always closed (connection.close()), even if an error occurs during the query.
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
    connection = await sql.connect(dbConfig); // Connects to the database.
    // Retrieves a single book by its ID using a parameterized query.
    const query = "SELECT id, title, author FROM Books WHERE id = @id";
    const request = connection.request();
    request.input("id", id); // The @id parameter is safely added, preventing SQL injection.
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // Book not found
    }

    return result.recordset[0]; // Returns the book object if found
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
    connection = await sql.connect(dbConfig); // Connects to the database.
    // Inserts a new book using a parameterized query with @title and @author: INSERT INTO Books (title, author) VALUES (@title, @author);.
    // Includes SELECT SCOPE_IDENTITY() AS id; in the query to get the ID of the newly inserted row.
    const query = "INSERT INTO Books (title, author) VALUES (@title, @author); SELECT SCOPE_IDENTITY() AS id;";
    const request = connection.request();
    request.input("title", bookData.title);
    request.input("author", bookData.author);
    const result = await request.query(query);

    const newBookId = result.recordset[0].id;
    return await getBookById(newBookId); // Calls getBookById() to retrieve and return the full, newly created book record.
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
    const query = "UPDATE Books SET title = @title, author = @author WHERE id LIKE @id; SELECT SCOPE_IDENTITY() AS id;";
    const idQuery = "SELECT id, title, author FROM Books WHERE id = @id";
    const request = connection.request();
    request.input("id", id);
    request.input("title", updateBookData.title);
    request.input("author", updateBookData.author);
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

// Delete book
async function deleteBook(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "DELETE Books WHERE id = @id";
    const idQuery = "SELECT id, title, author FROM Books WHERE id = @id";
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
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};