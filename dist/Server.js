import dotenv from 'dotenv';
import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
dotenv.config();
const app = express();
const corsOptions = {
    origin: 'https://your-netlify-app-url.netlify.app',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.post('/send-contact-form', (req, res) => {
    const { name, email, message } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });
    const mailOptions = {
        from: email,
        to: process.env.GMAIL_USER,
        subject: `Contact form submission from ${name}`,
        text: message,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email.');
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
