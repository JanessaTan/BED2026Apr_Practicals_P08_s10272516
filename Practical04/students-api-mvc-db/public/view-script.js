const studentDetailsDiv = document.getElementById("studentDetails");
const messageDiv = document.getElementById("message"); // Get reference to the message div
const apiBaseUrl = "http://localhost:3000";

// Function to get student ID from URL query parameter (e.g., edit.html?id=1)
function getStudentIdFromUrl() {
  const params = new URLSearchParams(window.location.search); // Get URL query parameters
  return params.get("id"); // Return the value of the 'id' parameter
}

async function fetchStudentData(studentId) {
  try {
    studentDetailsDiv.innerHTML = "Loading students..."; // Show loading state
    messageDiv.textContent = ""; // Clear any previous messages (assuming a message div exists or add one)

    // Make a GET request to the API endpoint for a specific student
    const response = await fetch(`${apiBaseUrl}/students/${studentId}`);

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
    const student = await response.json();
    // return student; // Return the fetched student object

    studentDetailsDiv.innerHTML = ""; // Clear loading message
    const studentIdFound = getStudentIdFromUrl();
    if (!studentIdFound) {
        studentDetailsDiv.innerHTML = "<p>Student not found.</p>";
    } else {
        const studentElement = document.createElement("div");
        studentElement.classList.add("student-item");
        // Use data attributes or similar to store ID on the element if needed later
        studentElement.setAttribute("data-student-id", student.student_id);
        studentElement.innerHTML = `
                    <h3>${student.name}</h3>
                    <p>Author: ${student.address}</p>
                    <p>ID: ${student.student_id}</p>`;
        studentDetailsDiv.appendChild(studentElement);
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    studentDetailsDiv.innerHTML = `<p style="color: red;">Failed to load students: ${error.message}</p>`;
    // return null; // Indicate that fetching failed
  }
}

const studentIdFound = getStudentIdFromUrl();
fetchStudentData(studentIdFound);