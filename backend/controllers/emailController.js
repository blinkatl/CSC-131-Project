// emailController.js contains all controller functions necessary for emailing functionalities.
// - sendContactEmail: Sends email from the contact form
// - sendDueDateReminder: Sends reminder emails for books due soon or overdue
// - loadUsers: Helper function to load user data from JSON file
// - getDaysOverdue: Calculates number of days a book is overdue
// - getDaysUntilDue: Calculates number of days until a book is due
// - buildTextEmail: Creates plain text email body for library notices
// - buildHtmlEmail: Creates HTML email body for library notices

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Path to users.json
const usersDatabase = path.join(__dirname, "../database/users.json");

// Function to load users
const loadUsers = () => {
  try {
    // Read the file and parse JSON data
    const rawData = fs.readFileSync(usersDatabase, "utf-8");
    const usersData = JSON.parse(rawData);

    if (!usersData.users) {
      throw new Error("Users data is missing the 'users' key");
    }

    return usersData.users;
  } catch (error) {
    console.error("Error loading users data:", error);
    throw new Error("Unable to load users data");
  }
};

// Controller to handle sending emails
const emailController = {
  // Send email from contact form
  sendContactEmail: async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
      }

      // Create a test account with Ethereal Email
      const testAccount = await nodemailer.createTestAccount();

      // Create reusable transporter object using the test account
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // True for 465, false for other ports
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });

      // Setup email data
      const mailOptions = {
        from: `"Contact Form" <${email}>`,
        to: 'projectdelta@testexample.com',
        subject: `New Contact Form Submission from ${name}`,
        text: `
          Name: ${name}
          Email: ${email}
          Phone: ${phone || 'Not provided'}
          
          Message:
          ${message}
        `,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      };

      // Send mail
      const info = await transporter.sendMail(mailOptions);

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      return res.status(200).json({ 
        success: true, 
        message: 'Email sent successfully!',
        previewUrl: nodemailer.getTestMessageUrl(info)
      });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
    }
  },

  // Send reminders for all active books (overdue or upcoming)
  sendDueDateReminder: async (req, res) => {
    console.log("Received request to send due date reminders");
    try {
      // Get all users
      const users = loadUsers();
      
      // Get current date
      const currentDate = new Date();
      const currentDateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Filter users who have active books checked out
      const usersWithActiveBooks = users.filter(user => {
        return user.active_books_checked_out && user.active_books_checked_out.length > 0;
      });
      
      // If no users have active books, return early
      if (usersWithActiveBooks.length === 0) {
        return res.status(200).json({ 
          success: true, 
          message: 'No users have active books checked out'
        });
      }
      
      // Array to store email preview URLs
      const emailPreviews = [];
      
      // Create a test account with Ethereal Email
      const testAccount = await nodemailer.createTestAccount();
      
      // Create reusable transporter object using the test account
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      
      // Send email to each user with active books
      for (const user of usersWithActiveBooks) {
        // Categorize books as overdue or upcoming
        const overdueBooks = [];
        const upcomingBooks = [];
        
        user.active_books_checked_out.forEach(book => {
          // Compare due date with current date
          if (book.due_date < currentDateStr) {
            overdueBooks.push(book);
          } else {
            upcomingBooks.push(book);
          }
        });
        
        // Skip if there are no books (shouldn't happen given the filter above, but just in case)
        if (overdueBooks.length === 0 && upcomingBooks.length === 0) continue;
        
        // Create lists for text and HTML formats
        let overdueBooksListText = '';
        let overdueBooksListHtml = '';
        let upcomingBooksListText = '';
        let upcomingBooksListHtml = '';
        
        // Format overdue books list
        if (overdueBooks.length > 0) {
          overdueBooksListText = overdueBooks.map(book => 
            `"${book.title}" by ${book.author} (Due: ${book.due_date}, Overdue by ${getDaysOverdue(book.due_date, currentDateStr)} days)`
          ).join('\n');
          
          overdueBooksListHtml = overdueBooks.map(book => 
            `<li>"${book.title}" by ${book.author} <strong>(Due: ${book.due_date}, Overdue by ${getDaysOverdue(book.due_date, currentDateStr)} days)</strong></li>`
          ).join('');
        }
        
        // Format upcoming books list
        if (upcomingBooks.length > 0) {
          upcomingBooksListText = upcomingBooks.map(book => 
            `"${book.title}" by ${book.author} (Due: ${book.due_date}, Due in ${getDaysUntilDue(book.due_date, currentDateStr)} days)`
          ).join('\n');
          
          upcomingBooksListHtml = upcomingBooks.map(book => 
            `<li>"${book.title}" by ${book.author} (Due: ${book.due_date}, Due in ${getDaysUntilDue(book.due_date, currentDateStr)} days)</li>`
          ).join('');
        }
        
        // Build email subject based on content
        let subject = '';
        if (overdueBooks.length > 0 && upcomingBooks.length > 0) {
          subject = 'Library Notice: Overdue Books and Upcoming Due Dates';
        } else if (overdueBooks.length > 0) {
          subject = 'Library Notice: Overdue Books';
        } else {
          subject = 'Library Notice: Upcoming Book Due Dates';
        }
        
        // Setup email data
        const mailOptions = {
          from: '"Library Reminder" <library@example.com>',
          to: user.email,
          subject,
          text: buildTextEmail(user.name, overdueBooks.length > 0, upcomingBooks.length > 0, overdueBooksListText, upcomingBooksListText),
          html: buildHtmlEmail(user.name, overdueBooks.length > 0, upcomingBooks.length > 0, overdueBooksListHtml, upcomingBooksListHtml)
        };
        
        // Send mail
        const info = await transporter.sendMail(mailOptions);
        
        // Get the preview URL
        const previewUrl = nodemailer.getTestMessageUrl(info);
        
        // Add to array of preview URLs
        emailPreviews.push({
          user: user.name,
          email: user.email,
          messageId: info.messageId,
          previewUrl
        });
        
        // Log the message ID and preview URL
        console.log(`Library notice email sent to ${user.name} (${user.email}): ${info.messageId}`);
        console.log(`Preview URL: ${previewUrl}`);
      }
      
      // Return success response with preview URLs
      return res.status(200).json({
        success: true,
        message: `Sent ${emailPreviews.length} reminder emails successfully!`,
        emailPreviews
      });
      
    } catch (error) {
      console.error('Error sending reminder emails:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send reminder emails. Please try again later.' 
      });
    }
  }
};

