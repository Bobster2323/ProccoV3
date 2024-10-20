const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow multiple frontend URLs
const corsOptions = {
  origin: [
    'https://procco-v3.vercel.app',  // Production URL
    'https://procco-v3-git-main-robs-projects-64ae1c07.vercel.app' // Git deployment URL
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// Connect to PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// User Registration Route
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role]
    );

    // Send success response
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// User Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the stored hashed password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Create and send a JWT token
    const token = jwt.sign({ username: user.rows[0].username, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, user: user.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Example route to test the server
app.get('/', (req, res) => {
  res.send('Procco Backend is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
