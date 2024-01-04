// required modules/imports
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()

//initial express app
const app = express();

//setup middleware
app.use(cors()); //middleware for allowing cross-origin resource sharing (eg. letting our client and server communicate)
app.use(express.json()); //built i middleware for parsing JSON sent in request

//use pool from pg package to create database connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'basic_full_stack',
    password: process.env.DB_PASSWORD,
    port: 5432
});

//get request handler for search
app.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q.toLowerCase(); //eg: /search?q=Smith
    const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(last_name) = $1', [`${searchQuery}`]);
    //const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(last_name) = $1', ['smith']);
    //const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(last_name) = 'smith');  
    res.json(rows);
  } catch (error) {
    res.status(500).send(error);
  }
})

//post request handler for registration
app.post('/register', async (req, res) => {
  //extracting the username and password from the body of the request object using destructuring
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  //insert the new user into the registration table 
  try {
    //query the database to insert into the registration table
    await pool.query('INSERT INTO registrations (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(201).send ('User registered successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//post request handler for login 
app.post('/login', async (req, res) => {
  //extracting the username and password from the body of the request object using destructuring 
  const { username, password } = req.body;

  try {
    //check if user exists
    const { rows } = await pool.query('SELECT * FROM registrations WHERE username = $1', [username]); //get row with matching username, if it exists
    //check if more than 0 matching rows
    if (rows.length > 0) {
      //if so, a user with given username does in fact exist in our table
      //check if their password matches
      const isValid = await bcrypt.compare(password, rows[0].password); //store the boolean result of bcrypts compare method in a variable

      if (isValid) {
        //if username and password combo are valid
        //create a JWT token
        const token = jwt.sign(
          { username },
          process.env.JWT_SECRET,
          { expiresIn: '1h'}  
        );
        res.json({ token });
      } else {
        //if username and password combo NOT valid
        res.status(403).send('Invalid password');
      }
    } else {
      //if user does not exist
      res.status(404).send('User not found');
    } 
  } catch (error) {
    res.status(500).send(error.message);
  }
})

//start our server at given port
const PORT = process.env.PORT || 3001; //use port specified in .env if there is one, default to 3001 otherwise
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})