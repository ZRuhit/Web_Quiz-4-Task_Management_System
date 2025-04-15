import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import tasks from './routes/tasks.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.post('/api/test', (req, res) => {
   // console.log("Test route body:", req.body);
    res.json({ received: req.body });
  });

// Middleware setup
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// CORS configuration to allow the React app to connect
app.use(
  cors({
    origin: "http://localhost:3000", // Your React app's URL
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/tasks', tasks);


// Basic route to check if the server is working
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    // Start server after DB connection is successful
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit process if MongoDB connection fails
  });

// Test API route for verification
app.get('/api/test', (req, res) => {
  res.json({ message: "API is working!" });
});
