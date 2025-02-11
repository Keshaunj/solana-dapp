import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { validationResult } from 'express-validator';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Authentication Functions

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
  });
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
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: existingUser._id, username: existingUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' }); // No action needed for now
};

const checkBalance = async (req, res) => {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required.' });
    }
  
    try {
      const connection = new Connection(
        'https://api.mainnet-beta.solana.com',
        'confirmed'
      );
  
      const publicKey = new PublicKey(walletAddress);
      const balance = await connection.getBalance(publicKey);
      const balanceInSOL = balance / LAMPORTS_PER_SOL;
      
      return res.json({ 
        balance: Number(balanceInSOL.toFixed(4))  // Formatted to 4 decimal places
      });
    } catch (error) {
      console.error('Balance check error:', error);
      return res.status(500).json({ error: 'Failed to fetch balance. Please try again later.' });
    }
  };

// Fetch balance from Solana network

export { authenticateToken, signup, login, logout, checkBalance };
