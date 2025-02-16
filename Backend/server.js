import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import { Connection, PublicKey } from '@solana/web3.js'; // Import Solana Web3.js
import authRoutes from "./routes/authRoutes.js";
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env");
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Update with your frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials like cookies
}));
app.options('*', cors()); // Enable OPTIONS preflight handling
app.use(express.json());
app.use(helmet()); // Set security headers
app.use(morgan("dev")); // Log HTTP requests
app.use(cookieParser());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Define the getBalance function
const getBalance = async (publicKey) => {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const pubKeyObj = new PublicKey(publicKey);

  // Fetch the balance in lamports
  const balanceInLamports = await connection.getBalance(pubKeyObj);
  return balanceInLamports / 1e9; // Convert lamports to SOL
};

// Routes
app.use("/auth", authRoutes);

// API route for checking balance
app.get('/api/check-balance/:publicKey', async (req, res) => {
  const publicKey = req.params.publicKey;
  
  try {
    const balance = await getBalance(publicKey);
    res.json({ balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Test CORS route
app.get("/test-cors", (req, res) => {
  res.send("CORS is working!");
});

app.use('/api', authRoutes);

console.log(authRoutes.stack.map(r => r.route && r.route.path));


// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
