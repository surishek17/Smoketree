const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the public folder

// MySQL connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: '',       
  database: 'user_address_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// POST route for user registration
app.post('/register', (req, res) => {
  const { name, address } = req.body;

  if (!name || !address) {
    return res.status(400).send('Name and Address are required.');
  }

  // Insert user into the users table
  const insertUserQuery = 'INSERT INTO users (name) VALUES (?)';
  db.execute(insertUserQuery, [name], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Error registering user');
    }

    const userId = result.insertId;

    // Insert address into the addresses table
    const insertAddressQuery = 'INSERT INTO addresses (user_id, address) VALUES (?, ?)';
    db.execute(insertAddressQuery, [userId, address], (err, result) => {
      if (err) {
        console.error('Error inserting address:', err);
        return res.status(500).send('Error saving address');
      }

      res.send('User and address registered successfully');
    });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
