const bookModel = require("../models/bookModel"); // Imports the bookModel to delegate database operations to the Model layer.
/*
Each function (like getAllBooks, getBookById, createBook) is an async function designed to handle incoming Express requests, receiving the req (request) and res (response) objects.
These functions are responsible for:
- Processing incoming HTTP requests (e.g., extracting data from req.params or req.body).
- Calling the appropriate function in the bookModel to perform the required data operation.
- Handling the results returned by the Model or catching any errors thrown.
- Formatting the data and sending the final HTTP response back to the client using methods like res.status().json().
*/

// Get all books
async function getAllBooks(req, res) {
  try {
    const books = await bookModel.getAllBooks(); // Calls bookModel.getAllBooks() to fetch all book records from the database.
    res.json(books); // Sends the retrieved array of books as a JSON response with a default 200 OK status.
  } catch (error) {
    // Includes basic try...catch error handling to log database errors (propagated from the Model) and send a generic 500 Internal Server Error response.
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving books" });
  }
}

// Get book by ID
async function getBookById(req, res) {
  try {
    const id = parseInt(req.params.id); // Extracts the book ID from req.params.id and attempts to parse it as an integer.
    const book = await bookModel.getBookById(id); // Calls bookModel.getBookById(id) to fetch the specific book.
    if (!book) {
      // If the Model returns null (book not found), sends a 404 Not Found response.
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book); // If a book is found, sends the book object as a JSON response.
  } catch (error) {
    // Catches other errors and sends a 500 Internal Server Error.
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving book" });
  }
}

// Create new book
async function createBook(req, res) {
  try {
    const newBook = await bookModel.createBook(req.body); // Passes the request body (req.body) directly to bookModel.createBook() for insertion.
    res.status(201).json(newBook); // On successful creation (indicated by the Model returning the new book object), sends a 201 Created status code along with the new book data as a JSON response.
  } catch (error) {
    // Catches errors from the Model and sends a 500 Internal Server Error response.
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating book" });
  }
}

// Update book
async function updateBook(req, res) {
  try {
    const id = parseInt(req.params.id);
    const book = await bookModel.getBookById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    const updateBookData = req.body

    const updatedBook = await bookModel.updateBook(id, req.body);
    res.status(200).json(updateBookData);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating book" });
  } 
}

// Delete book
async function deleteBook(req, res) {
  try {
    const id = parseInt(req.params.id);
    const bookId = await bookModel.getBookById(id);
    if (!bookId) {
      return res.status(404).json({ error: "Book not found" });
    }

    const book = await bookModel.deleteBook(id);
    res.status(204).send("Book deleted.");
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting book" });
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};