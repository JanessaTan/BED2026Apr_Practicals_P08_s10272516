use bed_db
GO
/*
CREATE TABLE UsersTable (
  user_id INT PRIMARY KEY IDENTITY,
  username VARCHAR(255) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('member', 'librarian'))
);

CREATE TABLE BooksTable (
  book_id INT PRIMARY KEY IDENTITY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  availability CHAR(1) CHECK (availability IN ('Y', 'N'))
);

-- Insert sample users
INSERT INTO UsersTable (username, passwordHash, role)
VALUES
  ('user1', 'password', 'member'),
  ('user2', 'badpassword', 'librarian'),
  ('user3', 'sd309f48$ggg)@', 'member'),
  ('user4', 'G00DpassWoRd?', 'librarian');

-- Insert sample books
INSERT INTO BooksTable (title, author, availability)
VALUES
  ('To Kill a Mockingbird', 'Harper Lee', 'Y'),
  ('The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 'N'),
  ('Dune', 'Frank Herbert', 'Y'),
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'N'),
  ('The Lord of the Rings', 'J.R.R. Tolkien', 'N'),
  ('Pride and Prejudice', 'Jane Austen', 'Y');
*/
SELECT * FROM UsersTable
SELECT * FROM BooksTable