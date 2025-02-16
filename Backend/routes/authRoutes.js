import express from "express";
import { signup, login, logout, authenticateToken, checkBalance, sendTransaction, getTransactions } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: `Welcome to your dashboard, ${req.user.username}!` });
});
router.post('/check-balance',authenticateToken, checkBalance);
router.post('/send',authenticateToken,sendTransaction)
router.get('/transactions/:address', authenticateToken, getTransactions);
router.get('/balance/:address', authenticateToken, checkBalance);

export default router;
