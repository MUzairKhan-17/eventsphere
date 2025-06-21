import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

import './Models/conn.js'; // Import database connection

// Import route files
import { authRouter } from './Routes/authRoute.js';
import { attendeeRouter } from './Routes/attendeeRoute.js';
import { eventRouter } from './Routes/eventRoute.js';
import { contactRouter } from './Routes/contactRoute.js';
import { adminRouter } from './Routes/adminRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Replace with the exact origin of your frontend
app.use(cors({
  origin: ["http://localhost:5173","http://localhost:5174"], // Adjust as needed
  credentials: true               // Allow cookies/session
}));


app.use(
  session({
    secret: "your_secret_key", // use a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,           // helps prevent XSS
      secure: false,            // set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.get("/", (req, res) =>{
  res.send("Welcome to EventSphere API");
})

// Use routes
app.use('/api/auth', authRouter);
app.use('/api/attendees', attendeeRouter);
app.use('/api/events', eventRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
