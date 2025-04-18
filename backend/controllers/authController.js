// authController.js contains login function for handling login authentication and JWT 
// - login: Checks database(users.json) for matching username/password, returns JWT if true
// - verifyToken: Middleware to verify JWT token for protected routes
// - isAdmin: Middleware to check if user is an administrator
// - verifyAuth: Verify token and return user data

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const JWT_SECRET = '8d39b43b29dbcf33adf4f1695a12db68b114c753355284e8dd1888b78edb148c';

// Login function - authenticates user and returns JWT
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

  // Create JWT with user data
  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      administrator: user.administrator 
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

// Middleware to verify JWT token for protected routes
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user is an administrator
const isAdmin = (req, res, next) => {
  if (!req.user.administrator) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Verify token and return user data
const verifyAuth = (req, res) => {
  // The user data already in req.user due to verifyToken middleware
  res.json({ 
    authenticated: true, 
    user: {
      username: req.user.username,
      administrator: req.user.administrator
    }
  });
};

module.exports = {
  login,
  verifyToken,
  isAdmin,
  verifyAuth
};
