import User from "../models/UserDb.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
export const userCreate = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error("User Already exist");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ firstName, lastName, email, phoneNumber , password: hashedPassword });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};