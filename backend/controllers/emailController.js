// emailController.js contains all controller functions necessary for emailing functionalities.
// - sendContactEmail: Sends email from the contact form

const nodemailer = require('nodemailer');

// Controller to handle sending emails from contact form
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
  }
};

module.exports = emailController;