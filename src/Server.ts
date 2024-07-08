import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

const app = express();

// Allowed origins including localhost for local testing
const allowedOrigins = [
  'https://nicolamcgarry.net', 
  'https://your-netlify-app-url.netlify.app',
  'http://localhost:3000'
];

app.use((req, res, next) => {
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

// Parse request body
app.use(bodyParser.json());

// Log all incoming requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

app.post('/send-contact-form', (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  console.log('Processing contact form submission:', { name, email, message });

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

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).send('Something broke!');
});

// Set the port to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
