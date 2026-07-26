// book.test.js
const Book = require("../models/book");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
      {
        id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        id: 2,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        availability: "N",
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAllBooks();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(2);
    expect(books[0].id).toBe(1);
    expect(books[0].title).toBe("The Lord of the Rings");
    expect(books[0].author).toBe("J.R.R. Tolkien");
    expect(books[0].availability).toBe("Y");
    // ... Add assertions for the second book
    expect(books[1].id).toBe(2);
    expect(books[1].title).toBe("The Hitchhiker's Guide to the Galaxy");
    expect(books[1].author).toBe("Douglas Adams");
    expect(books[1].availability).toBe("N");
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });
});

// book.test.js (continue in the same file)
describe("Book.updateBook", () => {
    beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the availability of a book", async () => {
    // ... arrange: set up mock book data and mock database interaction
    const updatedBook = {
      book_id: 1,
      title: "Dune",
      author: "Frank Herbert",
      availability: "N",
    };

    const mockRequest = {
      query: jest.fn()
        .mockResolvedValueOnce({ recordset: [{ book_id: 1 }] }) // 1st call: UPDATE result
        .mockResolvedValueOnce({ recordset: [updatedBook] }) // 2nd call: idQuery result
        .mockResolvedValueOnce({ recordset: [updatedBook] }), // 3rd: getBookById's SELECT
      input: jest.fn().mockReturnThis(), // input() is chained, so must return `this`
    };

    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection);

    // ... act: call updateBook with the test data
    const result = await Book.updateBook(1, { availability: "N" });

    // ... assert: check if the database was updated correctly and the updated book is returned
    expect(sql.connect).toHaveBeenCalledTimes(2);
    expect(mockRequest.input).toHaveBeenCalledWith("id", 1);
    expect(mockRequest.input).toHaveBeenCalledWith("availability", "N");
    expect(mockRequest.query).toHaveBeenCalledTimes(3);
    expect(mockConnection.close).toHaveBeenCalledTimes(2);
    expect(result).toEqual(updatedBook);
  });

  it("should return null if book with the given id does not exist", async () => {
    // ... arrange: set up mocks for a non-existent book id
    const mockRequest = {
      query: jest.fn()
        .mockResolvedValueOnce({ recordset: [] }) // 1st call: UPDATE result (not used)
        .mockResolvedValueOnce({ recordset: [] }), // 2nd call: idQuery finds no row
      input: jest.fn().mockReturnThis(),
    };

    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection);

    // ... act: call updateBook
    const result = await Book.updateBook(99, { availability: "Y" });

    // ... assert: expect the function to return null
    expect(sql.connect).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  // Add more tests for error scenarios (e.g., database error)
  it("should throw an error if the database connection fails", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.updateBook(1, { availability: "N" })).rejects.toThrow(errorMessage);
    expect(sql.connect).toHaveBeenCalledTimes(1);
  });
});