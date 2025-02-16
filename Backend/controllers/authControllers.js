import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";
import { Keypair, Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import cookieParser from 'cookie-parser';
import bs58 from 'bs58';
import Wallet from '../models/walletModel.js';

// Authentication Functions
const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.header("Authorization")?.replace("Bearer ", "");
    console.log("Received token:", token); // Debug log

    if (!token) {
      console.log("No token found"); // Debug log
      return res.status(403).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("Token verification failed:", err.message); // Debug log
        return res.status(403).json({ error: "Invalid token." });
      }

      console.log("Token verified, user:", user); // Debug log
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(403).json({ error: "Authentication failed" });
  }
};

// User Registration and Login
const signup = async (req, res) => {
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
};

// First, ensure we have a test user in the database


const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: "Missing credentials",
        details: "Username and password are required"
      });
    }

    // Find user in database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        error: "Authentication failed",
        details: "User not found"
      });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        error: "Authentication failed",
        details: "Invalid password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success with token
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: "Login failed",
      details: error.message
    });
  }
};

const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

// Solana Wallet Functions
const checkBalance = async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    // Create connection to mainnet
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    
    try {
      // Get balance
      const balance = await connection.getBalance(new PublicKey(address));
      
      // Convert lamports to SOL
      const solBalance = balance / LAMPORTS_PER_SOL;
      
      return res.json({
        success: true,
        balance: solBalance,
        lamports: balance,
        address: address
      });

    } catch (error) {
      console.error('Balance check error:', error);
      return res.status(400).json({ 
        error: "Failed to get balance",
        details: error.message 
      });
    }

  } catch (error) {
    console.error('General error:', error);
    res.status(500).json({ 
      error: "Failed to check balance",
      details: error.message 
    });
  }
};

// Use environment variable for API key
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || 'demo';
const RPC_ENDPOINT = `https://solana-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
const sendTransaction = async (req, res) => {
  try {
    const { senderAddress, senderPrivateKey, recipientAddress, amount } = req.body;

    // Validate inputs
    if (!senderAddress || !senderPrivateKey || !recipientAddress || !amount) {
      return res.status(400).json({ 
        error: "Missing required fields",
        details: "Need senderAddress, senderPrivateKey, recipientAddress, and amount" 
      });
    }

    try {
      // Create keypair from private key
      const secretKey = new Uint8Array(senderPrivateKey);
      const senderKeypair = Keypair.fromSecretKey(secretKey);
      
      // Verify the public key matches
      if (senderKeypair.publicKey.toBase58() !== senderAddress) {
        throw new Error('Public key mismatch');
      }

      // Create connection
      const connection = new Connection(clusterApiUrl('mainnet-beta'), {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000
      });

      // Check balance first
      const balance = await connection.getBalance(senderKeypair.publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      
      // Calculate required amount with standard fee
      const requiredAmount = amount + 0.001; // Standard SOL fee
      
      if (solBalance < requiredAmount) {
        return res.status(400).json({
          error: "Insufficient funds",
          details: `Account has ${solBalance} SOL but needs ${amount} SOL plus 0.001 SOL for fees`
        });
      }

      // Create transaction
      const transaction = new Transaction();
      
      // Add transfer instruction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: Math.floor(LAMPORTS_PER_SOL * amount),
        })
      );

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash('finalized');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderKeypair.publicKey;

      // Sign transaction
      transaction.sign(senderKeypair);

      // Send transaction
      const signature = await connection.sendRawTransaction(
        transaction.serialize(),
        {
          skipPreflight: false,
          maxRetries: 3,
          preflightCommitment: 'confirmed'
        }
      );

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      // Return success response
      return res.json({
        success: true,
        signature: signature,
        message: "Transaction sent successfully",
        amount: amount,
        currentBalance: solBalance - amount - 0.001, // Subtract amount and fee
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Transaction error:', error);
      
      // Better error messages
      let errorMessage = error.message;
      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Not enough SOL to complete transaction (including 0.001 SOL fee)';
      } else if (error.message.includes('blockhash')) {
        errorMessage = 'Network busy - please try again';
      }

      return res.status(400).json({
        error: "Transaction failed",
        details: errorMessage
      });
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
};

const getBalance = async (req, res) => {
  try {
    const { address } = req.params;
    
    // Create connection to mainnet
    const connection = new Connection(clusterApiUrl('mainnet-beta'));
    
    // Get balance
    const balance = await connection.getBalance(new PublicKey(address));
    const solBalance = balance / LAMPORTS_PER_SOL;
    
    res.json({ balance: solBalance });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(400).json({ 
      error: "Failed to get balance",
      details: error.message 
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { address } = req.params;
    const wallet = await Wallet.findOne({ publicKey: address });
    
    if (!wallet) {
      return res.json([]);  // Return empty array if no wallet found
    }

    // Sort transactions by date, newest first
    const transactions = wallet.transactions.sort((a, b) => b.date - a.date);
    
    res.json(transactions);
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ 
      error: "Failed to get transactions",
      details: error.message 
    });
  }
};

export {
  authenticateToken,
  signup,
  login,
  logout,
  checkBalance,
  sendTransaction,
  getBalance,
  getTransactions,
};
