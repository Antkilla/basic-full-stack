--Command to create "Users table"
--3 columns: id, which will auto increment and function as the primary key
--then first_name and last_name column that are varchar's less than 100 and last name 
--cannot be null.

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL
);

INSERT INTO users (last_name) VALUES ('Smith');

--fails bc last_name would be null
INSERT INTO users (first_name) VALUES ('cody');

--Using ChatGPT, generate a SQL command to insert 20 names 
--some of the first names can and should be null, last names cannot
--be NULL. AT least some last names shoud be re-used


INSERT INTO users (first_name, last_name) VALUES
  (NULL, 'Smith'),
  ('John', 'Doe'),
  ('Jane', 'Smith'),
  (NULL, 'Lee'),
  ('Alice', 'Brown'),
  (NULL, 'Taylor'),
  ('Bob', 'Clark'),
  ('Eva', 'Davis'),
  (NULL, 'Wilson'),
  ('Michael', 'Moore'),
  ('Sarah', 'Anderson'),
  ('David', 'Harris'),
  (NULL, 'Davis'),
  ('Emily', 'Thompson'),
  ('Peter', 'White'),
  (NULL, 'Jackson'),
  ('Olivia', 'Miller'),
  ('Christopher', 'Lee'),
  (NULL, 'Baker'),
  ('Emma', 'White');

--write a query to select all rows with last name White

SELECT * FROM WHERE last_name = 'White';

--Write query to select all rows with last names White and non null 1st names