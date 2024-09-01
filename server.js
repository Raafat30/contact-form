const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); // To serve the static HTML file

// Route to serve the contact form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route to handle form submission
app.post('/send', (req, res) => {
    const { name, email, message } = req.body;

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
      }

    });

    // Email options
    const mailOptions = {
        from: email,
        to: process.env.GMAIL_USER, // Your Gmail address
        subject: `Contact from ${name}`,
        text: message,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error: ' + error.message);
        }
        res.send('Thank you for contacting us!');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
