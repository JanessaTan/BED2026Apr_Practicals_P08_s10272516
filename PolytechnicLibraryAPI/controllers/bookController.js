const bookModel = require("../models/book");

// Get all books
async function getAllBooks(req, res) {
  try {
    const books = await bookModel.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving books" });
  }
}

// Get book by ID
async function getBookById(req, res) {
  try {
    const id = parseInt(req.params.bookId);
    const book = await bookModel.getBookById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving book" });
  }
}

// Update book
async function updateBook(req, res) {
  try {
    const id = parseInt(req.params.bookId);
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


module.exports = {
  getAllBooks,
  getBookById,
  updateBook
};