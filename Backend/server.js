import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import User from "./models/userModel.js";


dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet()); // Set security headers


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// In-memory token blacklist (for demonstration purposes)
// In production, use a database or Redis for persistence
const tokenBlacklist = [];

app.get("/", (req, res) => {
  res.send("Express Working");
});

app.post(
  "/signup",
  [
    body("username").trim().isLength({ min: 3 }).escape(),
    body("password").trim().isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  }
);

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: existingUser._id, username: existingUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

app.post("/logout", (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (token) {
    tokenBlacklist.push(token);
  }
  res.json({ message: "Logged out successfully" });
});

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  if (tokenBlacklist.includes(token)) {
    return res.status(401).json({ message: "Token is invalidated" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

app.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: `Welcome to your dashboard, ${req.user.username}!` });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