// Helper function to calculate days overdue
function getDaysOverdue(dueDateStr, currentDateStr) {
  const dueDate = new Date(dueDateStr);
  const currentDate = new Date(currentDateStr);
  const diffTime = Math.abs(currentDate - dueDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper function to calculate days until due
function getDaysUntilDue(dueDateStr, currentDateStr) {
  const dueDate = new Date(dueDateStr);
  const currentDate = new Date(currentDateStr);
  const diffTime = dueDate - currentDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper function to build text email
function buildTextEmail(userName, hasOverdue, hasUpcoming, overdueText, upcomingText) {
  let email = `Hello ${userName},\n\n`;
  
  if (hasOverdue) {
    email += `You have the following OVERDUE book(s) that need to be returned immediately to avoid additional late fees:\n\n${overdueText}\n\n`;
  }
  
  if (hasUpcoming) {
    email += `You have the following book(s) with upcoming due dates:\n\n${upcomingText}\n\n`;
  }
  
  email += `Please visit the library to return or renew your books.\n\nThank you,\nProject Delta`;
  
  return email;
}

// Helper function to build HTML email
function buildHtmlEmail(userName, hasOverdue, hasUpcoming, overdueHtml, upcomingHtml) {
  let email = `
    <h3>Library Book Status Notice</h3>
    <p>Hello ${userName},</p>
  `;
  
  if (hasOverdue) {
    email += `
      <p style="color: #cc0000;"><strong>You have the following OVERDUE book(s) that need to be returned immediately to avoid additional late fees:</strong></p>
      <ul style="color: #cc0000;">
        ${overdueHtml}
      </ul>
    `;
  }
  
  if (hasUpcoming) {
    email += `
      <p>You have the following book(s) with upcoming due dates:</p>
      <ul>
        ${upcomingHtml}
      </ul>
    `;
  }
  
  email += `
    <p>Please visit the library to return or renew your books.</p>
    <p>Thank you,<br>Your Library</p>
  `;
  
  return email;
}

module.exports = emailController;