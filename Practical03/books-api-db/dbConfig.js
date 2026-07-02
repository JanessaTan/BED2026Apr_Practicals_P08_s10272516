// This file defines an object containing your database connection details.
module.exports = {
  user: "booksapi_user", // Replace with your SQL Server login username
  password: "STOPtheSlop", // Replace with your SQL Server login password
  server: "localhost",
  database: "bed_db",
  trustServerCertificate: true, // set to true for development purposes. In production environments, consider using a more secure approach for certificate validation.
  // options object specifies the port (default for SQL Server) and a connection timeout value.
  options: {
    port: 1433, // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
  },
};