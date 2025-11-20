import User from "../models/UserDb.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
dotenv.config();

export const userLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 401, message: "Invalid credentials" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is undefined. Check your .env file!");
      return res.status(500).json({ status: 500, message: "Server configuration error" });
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
    res.status(200).json({
      status: 200,
      message: "Login successful",
      token,
      expires_in: process.env.JWT_EXPIRES_IN || 3600,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role:user.role
      },
    });
    

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};