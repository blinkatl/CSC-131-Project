// emailRoutes.js defines routes for sending emails
// API is accessed through http://localhost:3000/email/
//
// - POST /: Send contact form emails
// - POST /: Send due date reminder email
//
// The controller functions are located in /controllers/emailController.js.

const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Route for sending contact form emails
router.post('/contact', emailController.sendContactEmail);

// Route for sending due date reminder email
router.post('/send-due-date-reminders', emailController.sendDueDateReminder);

module.exports = router;