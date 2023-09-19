import nodemailer from 'nodemailer';

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail', 'Yahoo', or use your SMTP settings
    auth: {
    user: 'expancetracker7@email.com',
    pass: '890321',
},
});

// Define your email sending function
export const sendResetCodeEmail = (toEmail, userName, resetCode) => {
  const mailOptions = {
    from: 'expancetracker7@email.com', // Sender's email address
    to: toEmail, // Recipient's email address
    subject: 'Password Reset Code', // Email subject
    text: `Hello ${userName},\n\nYour password reset code is: ${resetCode}\n\nPlease use this code to reset your password.`, // Email body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};