import dotenv from 'dotenv';
dotenv.config(); // This should be called at the very top
import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
app.use(bodyParser.json());
app.use(cors());
console.log('GMAIL_USER:', process.env.GMAIL_USER); // Log the GMAIL_USER
console.log('GMAIL_PASS:', process.env.GMAIL_PASS); // Log the GMAIL_PASS
app.post('/send-contact-form', (req, res) => {
    const { name, email, message } = req.body;
    console.log('Received contact form submission:', { name, email, message }); // Log the received data
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, // Your Gmail address from .env file
            pass: process.env.GMAIL_PASS, // Your Gmail password from .env file or App password if 2FA is enabled
        },
    });
    const mailOptions = {
        from: email,
        to: process.env.GMAIL_USER, // Replace with your Gmail address from .env file
        subject: `Contact form submission from ${name}`,
        text: message,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error); // Log any errors
            return res.status(500).send(error.toString());
        }
        console.log('Email sent:', info.response); // Log the success response
        res.status(200).send('Email sent: ' + info.response);
    });
});
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
