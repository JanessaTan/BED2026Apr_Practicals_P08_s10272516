// booksController.test.js

const booksController = require("../controllers/bookController");
const Book = require("../models/book");

// Mock the Book model
jest.mock("../models/book"); // Replace with the actual path to your Book model

describe("booksController.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = [
      { id: 1, title: "The Lord of the Rings" },
      { id: 2, title: "The Hitchhiker's Guide to the Galaxy" },
    ];

    // Mock the Book.getAllBooks function to return the mock data
    Book.getAllBooks.mockResolvedValue(mockBooks);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(), // Mock the res.json function
    };

    await booksController.getAllBooks(req, res);

    expect(Book.getAllBooks).toHaveBeenCalledTimes(1); // Check if getAllBooks was called
    expect(res.json).toHaveBeenCalledWith(mockBooks); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.getAllBooks.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await booksController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error retrieving books" });
  });
});

describe("booksController.updateBook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("should return 404 if the book does not exist", async () => {
    Book.getBookById.mockResolvedValue(null);

    const req = {
      params: { bookId: "99" },
      body: { availability: "Y" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await booksController.updateBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Book not found" });

    expect(Book.updateBook).not.toHaveBeenCalled();
  });


  it("should return 400 if availability is not 'Y' or 'N'", async () => {
    Book.getBookById.mockResolvedValue({
      book_id: 1,
      title: "Dune",
      author: "Frank Herbert",
      availability: "Y",
    });

    const req = {
      params: { bookId: "1" },
      body: { availability: "X" }, // invalid — must be 'Y' or 'N'
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await booksController.updateBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error: "Availability must be 'Y' or 'N'",});

    expect(Book.updateBook).not.toHaveBeenCalled();
  });


  it("should update the book and return 200 with the updated book", async () => {
    const existingBook = {
      book_id: 1,
      title: "Dune",
      author: "Frank Herbert",
      availability: "Y",
    };

    const updatedBook = { ...existingBook, availability: "N" };

    Book.getBookById.mockResolvedValue(existingBook);
    Book.updateBook.mockResolvedValue(updatedBook);

    const req = {
      params: { bookId: "1" },
      body: { availability: "N" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await booksController.updateBook(req, res);

    expect(Book.getBookById).toHaveBeenCalledWith(1);
    expect(Book.updateBook).toHaveBeenCalledWith(1, { availability: "N" });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedBook);
  });


  it("should return 500 if the model throws an unexpected error", async () => {
    Book.getBookById.mockResolvedValue({
      book_id: 1,
      title: "Dune",
      author: "Frank Herbert",
      availability: "Y",
    });
    Book.updateBook.mockRejectedValue(new Error("Database error"));

    const req = {
      params: { bookId: "1" },
      body: { availability: "N" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await booksController.updateBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error updating book" });
  });
});

