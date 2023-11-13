const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();


const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_db_name',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to the database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/register', (req, res) => {
  const { name, password, role } = req.body;

  // Hash the password before storing it in the database
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: 'Password hashing error' });
    }

    const user = { name, password: hash, role };

    db.query('INSERT INTO users SET ?', user, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Registration failed' });
      }
      return res.status(201).json({ message: 'Registration successful' });
    });
  });
});

app.post('/login', (req, res) => {
  const { name, password } = req.body;

  db.query('SELECT * FROM users WHERE name = ?', name, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database server error' });
    }

    if (results.length !== 1) {
      return res.status(401).json({ message: 'Wrong username' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, same) => {
      if (err) {
        return res.status(503).json({ message: 'Authentication server error' });
      }

      if (same) {
        return res.status(200).json({ message: 'Login successful' });
      } else {
        return res.status(401).json({ message: 'Wrong password' });
      }
    });
  });
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server is ready at http://localhost:${port}`);
});
