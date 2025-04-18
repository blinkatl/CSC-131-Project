// authRoutes.js defines route for login authentication and JWT handling
// aPI is accessed through http://localhost:3000/login
//
// - POST /: Handle login authentication and JWT handling
// - GET /: Verify authentication status
//
// The controler functions are located in /controllers/authController.js.

const { Router } = require('express');
const authRouter = Router();
const authController = require('../controllers/authController');

// Route to handle login authentication and JWT handling
authRouter.post('/login', authController.login);

// Route to veriyfy authentication status
authRouter.get('/verify', authController.verifyToken, authController.verifyAuth);

module.exports = authRouter;
