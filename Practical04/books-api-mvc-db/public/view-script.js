const bookDetailsDiv = document.getElementById("bookDetails");
const messageDiv = document.getElementById("message"); // Get reference to the message div
const apiBaseUrl = "http://localhost:3000";

// Function to get book ID from URL query parameter (e.g., edit.html?id=1)
function getBookIdFromUrl() {
  const params = new URLSearchParams(window.location.search); // Get URL query parameters
  return params.get("id"); // Return the value of the 'id' parameter
}

async function fetchBookData(bookId) {
  try {
    bookDetailsDiv.innerHTML = "Loading books..."; // Show loading state
    messageDiv.textContent = ""; // Clear any previous messages (assuming a message div exists or add one)

    // Make a GET request to the API endpoint for a specific book
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`);

    // Check if the HTTP response status is not OK (e.g., 404, 500)
    if (!response.ok) {
      // Attempt to read error body if available (assuming JSON), otherwise use status text
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      // Throw an error with status and message
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    // Parse the JSON response body into a JavaScript object
    const book = await response.json();
    // return book; // Return the fetched book object

    bookDetailsDiv.innerHTML = ""; // Clear loading message
    const bookIdFound = getBookIdFromUrl();
    if (!bookIdFound) {
        bookDetailsDiv.innerHTML = "<p>Book not found.</p>";
    } else {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-item");
        // Use data attributes or similar to store ID on the element if needed later
        bookElement.setAttribute("data-book-id", book.id);
        bookElement.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>ID: ${book.id}</p>`;
        bookDetailsDiv.appendChild(bookElement);
    }
  } catch (error) {
    console.error("Error fetching book data:", error);
    bookDetailsDiv.innerHTML = `<p style="color: red;">Failed to load books: ${error.message}</p>`;
    // return null; // Indicate that fetching failed
  }
}

const bookIdFound = getBookIdFromUrl();
fetchBookData(bookIdFound);