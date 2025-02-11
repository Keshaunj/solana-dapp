import express from "express";
import { signup, login, logout, authenticateToken, checkBalance } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: `Welcome to your dashboard, ${req.user.username}!` });
});

router.post('/check-balance', checkBalance);

export default router;
