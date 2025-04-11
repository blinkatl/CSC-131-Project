// authController.js contains login function for handling login authentication and JWT 
// - login: Checks database(users.json) for matching username/password, returns JWT if true

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const JWT_SECRET = '8d39b43b29dbcf33adf4f1695a12db68b114c753355284e8dd1888b78edb148c';

const login = (req, res) => {
  const { username, password } = req.body;

  // Read user data from the JSON file
  const usersPath = path.join(__dirname, '../database/users.json');
  const data = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  const users = data.users;

  // Find user with matching username / password
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create JWT
  const token = jwt.sign(
    { username: user.username, administrator: user.administrator },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

module.exports = { login };
