use bed_db
GO
/*
CREATE TABLE Books (
  id INT IDENTITY(1,1) PRIMARY KEY,
  title VARCHAR(50) NOT NULL UNIQUE, -- Title is required and unique (cannot be NULL)
  author VARCHAR(50) NOT NULL -- Author is required (cannot be NULL)
);

INSERT INTO Books (title, author)
VALUES
  ('The Lord of the Rings', 'J.R.R. Tolkien'),
  ('Pride and Prejudice', 'Jane Austen');


CREATE TABLE Students (
  student_id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(200) NULL,
);

INSERT INTO Students (name, address)
VALUES
  ('John Doe', '69 Bruh Street'),
  ('Foo Bar', '67 Knotfunni Lane');
*/


SELECT id, title, author FROM Books;
SELECT student_id, name, address FROM Students;